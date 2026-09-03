document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#currentYear").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link, .floating-nav-link");

  navLinks.forEach((link) => {
    const target = link.getAttribute("href");
    if (!target) return;

    if (target === currentPage || (currentPage === "" && target === "index.html")) {
      link.classList.add("active");
    }
  });

  const siteHeader = document.querySelector(".site-header");
  const floatingNav = document.getElementById("floatingNav");
  const floatingButton = document.getElementById("floatingNavToggle");
  const floatingMenu = document.getElementById("floatingNavMenu");
  const scrollThreshold = 110;

  const closeFloatingNav = () => {
    if (!floatingButton || !floatingMenu) return;
    floatingMenu.classList.remove("is-open");
    floatingButton.setAttribute("aria-expanded", "false");
    floatingButton.setAttribute("aria-label", "Open navigation menu");
  };

  const openFloatingNav = () => {
    if (!floatingButton || !floatingMenu) return;
    floatingMenu.classList.add("is-open");
    floatingButton.setAttribute("aria-expanded", "true");
    floatingButton.setAttribute("aria-label", "Close navigation menu");
  };

  const syncHeaderState = () => {
    if (!siteHeader) return;
    if (window.scrollY > scrollThreshold) {
      siteHeader.classList.add("nav-hidden");
      siteHeader.classList.remove("nav-visible");
    } else {
      siteHeader.classList.remove("nav-hidden");
      siteHeader.classList.add("nav-visible");
    }
  };

  const syncFloatingState = () => {
    if (!floatingNav) return;
    const shouldShow = window.scrollY > scrollThreshold;
    floatingNav.classList.toggle("is-visible", shouldShow);
    if (!shouldShow) {
      closeFloatingNav();
    }
  };

  if (floatingButton && floatingMenu) {
    floatingButton.addEventListener("click", () => {
      const isExpanded = floatingButton.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeFloatingNav();
      } else {
        openFloatingNav();
      }
    });

    floatingMenu.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("a")) {
        closeFloatingNav();
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!floatingButton || !floatingMenu) return;
    const clickInside = floatingButton.contains(event.target) || floatingMenu.contains(event.target);
    if (!clickInside) {
      closeFloatingNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && floatingMenu && floatingMenu.classList.contains("is-open")) {
      closeFloatingNav();
      floatingButton?.focus();
    }
  });

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        syncHeaderState();
        syncFloatingState();
        ticking = false;
      });
      ticking = true;
    }
  };

  syncHeaderState();
  syncFloatingState();
  window.addEventListener("scroll", handleScroll, { passive: true });

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const savedTheme = localStorage.getItem("portfolioTheme");
    if (savedTheme === "soft-light") {
      document.body.classList.add("soft-light");
      themeToggle.textContent = "☀";
    }

    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("soft-light");
      localStorage.setItem("portfolioTheme", isLight ? "soft-light" : "dark");
      themeToggle.textContent = isLight ? "☀" : "☾";
    });
  }

  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (form && formMessage) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formMessage.textContent =
        "Your message is ready to be connected to your email service or backend later.";
      form.reset();
    });
  }
});
