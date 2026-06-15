(function () {
  const MOSCOW_TZ = "Europe/Moscow";

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function getMoscowTimeParts(date) {
    const d = date instanceof Date ? date : new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: MOSCOW_TZ,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    const parts = formatter.formatToParts(d);
    let hour = 0;
    let minute = 0;
    for (const p of parts) {
      if (p.type === "hour") hour = Number(p.value);
      if (p.type === "minute") minute = Number(p.value);
    }
    return { hour, minute };
  }

  function formatMoscowClock(date) {
    const { hour, minute } = getMoscowTimeParts(date);
    return `${pad2(hour)}:${pad2(minute)}`;
  }

  function setMoscowDatetimeAttr(el, date) {
    const f = new Intl.DateTimeFormat("en-CA", {
      timeZone: MOSCOW_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = f.formatToParts(date);
    const get = (t) => parts.find((p) => p.type === t)?.value ?? "00";
    el.setAttribute("datetime", `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:00+03:00`);
  }

  function updateMoscowTime() {
    const el = document.getElementById("moscow-time");
    if (!el) return;
    const now = new Date();
    el.textContent = formatMoscowClock(now);
    setMoscowDatetimeAttr(el, now);
  }

  function initMoscowClock() {
    updateMoscowTime();
    setInterval(updateMoscowTime, 60_000);
  }

  function initHeroReveals() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const reveals = hero.querySelectorAll(".js-reveal");
    if (!reveals.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const staggerMs = 85;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveals.forEach((el, i) => {
            window.setTimeout(() => {
              el.classList.add("is-visible");
            }, i * staggerMs);
          });
          io.unobserve(hero);
        });
      },
      { root: null, threshold: 0.05 }
    );

    io.observe(hero);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMoscowClock();
    initHeroReveals();
  });
})();
