/* ========================= */
/*         ÉLÉMENTS          */
/* ========================= */
const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const videoEndFrame = document.getElementById("videoEndFrame");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");

let revealObserverInitialized = false;
let introStarted = false;

/* ========================= */
/*    ANIMATIONS AU SCROLL   */
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
/*       LOGO FLOTTANT       */
/* ========================= */
function activateFloatingLogo() {
  document.body.classList.add("logo-active");
}

/* ========================= */
/*          MUSIQUE          */
/* ========================= */

/**
 * Met à jour l'icône du bouton musique
 * (définie avant tout appel : corrige le bug "updateMusicIcon is not defined")
 */
function updateMusicIcon() {
  if (!bgMusic) return;

  const isPlaying = !bgMusic.paused && !bgMusic.ended;

  if (musicIcon) {
    musicIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
  }

  if (musicToggle) {
    musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "Pause the music" : "Play the music"
    );
  }
}

/**
 * Démarre la musique après interaction utilisateur
 */
function startMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 1;

  const promise = bgMusic.play();

  if (promise !== undefined) {
    promise
      .then(() => updateMusicIcon())
      .catch((err) => {
        console.log("Lecture audio bloquée :", err);
        updateMusicIcon();
      });
  } else {
    updateMusicIcon();
  }
}

/**
 * Bouton lecture / pause (bas à droite)
 */
function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    bgMusic.play()
      .then(() => updateMusicIcon())
      .catch((err) => {
        console.log("Lecture audio bloquée :", err);
        updateMusicIcon();
      });
  } else {
    bgMusic.pause();
    updateMusicIcon();
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
}

if (bgMusic) {
  bgMusic.addEventListener("play", updateMusicIcon);
  bgMusic.addEventListener("pause", updateMusicIcon);
  bgMusic.addEventListener("ended", updateMusicIcon);
}

/* ========================= */
/*           INTRO           */
/* ========================= */

/**
 * Affiche le contenu principal sous l'image finale
 */
function showScene2() {
  if (!scene2 || !scene1) return;

  scene2.classList.remove("hidden");
  scene1.classList.add("is-finished");

  document.body.classList.remove("intro-active");
  document.body.classList.add("intro-finished");

  activateFloatingLogo();
  updateMusicIcon();

  requestAnimationFrame(() => {
    initRevealAnimations();
  });
}

/**
 * Lance l'intro : l'enveloppe disparaît en fondu et image2 reste
 */
function startIntro() {
  if (introStarted || !scene1) return;

  introStarted = true;

  // Démarrer la musique
  startMusic();
  activateFloatingLogo();

  // Déclencher la disparition douce de l'enveloppe
  scene1.classList.add("is-opening");

  // Après l'animation de fondu (1.7s), afficher le contenu principal
  setTimeout(() => {
    showScene2();
  }, 1700);
}

/**
 * Accessibilité clavier
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

/* ========================= */
/*         COUNTDOWN         */
/* ========================= */

/* 10 décembre 2026 à 16h00 (format FR : JJ/MM) — mois zéro-indexé = 11 */
const weddingDate = new Date(2026, 11, 10, 16, 0, 0).getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

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
  updateMusicIcon();
});

/* ========================= */
/*    AUDIO : PAGE / ONGLET  */
/* ========================= */

/* Un seul écouteur visibilitychange : pause en quittant,
   reprise au retour (sans blur, qui provoquait des coupures parasites) */
document.addEventListener("visibilitychange", () => {
  if (!bgMusic) return;

  if (document.hidden) {
    bgMusic.pause();
    updateMusicIcon();
  } else if (introStarted) {
    bgMusic.play()
      .then(() => updateMusicIcon())
      .catch(() => updateMusicIcon());
  }
});

window.addEventListener("pagehide", () => {
  if (!bgMusic) return;
  bgMusic.pause();
  updateMusicIcon();
});

/* Sécurité */
document.addEventListener("keydown", function (e) {
  if (e.key === "F12") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
    e.preventDefault();
  }
  if (e.ctrlKey && e.key.toUpperCase() === "U") {
    e.preventDefault();
  }
});
