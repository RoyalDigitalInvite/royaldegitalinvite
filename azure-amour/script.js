
(function () {
  "use strict";

  // -------- Compte à rebours --------
  const TARGET = new Date("2027-08-22T19:00:00");
  const elDays = document.getElementById("days");
  const elHours = document.getElementById("hours");
  const elMinutes = document.getElementById("minutes");
  const elSeconds = document.getElementById("seconds");

  function tick() {
    const now = new Date();
    let diff = TARGET.getTime() - now.getTime();
    if (diff < 0) diff = 0;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (elDays) elDays.textContent = String(d).padStart(2, "0");
    if (elHours) elHours.textContent = String(h).padStart(2, "0");
    if (elMinutes) elMinutes.textContent = String(m).padStart(2, "0");
    if (elSeconds) elSeconds.textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);

  // -------- Intro / ouverture --------
  const introScreen = document.getElementById("scene1");
  const trigger = document.getElementById("introTrigger");
  const main = document.getElementById("scene2");
  const body = document.body;

  function openInvitation() {
    if (!introScreen || !main) return;
    introScreen.classList.add("is-opening");
    setTimeout(() => {
      introScreen.classList.add("is-finished");
      main.classList.remove("hidden");
      body.classList.remove("intro-active");
      body.classList.add("intro-finished");
      body.classList.add("logo-active");
      window.scrollTo({ top: 0, behavior: "smooth" });
      try { document.getElementById("bgMusic")?.play(); } catch (_) { }
    }, 1400);
  }

  if (trigger) {
    trigger.addEventListener("click", openInvitation);
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvitation(); }
    });
  }

  // -------- Bouton musique --------
  const musicBtn = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const bgMusic = document.getElementById("bgMusic");
  if (musicBtn && bgMusic && musicIcon) {
    musicBtn.classList.remove("hidden");
    musicBtn.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicIcon.className = "fa-solid fa-volume-high";
      } else {
        bgMusic.pause();
        musicIcon.className = "fa-solid fa-volume-xmark";
      }
    });
  }

  // -------- Reveal on scroll --------
  const reveals = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-zoom, .reveal-fade");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // -------- RSVP --------
  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("rsvpStatus");

  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove("is-success", "is-error");
    status.classList.add("is-visible");
    status.classList.add(type === "success" ? "is-success" : "is-error");
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (form.rsvpName?.value || "").trim();
      const attendance = (form.querySelector('input[name="attendance"]:checked')?.value) || "yes";

      if (!name) {
        setStatus("Merci d'indiquer votre nom complet.", "error");
        return;
      }

      const subject = encodeURIComponent(`RSVP — Oumaïma & Noam — ${name}`);
      const bodyTxt = encodeURIComponent(
        `Nom : ${name}\nPrésence : ${attendance === "yes" ? "Confirme" : "Ne pourra pas être présent(e)"}\n\nMessage :\n${form.rsvpMessage?.value || ""}`
      );
      // Démonstration locale — en production, envoyez vers votre service (Formspree / API / mailto).
      setStatus(`Merci ${name}, votre réponse a bien été enregistrée. 💛`, "success");
      // Option mailto :
      // window.location.href = `mailto:vous@example.com?subject=${subject}&body=${bodyTxt}`;
    });
  }
})();
