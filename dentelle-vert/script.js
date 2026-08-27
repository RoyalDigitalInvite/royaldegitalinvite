// ===== SCENE / TRIGGER / MUSIC =====
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
  brideName: "Sarah",
  groomName: "Mohammed",
  weddingDate: new Date(2026, 7, 22, 17, 0, 0).getTime(),
  venue: "Palais des roses — Tanger",
  weddingDayText: "Samedi 22 Août 2026",
  weddingTimeText: "À partir de 18h00",
  rsvpDeadline: "Merci de confirmer avant le 22 Août 2026"
};

/* ============================================================
   Cœur emballé — rubans bronze / sauge — glisser UP pour révéler
   Palette claire : dominante blanc cassé, vert sauge accent, bronze
   ============================================================ */
(function () {
  const pkg = document.querySelector('.heart-package');
  if (!pkg) return;
  const wrap = pkg.querySelector('.heart-wrap');
  const hint = pkg.querySelector('.heart-hint');
  const btn = pkg.querySelector('.heart-toggle-btn');
  const secret = pkg.querySelector('.heart-secret');
  const seal = pkg.querySelector('.heart-seal');

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'heart-toggle-btn-close';
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Refermer le cadeau</span>';
  closeBtn.setAttribute('aria-label', 'Refermer le message secret');
  pkg.parentElement.insertBefore(closeBtn, pkg.nextSibling);

  const MAX_DRAG_Y = 180;
  const REVEAL_POINT = 0.78;

  let dragging = false, startY = 0, offsetY = 0, revealed = false;

  function setProgress(p, offsetPx) {
    wrap.style.transform = `translateY(${-offsetPx}px)`;
    // Bronze → pale (reflets bronze + or)
    const startRGB = [181, 143, 74];
    const endRGB = [226, 209, 164];
    const r = Math.round(startRGB[0] + (endRGB[0] - startRGB[0]) * p);
    const g = Math.round(startRGB[1] + (endRGB[1] - startRGB[1]) * p);
    const b = Math.round(startRGB[2] + (endRGB[2] - startRGB[2]) * p);

    document.querySelectorAll('.ribbon, .heart-seal').forEach(el => {
      el.style.filter = `brightness(${1 + p * 0.18}) saturate(${1 + p * 0.2})`;
    });
    if (seal) seal.style.background = `radial-gradient(circle at 35% 30%,
        rgb(${Math.min(255, r + 20)},${Math.min(255, g + 30)},${Math.min(255, b + 30)}),
        rgb(${r},${g},${b}) 60%, #3A4A33 100%)`;

    const rot = -p * 5;
    const scale = 1 + p * 0.04;
    pkg.style.transform = `rotate(${rot}deg) scale(${scale})`;

    if (hint) hint.style.opacity = (1 - p * 1.4).toFixed(2);

    if (!revealed && secret) {
      secret.style.opacity = Math.min(1, p * 1.4);
      secret.style.transform = `scale(${0.85 + p * 0.15})`;
    }

    if (p >= REVEAL_POINT && !revealed) {
      revealed = true;
      revealPkg(offsetPx);
    }
  }

  function revealPkg(finalOffset) {
    pkg.classList.add('dragging');
    pkg.dataset.state = 'opened';

    wrap.style.transition = 'transform 0.7s cubic-bezier(.2,.8,.2,1)';
    wrap.style.transform = `translateY(${-MAX_DRAG_Y - 8}px)`;

    pkg.style.transition = 'transform 0.5s ease-out';
    pkg.style.transform = 'rotate(0deg) scale(1)';
    setTimeout(() => { pkg.style.transition = 'none'; }, 500);

    if (secret) {
      secret.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(.2,.8,.2,1)';
      secret.style.opacity = 1;
      secret.style.transform = 'scale(1)';
    }
    if (hint) hint.style.opacity = 0;

    spawnConfetti();
    if (typeof sprinklePetals === 'function') sprinklePetals();
  }

  function closePkg() {
    revealed = false;
    pkg.dataset.state = 'sealed';
    pkg.classList.remove('dragging');
    wrap.style.transition = 'transform 0.55s cubic-bezier(.34,1.56,.64,1)';
    wrap.style.transform = 'translateY(0)';
    pkg.style.transition = 'transform 0.55s cubic-bezier(.34,1.56,.64,1)';
    pkg.style.transform = 'rotate(0deg) scale(1)';
    if (secret) {
      secret.style.transition = 'opacity 0.3s ease, transform 0.45s ease';
      secret.style.opacity = 0; secret.style.transform = 'scale(0.85)';
    }
    if (hint) hint.style.opacity = 0.92;
    document.querySelectorAll('.ribbon, .heart-seal').forEach(el => {
      el.style.filter = '';
    });
    if (seal) seal.style.background = '';
  }

  // Confettis — palette sauge/bronze/crème
  function spawnConfetti() {
    const r = pkg.getBoundingClientRect();
    const colors = ['#B58F4A', '#C9A866', '#E2D1A4', '#5B6A4E', '#21351A'];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.background = colors[i % colors.length];
      c.style.left = (r.left + r.width / 2) + 'px';
      c.style.top = (r.top + r.height / 2) + 'px';
      c.style.position = 'fixed';
      document.body.appendChild(c);
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 50;
      const rot = Math.random() * 720;
      const dur = 900 + Math.random() * 700;
      c.animate(
        [{ transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 }],
        { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
      );
      setTimeout(() => c.remove(), dur + 100);
    }
  }

  function sprinklePetals() {
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.textContent = ['✦', '✧', '❀', '❁'][i % 4];
      p.style.position = 'fixed';
      p.style.left = (pkg.getBoundingClientRect().left + pkg.offsetWidth / 2) + 'px';
      p.style.top = (pkg.getBoundingClientRect().top + pkg.offsetHeight / 2) + 'px';
      p.style.color = ['#B58F4A', '#E2D1A4', '#C9A866'][i % 3];
      p.style.fontSize = (14 + Math.random() * 16) + 'px';
      p.style.pointerEvents = 'none';
      p.style.zIndex = '99';
      p.style.opacity = '0.95';
      document.body.appendChild(p);
      const dur = 1800 + Math.random() * 1200;
      const dx = (Math.random() - 0.5) * 240;
      p.animate(
        [{ transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${300 + Math.random() * 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }],
        { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
      );
      setTimeout(() => p.remove(), dur + 100);
    }
  }

  function onDown(e) {
    e.preventDefault();
    if (pkg.dataset.state === 'opened') return;
    dragging = true;
    pkg.classList.add('dragging');
    pkg.style.transition = 'none';
    wrap.style.transition = 'none';
    if (closeBtn) closeBtn.style.display = 'none';
    if (pkg.setPointerCapture && e.pointerId !== undefined) pkg.setPointerCapture(e.pointerId);
    startY = e.clientY;
    offsetY = 0;
    setProgress(0, 0);
  }
  function onMove(e) {
    if (!dragging) return;
    const dy = startY - e.clientY;
    offsetY = Math.max(0, Math.min(MAX_DRAG_Y, dy));
    const p = offsetY / MAX_DRAG_Y;
    setProgress(p, offsetY);
  }
  function onUp(e) {
    if (!dragging) return;
    dragging = false;
    pkg.classList.remove('dragging');
    if (!revealed) {
      offsetY = 0;
      wrap.style.transition = 'transform 0.4s cubic-bezier(.34,1.56,.64,1)';
      pkg.style.transition = 'transform 0.4s cubic-bezier(.34,1.56,.64,1)';
      setProgress(0, 0);
      setTimeout(() => {
        wrap.style.transition = 'transform 0.55s cubic-bezier(.2,.8,.2,1)';
        pkg.style.transition = 'none';
      }, 420);
    } else {
      wrap.style.transition = 'transform 0.7s cubic-bezier(.2,.8,.2,1)';
      pkg.style.transition = 'none';
    }
  }

  pkg.addEventListener('pointerdown', onDown);
  pkg.addEventListener('pointermove', onMove);
  pkg.addEventListener('pointerup', onUp);
  pkg.addEventListener('pointercancel', onUp);
  pkg.addEventListener('pointerleave', (e) => { if (dragging) onUp(e); });

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (pkg.dataset.state === 'opened') return;
      let p = 0;
      const step = () => {
        p += 0.09;
        if (p < 1) { setProgress(Math.min(1, p), p * MAX_DRAG_Y); requestAnimationFrame(step); }
        else { revealed = true; revealPkg(MAX_DRAG_Y); }
      };
      step();
    });
  }
  pkg.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && pkg.dataset.state !== 'opened') {
      e.preventDefault();
      btn && btn.click();
    }
    if ((e.key === 'Escape') && pkg.dataset.state === 'opened') {
      e.preventDefault();
      closePkg();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    closePkg();
    setTimeout(() => { closeBtn.style.display = 'none'; }, 600);
  });
})();

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

/* ─── Pause / reprise musique ─── */
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
