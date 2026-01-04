
  function getGreetingWIB() {
    // Ambil waktu UTC
    const now = new Date();

    // Konversi ke WIB (UTC +7)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wibTime = new Date(utc + 7 * 60 * 60 * 1000);
    const hour = wibTime.getHours();

    if (hour >= 4 && hour < 11) return "Good Morning";
    if (hour >= 11 && hour < 15) return "Good Afternoon";
    if (hour >= 15 && hour < 18) return "Good Evening";
    return "Good Night";
  }

  document.getElementById("greeting").textContent = getGreetingWIB();

