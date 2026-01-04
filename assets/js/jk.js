const genderSelect = document.getElementById("gender");
  const hamilWrapper = document.getElementById("hamilWrapper");

  function toggleHamil() {
    if (genderSelect.value === "laki-laki") {
      hamilWrapper.style.display = "none";
    } else {
      hamilWrapper.style.display = "block";
    }
  }

  // Jalankan saat gender berubah
  genderSelect.addEventListener("change", toggleHamil);

  // Jalankan saat halaman pertama kali dibuka (standby)
  document.addEventListener("DOMContentLoaded", toggleHamil);

