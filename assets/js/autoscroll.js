const track = document.getElementById("bannerTrack");

let scrollSpeed = 0.3;

function autoScroll() {
  track.scrollLeft += scrollSpeed;

  if (track.scrollLeft >= track.scrollWidth / 2) {
    track.scrollLeft = 0;
  }
}

setInterval(autoScroll, 20);

