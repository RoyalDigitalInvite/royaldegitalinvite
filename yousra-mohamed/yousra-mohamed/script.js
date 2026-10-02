/* ============================================================
   دعوة زفاف | يسرى ومحمد — Script principal
   ============================================================ */

const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const introTrigger = document.getElementById("introTrigger");
const bgMusic = document.getElementById("bgMusic");
const videoEndFrame = document.getElementById("videoEndFrame");
const musicToggle = document.getElementById("musicToggle");

let revealObserverInitialized = false;
let introStarted = false;

/**
 * تهيئة حركات الظهور عند التمرير
 */
function initRevealAnimations() {
  if (revealObserverInitialized) return;

  const elements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right, .reveal-zoom, .reveal-fade"
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
 * تفعيل الشعار المتحرك
 */
function activateFloatingLogo() {
  document.body.classList.add("logo-active");
}

/**
 * تشغيل الموسيقى بعد تفاعل المستخدم
 */
function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 1;
  const promise = bgMusic.play();
  if (promise !== undefined) {
    promise.catch((err) => {
      console.log("تشغيل الصوت محجوب :", err);
    });
  }
}

/**
 * إظهار المحتوى الرئيسي أسفل الصورة النهائية
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
 * بدء المقدمة: اختفاء المظروف بتلاشٍ لطيف وتبقى الصورة النهائية
 */
function startIntro() {
  if (introStarted || !scene1) return;

  introStarted = true;

  // تشغيل الموسيقى
  startMusic();
  activateFloatingLogo();

  // تشغيل اختفاء المظروف
  scene1.classList.add("is-opening");

  // بعد انتهاء الحركة (1.6 ثانية)، إظهار المحتوى الرئيسي
  setTimeout(() => {
    showScene2();
  }, 1700);
}

/**
 * دعم لوحة المفاتيح (إمكانية الوصول)
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

/* ========================================= */
/*      زر التحكم في الموسيقى (أسفل اليمين)  */
/* ========================================= */

/**
 * تحديث أيقونة الزر حسب حالة الموسيقى
 */
function updateMusicToggleUI() {
  if (!musicToggle || !bgMusic) return;

  const icon = musicToggle.querySelector("i");
  const isMuted = bgMusic.paused;

  if (icon) {
    icon.className = isMuted
      ? "fa-solid fa-volume-xmark"
      : "fa-solid fa-volume-high";
  }

  musicToggle.classList.toggle("is-muted", isMuted);
  musicToggle.setAttribute("aria-pressed", String(!isMuted));
  musicToggle.title = isMuted ? "تشغيل الموسيقى" : "إيقاف الموسيقى";
}

if (musicToggle && bgMusic) {
  // نقرة على الزر: تشغيل / إيقاف
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => { });
    } else {
      bgMusic.pause();
    }
    updateMusicToggleUI();
  });

  // مزامنة الأيقونة مع أي تغيير في حالة الصوت
  bgMusic.addEventListener("play", updateMusicToggleUI);
  bgMusic.addEventListener("pause", updateMusicToggleUI);

  updateMusicToggleUI();
}

/* ========================= */
/*        العد التنازلي      */
/* ========================= */

/* 05 يناير 2027 الساعة 18:00 (الشهر يبدأ من 0 = يناير) */
const weddingDate = new Date(2027, 0, 5, 18, 0, 0).getTime();

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
/*   إضافات عند التحميل      */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {
  if (scene2 && !scene2.classList.contains("hidden")) {
    initRevealAnimations();
    activateFloatingLogo();
  }
});

/* الموسيقى: إيقاف عند مغادرة الصفحة واستئناف عند العودة */
document.addEventListener("visibilitychange", () => {
  if (!bgMusic) return;

  if (document.hidden) {
    bgMusic.pause();
  } else {
    bgMusic.play().catch(() => { });
  }
});

window.addEventListener("pagehide", () => {
  if (bgMusic) {
    bgMusic.pause();
  }
});

/* حماية بسيطة */
document.addEventListener("keydown", function (e) {
  if (e.key === "F12") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
    e.preventDefault();
  }
  if (e.ctrlKey && e.key.toUpperCase() === "U") {
    e.preventDefault();
  }
});
