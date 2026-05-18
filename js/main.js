(() => {
  const currentYear = document.querySelector("[data-current-year]");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    });
  });

  const revealItems = document.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealItems.length) {
    revealItems.forEach((item) => {
      const delay = item.getAttribute("data-reveal-delay");

      if (delay) {
        item.style.setProperty("--reveal-delay", `${delay}ms`);
      }

      if (prefersReducedMotion) {
        item.classList.add("is-visible");
      }
    });

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.12,
        }
      );

      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

  const faqList = document.querySelector("[data-faq-list]");
  if (!faqList) return;

  faqList.querySelectorAll("details").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqList.querySelectorAll("details[open]").forEach((openItem) => {
        if (openItem !== item) {
          openItem.open = false;
        }
      });
    });
  });
})();
