// assets/js/bottom-nav.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Loading navbar...");
    
    let basePath = "";
    if (window.location.pathname.includes("/antarmuka/")) {
      basePath = "../";
    }
    
    const navPath = basePath + "components/bottom-nav.html";
    const res = await fetch(navPath);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const html = await res.text();
    document.body.insertAdjacentHTML("beforeend", html);
    
    const currentPage = location.pathname.split("/").pop() || "index.html";
    
    setTimeout(() => {
      document.querySelectorAll(".bottom-nav a").forEach(link => {
        const href = link.getAttribute("href");
        if (href && !href.startsWith("http") && !href.startsWith("/")) {
          link.setAttribute("href", basePath + href);
        }
      });
      
      document.querySelectorAll(".bottom-nav img").forEach(img => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http") && !src.startsWith("/")) {
          img.setAttribute("src", basePath + src);
        }
      });
      
      document.querySelectorAll(".nav-item").forEach(item => {
        if (item.dataset.page === currentPage) {
          item.classList.add("active");
        }
      });
    }, 100);
    
  } catch (error) {
    console.error("Navbar error:", error);
    
    let basePath = "";
    if (window.location.pathname.includes("/antarmuka/")) {
      basePath = "../";
    }
    
    const fallbackNav = `
    <div class="bottom-nav">
      <div class="nav-item" data-page="index.html">
        <a href="${basePath}index.html">
          <img src="${basePath}assets/img/home.png">
        </a>
      </div>
      <div class="nav-item" data-page="search.html">
        <a href="${basePath}search.html">
          <img src="${basePath}assets/img/search.png">
        </a>
      </div>
      <div class="fab-wrapper">
        <a href="${basePath}scanwajah.html" class="fab animate-pulse">
          <img src="${basePath}assets/img/scanwajah.png">
        </a>
      </div>
      <div class="nav-item" data-page="favorite.html">
        <a href="${basePath}favorite.html">
          <img src="${basePath}assets/img/heart.png">
        </a>
      </div>
      <div class="nav-item" data-page="profile.html">
        <a href="${basePath}profile.html">
          <img src="${basePath}assets/img/user.png">
        </a>
      </div>
    </div>`;
    
    document.body.insertAdjacentHTML("beforeend", fallbackNav);
  }
});