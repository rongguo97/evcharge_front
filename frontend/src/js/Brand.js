// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
reveals.forEach((el) => obs.observe(el));

// Nav scroll effect
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  nav.style.background =
    window.scrollY > 60 ? "rgba(7, 5, 15, 0.97)" : "rgba(7, 5, 15, 0.85)";
});
