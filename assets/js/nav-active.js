document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  const currentPage = window.location.pathname.split("/").pop();

  navItems.forEach(item => {
    const page = item.dataset.page;

    // RESET
    item.classList.remove("active");

    // MATCH PAGE
    if (page === currentPage || (page === "index.html" && currentPage === "")) {
      item.classList.add("active");
    }

    // OPTIONAL: CLICK NAV
    item.addEventListener("click", () => {
      if (page) {
        window.location.href = page;
      }
    });
  });
});
