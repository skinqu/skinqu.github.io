// assets/js/bottom-nav.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Loading navbar from:", "components/bottom-nav.html");
    
    const res = await fetch("components/bottom-nav.html");
    
    if (!res.ok) {
      throw new Error(`Failed to load navbar: ${res.status} ${res.statusText}`);
    }
    
    const html = await res.text();
    console.log("Navbar HTML loaded successfully");
    
    // Tambahkan navbar ke body
    document.body.insertAdjacentHTML("beforeend", html);
    
    // Tentukan halaman aktif
    const currentPage = location.pathname.split("/").pop();
    console.log("Current page:", currentPage);
    
    // Tunggu DOM selesai render navbar
    setTimeout(() => {
      const navItems = document.querySelectorAll(".nav-item");
      console.log("Found nav items:", navItems.length);
      
      navItems.forEach(item => {
        const pageName = item.dataset.page;
        console.log("Checking nav item for page:", pageName);
        
        if (pageName === currentPage) {
          item.classList.add("active");
          console.log("Set active for:", pageName);
        }
      });
    }, 50);
    
  } catch (error) {
    console.error("Error loading navbar:", error);
    
    // FALLBACK: Buat navbar manual jika fetch gagal
    console.log("Creating fallback navbar...");
    const fallbackNav = `
    <div class="bottom-nav">
      <div class="nav-item" data-page="index.html">
        <a href="index.html">
          <img src="assets/img/home.png" alt="Home">
        </a>
      </div>
      <div class="nav-item" data-page="search.html">
        <a href="search.html">
          <img src="assets/img/search.png" alt="Search">
        </a>
      </div>
      <div class="fab-wrapper">
        <a href="scanwajah.html" class="fab animate-pulse">
          <img src="assets/img/scanwajah.png" alt="Scan Wajah">
        </a>
      </div>
      <div class="nav-item" data-page="favorite.html">
        <a href="favorite.html">
          <img src="assets/img/heart.png" alt="Favorite">
        </a>
      </div>
      <div class="nav-item" data-page="profile.html">
        <a href="profile.html">
          <img src="assets/img/user.png" alt="Profile">
        </a>
      </div>
    </div>`;
    
    document.body.insertAdjacentHTML("beforeend", fallbackNav);
  }
});