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
  brideName: "Nada",
  groomName: "Abdellah",

  // 29 décembre 2026 à 19h00
  weddingDate: new Date(2026, 11, 29, 19, 0, 0).getTime(),

  venue: "Palace California — قاعة كاليفورنيا",
  weddingDayText: "Mardi 29 Décembre 2026",
  weddingTimeText: "À 19h00",
  rsvpDeadline: "Merci de confirmer avant le 29 Décembre 2026"
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

/* ─── Music (avec fondu doux, sans coupures parasites) ─── */
let musicFadeInterval = null;
let musicUserStarted = false; // la musique ne reprend au retour sur l'onglet que si elle jouait avant

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

/* Fade-in progressif vers un volume cible (évite le "claquement" au démarrage) */
function fadeInAudio(targetVolume = 1, durationMs = 1500) {
  if (!bgMusic) return;
  clearInterval(musicFadeInterval);
  bgMusic.volume = 0;
  const steps = Math.max(1, Math.round(durationMs / 100));
  let current = 0;
  musicFadeInterval = setInterval(() => {
    current++;
    bgMusic.volume = Math.min(targetVolume, current / steps);
    if (bgMusic.volume >= targetVolume) {
      clearInterval(musicFadeInterval);
      bgMusic.volume = targetVolume;
    }
  }, 100);
}

/* Fade-out court puis pause (évite le "clic" à l'arrêt) */
function fadeOutAndPause(durationMs = 400) {
  if (!bgMusic) return;
  clearInterval(musicFadeInterval);
  const startVolume = bgMusic.volume;
  const steps = Math.max(1, Math.round(durationMs / 100));
  let current = 0;
  musicFadeInterval = setInterval(() => {
    current++;
    bgMusic.volume = Math.max(0, startVolume * (1 - current / steps));
    if (bgMusic.volume <= 0) {
      clearInterval(musicFadeInterval);
      bgMusic.pause();
      bgMusic.volume = 1; // prêt pour le prochain fondu d'entrée
      updateMusicIcon();
    }
  }, 100);
}

function startMusic() {
  if (!bgMusic) return;
  musicUserStarted = true;
  const promise = bgMusic.play();
  if (promise !== undefined) {
    promise
      .then(() => {
        fadeInAudio(1, 1500);
        updateMusicIcon();
      })
      .catch(() => { });
  } else {
    fadeInAudio(1, 1500);
    updateMusicIcon();
  }
}

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused || bgMusic.ended) {
    startMusic();
  } else {
    musicUserStarted = false;
    fadeOutAndPause(400);
  }
}

/* Un SEUL handler visibilitychange : pause quand l'onglet est caché,
   reprise SEULEMENT si la musique jouait avant (pas de relance forcée) */
document.addEventListener("visibilitychange", () => {
  if (!bgMusic) return;
  if (document.hidden) {
    if (!bgMusic.paused) {
      bgMusic.pause();
      bgMusic.volume = 1;
      updateMusicIcon();
    }
  } else if (musicUserStarted && bgMusic.paused) {
    bgMusic.play()
      .then(() => updateMusicIcon())
      .catch(() => { });
  }
});

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

/* ─── RSVP Form ─── */
const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");

function showStatus(message, type = "success") {
  if (!rsvpStatus) return;
  rsvpStatus.className = "rsvp-status is-visible";
  rsvpStatus.classList.add(type === "error" ? "is-error" : "is-success");
  rsvpStatus.textContent = message;
}

function clearStatus() {
  if (!rsvpStatus) return;
  rsvpStatus.className = "rsvp-status";
  rsvpStatus.textContent = "";
}

function showFieldError(field, message) {
  if (!field) return;
  const wrapper = field.closest(".rsvp-field");
  if (!wrapper) return;
  wrapper.classList.add("has-error");
  const oldMsg = wrapper.querySelector(".rsvp-error-msg");
  if (oldMsg) oldMsg.remove();
  const msg = document.createElement("small");
  msg.className = "rsvp-error-msg";
  msg.textContent = message;
  wrapper.appendChild(msg);
}

function clearFieldError(field) {
  if (!field) return;
  const wrapper = field.closest(".rsvp-field");
  if (!wrapper) return;
  wrapper.classList.remove("has-error");
  const oldMsg = wrapper.querySelector(".rsvp-error-msg");
  if (oldMsg) oldMsg.remove();
}

function syncAttendanceFields() {
  if (!rsvpForm) return;
  const attendanceField = rsvpForm.querySelector('input[name="attendance"]:checked');
  const guestsField = document.getElementById("rsvpGuests");
  const isComing = attendanceField ? attendanceField.value === "yes" : true;
  if (!guestsField) return;
  guestsField.disabled = !isComing;
  guestsField.style.opacity = isComing ? "1" : "0.50";
  if (!isComing) guestsField.value = "1";
}

function buildWhatsAppMessage(data) {
  const attendanceText = data.attendance === "yes"
    ? "✅ *Je confirme ma présence avec grand plaisir*"
    : "❌ *Je ne pourrai malheureusement pas être présent(e)*";


  const messageText = data.message
    ? `\n\n💌 *Message :*\n${data.message}` : "";

  const message =
    `*🤍 Confirmation de présence — Mariage 🤍*

Salam ${WEDDING_CONFIG.brideName} & ${WEDDING_CONFIG.groomName} 💐

👤 *Nom complet :* ${data.name}
 
📍 *Lieu :* ${WEDDING_CONFIG.venue}
📅 *Date :* ${WEDDING_CONFIG.weddingDayText}
🕕 *Horaire :* ${WEDDING_CONFIG.weddingTimeText}${messageText}

Avec mes meilleurs vœux de bonheur 💕`;

  return encodeURIComponent(message);
}

function openWhatsApp(url) {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
    window.location.href = url;
  }
}

if (rsvpForm) {
  const allFields = rsvpForm.querySelectorAll("input, textarea, select");

  allFields.forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field);
      clearStatus();
    });
    field.addEventListener("change", () => {
      clearFieldError(field);
      clearStatus();
      if (field.name === "attendance") syncAttendanceFields();
    });
  });

  syncAttendanceFields();

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearStatus();

    const nameField = document.getElementById("rsvpName");
    const messageField = document.getElementById("rsvpMessage");
    const attendanceField = rsvpForm.querySelector('input[name="attendance"]:checked');

    const name = nameField ? nameField.value.trim() : "";
    const message = messageField ? messageField.value.trim() : "";
    const attendance = attendanceField ? attendanceField.value : "yes";

    let hasError = false;

    if (!name || name.length < 2) {
      showFieldError(nameField, "Merci d'indiquer votre nom complet.");
      if (nameField) nameField.focus();
      hasError = true;
    }



    if (hasError) {
      showStatus("Merci de corriger les champs indiqués avant l'envoi.", "error");
      return;
    }

    const encodedMessage = buildWhatsAppMessage({
      name,
      attendance,
      message
    });

    const whatsappUrl = `https://wa.me/${WEDDING_CONFIG.whatsappNumber}?text=${encodedMessage}`;
    const submitBtn = rsvpForm.querySelector(".btn-royal");

    showStatus("Ouverture de WhatsApp en cours...", "success");

    if (submitBtn) {
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Ouverture de WhatsApp...</span>';
      submitBtn.disabled = true;
      setTimeout(() => {
        openWhatsApp(whatsappUrl);
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }, 500);
    } else {
      openWhatsApp(whatsappUrl);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (scene2 && !scene2.classList.contains("hidden")) {
    initRevealAnimations();
    activateFloatingLogo();
  }
});

/* ─── Arrêter proprement la musique quand l'utilisateur quitte la page ─── */
window.addEventListener("pagehide", () => {
  if (bgMusic) {
    bgMusic.pause();
    updateMusicIcon();
  }
});
