document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("bannerTrack");
  const dotsContainer = document.getElementById("bannerDots");
  if (!track || !dotsContainer) return;

  const banners = Array.from(track.children);
  const bannerCount = banners.length;

  /* ===== CREATE DOTS ===== */
  for (let i = 0; i < bannerCount; i++) {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll("span");

  /* ===== CLONE BANNERS (INFINITE) ===== */
  banners.forEach(banner => {
    const clone = banner.cloneNode(true);
    track.appendChild(clone);
  });

  let scrollSpeed = 0.35;
  let interval;

  function updateDots() {
    const bannerWidth = banners[0].offsetWidth + 18; // gap
    const index = Math.floor(track.scrollLeft / bannerWidth) % bannerCount;

    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function autoScroll() {
    track.scrollLeft += scrollSpeed;

    if (track.scrollLeft >= track.scrollWidth / 2) {
      track.scrollLeft = 0;
    }

    updateDots();
  }

  interval = setInterval(autoScroll, 20);

  /* ===== PAUSE ON INTERACTION ===== */
  ["touchstart", "mouseenter"].forEach(evt =>
    track.addEventListener(evt, () => clearInterval(interval))
  );

  ["touchend", "mouseleave"].forEach(evt =>
    track.addEventListener(evt, () => {
      interval = setInterval(autoScroll, 20);
    })
  );

  /* ===== MANUAL SCROLL UPDATE DOT ===== */
  track.addEventListener("scroll", () => {
    updateDots();
  });
});
