document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("bannerTrack");
  const dotsContainer = document.getElementById("bannerDots");
  if (!track || !dotsContainer) return;

  let banners = Array.from(track.children);
  const bannerCount = banners.length;

  /* ===== CREATE DOTS ===== */
  banners.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll("span");

  /* ===== CLONE BANNERS (INFINITE) ===== */
  banners.forEach(b => track.appendChild(b.cloneNode(true)));

  banners = Array.from(track.children); // update list after clone

  let index = 0;
  let interval;

  function bannerWidth() {
    return banners[0].offsetWidth + 18; // gap
  }

  function updateActive() {
    banners.forEach(b => b.classList.remove("is-active"));
    const activeIndex = index % bannerCount;
    banners[activeIndex].classList.add("is-active");

    dots.forEach(d => d.classList.remove("active"));
    dots[activeIndex].classList.add("active");
  }

  function goToBanner(i) {
    track.scrollTo({
      left: i * bannerWidth(),
      behavior: "smooth"
    });
    index = i;
    updateActive();
  }

  /* ===== AUTO STEP SCROLL ===== */
  function startAuto() {
    interval = setInterval(() => {
      index++;

      if (index >= bannerCount * 2) {
        track.scrollLeft = 0;
        index = 1;
      }

      goToBanner(index);
    }, 3000); // ⏱️ langsung lompat per 3 detik
  }

  /* ===== PAUSE ON INTERACTION ===== */
  ["mouseenter", "touchstart"].forEach(evt =>
    track.addEventListener(evt, () => clearInterval(interval))
  );

  ["mouseleave", "touchend"].forEach(evt =>
    track.addEventListener(evt, startAuto)
  );

  /* ===== DOT CLICK (OPSIONAL TAPI KEREN) ===== */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(interval);
      goToBanner(i);
      startAuto();
    });
  });

  /* INIT */
  updateActive();
  startAuto();
});
