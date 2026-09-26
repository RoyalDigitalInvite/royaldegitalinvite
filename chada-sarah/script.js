const video1 = document.getElementById("video1");
const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const videoEndFrame = document.getElementById("videoEndFrame");

let revealObserverInitialized = false;
let introStarted = false;

/**
 * Inicializa las animaciones de aparición al hacer scroll
 */
function initRevealAnimations() {
  if (revealObserverInitialized) return;

  const elements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right, .reveal-zoom"
  );

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    revealObserverInitialized = true;
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14
  });

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 0.07, 0.45)}s`;
    observer.observe(el);
  });

  revealObserverInitialized = true;
}

/**
 * Activa el logo flotante
 */
function activateFloatingLogo() {
  document.body.classList.add("logo-active");
}

/**
 * Inicia la música tras la interacción del usuario
 */
function startMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 1;

  const promise = bgMusic.play();
  if (promise !== undefined) {
    promise.catch((err) => {
      console.log("Reproducción de audio bloqueada:", err);
    });
  }
}

/**
 * Muestra el contenido principal bajo la imagen final
 * sin eliminar la escena 1
 */
function showScene2() {
  if (!scene2 || !scene1) return;

  scene2.classList.remove("hidden");
  scene1.classList.add("is-finished");

  document.body.classList.remove("intro-active");
  document.body.classList.add("intro-finished");

  activateFloatingLogo();

  requestAnimationFrame(() => {
    initRevealAnimations();
  });
}

/**
 * Lanza la introducción
 */
function startIntro() {
  if (introStarted || !scene1 || !video1) return;

  introStarted = true;

  scene1.classList.add("is-started");

  // 🦋 Las mariposas aparecen en cuanto se abre el sobre
  document.body.classList.add("butterflies-active");

  activateFloatingLogo();
  startMusic();

  video1.loop = false;
  video1.currentTime = 0;

  const playPromise = video1.play();

  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.log("Reproducción de vídeo bloqueada:", err);
      scene1.classList.add("show-end-frame");
      showScene2();
    });
  }
}

/**
 * Fin del vídeo:
 * se congela en la imagen final Y se mantiene visible
 * mientras el resto de la página se muestra debajo
 */
function freezeLastFrame() {
  if (!scene1 || !video1 || !videoEndFrame) return;

  video1.pause();
  scene1.classList.add("show-end-frame");

  requestAnimationFrame(() => {
    showScene2();
  });
}

/**
 * Accesibilidad por teclado
 */
function handleIntroKeydown(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    startIntro();
  }
}

if (introTrigger) {
  introTrigger.addEventListener("click", startIntro);
  introTrigger.addEventListener("keydown", handleIntroKeydown);
}

if (video1) {
  video1.addEventListener("ended", freezeLastFrame);

  video1.addEventListener("error", () => {
    if (scene1) {
      scene1.classList.add("show-end-frame");
    }
    showScene2();
  });
}

/* ========================= */
/*         CUENTA ATRÁS       */
/* ========================= */

/* 28 de noviembre de 2026 a las 17:30 — Chada infantil */
const chadaDate = new Date(2026, 10, 28, 17, 30, 0).getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date().getTime();
  const distance = chadaDate - now;

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor(
    (distance % (1000 * 60)) / 1000
  );

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.addEventListener("DOMContentLoaded", () => {
  if (scene2 && !scene2.classList.contains("hidden")) {
    initRevealAnimations();
    activateFloatingLogo();
  }
});

document.addEventListener("contextmenu", (e) => e.preventDefault());
/* ========================= */
/*   PAUSA DE LA MÚSICA      */
/* ========================= */
let musicWasPlaying = false;

function pauseMusicOnLeave() {
  if (!bgMusic) return;

  musicWasPlaying = !bgMusic.paused && !bgMusic.ended;

  if (musicWasPlaying) {
    bgMusic.pause();
  }
}

function resumeMusicOnReturn() {
  if (!bgMusic) return;

  if (musicWasPlaying && introStarted) {
    const p = bgMusic.play();
    if (p !== undefined) {
      p.catch((err) => console.log("Reanudación de audio bloqueada:", err));
    }
  }

  musicWasPlaying = false;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseMusicOnLeave();
  } else {
    resumeMusicOnReturn();
  }
});

window.addEventListener("pagehide", pauseMusicOnLeave);
window.addEventListener("blur", pauseMusicOnLeave);
window.addEventListener("focus", resumeMusicOnReturn);
window.addEventListener("pageshow", resumeMusicOnReturn);
/* ========================= */
/*  ICONO DE MÚSICA  +  REINICIO AL VOLVER  */
/* ========================= */
/* Reutiliza bgMusic e introStarted ya declarados arriba.
   No vuelve a declararlos. */

const musicToggle = document.getElementById("musicToggle");

let userMuted = false;        /* el usuario ha silenciado la música a mano */
let musicShouldPlay = false;  /* la música debe sonar (después del primer gesto) */

/* --- Icono: refleja el estado real --- */
function setMusicIcon(isPlaying) {
  if (!musicToggle) return;

  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  musicToggle.setAttribute(
    "aria-label",
    isPlaying ? "Pausar la música" : "Reproducir la música"
  );

  const icon = musicToggle.querySelector("i");
  if (icon) {
    icon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-music";
  }
}

/* --- Lectura protegida contra el bloqueo de autoplay --- */
function playMusic() {
  if (!bgMusic) return;

  const promise = bgMusic.play();

  if (promise !== undefined) {
    promise
      .then(() => setMusicIcon(true))
      .catch((err) => {
        console.log("Reproducción de audio bloqueada:", err);
        setMusicIcon(false);
      });
  } else {
    setMusicIcon(true);
  }
}

/* --- El usuario pulsa el icono --- */
function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused || bgMusic.ended) {
    /* Volver a poner la música: se cancela el silencio manual */
    userMuted = false;
    musicShouldPlay = true;

    if (bgMusic.ended || bgMusic.currentTime >= (bgMusic.duration || 0)) {
      bgMusic.currentTime = 0;
    }

    playMusic();
  } else {
    /* Silencio manual: no se reiniciará al volver */
    userMuted = true;
    musicShouldPlay = false;
    bgMusic.pause();
    setMusicIcon(false);
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
}

/* --- Pausa al salir de la página --- */
function pauseMusicOnLeave() {
  if (!bgMusic || bgMusic.paused) return;
  bgMusic.pause();
  setMusicIcon(false);
}

/* --- Reinicia la música DESDE EL PRINCIPIO al volver --- */
function restartMusicOnReturn() {
  if (!bgMusic) return;
  if (userMuted) return;         /* respeta el silencio manual */
  if (!musicShouldPlay) return;  /* la música aún no se ha iniciado */
  if (!bgMusic.paused) return;   /* ya está sonando: no la tocamos */

  bgMusic.currentTime = 0;
  playMusic();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseMusicOnLeave();
  } else {
    restartMusicOnReturn();
  }
});

/* Caché « atrás/adelante » del móvil (BFCache) */
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    restartMusicOnReturn();
  }
});

window.addEventListener("pagehide", pauseMusicOnLeave);
window.addEventListener("focus", restartMusicOnReturn);

/* --- Primer gesto del usuario: abre la música si el navegador la bloqueó --- */
function markMusicStarted() {
  musicShouldPlay = true;
}

if (introTrigger) {
  introTrigger.addEventListener("click", markMusicStarted);
  introTrigger.addEventListener("keydown", markMusicStarted);
}

function unlockMusicOnFirstGesture() {
  if (!musicShouldPlay || !bgMusic || userMuted) return;
  if (bgMusic.paused) {
    bgMusic.currentTime = 0;
    playMusic();
  }
}

document.addEventListener("pointerdown", unlockMusicOnFirstGesture);
document.addEventListener("keydown", unlockMusicOnFirstGesture);

/* --- Estado inicial del icono --- */
document.addEventListener("DOMContentLoaded", () => {
  setMusicIcon(bgMusic ? !bgMusic.paused : false);
});
