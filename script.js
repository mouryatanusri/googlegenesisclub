
/* =========================================
   HOMEPAGE — KEEP UNCHANGED
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("logoIntro");
  const navbar = document.getElementById("navbar");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    intro?.remove();
    navbar?.classList.add("visible");
  } else {
    setTimeout(() => {
      intro?.classList.add("hide");
      navbar?.classList.add("visible");
    }, 2800);
    setTimeout(() => intro?.remove(), 3600);
  }

  const links = document.querySelectorAll(".nav-links a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      links.forEach(item => {
        item.classList.remove("active");
        item.removeAttribute("aria-current");
      });
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    });
  });
});

/* =========================================
   GGC EVENTS — SINGLE 3D CONTROLLER
========================================= */

/* =========================================
   GGC EVENTS — SMOOTH 3D CAROUSEL
========================================= */

(() => {
  const stage = document.getElementById("eventsStage");
  const frames = [...document.querySelectorAll(".event-frame")];
  const counter = document.getElementById("eventsCounter");
  const dots = [...document.querySelectorAll(".event-progress-dot")];
  const modal = document.getElementById("eventModal");
  const closeBtn = document.getElementById("eventModalClose");

  if (!stage || frames.length !== 3 || !modal || !closeBtn) return;

  const events = [
    {
      title: "Prompt Engineering with Gemini",
      category: "MASTERCLASS",
      date: "10 December 2025",
      place: "Virtual Session",
      image: "./assets/event1.jpg",
      description:
        "Mastering the art of communication with Large Language Models using Google's Gemini. This masterclass explored effective prompt engineering techniques and how to interact with generative AI tools."
    },
    {
      title: "Machine Learning Essentials",
      category: "TECHNICAL SESSION",
      date: "25 November 2025",
      place: "Main Hall",
      image: "./assets/event2.jpg",
      description:
        "Dive deep into the core concepts of machine learning and how to apply them in real-world scenarios. This session explored the foundations of machine learning and its practical applications."
    },
    {
      title: "Student Skills Enrichment Workshop on SOC Operations",
      category: "CYBERSECURITY WORKSHOP",
      date: "27 August 2026",
      place: "Data Science Lab",
      image: "./assets/event3.jpg",
      description:
        "An immersive cybersecurity workshop featuring SOC job simulation, cybersecurity career exploration, cyber certification guidance, hands-on security tools demonstrations, and security alert investigation. Speakers: Kaushik Srinivasan and Siva Sagar."
    }
  ];

  const colors = ["#4285f4", "#fbbc05", "#34a853"];

  let active = 0;
  let locked = false;
  let lastFocus = null;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const duration = reduceMotion ? 0 : 850;

  // MOVE THE CAROUSEL
  function moveTo(index) {
    index = (index + frames.length) % frames.length;

    if (locked || index === active) return;

    locked = true;
    active = index;
    draw();

    window.setTimeout(() => {
      locked = false;
    }, duration + 80);
  }

  function draw() {
    frames.forEach((frame, index) => {
      const position =
        (index - active + frames.length) % frames.length;

      frame.classList.toggle("is-active", position === 0);
      frame.classList.toggle("is-right", position === 1);
      frame.classList.toggle("is-left", position === 2);

      frame.setAttribute(
        "aria-label",
        index === active
          ? "Open " + events[index].title
          : "Show " + events[index].title
      );
    });

    if (counter) {
      counter.textContent =
        String(active + 1).padStart(2, "0") + " / 03";
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === active);
      dot.style.backgroundColor =
        i === active ? colors[i] : "#cdd4df";
    });
  }

  // CLICK SIDE CARD → MOVE IT FORWARD
  // CLICK CENTER CARD → OPEN DETAILS
  frames.forEach((frame, index) => {
    frame.addEventListener("click", () => {
      if (locked || ignoreClick) return;

      if (index !== active) {
        moveTo(index);
      } else {
        openEvent(index);
      }
    });

    frame.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();

      if (locked) return;

      if (index !== active) {
        moveTo(index);
      } else {
        openEvent(index);
      }
    });
  });

  // HOVER SIDE CARD → GENTLE PREVIEW
  // Only trigger if the pointer actually MOVES.
  // This prevents cards animating under a still mouse
  // from repeatedly activating one another.
  let hoverTimer = null;
  let lastMouseX = null;
  let lastMouseY = null;

  stage.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || locked) return;

    const movement = lastMouseX === null
      ? 0
      : Math.hypot(
          e.clientX - lastMouseX,
          e.clientY - lastMouseY
        );

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (movement < 4) return;

    const frame = e.target.closest(".event-frame");
    if (!frame) return;

    const index = frames.indexOf(frame);

    if (index < 0 || index === active) return;

    clearTimeout(hoverTimer);

    hoverTimer = setTimeout(() => {
      if (!locked) moveTo(index);
    }, 180);
  });

  stage.addEventListener("pointerleave", () => {
    clearTimeout(hoverTimer);
    lastMouseX = null;
    lastMouseY = null;
  });

  // SWIPE ON MOBILE
  let startX = 0;
  let startY = 0;
  let ignoreClick = false;

  stage.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
      ignoreClick = true;

      moveTo(active + (dx < 0 ? 1 : -1));

      setTimeout(() => {
        ignoreClick = false;
      }, 400);
    }
  }, { passive: true });

  // EVENT DESCRIPTION
  function openEvent(index) {
    const event = events[index];

    lastFocus = document.activeElement;

    document.getElementById("modalEventImage").src =
      event.image;

    document.getElementById("modalEventImage").alt =
      event.title;

    document.getElementById("modalEventCategory").textContent =
      event.category;

    document.getElementById("modalEventTitle").textContent =
      event.title;

    document.getElementById("modalEventDate").textContent =
      "📅 " + event.date;

    document.getElementById("modalEventPlace").textContent =
      "📍 " + event.place;

    document.getElementById("modalEventDescription").textContent =
      event.description;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeEvent() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    lastFocus?.focus();
  }

  closeBtn.addEventListener("click", closeEvent);

  modal.querySelector(".event-modal-backdrop")
    .addEventListener("click", closeEvent);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeEvent();
    }
  });

  draw();
})();

/* =========================================
   THINKATHON TICKET — PRINT + TEAR
========================================= */

(() => {
  const section = document.querySelector(".thinkathon-section");
  const ticket = document.getElementById("thinkathonTicket");

  if (!section || !ticket) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Print ticket when it enters the viewport.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          section.classList.add("is-visible");
          setTimeout(() => {
  section.classList.add("is-printed");
}, 3600);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(section);
  } else {
    section.classList.add("is-visible");
  }

  // Click ticket -> animate -> navigate.
  ticket.addEventListener("click", (e) => {
    if (reducedMotion) return;

    // Keep browser shortcuts working normally.
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) return;

    e.preventDefault();

    if (ticket.classList.contains("is-tearing")) return;

    ticket.classList.add("is-tearing");

    window.setTimeout(() => {
      window.location.href = ticket.href;
    }, 900);
  });
})();

/* =========================================
   THINKATHON — PRINT AND FLY
========================================= */


/* =========================================
   THINKATHON — PRINT, THEN SCROLL TO FLY
========================================= */


/* =========================================
   THINKATHON — PRINT, FLOAT, CLICK TO FLY
========================================= */

(() => {
  const section = document.querySelector(".thinkathon-section");
  const ticket = document.getElementById("thinkathonTicket");

  if (!section || !ticket) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let printingDone = false;
  let navigating = false;

  // Start printing when the section is visible
  const observer = new IntersectionObserver(
    entries => {
      if (!entries[0].isIntersecting) return;

      section.classList.add("is-visible");
      observer.disconnect();

      if (reducedMotion) {
        printingDone = true;
        section.classList.add("is-printed");
      } else {
        setTimeout(() => {
          printingDone = true;
          section.classList.add("is-printed");
          section.classList.add("is-floating");
        }, 3600);
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(section);

  // Click only AFTER printing finishes
  ticket.addEventListener("click", e => {
    if (
      e.button !== 0 ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey
    ) return;

    if (reducedMotion) return;

    e.preventDefault();

    if (!printingDone || navigating) return;

    navigating = true;

    section.classList.remove("is-floating");
    ticket.classList.add("is-tearing");

    setTimeout(() => {
      window.location.assign(ticket.href);
    }, 1000);
  });
})();

/* =========================================
   GGC EVENTS — PAST / UPCOMING TOGGLE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".events-toggle-btn");
  const showcase = document.querySelector(".events-showcase");
  const comingSoon = document.getElementById("eventsComingSoon");
  const eventsSection = document.querySelector(".ggc-events");

  if (!buttons.length || !showcase || !comingSoon) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const isPast = button.dataset.view === "past";

      buttons.forEach(btn => {
        const selected = btn === button;
        btn.classList.toggle("active", selected);
        btn.setAttribute("aria-pressed", String(selected));
      });

      showcase.hidden = !isPast;
      comingSoon.hidden = isPast;

      eventsSection?.classList.toggle("showing-upcoming", !isPast);
    });
  });
});
