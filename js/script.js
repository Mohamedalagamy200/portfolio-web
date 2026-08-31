document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("#currentYear")
    .forEach((e) => (e.textContent = new Date().getFullYear()));
  const t = document.getElementById("themeToggle");
  if (t) {
    t.addEventListener("click", () =>
      document.body.classList.toggle("soft-light"),
    );
  }
  const f = document.getElementById("contactForm");
  if (f) {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("formMessage").textContent =
        "The form is ready to be connected to an email service or backend later.";
      f.reset();
    });
  }
});
