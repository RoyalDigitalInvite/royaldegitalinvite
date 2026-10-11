/* =========================================================
   IMANE & MAHER — Invitation de mariage
   Intro : l'enveloppe fond doucement pendant que l'image
   apparaît en même temps (plein écran), puis l'écriture
   s'anime PAR-DESSUS l'image (aucune attente après le fondu).
   Envoi de la confirmation de présence : WhatsApp.
   ========================================================= */

/* >>> ÉTAPE 1 : REMPLACEZ ce numéro par le vôtre <<<
   Format international, sans le "+", sans espaces.
   Exemple : 06 12 34 56 78  ->  "33612345678" */
const WHATSAPP_NUMBER = "33766588714";

const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const namesAnimated = document.getElementById("namesAnimated");
const musicToggle = document.getElementById("musicToggle");

let revealObserverInitialized = false;
let introStarted = false;

/* ========================= */
/*   NOMS LETTRE PAR LETTRE  */
/*   (flou + montée douce)   */
/* ========================= */
function animateNames() {
  if (!namesAnimated) return;

  const text = "Imane & Maher";
  namesAnimated.innerHTML = "";

  Array.from(text).forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "name-letter";

    if (char === " ") {
      span.classList.add("name-space");
      span.innerHTML = "&nbsp;";
    } else {
      span.textContent = char;
    }

    span.style.animationDelay = (0.4 + index * 0.14).toFixed(2) + "s";
    namesAnimated.appendChild(span);
  });
}

/* ========================= */
/*   ANIMATIONS AU SCROLL    */
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
    el.style.transitionDelay = Math.min(index * 0.07, 0.45) + "s";
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
/*       BARRE MUSIQUE       */
/* ========================= */
function setMusicIcon(playing) {
  if (!musicToggle) return;
  const icon = musicToggle.querySelector("i");
  if (icon) icon.className = playing ? "fa-solid fa-pause" : "fa-solid fa-play";
  musicToggle.classList.toggle("is-playing", playing);
  musicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
}

function startMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 1;

  const promise = bgMusic.play();

  if (promise !== undefined) {
    promise
      .then(() => setMusicIcon(true))
      .catch((err) => {
        console.log("Lecture audio bloquée :", err);
        setMusicIcon(false);
      });
  } else {
    setMusicIcon(!bgMusic.paused);
  }
}

function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    startMusic();
  } else {
    bgMusic.pause();
    setMusicIcon(false);
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
}

if (bgMusic) {
  bgMusic.addEventListener("play", () => setMusicIcon(true));
  bgMusic.addEventListener("pause", () => setMusicIcon(false));
  bgMusic.addEventListener("error", () => setMusicIcon(false));
}

/* PAUSE AUTOMATIQUE quand on quitte le navigateur / l'onglet */
document.addEventListener("visibilitychange", () => {
  if (document.hidden && bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    setMusicIcon(false);
  }
});

window.addEventListener("pagehide", () => {
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    setMusicIcon(false);
  }
});

/* ========================= */
/*        SCÈNE 2            */
/* ========================= */
/* La scène 2 est révélée sans saut ni défilement automatique :
   l'utilisateur scrolle lui-même pour la découvrir. */
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

/* ========================= */
/*        INTRO              */
/* ========================= */
/* Au clic : fondu simultané — l'enveloppe disparaît
   doucement (1.8s) PENDANT que l'image apparaît et que
   l'écriture s'anime. Aucune attente entre les deux. */
function startIntro() {
  if (introStarted || !scene1 || !introTrigger) return;

  introStarted = true;

  /* Un seul état déclenche le fondu croisé complet :
     l'enveloppe s'efface, l'image et l'écriture apparaissent */
  scene1.classList.add("is-started");

  /* Musique lancée dans le geste utilisateur (autoplay autorisé) */
  startMusic();

  /* L'animation des noms démarre pendant le fondu */
  animateNames();

  /* La scène 2 est révélée tout de suite (sans scroll automatique) */
  showScene2();

  /* Le bouton musique apparaît dès le début du fondu */
  if (musicToggle) {
    musicToggle.classList.remove("is-hidden");
  }

  /* Marque la fin de l'animation des noms (pour la flèche) */
  setTimeout(() => {
    if (scene1) scene1.classList.add("names-done");
  }, 3400);
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

/* ========================= */
/*         COUNTDOWN         */
/* ========================= */

/* Samedi 12 décembre 2026 à 14h00 (mois 11 = décembre) */
const weddingDate = new Date(2026, 11, 12, 14, 0, 0).getTime();

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
/*  FORMULAIRE RSVP → WHATSAPP */
/* ========================= */
const rsvpForm = document.getElementById("rsvpForm");
const guestName = document.getElementById("guestName");
const guestMessage = document.getElementById("guestMessage");
const nameError = document.getElementById("nameError");
const answerError = document.getElementById("answerError");
const formStatus = document.getElementById("formStatus");
const rsvpSubmit = document.getElementById("rsvpSubmit");

function setError(el, message) {
  if (!el) return;
  el.textContent = message || "";
  el.classList.toggle("is-visible", Boolean(message));
}

function showStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove("is-success", "is-error");
  if (type) formStatus.classList.add(type);
}

if (rsvpForm) {
  rsvpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameValue = guestName ? guestName.value.trim() : "";
    const answerInput = rsvpForm.querySelector('input[name="reponse"]:checked');
    const messageValue = guestMessage ? guestMessage.value.trim() : "";

    let valid = true;

    if (nameValue.length < 2) {
      setError(nameError, "Merci d’indiquer votre nom et prénom.");
      if (guestName) guestName.classList.add("is-invalid");
      valid = false;
    } else {
      setError(nameError, "");
      if (guestName) guestName.classList.remove("is-invalid");
    }

    if (!answerInput) {
      setError(answerError, "Merci de choisir une réponse.");
      valid = false;
    } else {
      setError(answerError, "");
    }

    if (!valid) {
      showStatus("Merci de compléter les champs obligatoires.", "is-error");
      if (guestName && nameValue.length < 2) guestName.focus();
      return;
    }

    /* Message WhatsApp pré-rempli */
 
/* Message WhatsApp pré-rempli */

// Récupérer les textes du choix sélectionné
const selectedLabel = answerInput.closest("label");

const choiceText =
  selectedLabel?.querySelector(".choice-text")?.textContent.trim() || answerInput.value;

const choiceSub =
  selectedLabel?.querySelector(".choice-sub")?.textContent.trim() || "";

const lignes = [
  "💌 Confirmation de présence",
  "",
  "Bonjour Imane et Maher, 🌸",
  "",
  "Je vous remercie pour votre invitation à partager ce magnifique moment avec vous.",
  "",
  "👤 Nom et prénom : " + nameValue,
  "💖 Réponse : " + choiceText,
  ...(choiceSub ? [choiceSub] : []),
  ...(messageValue ? ["", "✉️ Petit message : " + messageValue] : []),
  "",
  "Je vous souhaite beaucoup de bonheur et une merveilleuse célébration. 💐"
];


  
    const texte = encodeURIComponent(lignes.join("\n"));
    const whatsappUrl =
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + texte;

    if (rsvpSubmit) rsvpSubmit.disabled = true;
    showStatus("Ouverture de WhatsApp…", "");

    window.open(whatsappUrl, "_blank", "noopener");

    if (rsvpSubmit) rsvpSubmit.disabled = false;

    const confirmation =
      answerInput.value === "Avec plaisir"
        ? "Merci " + nameValue + "  pour votre présence!💐"
        : "Merci " + nameValue + " pour votre présence!💐";

    showStatus(confirmation, "is-success");
    rsvpForm.reset();
    setError(nameError, "");
    setError(answerError, "");
  });
}

if (guestName) {
  guestName.addEventListener("input", function () {
    if (guestName.value.trim().length >= 2) {
      setError(nameError, "");
      guestName.classList.remove("is-invalid");
    }
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener("change", function (e) {
    if (e.target && e.target.name === "reponse") {
      setError(answerError, "");
    }
  });
}
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
/* ========================= */
/*        DIVERS             */
/* ========================= */
