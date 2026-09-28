const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const videoEndFrame = document.getElementById("videoEndFrame");

let revealObserverInitialized = false;
let introStarted = false;

const WEDDING_CONFIG = {
  whatsappNumber: "33605642917",
  brideName: "sana",
  groomName: "Abdellatif",
  weddingDate: new Date(2026, 9, 16, 20, 0, 0).getTime(),
  venue: "Les Salons Hoche — Paris",
  weddingDayText: "Vendredi 16 Octobre 2026",
  weddingTimeText: "À partir de 20h00",
  rsvpDeadline: "Merci de confirmer avant le 16 Octobre 2026"
};

/**
 * Initialise les animations d'apparition au scroll
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
    promise.catch((err) => {
      console.log("Lecture audio bloquée :", err);
    });
  }
}

/**
 * Met à jour l'icône musique si un bouton existe
 */
function updateMusicIcon() {
  const musicIcon = document.querySelector(".music-toggle i");
  if (!musicIcon || !bgMusic) return;

  if (bgMusic.paused) {
    musicIcon.className = "fa-solid fa-volume-xmark";
  } else {
    musicIcon.className = "fa-solid fa-volume-high";
  }
}

const musicToggleBtn = document.getElementById("musicToggle");
if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", () => {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().then(updateMusicIcon).catch(() => { });
    } else {
      bgMusic.pause();
      updateMusicIcon();
    }
  });
}

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
  activateFloatingLogo();

  scene1.classList.add("is-opening");

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

const weddingDate = WEDDING_CONFIG.weddingDate;

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
    ? "✅ Je confirme ma présence avec grand plaisir"
    : "❌ Je ne pourrai malheureusement pas être présent(e)";

  const messageText = data.message
    ? `\n\n💌 Message :\n${data.message}` : "";

  const message =
    `🤍 Confirmation de présence — Mariage 🤍

Salam ${WEDDING_CONFIG.brideName} & ${WEDDING_CONFIG.groomName} 💐

👤 C'est : ${data.name}

${attendanceText}

📍 Lieu : ${WEDDING_CONFIG.venue}
📅 Date : ${WEDDING_CONFIG.weddingDayText}
🕕 Horaire : ${WEDDING_CONFIG.weddingTimeText}${messageText}

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