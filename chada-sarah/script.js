/* =========================================================
   INVITACIÓN CHADA — SARAH  ·  script.js
   ========================================================= */

const video1 = document.getElementById("video1");
const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const videoEndFrame = document.getElementById("videoEndFrame");
const musicToggle = document.getElementById("musicToggle");
const swipeHint = document.getElementById("swipeUpHintEnd");

let revealObserverInitialized = false;
let introStarted = false;
let userMuted = false;
let musicWasPlayingBeforeLeave = false;

/* ========================= */
/*      REVEAL ANIMATIONS    */
/* ========================= */
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

/* ========================= */
/*      LOGO FLOTANTE        */
/* ========================= */
function activateFloatingLogo() {
  document.body.classList.add("logo-active");
}

/* ========================= */
/*   SWIPE DOWN — indicador  */
/* ========================= */
function showSwipeHint() {
  if (!swipeHint) return;
  swipeHint.classList.add("is-visible");
  swipeHint.setAttribute("aria-hidden", "false");
}

function hideSwipeHint() {
  if (!swipeHint) return;
  swipeHint.classList.remove("is-visible");
  swipeHint.setAttribute("aria-hidden", "true");
}

if (swipeHint) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) hideSwipeHint();
  }, { passive: true });
}

/* ========================= */
/*          MÚSICA           */
/* ========================= */
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

function playMusic() {
  if (!bgMusic || userMuted) return;

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

function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 1;
  playMusic();
}

function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    // L'utilisateur veut relancer
    userMuted = false;
    playMusic();
  } else {
    // L'utilisateur coupe volontairement
    userMuted = true;
    bgMusic.pause();
    setMusicIcon(false);
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
}

/* ========================= */
/*    PAUSA / REANUDACIÓN    */
/* ========================= */
function pauseMusicOnLeave() {
  if (!bgMusic) return;

  musicWasPlayingBeforeLeave = !bgMusic.paused && !bgMusic.ended;

  if (musicWasPlayingBeforeLeave) {
    bgMusic.pause();
    setMusicIcon(false);
  }
}

function resumeMusicOnReturn() {
  if (!bgMusic || userMuted) return;

  if (musicWasPlayingBeforeLeave) {
    playMusic();
  }

  musicWasPlayingBeforeLeave = false;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseMusicOnLeave();
  } else {
    resumeMusicOnReturn();
  }
});

window.addEventListener("blur", pauseMusicOnLeave);
window.addEventListener("focus", resumeMusicOnReturn);
window.addEventListener("pagehide", pauseMusicOnLeave);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) resumeMusicOnReturn();
});

/* ========================= */
/*      ESCENAS / INTRO      */
/* ========================= */

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

function startIntro() {
  if (introStarted || !scene1 || !video1) return;

  introStarted = true;

  scene1.classList.add("is-started");

  /* 🦋 Papillons */
  document.body.classList.add("butterflies-active");

  /* 🎵 Afficher l'icône musique après ouverture */
  document.body.classList.add("intro-started");

  activateFloatingLogo();
  startMusic();

  video1.loop = false;
  video1.currentTime = 0;

  const playPromise = video1.play();

  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.log("Reproducción de vídeo bloqueada:", err);
      scene1.classList.add("show-end-frame");
      showSwipeHint();
      showScene2();
    });
  }
}

/**
 * Fin del vídeo:
 * se congela en la imagen final (design1.png),
 * se muestra el indicador "Desliza hacia abajo"
 * y el resto de la página aparece debajo.
 */
function freezeLastFrame() {
  if (!scene1 || !video1) return;

  video1.pause();
  scene1.classList.add("show-end-frame");

  requestAnimationFrame(() => {
    showSwipeHint();
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
    showSwipeHint();
    showScene2();
  });
}

/* ========================= */
/*        CUENTA ATRÁS       */
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

/* ========================= */
/*      ESTADO INICIAL       */
/* ========================= */
document.addEventListener("DOMContentLoaded", () => {
  if (scene2 && !scene2.classList.contains("hidden")) {
    initRevealAnimations();
    activateFloatingLogo();
  }

  if (bgMusic) {
    setMusicIcon(!bgMusic.paused);
  }
});

document.addEventListener("contextmenu", (e) => e.preventDefault());
