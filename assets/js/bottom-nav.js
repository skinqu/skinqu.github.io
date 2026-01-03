// assets/js/bottom-nav.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("🚀 Starting navbar load...");
    console.log("Current path:", window.location.pathname);
    
    // Tentukan path berdasarkan lokasi halaman
    let basePath = "";
    if (window.location.pathname.includes("/antarmuka/")) {
      basePath = "../"; // Naik satu level dari /antarmuka/
    }
    
    const navPath = basePath + "components/bottom-nav.html";
    console.log("Fetching navbar from:", navPath);
    
    const res = await fetch(navPath);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to load navbar`);
    }
    
    const html = await res.text();
    console.log("✅ Navbar HTML loaded");
    
    // Tambahkan navbar ke body
    document.body.insertAdjacentHTML("beforeend", html);
    
    // Tentukan halaman aktif
    const currentPage = location.pathname.split("/").pop() || "index.html";
    console.log("Current page for active state:", currentPage);
    
    // Tunggu DOM selesai render navbar, lalu update semua link
    setTimeout(() => {
      // 1. Update semua link di navbar
      const allLinks = document.querySelectorAll(".bottom-nav a");
      allLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && !href.startsWith("http") && !href.startsWith("/")) {
          // Jika halaman di /antarmuka/, tambahkan ../
          const newHref = basePath + href;
          link.setAttribute("href", newHref);
        }
      });
      
      // 2. Update semua gambar di navbar
      const allImages = document.querySelectorAll(".bottom-nav img");
      allImages.forEach(img => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http") && !src.startsWith("/")) {
          // Jika halaman di /antarmuka/, tambahkan ../
          const newSrc = basePath + src;
          img.setAttribute("src", newSrc);
        }
      });
      
      // 3. Set active state
      const navItems = document.querySelectorAll(".nav-item");
      console.log("Found nav items:", navItems.length);
      
      navItems.forEach(item => {
        const pageName = item.dataset.page;
        if (pageName === currentPage) {
          item.classList.add("active");
          console.log("🌟 Set active for:", pageName);
        }
      });
      
    }, 100);
    
  } catch (error) {
    console.error("❌ Error loading navbar:", error);
    
    // FALLBACK: Buat navbar manual dengan path yang benar
    console.log("Creating fallback navbar...");
    
    // Tentukan base path untuk fallback
    let basePath = "";
    if (window.location.pathname.includes("/antarmuka/")) {
      basePath = "../";
    }
    
    const fallbackNav = `
    <div class="bottom-nav">
      <div class="nav-item" data-page="index.html">
        <a href="${basePath}index.html">
          <img src="${basePath}assets/img/home.png" alt="Home">
          <span>Home</span>
        </a>
      </div>
      <div class="nav-item" data-page="search.html">
        <a href="${basePath}search.html">
          <img src="${basePath}assets/img/search.png" alt="Search">
          <span>Search</span>
        </a>
      </div>
      <div class="fab-wrapper">
        <a href="${basePath}scanwajah.html" class="fab animate-pulse">
          <img src="${basePath}assets/img/scanwajah.png" alt="Scan Wajah">
        </a>
      </div>
      <div class="nav-item" data-page="favorite.html">
        <a href="${basePath}favorite.html">
          <img src="${basePath}assets/img/heart.png" alt="Favorite">
          <span>Favorite</span>
        </a>
      </div>
      <div class="nav-item" data-page="profile.html">
        <a href="${basePath}profile.html">
          <img src="${basePath}assets/img/user.png" alt="Profile">
          <span>Profile</span>
        </a>
      </div>
    </div>`;
    
    document.body.insertAdjacentHTML("beforeend", fallbackNav);
    
    // Tambahkan CSS emergency jika CSS tidak terload
    const emergencyCSS = `
    <style>
      .bottom-nav {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 70px !important;
        display: flex !important;
        justify-content: space-around !important;
        align-items: center !important;
        background: white !important;
        border-top: 1px solid #eee !important;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1) !important;
        z-index: 9999 !important;
      }
      .bottom-nav a {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-decoration: none !important;
        color: #666 !important;
        font-size: 11px !important;
      }
      .bottom-nav img {
        width: 24px !important;
        height: 24px !important;
        margin-bottom: 4px !important;
      }
      .bottom-nav .active a {
        color: #447DCE !important;
      }
      .fab-wrapper {
        margin-top: -20px !important;
      }
      .fab {
        width: 60px !important;
        height: 60px !important;
        background: #2c83f5 !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 4px 12px rgba(44,131,245,0.4) !important;
      }
      .fab img {
        width: 30px !important;
        height: 30px !important;
        filter: brightness(0) invert(1) !important;
        margin: 0 !important;
      }
      body {
        padding-bottom: 80px !important;
      }
    </style>
    `;
    
    document.head.insertAdjacentHTML("beforeend", emergencyCSS);
  }
});