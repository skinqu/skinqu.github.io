document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("bannerTrack");
  const dotsContainer = document.getElementById("bannerDots");

  if (!track || !dotsContainer) return;

  let banners = Array.from(track.children);
  const bannerCount = banners.length;

  // ✅ Pastikan CSS punya: scroll-snap-type & scroll-padding!
  // (lihat rekomendasi CSS di atas)

  /* ===== DOTS ===== */
  dotsContainer.innerHTML = "";
  banners.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll("span");

  /* ===== CLONE UNTUK INFINITE (2 set: kiri & kanan) ===== */
  const fragment = document.createDocumentFragment();
  banners.forEach(b => fragment.appendChild(b.cloneNode(true)));
  track.prepend(fragment);
  track.append(fragment.cloneNode(true));
  banners = Array.from(track.children);

  let currentIndex = bannerCount; // mulai di banner asli pertama (posisi tengah visual)
  let interval = null;
  let resumeTimeout = null;
  let isUserInteracting = false;

  function updateActive() {
    const realIndex = (currentIndex % bannerCount + bannerCount) % bannerCount;

    banners.forEach(b => b.classList.remove("is-active"));
    banners[currentIndex].classList.add("is-active");

    dots.forEach((d, i) => d.classList.toggle("active", i === realIndex));
  }

  // 🔥 FUNGSI UTAMA: pastikan banner benar-benar DI TENGAH VIEWPORT
  function centerBanner(index, smooth = true) {
    const banner = banners[index];
    if (!banner) return;

    banner.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "nearest",
      inline: "center" // ✅ Ini kuncinya — force center secara visual
    });

    currentIndex = index;
    updateActive();
  }

  function startAuto() {
    if (interval) return;

    interval = setInterval(() => {
      if (isUserInteracting) return;

      currentIndex++;

      // Loop: jika melewati clone kanan, lompat ke clone tengah (tanpa jump)
      if (currentIndex >= bannerCount * 2) {
        // Reset ke posisi visual yang sama, tapi di clone tengah
        currentIndex = bannerCount;
        // Lompat langsung (tanpa animasi) ke posisi awal clone tengah
        banners[currentIndex].scrollIntoView({ behavior: "auto", inline: "center" });
      }

      centerBanner(currentIndex);
    }, 3200);
  }

  function stopAuto() {
    clearInterval(interval);
    interval = null;

    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      if (!isUserInteracting) startAuto();
    }, 2500);
  }

  /* ===== USER INTERACTION ===== */
  let touchStartX = 0;
  let isDragging = false;

  const handleStart = (e) => {
    isUserInteracting = true;
    isDragging = true;
    stopAuto();
    touchStartX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const x = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const diff = touchStartX - x;
    if (Math.abs(diff) > 10) {
      // Biarkan scroll alami terjadi — jangan override
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    isUserInteracting = false;

    // 🔥 CARI BANNER PALING DEKAT DENGAN CENTER VIEWPORT
    const rect = track.getBoundingClientRect();
    const centerScreenX = rect.left + rect.width / 2;

    let closestIndex = currentIndex;
    let minDist = Infinity;

    // Cari banner yang center-nya paling dekat dengan center layar
    for (let i = 0; i < banners.length; i++) {
      const bannerRect = banners[i].getBoundingClientRect();
      const bannerCenterX = bannerRect.left + bannerRect.width / 2;
      const dist = Math.abs(bannerCenterX - centerScreenX);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    // Pastikan index tetap di zone tengah (bannerCount ... 2*bannerCount - 1)
    closestIndex = Math.min(
      Math.max(closestIndex, bannerCount),
      bannerCount * 2 - 1
    );

    centerBanner(closestIndex, true);
    stopAuto(); // akan resume otomatis
  };

  // Event listeners
  track.addEventListener("mousedown", handleStart);
  track.addEventListener("touchstart", handleStart, { passive: true });
  track.addEventListener("mousemove", handleMove);
  track.addEventListener("touchmove", handleMove, { passive: true });
  track.addEventListener("mouseup", handleEnd);
  track.addEventListener("mouseleave", handleEnd);
  track.addEventListener("touchend", handleEnd);
  track.addEventListener("touchcancel", handleEnd);

  // Wheel (mouse/trackpad)
  track.addEventListener("wheel", (e) => {
    if (e.deltaX === 0) return;
    isUserInteracting = true;
    stopAuto();
    // Biarkan scroll alami, lalu snap via scroll event
  });

  // Snap saat scroll berhenti
  let scrollDebounce;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
      if (!isUserInteracting && !isDragging) {
        handleEnd(); // force snap to nearest center
      }
    }, 120);
  });

  /* ===== DOT CLICK ===== */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAuto();
      centerBanner(bannerCount + i, true);
    });
  });

  /* ===== INIT ===== */
  requestAnimationFrame(() => {
    centerBanner(bannerCount, false); // pastikan benar-benar di tengah
    startAuto();
  });
});