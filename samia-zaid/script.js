const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");

let revealObserverInitialized = false;
let introStarted = false;

const WEDDING_CONFIG = {
  whatsappNumber: "212696687166",
  brideName: "Samia",
  groomName: "Zaid",
  /* Vendredi 23 Octobre 2026 à 17h00 — قصر الأنوار */
  weddingDate: new Date(2026, 9, 23, 18, 0, 0).getTime(),
  venue: "Palais Al Anwar — Marrakech",
  weddingDayText: "Vendredi 23 Octobre 2026",
  weddingTimeText: "À partir de 17h00",
  rsvpDeadline: "Merci de confirmer avant le 15 Octobre 2026",
  rsvpDeadlineDate: new Date(2026, 9, 15, 23, 59, 59).getTime() // 15 octobre 2026 à 23h59
};

/* ─── Reveal Animations ─── */
function initRevealAnimations() {
  if (revealObserverInitialized) return;

  const elements = document.querySelectorAll(
    ".reveal-fade, .reveal-left, .reveal-right, .reveal-zoom"
  );

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    revealObserverInitialized = true;
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 0.07, 0.45)}s`;
    observer.observe(el);
  });

  revealObserverInitialized = true;
}

function activateFloatingLogo() {
  document.body.classList.add("logo-active");
}

/* ─── Music ─── */
function updateMusicIcon() {
  if (!musicIcon || !bgMusic) return;
  const isPlaying = !bgMusic.paused && !bgMusic.ended;
  musicIcon.className = isPlaying
    ? "fa-solid fa-volume-high"
    : "fa-solid fa-volume-xmark";
  if (musicToggle) {
    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "Couper la musique" : "Activer la musique"
    );
  }
}

function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 1;
  const promise = bgMusic.play();
  if (promise !== undefined) {
    promise.then(() => updateMusicIcon()).catch(() => { });
  } else {
    updateMusicIcon();
  }
}

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused || bgMusic.ended) {
    bgMusic.volume = 1;
    const promise = bgMusic.play();
    if (promise !== undefined) {
      promise.then(() => updateMusicIcon()).catch(() => { });
    } else {
      updateMusicIcon();
    }
  } else {
    bgMusic.pause();
    updateMusicIcon();
  }
}

/* ─── Scene transition ─── */
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
  if (introStarted || !scene1) return;
  introStarted = true;
  startMusic();
  activateFloatingLogo();
  scene1.classList.add("is-opening");
  setTimeout(() => {
    showScene2();
  }, 1700);
}

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

if (musicToggle) {
  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
  musicToggle.setAttribute("role", "button");
  musicToggle.setAttribute("tabindex", "0");
  musicToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      toggleMusic();
    }
  });
}

if (bgMusic) {
  bgMusic.addEventListener("play", updateMusicIcon);
  bgMusic.addEventListener("pause", updateMusicIcon);
  bgMusic.addEventListener("ended", updateMusicIcon);
  updateMusicIcon();
}

/* ─── Countdown ─── */
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  const now = new Date().getTime();
  const distance = WEDDING_CONFIG.weddingDate - now;

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

/* ─── Pause quand l'utilisateur quitte la page, reprise au retour ─── */
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
});

/* Lustre — lance l'animation à l'entrée dans le viewport */
(function chandelierPlay() {
  const svg = document.querySelector('.chandelier-svg');
  if (!svg) return;

  if (!('IntersectionObserver' in window)) {
    svg.classList.add('is-playing');
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        svg.classList.add('is-playing');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  io.observe(svg);
})();
