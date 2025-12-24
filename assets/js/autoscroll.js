document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("bannerTrack");
  const dotsContainer = document.getElementById("bannerDots");

  if (!track || !dotsContainer) return;

  let banners = Array.from(track.children);
  const bannerCount = banners.length;

  // ✅ TAMBAH STYLE UNTUK CENTERING YANG LEBIH BAIK
  const style = document.createElement("style");
  style.textContent = `
    .banner-track {
      scroll-snap-type: x mandatory !important;
      scroll-padding: 0 calc(50% - 160px) !important;
    }
    .banner {
      scroll-snap-align: center !important;
      scroll-snap-stop: always !important;
    }
  `;
  document.head.appendChild(style);

  /* ===== DOTS ===== */
  dotsContainer.innerHTML = "";
  banners.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll("span");

  /* ===== CLONE UNTUK INFINITE SMOOTH ===== */
  // Clone kiri: copy banner terakhir
  const leftClone = banners[bannerCount - 1].cloneNode(true);
  // Clone kanan: copy banner pertama
  const rightClone = banners[0].cloneNode(true);
  
  track.prepend(leftClone);
  track.append(rightClone);
  
  banners = Array.from(track.children);
  
  // Set posisi awal ke banner pertama yang asli (index 1 karena ada clone kiri)
  let currentIndex = 1;
  let interval = null;
  let isUserInteracting = false;
  let resumeTimeout = null;

  // 🔥 FUNGSI UTAMA UNTUK LOCK KE CENTER
  function centerBanner(index, smooth = true) {
    const banner = banners[index];
    if (!banner) return;

    // ⭐⭐ CARA YANG LEBIH AKURAT UNTUK CENTERING ⭐⭐
    const trackRect = track.getBoundingClientRect();
    const bannerRect = banner.getBoundingClientRect();
    const trackCenter = trackRect.left + (trackRect.width / 2);
    const bannerCenter = bannerRect.left + (bannerRect.width / 2);
    const scrollDistance = bannerCenter - trackCenter;
    
    // Scroll manual untuk kontrol yang lebih presisi
    track.scrollBy({
      left: scrollDistance,
      behavior: smooth ? "smooth" : "instant"
    });

    currentIndex = index;
    updateActive();
  }

  function updateActive() {
    const realIndex = getRealIndex(currentIndex);
    
    // Update active class
    banners.forEach(b => b.classList.remove("is-active"));
    if (banners[currentIndex]) {
      banners[currentIndex].classList.add("is-active");
    }
    
    // Update dots
    dots.forEach((d, i) => d.classList.toggle("active", i === realIndex));
  }

  // Fungsi untuk mendapatkan index asli (tanpa clone)
  function getRealIndex(index) {
    // Jika di clone kiri (index 0)
    if (index === 0) return bannerCount - 1;
    // Jika di clone kanan (index terakhir)
    if (index === banners.length - 1) return 0;
    // Jika di banner asli
    return index - 1;
  }

  // 🔥 FUNGSI UNTUK CARI BANNER TERDEKAT DENGAN CENTER
  function findNearestCenterBanner() {
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + (trackRect.width / 2);
    
    let closestIndex = currentIndex;
    let minDistance = Infinity;
    
    for (let i = 0; i < banners.length; i++) {
      const bannerRect = banners[i].getBoundingClientRect();
      const bannerCenter = bannerRect.left + (bannerRect.width / 2);
      const distance = Math.abs(bannerCenter - trackCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }

  // 🔥 FUNGSI UNTUK HANDLE INFINITE LOOP SMOOTH
  function handleInfiniteLoop() {
    const realIndex = getRealIndex(currentIndex);
    
    // Jika sampai di clone kanan (index terakhir)
    if (currentIndex === banners.length - 1) {
      // Lompat tanpa animasi ke banner pertama yang asli
      currentIndex = 1;
      track.scrollTo({
        left: banners[currentIndex].offsetLeft - (track.offsetWidth / 2) + (banners[currentIndex].offsetWidth / 2),
        behavior: 'instant'
      });
    }
    // Jika kembali ke clone kiri (index 0)
    else if (currentIndex === 0) {
      // Lompat tanpa animasi ke banner terakhir yang asli
      currentIndex = bannerCount;
      track.scrollTo({
        left: banners[currentIndex].offsetLeft - (track.offsetWidth / 2) + (banners[currentIndex].offsetWidth / 2),
        behavior: 'instant'
      });
    }
    
    updateActive();
  }

  function startAutoSlide() {
    if (interval) clearInterval(interval);
    
    interval = setInterval(() => {
      if (isUserInteracting) return;
      
      // Pindah ke banner berikutnya
      currentIndex++;
      
      // Cek infinite loop
      if (currentIndex >= banners.length - 1) {
        currentIndex = banners.length - 1;
      }
      
      centerBanner(currentIndex, true);
      
      // Set timeout untuk cek infinite loop setelah animasi selesai
      setTimeout(() => {
        if (!isUserInteracting) {
          handleInfiniteLoop();
        }
      }, 500);
      
    }, 3200);
  }

  function stopAutoSlide() {
    clearInterval(interval);
    interval = null;
    
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      if (!isUserInteracting) startAutoSlide();
    }, 2500);
  }

  /* ===== EVENT HANDLERS ===== */
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleStart = (e) => {
    isUserInteracting = true;
    isDragging = true;
    stopAutoSlide();
    
    startX = e.type === "touchstart" ? e.touches[0].pageX : e.pageX;
    scrollLeft = track.scrollLeft;
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const x = e.type === "touchmove" ? e.touches[0].pageX : e.pageX;
    const walk = (x - startX);
    track.scrollLeft = scrollLeft - walk;
  };

  const handleEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    
    // Beri waktu untuk scroll berhenti
    setTimeout(() => {
      const nearestIndex = findNearestCenterBanner();
      currentIndex = nearestIndex;
      centerBanner(currentIndex, true);
      
      // Cek infinite loop setelah snap
      setTimeout(() => {
        handleInfiniteLoop();
        isUserInteracting = false;
        stopAutoSlide(); // Auto restart
      }, 100);
      
    }, 100);
  };

  // Scroll event untuk snap dan infinite loop
  let scrollTimeout;
  track.addEventListener("scroll", () => {
    if (!isDragging) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (isDragging) {
        const nearestIndex = findNearestCenterBanner();
        currentIndex = nearestIndex;
        centerBanner(currentIndex, true);
        handleInfiniteLoop();
      }
    }, 150);
  });

  // Event Listeners
  track.addEventListener("mousedown", handleStart);
  track.addEventListener("touchstart", handleStart, { passive: false });
  track.addEventListener("mousemove", handleMove);
  track.addEventListener("touchmove", handleMove, { passive: false });
  track.addEventListener("mouseup", handleEnd);
  track.addEventListener("mouseleave", handleEnd);
  track.addEventListener("touchend", handleEnd);
  track.addEventListener("touchcancel", handleEnd);

  // Dot click
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAutoSlide();
      currentIndex = i + 1; // +1 karena ada clone kiri
      centerBanner(currentIndex, true);
    });
  });

  // Wheel event
  track.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      isUserInteracting = true;
      stopAutoSlide();
      
      setTimeout(() => {
        const nearestIndex = findNearestCenterBanner();
        currentIndex = nearestIndex;
        centerBanner(currentIndex, true);
        handleInfiniteLoop();
        isUserInteracting = false;
      }, 300);
    }
  });

  /* ===== INITIALIZE ===== */
  // Tunggu gambar/elemen selesai load
  setTimeout(() => {
    // Set scroll position ke banner pertama yang asli di tengah
    const firstRealBanner = banners[1]; // Index 1 karena clone kiri di index 0
    if (firstRealBanner) {
      track.scrollTo({
        left: firstRealBanner.offsetLeft - (track.offsetWidth / 2) + (firstRealBanner.offsetWidth / 2),
        behavior: 'instant'
      });
      currentIndex = 1;
      updateActive();
    }
    
    startAutoSlide();
  }, 100);
});