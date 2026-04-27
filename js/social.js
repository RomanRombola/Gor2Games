// social.js — Sistema social V3 BandaGamer
// Firestore: perfiles, amigos, solicitudes, grupos, historial de chat
// Realtime DB: presencia online, salas de juego
// ─────────────────────────────────────────────────────────────────────────────

const _rtdb = firebase.database();

// ── Colecciones Firestore ─────────────────────────────────────────────────
// /users/{uid}                     → perfil público
// /friendRequests/{uid}/incoming   → solicitudes recibidas
// /friendRequests/{uid}/outgoing   → solicitudes enviadas
// /friends/{uid}/{friendUid}       → lista de amigos
// /chats/{chatId}/messages         → mensajes (chatId = uid1_uid2 ordenados)
// Realtime DB:
// /presence/{uid}                  → { online, lastSeen, displayName }
// /gameRooms/{roomId}              → sala de juego

// ── Presencia online ──────────────────────────────────────────────────────
let _presenceRef = null;
let _currentUid  = null;

function Social_initPresence(uid, displayName) {
  if (_presenceRef) _presenceRef.remove();
  _currentUid  = uid;
  _presenceRef  = _rtdb.ref(`presence/${uid}`);
  const connRef = _rtdb.ref('.info/connected');

  connRef.on('value', snap => {
    if (!snap.val()) return;
    _presenceRef.onDisconnect().set({
      online:      false,
      lastSeen:    firebase.database.ServerValue.TIMESTAMP,
      displayName: displayName || 'Usuario',
      jugandoA:    null,
      juegoId:     null,
      roomId:      null
    });
    _presenceRef.set({
      online:      true,
      lastSeen:    firebase.database.ServerValue.TIMESTAMP,
      displayName: displayName || 'Usuario',
      jugandoA:    null,
      juegoId:     null,
      roomId:      null
    });
  });
}

// Actualiza el estado "estoy jugando a X" para que los amigos lo vean
function Social_setJugando(juegoNombre, juegoId, roomId) {
  if (!_presenceRef) return;
  _presenceRef.update({
    jugandoA: juegoNombre || null,
    juegoId:  juegoId || null,
    roomId:   roomId || null,
    lastSeen: firebase.database.ServerValue.TIMESTAMP
  });
}

function Social_clearJugando() {
  if (!_presenceRef) return;
  _presenceRef.update({
    jugandoA: null,
    juegoId: null,
    roomId: null,
    lastSeen: firebase.database.ServerValue.TIMESTAMP
  });
}

function Social_goOffline() {
  if (_presenceRef) {
    _presenceRef.set({ online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
  }
}

// ── Buscar usuarios ───────────────────────────────────────────────────────
async function Social_buscarUsuarios(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  // Estrategia dual: buscar en /users/ con >= y <= (no necesita índice compuesto)
  // y también buscar en /usuarios/ como fallback
  const results = [];
  const seen = new Set();
  
  try {
    // Búsqueda principal en colección users (perfil público)
    const snap = await _db.collection('users')
      .where('nombre_lower', '>=', q)
      .where('nombre_lower', '<=', q + '\uf8ff')
      .limit(20)
      .get();
    snap.forEach(doc => {
      if (doc.id !== _currentUid && !seen.has(doc.id)) {
        seen.add(doc.id);
        results.push({ uid: doc.id, ...doc.data() });
      }
    });
  } catch(e) {
    console.warn('[Social] Búsqueda en users falló:', e.message);
  }
  
  // Si no encontró nada, buscar en colección usuarios (perfil privado) como fallback
  if (results.length === 0) {
    try {
      const snap2 = await _db.collection('usuarios')
        .where('nombre', '>=', query)
        .where('nombre', '<=', query + '\uf8ff')
        .limit(20)
        .get();
      snap2.forEach(doc => {
        if (doc.id !== _currentUid && !seen.has(doc.id)) {
          seen.add(doc.id);
          const d = doc.data();
          results.push({ uid: doc.id, nombre: d.nombre, avatar: d.avatar, nivel: d.nivel, xp: d.xp });
        }
      });
    } catch(e) {
      console.warn('[Social] Búsqueda fallback falló:', e.message);
    }
  }
  
  return results.slice(0, 15);
}

// ── Solicitudes de amistad ────────────────────────────────────────────────
async function Social_enviarSolicitud(toUid) {
  if (!_currentUid) return { error: 'No autenticado' };
  const myDoc = await _db.collection('users').doc(_currentUid).get();
  const myData = myDoc.data() || {};

  // Guardar en outgoing del emisor
  await _db.collection('friendRequests').doc(_currentUid)
    .collection('outgoing').doc(toUid)
    .set({ uid: toUid, sentAt: firebase.firestore.FieldValue.serverTimestamp(), status: 'pending' });

  // Guardar en incoming del receptor
  await _db.collection('friendRequests').doc(toUid)
    .collection('incoming').doc(_currentUid)
    .set({
      uid:         _currentUid,
      nombre:      myData.nombre || 'Usuario',
      avatar:      myData.avatar || '😊',
      sentAt:      firebase.firestore.FieldValue.serverTimestamp(),
      status:      'pending'
    });

  return { ok: true };
}

async function Social_aceptarSolicitud(fromUid) {
  if (!_currentUid) return;
  const batch = _db.batch();

  // Agregar a lista de amigos de ambos
  const ts = firebase.firestore.FieldValue.serverTimestamp();
  batch.set(_db.collection('friends').doc(_currentUid).collection('list').doc(fromUid), { uid: fromUid, since: ts });
  batch.set(_db.collection('friends').doc(fromUid).collection('list').doc(_currentUid), { uid: _currentUid, since: ts });

  // Eliminar solicitudes
  batch.delete(_db.collection('friendRequests').doc(_currentUid).collection('incoming').doc(fromUid));
  batch.delete(_db.collection('friendRequests').doc(fromUid).collection('outgoing').doc(_currentUid));

  await batch.commit();
  return { ok: true };
}

async function Social_rechazarSolicitud(fromUid) {
  if (!_currentUid) return;
  await _db.collection('friendRequests').doc(_currentUid).collection('incoming').doc(fromUid).delete();
  await _db.collection('friendRequests').doc(fromUid).collection('outgoing').doc(_currentUid).delete();
}

async function Social_eliminarAmigo(friendUid) {
  if (!_currentUid) return;
  await _db.collection('friends').doc(_currentUid).collection('list').doc(friendUid).delete();
  await _db.collection('friends').doc(friendUid).collection('list').doc(_currentUid).delete();
}

// ── Listeners de amigos ───────────────────────────────────────────────────
function Social_onAmigos(callback) {
  if (!_currentUid) return () => {};
  return _db.collection('friends').doc(_currentUid).collection('list')
    .onSnapshot(snap => {
      const amigos = [];
      snap.forEach(doc => amigos.push({ uid: doc.id, ...doc.data() }));
      callback(amigos);
    });
}

function Social_onSolicitudesEntrantes(callback) {
  if (!_currentUid) return () => {};
  return _db.collection('friendRequests').doc(_currentUid).collection('incoming')
    .where('status', '==', 'pending')
    .onSnapshot(snap => {
      const reqs = [];
      snap.forEach(doc => reqs.push({ uid: doc.id, ...doc.data() }));
      callback(reqs);
    });
}

// ── Presencia de amigos ───────────────────────────────────────────────────
function Social_onPresenciaAmigos(uids, callback) {
  const listeners = [];
  const presenceMap = {};
  uids.forEach(uid => {
    const ref = _rtdb.ref(`presence/${uid}`);
    const fn = ref.on('value', snap => {
      presenceMap[uid] = snap.val() || { online: false };
      callback({ ...presenceMap });
    });
    listeners.push({ ref, fn });
  });
  return () => listeners.forEach(({ ref, fn }) => ref.off('value', fn));
}

// ── Chat 1-a-1 ────────────────────────────────────────────────────────────
function Social_getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

async function Social_enviarMensaje(toUid, texto) {
  if (!_currentUid || !texto.trim()) return;
  const chatId  = Social_getChatId(_currentUid, toUid);
  const myDoc   = await _db.collection('users').doc(_currentUid).get();
  const myData  = myDoc.data() || {};

  await _db.collection('chats').doc(chatId).collection('messages').add({
    from:      _currentUid,
    fromNombre: myData.nombre || 'Usuario',
    texto:     texto.trim(),
    at:        firebase.firestore.FieldValue.serverTimestamp(),
    leido:     false
  });

  // Metadata del chat para mostrar "último mensaje"
  await _db.collection('chats').doc(chatId).set({
    participants: [_currentUid, toUid],
    lastMessage:  texto.trim().substring(0, 60),
    lastAt:       firebase.firestore.FieldValue.serverTimestamp(),
    [`unread_${toUid}`]: firebase.firestore.FieldValue.increment(1)
  }, { merge: true });
}

function Social_onMensajes(toUid, callback) {
  const chatId = Social_getChatId(_currentUid, toUid);
  return _db.collection('chats').doc(chatId).collection('messages')
    .orderBy('at', 'asc')
    .limitToLast(60)
    .onSnapshot(snap => {
      const msgs = [];
      snap.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
      callback(msgs);
    });
}

async function Social_marcarLeido(toUid) {
  if (!_currentUid) return;
  const chatId = Social_getChatId(_currentUid, toUid);
  await _db.collection('chats').doc(chatId).set(
    { [`unread_${_currentUid}`]: 0 }, { merge: true }
  );
  // Marcar mensajes como leídos
  const snap = await _db.collection('chats').doc(chatId).collection('messages')
    .where('from', '==', toUid).where('leido', '==', false).limit(20).get();
  const batch = _db.batch();
  snap.forEach(doc => batch.update(doc.ref, { leido: true }));
  await batch.commit();
}

function Social_onChatsActivos(callback) {
  if (!_currentUid) return () => {};
  return _db.collection('chats')
    .where('participants', 'array-contains', _currentUid)
    .orderBy('lastAt', 'desc')
    .limit(20)
    .onSnapshot(snap => {
      const chats = [];
      snap.forEach(doc => chats.push({ id: doc.id, ...doc.data() }));
      callback(chats);
    });
}

// ── Invitaciones a juego ──────────────────────────────────────────────────
async function Social_invitarAJuego(friendUid, juegoId, juegoNombre) {
  if (!_currentUid) return;
  const myDoc  = await _db.collection('users').doc(_currentUid).get();
  const myData = myDoc.data() || {};
  const roomId = `room_${_currentUid}_${Date.now()}`;

  // Crear sala en RTDB
  await _rtdb.ref(`gameRooms/${roomId}`).set({
    host:       _currentUid,
    hostNombre: myData.nombre || 'Usuario',
    juegoId,
    juegoNombre,
    createdAt:  firebase.database.ServerValue.TIMESTAMP,
    status:     'waiting',
    players:    { [_currentUid]: { nombre: myData.nombre, ready: false } }
  });

  // Notificación via Firestore
  await _db.collection('gameInvites').doc(friendUid).collection('pending').add({
    from:       _currentUid,
    fromNombre: myData.nombre || 'Usuario',
    juegoId,
    juegoNombre,
    roomId,
    at:         firebase.firestore.FieldValue.serverTimestamp()
  });

  return { ok: true, roomId };
}

function Social_onInvitaciones(callback) {
  if (!_currentUid) return () => {};
  return _db.collection('gameInvites').doc(_currentUid).collection('pending')
    .orderBy('at', 'desc')
    .limit(10)
    .onSnapshot(snap => {
      const invites = [];
      snap.forEach(doc => invites.push({ id: doc.id, ...doc.data() }));
      callback(invites);
    });
}

// ── Perfil público ────────────────────────────────────────────────────────
async function Social_actualizarPerfilPublico(uid, data) {
  await _db.collection('users').doc(uid).set({
    nombre:       data.nombre || 'Usuario',
    nombre_lower: (data.nombre || 'usuario').toLowerCase(),
    nivel:        data.nivel  || 1,
    xp:           data.xp    || 0,
    avatar:       data.avatar || '😊',
    updatedAt:    firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

async function Social_getPerfil(uid) {
  const doc = await _db.collection('users').doc(uid).get();
  return doc.exists ? { uid: doc.id, ...doc.data() } : null;
}

// ── Estado de amistad ─────────────────────────────────────────────────────
async function Social_estadoAmistad(otherUid) {
  if (!_currentUid) return 'none';
  const [friendSnap, outSnap, inSnap] = await Promise.all([
    _db.collection('friends').doc(_currentUid).collection('list').doc(otherUid).get(),
    _db.collection('friendRequests').doc(_currentUid).collection('outgoing').doc(otherUid).get(),
    _db.collection('friendRequests').doc(_currentUid).collection('incoming').doc(otherUid).get(),
  ]);
  if (friendSnap.exists) return 'friends';
  if (outSnap.exists)    return 'pending_out';
  if (inSnap.exists)     return 'pending_in';
  return 'none';
}

// Exportar para uso global
window.Social = {
  initPresence:           Social_initPresence,
  goOffline:              Social_goOffline,
  setJugando:             Social_setJugando,
  clearJugando:           Social_clearJugando,
  buscarUsuarios:         Social_buscarUsuarios,
  enviarSolicitud:        Social_enviarSolicitud,
  aceptarSolicitud:       Social_aceptarSolicitud,
  rechazarSolicitud:      Social_rechazarSolicitud,
  eliminarAmigo:          Social_eliminarAmigo,
  onAmigos:               Social_onAmigos,
  onSolicitudesEntrantes: Social_onSolicitudesEntrantes,
  onPresenciaAmigos:      Social_onPresenciaAmigos,
  getChatId:              Social_getChatId,
  enviarMensaje:          Social_enviarMensaje,
  onMensajes:             Social_onMensajes,
  marcarLeido:            Social_marcarLeido,
  onChatsActivos:         Social_onChatsActivos,
  invitarAJuego:          Social_invitarAJuego,
  onInvitaciones:         Social_onInvitaciones,
  actualizarPerfilPublico: Social_actualizarPerfilPublico,
  getPerfil:              Social_getPerfil,
  estadoAmistad:          Social_estadoAmistad,
  get uid() { return _currentUid; }
};
