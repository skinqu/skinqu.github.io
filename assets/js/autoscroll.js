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
    .banner-item {
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

  /* ===== CLONE UNTUK INFINITE ===== */
  const fragment = document.createDocumentFragment();
  banners.forEach(b => fragment.appendChild(b.cloneNode(true)));
  track.prepend(fragment);
  track.append(fragment.cloneNode(true));
  banners = Array.from(track.children);

  let currentIndex = bannerCount;
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
    const realIndex = (currentIndex % bannerCount + bannerCount) % bannerCount;
    
    // Update active class
    banners.forEach(b => b.classList.remove("is-active"));
    if (banners[currentIndex]) {
      banners[currentIndex].classList.add("is-active");
    }
    
    // Update dots
    dots.forEach((d, i) => d.classList.toggle("active", i === realIndex));
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
    
    // Pastikan tetap di zona tengah
    if (closestIndex < bannerCount) {
      closestIndex = bannerCount;
    } else if (closestIndex >= bannerCount * 2) {
      closestIndex = bannerCount * 2 - 1;
    }
    
    return closestIndex;
  }

  function startAutoSlide() {
    if (interval) clearInterval(interval);
    
    interval = setInterval(() => {
      if (isUserInteracting) return;
      
      currentIndex++;
      
      // Reset jika sudah melewati clone kanan
      if (currentIndex >= bannerCount * 2) {
        currentIndex = bannerCount;
        track.scrollTo({
          left: banners[currentIndex].offsetLeft - (track.offsetWidth / 2) + (banners[currentIndex].offsetWidth / 2),
          behavior: 'instant'
        });
      }
      
      centerBanner(currentIndex, true);
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
      isUserInteracting = false;
      const nearestIndex = findNearestCenterBanner();
      centerBanner(nearestIndex, true);
      stopAutoSlide(); // Auto restart
    }, 100);
  };

  // Event Listeners
  track.addEventListener("mousedown", handleStart);
  track.addEventListener("touchstart", handleStart, { passive: false });
  track.addEventListener("mousemove", handleMove);
  track.addEventListener("touchmove", handleMove, { passive: false });
  track.addEventListener("mouseup", handleEnd);
  track.addEventListener("mouseleave", handleEnd);
  track.addEventListener("touchend", handleEnd);
  track.addEventListener("touchcancel", handleEnd);

  // Scroll event untuk snap
  let scrollTimeout;
  track.addEventListener("scroll", () => {
    if (!isDragging) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (isDragging) {
        const nearestIndex = findNearestCenterBanner();
        centerBanner(nearestIndex, true);
      }
    }, 150);
  });

  // Dot click
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAutoSlide();
      centerBanner(bannerCount + i, true);
    });
  });

  // Wheel event
  track.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      isUserInteracting = true;
      stopAutoSlide();
      
      setTimeout(() => {
        isUserInteracting = false;
        const nearestIndex = findNearestCenterBanner();
        centerBanner(nearestIndex, true);
      }, 300);
    }
  });

  /* ===== INITIALIZE ===== */
  // Tunggu gambar/elemen selesai load
  setTimeout(() => {
    // Set scroll position ke banner pertama di tengah
    const firstRealBanner = banners[bannerCount];
    if (firstRealBanner) {
      track.scrollTo({
        left: firstRealBanner.offsetLeft - (track.offsetWidth / 2) + (firstRealBanner.offsetWidth / 2),
        behavior: 'instant'
      });
      updateActive();
    }
    
    startAutoSlide();
  }, 100);
});