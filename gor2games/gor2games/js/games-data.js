// games-data.js — Catálogo completo de juegos de Gor2Games
// Categorías en minúsculas sin tildes. IDs en formato "game-NNN".

const juegos = [

  // ── IFRAME ──────────────────────────────────────────────────────────────
  {
    id: "game-001",
    nombre: "2048",
    categoria: "puzzle",
    tags: ["numeros", "logica", "clasico"],
    thumbnail: "https://play2048.co/meta/og-image.png",
    embed_url: "https://play2048.co/",
    descripcion: "Combiná losetas para llegar al 2048. El puzzle numérico clásico.",
    tipo: "iframe"
  },
  {
    id: "game-002",
    nombre: "Pacman",
    categoria: "arcade",
    tags: ["clasico", "laberinto", "fantamas"],
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pac-Man_logo.svg/320px-Pac-Man_logo.svg.png",
    embed_url: "https://freepacman.org/",
    descripcion: "Come puntos, esquivá fantasmas. El arcade original.",
    tipo: "iframe"
  },
  {
    id: "game-003",
    nombre: "Tetris JS",
    categoria: "puzzle",
    tags: ["bloques", "clasico", "velocidad"],
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Typical_Tetris_Game.svg/220px-Typical_Tetris_Game.svg.png",
    embed_url: "https://chvin.github.io/react-tetris/",
    descripcion: "Tetris en React. Fluido, con puntaje y niveles.",
    tipo: "iframe"
  },
  {
    id: "game-004",
    nombre: "Chess",
    categoria: "estrategia",
    tags: ["ajedrez", "tablero", "clasico"],
    thumbnail: "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/PedroPinhata/phpgnX0tR.png",
    embed_url: "https://lichess.org/embed/game/abc",
    descripcion: "Ajedrez online contra la IA o un amigo.",
    tipo: "iframe"
  },
  {
    id: "game-005",
    nombre: "Flappy Bird",
    categoria: "arcade",
    tags: ["saltar", "pajaros", "infinito"],
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_bird_nes.jpg",
    embed_url: "https://nebezial.itch.io/flappy-bird/embed",
    descripcion: "Esquivá los caños. Fácil de aprender, difícil de dominar.",
    tipo: "iframe"
  },
  {
    id: "game-006",
    nombre: "Cookie Clicker",
    categoria: "arcade",
    tags: ["idle", "clicker", "galletitas"],
    thumbnail: "https://orteil.dashnet.org/cookieclicker/img/favicon.ico",
    embed_url: "https://orteil.dashnet.org/cookieclicker/",
    descripcion: "Hacé click en la galletita. El idle game más adictivo.",
    tipo: "iframe"
  },
  {
    id: "game-007",
    nombre: "Wordle",
    categoria: "puzzle",
    tags: ["palabras", "adivinar", "daily"],
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wordle_196_example.svg/250px-Wordle_196_example.svg.png",
    embed_url: "https://wordlegame.org/",
    descripcion: "Adiviná la palabra del día en 6 intentos.",
    tipo: "iframe"
  },
  {
    id: "game-008",
    nombre: "Minesweeper",
    categoria: "puzzle",
    tags: ["minas", "logica", "clasico"],
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Minesweeper_2020_Windows.png/220px-Minesweeper_2020_Windows.png",
    embed_url: "https://minesweeper.online/",
    descripcion: "Buscaminas clásico. Encontrá todas las minas sin volar.",
    tipo: "iframe"
  },
  {
    id: "game-009",
    nombre: "Sudoku",
    categoria: "puzzle",
    tags: ["numeros", "logica", "sudoku"],
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Sudoku-by-L2G-20050714.svg/220px-Sudoku-by-L2G-20050714.svg.png",
    embed_url: "https://sudoku.com/",
    descripcion: "El clásico puzzle numérico. Varios niveles de dificultad.",
    tipo: "iframe"
  },
  {
    id: "game-010",
    nombre: "Agar.io Clone",
    categoria: "accion",
    tags: ["multijugador", "celulas", "io"],
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/3/3c/Agar.io_Logo.png",
    embed_url: "https://agar.io/",
    descripcion: "Comé celdas más chicas y crecé. IO game clásico.",
    tipo: "iframe"
  },

  // ── LOCAL ────────────────────────────────────────────────────────────────
  {
    id: "game-011",
    nombre: "Snake Gor2",
    categoria: "arcade",
    tags: ["serpiente", "clasico", "pixel"],
    thumbnail: "",
    embed_url: "games/juego-local-1.html",
    descripcion: "Snake clásico con estética neon. ¿Hasta dónde llegás?",
    tipo: "local"
  },
  {
    id: "game-012",
    nombre: "Breakout Neon",
    categoria: "arcade",
    tags: ["pelota", "ladrillos", "retro"],
    thumbnail: "",
    embed_url: "games/juego-local-2.html",
    descripcion: "Rompé todos los ladrillos con la pelota. Breakout neon.",
    tipo: "local"
  },
  {
    id: "game-013",
    nombre: "Memory Match",
    categoria: "puzzle",
    tags: ["memoria", "cartas", "parejas"],
    thumbnail: "",
    embed_url: "games/juego-local-3.html",
    descripcion: "Encontrá todos los pares. Entrenás la memoria.",
    tipo: "local"
  },
  {
    id: "game-014",
    nombre: "Space Shooter",
    categoria: "accion",
    tags: ["naves", "disparos", "espacio"],
    thumbnail: "",
    embed_url: "games/juego-local-4.html",
    descripcion: "Destruí naves enemigas. Shooter espacial con power-ups.",
    tipo: "local"
  },
  {
    id: "game-015",
    nombre: "Dino Runner",
    categoria: "accion",
    tags: ["dinosaurio", "saltar", "infinito"],
    thumbnail: "",
    embed_url: "games/juego-local-5.html",
    descripcion: "Saltá obstáculos infinitamente. Clásico del dino offline.",
    tipo: "local"
  },

  // ── EMULADOR ─────────────────────────────────────────────────────────────
  {
    id: "game-016",
    nombre: "NES Homebrew (demo)",
    categoria: "retro",
    tags: ["nes", "retro", "emulador", "homebrew"],
    thumbnail: "",
    embed_url: "../assets/roms/demo.nes",
    descripcion: "ROM homebrew de dominio público. Requiere archivo en assets/roms/.",
    tipo: "emulador",
    core: "nes"
  },
  {
    id: "game-017",
    nombre: "GBA Homebrew (demo)",
    categoria: "retro",
    tags: ["gba", "retro", "emulador", "homebrew"],
    thumbnail: "",
    embed_url: "../assets/roms/demo.gba",
    descripcion: "ROM homebrew GBA. Requiere archivo en assets/roms/.",
    tipo: "emulador",
    core: "gba"
  },

  // ── MÁS IFRAME ───────────────────────────────────────────────────────────
  {
    id: "game-018",
    nombre: "Slither.io",
    categoria: "accion",
    tags: ["serpiente", "io", "multijugador"],
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/4/43/Slither.io_Logo.png",
    embed_url: "https://slither.io/",
    descripcion: "Serpiente multijugador online. Comé orbes y crecé.",
    tipo: "iframe"
  },
  {
    id: "game-019",
    nombre: "Helix Jump",
    categoria: "arcade",
    tags: ["caida", "espiral", "reflejos"],
    thumbnail: "",
    embed_url: "https://www.crazygames.com/embed/helix-jump",
    descripcion: "Hacé caer la pelota por la torre helix esquivando plataformas.",
    tipo: "iframe"
  },
  {
    id: "game-020",
    nombre: "Krunker.io",
    categoria: "accion",
    tags: ["fps", "shooter", "io", "multijugador"],
    thumbnail: "https://krunker.io/img/krunker_icon.png",
    embed_url: "https://krunker.io/",
    descripcion: "FPS browser game. Shooter multijugador rápido.",
    tipo: "iframe"
  }
];

// Exportar para uso modular (compatibilidad con módulos ES y script clásico)
if (typeof module !== "undefined") module.exports = { juegos };
