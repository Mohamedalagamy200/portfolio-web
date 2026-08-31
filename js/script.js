document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("#currentYear")
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const target = link.getAttribute("href");
    if (!target) return;
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (target === currentPage || (currentPage === "" && target === "index.html")) {
      link.classList.add("active");
    }
  });

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
