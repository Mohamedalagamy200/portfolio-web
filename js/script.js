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
  const mainNav = document.getElementById("mainNav");
  const mainNavToggle = document.querySelector('[data-bs-target="#mainNav"]');
  const scrollThreshold = 110;

  const closeMainNav = () => {
    if (!mainNav || !mainNavToggle || !window.bootstrap?.Collapse) return;
    window.bootstrap.Collapse.getOrCreateInstance(mainNav, { toggle: false }).hide();
    mainNavToggle.setAttribute("aria-label", "Open navigation menu");
  };

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
    const headerHasFocus = siteHeader.matches(":focus-within");
    if (window.scrollY > scrollThreshold && !headerHasFocus) {
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

  mainNav?.addEventListener("shown.bs.collapse", () => {
    mainNavToggle?.setAttribute("aria-label", "Close navigation menu");
  });
  mainNav?.addEventListener("hidden.bs.collapse", () => {
    mainNavToggle?.setAttribute("aria-label", "Open navigation menu");
  });

  document.addEventListener("click", (event) => {
    if (
      mainNav &&
      mainNavToggle &&
      !mainNav.contains(event.target) &&
      !mainNavToggle.contains(event.target)
    ) {
      closeMainNav();
    }

    if (!floatingButton || !floatingMenu) return;
    const clickInside = floatingButton.contains(event.target) || floatingMenu.contains(event.target);
    if (!clickInside) {
      closeFloatingNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav?.classList.contains("show")) {
      closeMainNav();
      mainNavToggle?.focus();
      return;
    }

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
  document.addEventListener("focusin", syncHeaderState);
  document.addEventListener("focusout", () => {
    window.requestAnimationFrame(syncHeaderState);
  });

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const savedTheme = localStorage.getItem("portfolioTheme");
    if (savedTheme === "soft-light") {
      document.body.classList.add("soft-light");
      themeToggle.textContent = "☀";
      themeToggle.setAttribute("aria-label", "Switch to dark theme");
    }

    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("soft-light");
      localStorage.setItem("portfolioTheme", isLight ? "soft-light" : "dark");
      themeToggle.textContent = isLight ? "☀" : "☾";
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme",
      );
    });
  }

  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (form && formMessage) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const subject = encodeURIComponent(formData.get("subject") || "Portfolio contact");
      const body = encodeURIComponent(
        `Name: ${formData.get("name") || ""}\nEmail: ${formData.get("email") || ""}\n\n${formData.get("message") || ""}`,
      );

      formMessage.textContent =
        "Your email app will open with this message ready to send. If it does not open, use the email link below.";
      window.location.href = `mailto:mohamedalagamy606@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
