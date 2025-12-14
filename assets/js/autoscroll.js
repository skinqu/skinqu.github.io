document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("bannerTrack");
  const dotsContainer = document.getElementById("bannerDots");
  if (!track || !dotsContainer) return;

  let banners = Array.from(track.children);
  const bannerCount = banners.length;

  /* ===== DOTS ===== */
  banners.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll("span");

  /* ===== CLONE FOR INFINITE ===== */
  banners.forEach(b => track.appendChild(b.cloneNode(true)));
  banners = Array.from(track.children);

  let index = 0;
  let interval = null;
  let resumeTimeout = null;

  function bannerSize() {
    return banners[0].offsetWidth + 18;
  }

  function centerOffset() {
    return (track.offsetWidth - banners[0].offsetWidth) / 2;
  }

  function updateActive() {
    const realIndex = index % bannerCount;

    banners.forEach(b => b.classList.remove("is-active"));
    banners[realIndex].classList.add("is-active");

    dots.forEach(d => d.classList.remove("active"));
    dots[realIndex].classList.add("active");
  }

  function goToBanner(i, smooth = true) {
    index = i;

    track.scrollTo({
      left: i * bannerSize() - centerOffset(),
      behavior: smooth ? "smooth" : "auto"
    });

    updateActive();
  }

  function startAuto() {
    if (interval) return;

    interval = setInterval(() => {
      index++;

      if (index >= bannerCount * 2) {
        track.scrollLeft = 0;
        index = 1;
      }

      goToBanner(index);
    }, 3200);
  }

  function stopAuto() {
    clearInterval(interval);
    interval = null;

    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(startAuto, 2500); // 🔥 jeda sebelum auto nyala lagi
  }

  /* ===== USER INTERACTION ===== */
  ["mousedown", "touchstart", "wheel"].forEach(evt =>
    track.addEventListener(evt, stopAuto)
  );

  track.addEventListener("scroll", () => {
    const i = Math.round(
      (track.scrollLeft + centerOffset()) / bannerSize()
    );
    index = i;
    updateActive();
  });

  /* ===== DOT CLICK ===== */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAuto();
      goToBanner(i);
    });
  });

  /* INIT */
  goToBanner(0, false);
  startAuto();
});
