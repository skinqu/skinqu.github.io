document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("components/bottom-nav.html");
  const html = await res.text();

  document.body.insertAdjacentHTML("beforeend", html);

  const currentPage = location.pathname.split("/").pop();

  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.dataset.page === currentPage) {
      item.classList.add("active");
    }
  });
});
