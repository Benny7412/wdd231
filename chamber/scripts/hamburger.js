document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector("nav ul");

  hamburgerButton.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburgerButton.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    const isClickInside =
      navMenu.contains(event.target) || hamburgerButton.contains(event.target);

    if (!isClickInside && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      hamburgerButton.classList.remove("active");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      hamburgerButton.classList.remove("active");
    }
  });
});
