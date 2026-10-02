const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const floatingLogo = document.getElementById("floatingLogo");

let revealObserverInitialized = false;
let introStarted = false;

const WEDDING_CONFIG = {
  whatsappNumber: "212663824822",
  brideName: "Oumaima",
  groomName: "Abdulla",

  weddingDate: new Date(2026, 9, 22, 15, 30).getTime(),

  venue: "Palais Ines — Casablanca",
  weddingDayText: "Thursday 22 October 2026",
  weddingTimeText: "From 3:30 PM",
  rsvpDeadline: "Please confirm before 15 October 2026"
};


/* ═══════════════════════════════════════
   REVEAL ANIMATIONS
═══════════════════════════════════════ */

function initRevealAnimations() {
  if (revealObserverInitialized) return;

  const elements = document.querySelectorAll(
    ".reveal-fade, .reveal-left, .reveal-right, .reveal-zoom"
  );

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => {
      el.classList.add("is-visible");
    });

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
    {
      threshold: 0.12
    }
  );

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 0.07, 0.45)}s`;
    observer.observe(el);
  });

  revealObserverInitialized = true;
}


/* ═══════════════════════════════════════
   FLOATING LOGO
═══════════════════════════════════════ */

function activateFloatingLogo() {
  if (!floatingLogo) return;

  document.body.classList.add("logo-active");
}


/* ═══════════════════════════════════════
   MUSIC
═══════════════════════════════════════ */

function updateMusicIcon() {
  if (!musicIcon || !bgMusic) return;

  const isPlaying = !bgMusic.paused && !bgMusic.ended;

  musicIcon.className = isPlaying
    ? "fa-solid fa-volume-high"
    : "fa-solid fa-volume-xmark";

  if (musicToggle) {
    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "Mute music" : "Unmute music"
    );
  }
}


function startMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 1;

  const promise = bgMusic.play();

  if (promise !== undefined) {
    promise
      .then(() => {
        updateMusicIcon();
      })
      .catch(() => {});
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
      promise
        .then(() => {
          updateMusicIcon();
        })
        .catch(() => {});
    } else {
      updateMusicIcon();
    }

  } else {
    bgMusic.pause();
    updateMusicIcon();
  }
}


/* ═══════════════════════════════════════
   SCENE TRANSITION
═══════════════════════════════════════ */

function showScene2() {
  if (!scene2 || !scene1) return;

  // Afficher la deuxième scène
  scene2.classList.remove("hidden");

  // Terminer l'introduction
  scene1.classList.add("is-finished");

  document.body.classList.remove("intro-active");
  document.body.classList.add("intro-finished");

  // Activer le logo flottant
  activateFloatingLogo();

  // Initialiser les animations
  requestAnimationFrame(() => {
    initRevealAnimations();
  });
}


function startIntro() {
  if (introStarted || !scene1) return;

  introStarted = true;

  startMusic();

  scene1.classList.add("is-opening");

  setTimeout(() => {
    showScene2();
  }, 1700);
}


/* ═══════════════════════════════════════
   INTRO EVENTS
═══════════════════════════════════════ */

function handleIntroKeydown(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    startIntro();
  }
}


if (introTrigger) {
  introTrigger.addEventListener("click", startIntro);

  introTrigger.addEventListener(
    "keydown",
    handleIntroKeydown
  );
}


/* ═══════════════════════════════════════
   MUSIC BUTTON
═══════════════════════════════════════ */

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

  bgMusic.addEventListener(
    "play",
    updateMusicIcon
  );

  bgMusic.addEventListener(
    "pause",
    updateMusicIcon
  );

  bgMusic.addEventListener(
    "ended",
    updateMusicIcon
  );

  updateMusicIcon();
}


/* ═══════════════════════════════════════
   COUNTDOWN
═══════════════════════════════════════ */

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");


function updateCountdown() {

  if (
    !daysEl ||
    !hoursEl ||
    !minutesEl ||
    !secondsEl
  ) {
    return;
  }

  const now = new Date().getTime();

  const distance =
    WEDDING_CONFIG.weddingDate - now;


  if (distance <= 0) {

    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    return;
  }


  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60)) /
    1000
  );


  daysEl.textContent =
    String(days).padStart(2, "0");

  hoursEl.textContent =
    String(hours).padStart(2, "0");

  minutesEl.textContent =
    String(minutes).padStart(2, "0");

  secondsEl.textContent =
    String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* ═══════════════════════════════════════
   RSVP FORM
═══════════════════════════════════════ */

const rsvpForm =
  document.getElementById("rsvpForm");

const rsvpStatus =
  document.getElementById("rsvpStatus");


function showStatus(
  message,
  type = "success"
) {

  if (!rsvpStatus) return;

  rsvpStatus.className =
    "rsvp-status is-visible";

  rsvpStatus.classList.add(
    type === "error"
      ? "is-error"
      : "is-success"
  );

  rsvpStatus.textContent = message;
}


function clearStatus() {

  if (!rsvpStatus) return;

  rsvpStatus.className =
    "rsvp-status";

  rsvpStatus.textContent = "";
}


function showFieldError(
  field,
  message
) {

  if (!field) return;

  const wrapper =
    field.closest(".rsvp-field");

  if (!wrapper) return;

  wrapper.classList.add("has-error");

  const oldMsg =
    wrapper.querySelector(
      ".rsvp-error-msg"
    );

  if (oldMsg) {
    oldMsg.remove();
  }

  const msg =
    document.createElement("small");

  msg.className =
    "rsvp-error-msg";

  msg.textContent =
    message;

  wrapper.appendChild(msg);
}


function clearFieldError(field) {

  if (!field) return;

  const wrapper =
    field.closest(".rsvp-field");

  if (!wrapper) return;

  wrapper.classList.remove(
    "has-error"
  );

  const oldMsg =
    wrapper.querySelector(
      ".rsvp-error-msg"
    );

  if (oldMsg) {
    oldMsg.remove();
  }
}


/* ═══════════════════════════════════════
   WHATSAPP RSVP
═══════════════════════════════════════ */

function buildWhatsAppMessage(data) {

  const attendanceText =
    data.attendance === "yes"

      ? "✅ *I confirm my attendance with great pleasure*"

      : "❌ *Unfortunately, I will not be able to attend*";


  const messageText =
    data.message

      ? `\n\n💌 *Message :*\n${data.message}`

      : "";


  const message =

`*🤍 Wedding RSVP — Attendance Confirmation 🤍*

Hello ${WEDDING_CONFIG.brideName} & ${WEDDING_CONFIG.groomName} 💐

👤 *Full name:* ${data.name}

${attendanceText}

📍 *Venue:* ${WEDDING_CONFIG.venue}
📅 *Date:* ${WEDDING_CONFIG.weddingDayText}
🕞 *Time:* ${WEDDING_CONFIG.weddingTimeText}${messageText}

With my warmest wishes of happiness 💕`;


  return encodeURIComponent(message);
}


function openWhatsApp(url) {

  const newWindow =
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );


  if (
    !newWindow ||
    newWindow.closed ||
    typeof newWindow.closed === "undefined"
  ) {
    window.location.href = url;
  }
}


if (rsvpForm) {

  const allFields =
    rsvpForm.querySelectorAll(
      "input, textarea, select"
    );


  allFields.forEach((field) => {

    field.addEventListener(
      "input",
      () => {

        clearFieldError(field);
        clearStatus();

      }
    );


    field.addEventListener(
      "change",
      () => {

        clearFieldError(field);
        clearStatus();

        if (
          field.name === "attendance" &&
          typeof syncAttendanceFields === "function"
        ) {
          syncAttendanceFields();
        }

      }
    );

  });


  rsvpForm.addEventListener(
    "submit",
    (e) => {

      e.preventDefault();

      clearStatus();


      const nameField =
        document.getElementById(
          "rsvpName"
        );

      const messageField =
        document.getElementById(
          "rsvpMessage"
        );

      const attendanceField =
        rsvpForm.querySelector(
          'input[name="attendance"]:checked'
        );


      const name =
        nameField
          ? nameField.value.trim()
          : "";


      const message =
        messageField
          ? messageField.value.trim()
          : "";


      const attendance =
        attendanceField
          ? attendanceField.value
          : "yes";


      let hasError = false;


      if (
        !name ||
        name.length < 2
      ) {

        showFieldError(
          nameField,
          "Please enter your full name."
        );

        if (nameField) {
          nameField.focus();
        }

        hasError = true;
      }


      if (hasError) {

        showStatus(
          "Please correct the highlighted fields before sending.",
          "error"
        );

        return;
      }


      const encodedMessage =
        buildWhatsAppMessage({
          name,
          attendance,
          message
        });


      const whatsappUrl =
        `https://wa.me/${WEDDING_CONFIG.whatsappNumber}?text=${encodedMessage}`;


      const submitBtn =
        rsvpForm.querySelector(
          ".btn-royal"
        );


      showStatus(
        "Opening WhatsApp...",
        "success"
      );


      if (submitBtn) {

        const originalHTML =
          submitBtn.innerHTML;


        submitBtn.innerHTML =
          '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Opening WhatsApp...</span>';


        submitBtn.disabled = true;


        setTimeout(() => {

          openWhatsApp(
            whatsappUrl
          );

          submitBtn.innerHTML =
            originalHTML;

          submitBtn.disabled =
            false;

        }, 500);

      } else {

        openWhatsApp(
          whatsappUrl
        );

      }

    }
  );
}


/* ═══════════════════════════════════════
   PAGE LOAD
═══════════════════════════════════════ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (
      scene2 &&
      !scene2.classList.contains("hidden")
    ) {

      initRevealAnimations();

      activateFloatingLogo();

    }

  }
);


/* ═══════════════════════════════════════
   PAUSE MUSIC WHEN LEAVING PAGE
═══════════════════════════════════════ */

document.addEventListener(
  "visibilitychange",
  () => {

    if (!bgMusic) return;


    if (document.hidden) {

      bgMusic.pause();

      updateMusicIcon();

    } else {

      bgMusic
        .play()
        .then(() => {
          updateMusicIcon();
        })
        .catch(() => {});

    }

  }
);


window.addEventListener(
  "pagehide",
  () => {

    if (bgMusic) {

      bgMusic.pause();

      updateMusicIcon();

    }

  }
);


/* ═══════════════════════════════════════
   DISABLE RIGHT CLICK
═══════════════════════════════════════ */

document.addEventListener(
  "contextmenu",
  (e) => {
    e.preventDefault();
  }
);


/* ═══════════════════════════════════════
   BLOCK F12 / DEVTOOLS SHORTCUTS
═══════════════════════════════════════ */

document.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "F12" ||

      (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(
          e.key.toUpperCase()
        )
      ) ||

      (
        e.ctrlKey &&
        e.key.toUpperCase() === "U"
      )
    ) {

      e.preventDefault();

    }

  }
);