const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const videoEndFrame = document.getElementById("videoEndFrame");
const image2nd = document.getElementById("image2nd");
let revealObserverInitialized = false;
let introStarted = false;
const fixedBackground = document.getElementById("fixedBackground");
const image2ndSection = document.getElementById("image2ndSection");
const musicToggle = document.getElementById("musicToggle");

/**
 * Initialise les animations d'apparition au scroll
 */
function updateMusicIcon() {
  if (!musicToggle || !bgMusic) return;

  const icon = musicToggle.querySelector("i");
  if (!icon) return;

  if (bgMusic.paused) {
    icon.className = "fa-solid fa-play";
    musicToggle.setAttribute("aria-label", "Relancer la musique");
  } else {
    icon.className = "fa-solid fa-pause";
    musicToggle.setAttribute("aria-label", "Mettre la musique en pause");
  }
}

function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    bgMusic.play()
      .then(() => {
        updateMusicIcon();
      })
      .catch((err) => {
        console.log("Impossible de relancer la musique :", err);
      });
  } else {
    bgMusic.pause();
    updateMusicIcon();
  }
}

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
 * Active le logo flottant
 */
function activateFloatingLogo() {
  document.body.classList.add("logo-active");
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
      .then(() => {
        updateMusicIcon();
      })
      .catch((err) => {
        console.log("Lecture audio bloquée :", err);
      });
  }
}
if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
}



/**
 * Affiche le contenu principal sous l'image finale
 */
function showScene2() {
  if (!scene2 || !scene1) return;

  image2ndSection.classList.remove("hidden");
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
 * Lance l'intro : enveloppe disparaît en fondu et image2 reste
 */
function startIntro() {
  if (introStarted || !scene1) return;

  introStarted = true;

  startMusic();

  if (fixedBackground) {
    fixedBackground.classList.add("show");
  }

  activateFloatingLogo();

  scene1.classList.add("is-opening");

  // After envelope disappears
  setTimeout(() => {

    // Hide image2
    videoEndFrame.classList.add("hide");

    // Show image2nd
    image2nd.classList.add("show");

  }, 1700);

  // After a few seconds, display the website
  setTimeout(() => {

    showScene2();

  }, 4700); // 1700 + 3000
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

/* 22 août 2026 à 16h00 */
const weddingDate = new Date(2026, 7, 22, 16, 0, 0).getTime();

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
/* ─── Arrêter la musique quand l'utilisateur quitte la page ─── */
document.addEventListener("visibilitychange", () => {
  if (document.hidden && bgMusic) {
    bgMusic.pause();
    updateMusicIcon();
  }
});

window.addEventListener("pagehide", () => {
  if (bgMusic) {
    bgMusic.pause();
    updateMusicIcon();
  }
});

window.addEventListener("blur", () => {
  if (bgMusic) {
    bgMusic.pause();
    updateMusicIcon();
  }
});/* ─── Pause quand l'utilisateur quitte la page, reprise au retour ─── */
document.addEventListener("visibilitychange", () => {
  if (!bgMusic) return;

  if (document.hidden) {
    bgMusic.pause();
    updateMusicIcon();
  } else {
    bgMusic.play()
      .then(() => updateMusicIcon())
      .catch(() => { });
  }
});