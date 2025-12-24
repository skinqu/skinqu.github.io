document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("bannerTrack");
  const dotsContainer = document.getElementById("bannerDots");

  if (!track || !dotsContainer) return;

  // Gunakan ResizeObserver agar tetap responsif (termasuk rotate HP)
  const resizeObserver = new ResizeObserver(() => {
    if (interval) stopAuto();  // hindari conflict saat resize
    setTimeout(() => {
      goToBanner(index % bannerCount, false);
      if (!interval) startAuto();
    }, 100);
  });
  resizeObserver.observe(track);

  let banners = Array.from(track.children);
  const bannerCount = banners.length;

  /* ===== DOTS ===== */
  dotsContainer.innerHTML = ""; // clear dulu (hindari duplikat saat reload)
  banners.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll("span");

  /* ===== CLONE FOR INFINITE SCROLL (dua arah) ===== */
  // Clone 1 set di kiri & 1 set di kanan → seamless ke kiri/kanan
  const fragment = document.createDocumentFragment();
  banners.forEach(b => fragment.appendChild(b.cloneNode(true)));
  track.prepend(fragment); // clone di kiri
  track.append(fragment.cloneNode(true)); // clone di kanan
  banners = Array.from(track.children); // update referensi

  let index = bannerCount; // mulai di clone pertama (posisi "asli" tengah)
  let interval = null;
  let resumeTimeout = null;
  let isUserScrolling = false;

  // Helper: ukuran 1 banner (responsif)
  function bannerSize() {
    return banners[bannerCount].offsetWidth + 18; // ambil dari banner asli (index bannerCount)
  }

  // Helper: offset ke tengah (termasuk padding/margin luar)
  function centerOffset() {
    return (track.offsetWidth - (banners[bannerCount]?.offsetWidth || 0)) / 2;
  }

  function updateActive() {
    const realIndex = (index % bannerCount + bannerCount) % bannerCount;

    banners.forEach(b => b.classList.remove("is-active"));
    banners[index].classList.add("is-active");

    dots.forEach(d => d.classList.remove("active"));
    dots[realIndex].classList.add("active");
  }

  function goToBanner(targetIndex, smooth = true) {
    index = targetIndex;
    const targetScroll = index * bannerSize() - centerOffset();

    track.scrollTo({
      left: targetScroll,
      behavior: smooth ? "smooth" : "auto"
    });

    updateActive();
  }

  function startAuto() {
    if (interval) return;

    interval = setInterval(() => {
      if (isUserScrolling) return;

      index++;

      // Jika sampai di akhir clone kanan → lompat ke clone tengah (tanpa jump visual)
      if (index >= bannerCount * 2) {
        index = bannerCount; // reset ke posisi "asli" (index tengah)
        track.scrollTo({
          left: index * bannerSize() - centerOffset(),
          behavior: "auto"
        });
      }

      goToBanner(index);
    }, 3200);
  }

  function stopAuto() {
    clearInterval(interval);
    interval = null;

    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      if (!isUserScrolling) startAuto();
    }, 2500);
  }

  /* ===== USER INTERACTION ===== */
  let startX = 0;
  let scrollLeft = 0;

  // Touch/Mouse start
  const handleStart = (e) => {
    isUserScrolling = true;
    stopAuto();
    startX = (e.type === "touchstart" ? e.touches[0].clientX : e.clientX);
    scrollLeft = track.scrollLeft;
  };

  // Touch/Mouse move (opsional: bisa skip jika hanya butuh scroll biasa)
  const handleMove = (e) => {
    if (!isUserScrolling) return;
    const x = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX);
    const walk = (x - startX) * 1.5; // sensitivitas
    track.scrollLeft = scrollLeft - walk;
  };

  // End: snap ke banner terdekat
  const handleEnd = () => {
    if (!isUserScrolling) return;
    isUserScrolling = false;

    const scrollPos = track.scrollLeft + centerOffset();
    const i = Math.round(scrollPos / bannerSize());
    // Pastikan index tetap di range [bannerCount, bannerCount*2)
    let targetIndex = Math.min(Math.max(i, bannerCount), bannerCount * 2 - 1);
    goToBanner(targetIndex, true);
    stopAuto(); // akan auto-resume setelah timeout
  };

  // Event listener interaksi
  track.addEventListener("mousedown", handleStart);
  track.addEventListener("touchstart", handleStart, { passive: true });
  track.addEventListener("mousemove", handleMove);
  track.addEventListener("touchmove", handleMove, { passive: true });
  track.addEventListener("mouseup", handleEnd);
  track.addEventListener("mouseleave", handleEnd);
  track.addEventListener("touchend", handleEnd);

  // Scroll snapping via wheel/trackpad
  track.addEventListener("wheel", (e) => {
    if (e.deltaX !== 0) {
      stopAuto();
      isUserScrolling = true;
      setTimeout(() => {
        isUserScrolling = false;
        const scrollPos = track.scrollLeft + centerOffset();
        const i = Math.round(scrollPos / bannerSize());
        let targetIndex = Math.min(Math.max(i, bannerCount), bannerCount * 2 - 1);
        goToBanner(targetIndex, true);
      }, 150);
    }
  });

  // Manual scroll (touchpad/mouse drag)
  let scrollTimeout;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    if (!isUserScrolling) {
      scrollTimeout = setTimeout(() => {
        const scrollPos = track.scrollLeft + centerOffset();
        const i = Math.round(scrollPos / bannerSize());
        let targetIndex = Math.min(Math.max(i, bannerCount), bannerCount * 2 - 1);
        if (Math.abs(index - targetIndex) > 0.5) {
          goToBanner(targetIndex, false);
        }
      }, 100);
    }
  });

  /* ===== DOT CLICK ===== */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAuto();
      // target ke clone tengah + offset i
      goToBanner(bannerCount + i, true);
    });
  });

  /* ===== INIT ===== */
  goToBanner(bannerCount, false); // mulai di posisi tengah (clone pertama)
  startAuto();
});