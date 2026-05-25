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
    const isSmallScreen = window.matchMedia("(max-width: 900px)").matches;

    revealItems.forEach((item) => {
      const delay = item.getAttribute("data-reveal-delay");
      if (delay) {
        item.style.setProperty("--reveal-delay", `${delay}ms`);
      }
    });

    // On reduced-motion OR small screens, show content immediately (helps mobile where IO may not trigger)
    if (prefersReducedMotion || isSmallScreen) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      // Scroll-based reveal: fade in as user scrolls to element
      const updateReveal = () => {
        const windowHeight = window.innerHeight;
        
        revealItems.forEach((item) => {
          if (item.classList.contains("is-visible")) return;
          
          const rect = item.getBoundingClientRect();
          const elementTop = rect.top;
          const triggerPoint = windowHeight * 1.8; // Start revealing when 80% before entering viewport
          
          if (elementTop < triggerPoint) {
            item.classList.add("is-visible");
          }
        });
      };
      
      window.addEventListener("scroll", updateReveal, { passive: true });
      window.addEventListener("resize", updateReveal);
      updateReveal(); // Check on page load
    }
  }

  // skeleton loader for extension grid: add a loading state and remove after page load
  const extensionGrid = document.querySelector(".extension-grid");
  if (extensionGrid) {
    extensionGrid.classList.add("is-loading");

    const removeLoading = () => {
      setTimeout(() => extensionGrid.classList.remove("is-loading"), 700);
    };

    if (document.readyState === "complete") {
      removeLoading();
    } else {
      window.addEventListener("load", removeLoading);
      // safety fallback in case load never fires in some environments
      setTimeout(removeLoading, 1800);
    }
  }

  const faqList = document.querySelector("[data-faq-list]");
  if (faqList) {
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
  }
})();
