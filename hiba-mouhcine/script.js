const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const videoEndFrame = document.getElementById("videoEndFrame");

let revealObserverInitialized = false;
let introStarted = false;
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");

function updateMusicIcon() {
  if (bgMusic.paused) {
    musicIcon.className = "fa-solid fa-volume-xmark";
  } else {
    musicIcon.className = "fa-solid fa-volume-high";
  }
}

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play()
      .then(() => updateMusicIcon())
      .catch(err => console.log(err));
  } else {
    bgMusic.pause();
    updateMusicIcon();
  }
});

bgMusic.addEventListener("play", updateMusicIcon);
bgMusic.addEventListener("pause", updateMusicIcon);

/* ============================================================
   RSVP — WhatsApp + Email fallback
   ⚠ REMPLACER le numéro WhatsApp et l'adresse e-mail ci-dessous
   ============================================================ */
const WHATSAPP_NUMBER = "447446589045"; // ex: 212600112233 (indicatif pays + numéro, sans + ni espaces)
//const RSVP_EMAIL = "rsvp.hiba.mouhcine@example.com";

function buildWhatsAppUrl(name, choice, message) {
  const lines = [
    "✨ RSVP — Wedding of Hiba & Mouhcine ✨",
    "",
    `Name: ${name}`,
    `Answer: ${choice === "yes"
      ? "Joyfully attending ❤️"
      : "Unfortunately unable to attend 💌"}`,
  ];
  if (message && message.trim()) {
    lines.push("", `Message:\n${message.trim()}`);
  }
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function buildMailtoUrl(name, choice, message) {
  const subject = encodeURIComponent(`RSVP — ${name} — Wedding of Hiba & Mouhcine`);
  const body = encodeURIComponent(
    `Name: ${name}\n` +
    `Answer: ${choice === "yes"
      ? "Joyfully attending"
      : "Unfortunately unable to attend"}\n` +
    (message && message.trim() ? `\nMessage:\n${message.trim()}\n` : "")
  );
  return `mailto:${RSVP_EMAIL}?subject=${subject}&body=${body}`;
}


function buildMailtoUrl(name, choice, message) {
  const subject = encodeURIComponent(`RSVP — ${name} — Mariage Hiba & Mouhcine`);
  const body = encodeURIComponent(
    `Nom: ${name}\n` +
    `Réponse: ${choice === "yes" ? "Avec plaisir" : "Malheureusement absent(e)"}\n` +
    (message && message.trim() ? `\nMessage:\n${message.trim()}\n` : "")
  );
  return `mailto:${RSVP_EMAIL}?subject=${subject}&body=${body}`;
}

/* ============================================================ */

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

  // Disconnect prior observer if any (defensive for re-init after reset)
  if (window.__revealObserver) {
    try { window.__revealObserver.disconnect(); } catch (_) { }
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  window.__revealObserver = observer;

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 0.07, 0.45)}s`;
    observer.observe(el);
  });

  revealObserverInitialized = true;
}

function activateFloatingLogo() {
  document.body.classList.add("logo-active");
}

function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 1;
  const promise = bgMusic.play();
  if (promise !== undefined) {
    promise.catch((err) => {
      console.log("Lecture audio bloquée :", err);
    });
  }
}

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
function activateFloatingLogo() {
  document.body.classList.add("logo-active");
}


/* ========================= */
/*         COUNTDOWN         */
/* ========================= */
const weddingDate = new Date(2026, 9, 17, 18, 0, 0).getTime();

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

/* ========================= */
/*           RSVP            */
/* ========================= */
(function setupRsvp() {
  const form = document.getElementById("rsvpForm");
  const success = document.getElementById("rsvpSuccess");
  const resetBtn = document.getElementById("rsvpReset");
  const mailtoLink = document.getElementById("rsvpMailto");
  if (!form) return;

  const nameInput = document.getElementById("rsvpName");
  const messageInput = document.getElementById("rsvpMessage");
  const choiceInputs = form.querySelectorAll('input[name="rsvpChoice"]');

  function clearErrors() {
    form.querySelectorAll(".rsvp-field").forEach((f) => f.classList.remove("has-error"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const name = (nameInput.value || "").trim();
    const choice = form.querySelector('input[name="rsvpChoice"]:checked');
    const message = (messageInput.value || "").trim();
    let valid = true;

    if (!name) {
      nameInput.closest(".rsvp-field").classList.add("has-error");
      valid = false;
    }
    if (!choice) {
      // mark every choice container as error by adding class on first choice's field
      const choicesField = form.querySelector(".rsvp-choices").closest(".rsvp-field");
      if (choicesField) choicesField.classList.add("has-error");
      valid = false;
    }

    if (!valid) return;

    // 1) Prepare WhatsApp URL (open in new tab)
    const waUrl = buildWhatsAppUrl(name, choice.value, message);
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // 2) Update fallback mailto link with the same content
    if (mailtoLink) mailtoLink.href = buildMailtoUrl(name, choice.value, message);

    // 3) Show on-screen confirmation
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      success.hidden = true;
      form.hidden = false;
      form.reset();
      clearErrors();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();

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

/* Arrêter la musique quand l'utilisateur quitte la page */
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

// Désactiver clic droit
document.addEventListener("contextmenu", e => {
  e.preventDefault();
});

// Bloquer F12 et raccourcis courants
document.addEventListener("keydown", e => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toUpperCase() === "U")
  ) {
    e.preventDefault();
  }
});
