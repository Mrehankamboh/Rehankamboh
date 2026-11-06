(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const body = document.body;
  const boot = document.querySelector(".boot");
  const bootBar = document.querySelector(".boot__bar span");

  function finishBoot() {
    if (boot) boot.classList.add("is-done");
    body.classList.remove("is-loading");
    body.classList.add("is-ready");
  }

  if (reduceMotion) {
    finishBoot();
  } else {
    body.classList.add("is-loading");
    let p = 0;
    const tick = window.setInterval(() => {
      p = Math.min(100, p + 10 + Math.random() * 16);
      if (bootBar) bootBar.style.width = `${p}%`;
      if (p >= 100) {
        window.clearInterval(tick);
        window.setTimeout(finishBoot, 160);
      }
    }, 55);
    window.setTimeout(() => {
      if (bootBar) bootBar.style.width = "100%";
      window.clearInterval(tick);
      finishBoot();
    }, 880);
  }

  const progress = document.querySelector(".scroll-progress span");
  const nav = document.querySelector(".nav");

  const onScroll = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav__toggle");
  const mobile = document.querySelector(".nav__mobile");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobile.classList.toggle("is-open", !open);
      body.style.overflow = open ? "" : "hidden";
    });
    mobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobile.classList.remove("is-open");
        body.style.overflow = "";
      });
    });
  }

  document.querySelectorAll("[data-split]").forEach((el) => {
    if (reduceMotion) return;
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(/\s+/)
      .map((word, i) => `<span class="word" style="--i:${i}"><span>${word}</span></span>`)
      .join(" ");
  });

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && !reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn--magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.16}px, ${y * 0.2}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor__dot");
  if (cursor && cursorDot && finePointer && !reduceMotion) {
    body.classList.add("has-cursor");
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        cursorDot.style.transform = `translate(${x}px, ${y}px)`;
      },
      { passive: true }
    );
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll("a, button, .work-item, input, textarea").forEach((el) => {
      el.addEventListener("pointerenter", () => {
        body.classList.add("cursor-hover");
        if (el.classList.contains("work-item") || el.closest?.(".work-item")) {
          body.classList.add("cursor-project");
        }
      });
      el.addEventListener("pointerleave", () => {
        body.classList.remove("cursor-hover", "cursor-project");
      });
    });
  }

  const form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      form.querySelectorAll("input, textarea, button").forEach((el) => {
        el.disabled = true;
      });
      if (btn) btn.textContent = "Message sent ✓";
      form.classList.add("is-sent");
    });
  }

  document.querySelectorAll(".faq__item").forEach((item) => {
    const btn = item.querySelector(".faq__q");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq__item.is-open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq__q")?.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !open);
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
})();
