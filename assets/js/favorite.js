import { SUPABASE_URL, SUPABASE_KEY } from "./supabase.js";

const grid = document.getElementById("favoriteGrid");

// tunggu session dari auth-guard.js
function waitSession() {
  if (!window.USER_ID || !window.ACCESS_TOKEN) {
    setTimeout(waitSession, 100);
    return;
  }
  loadFavorites();
}

async function loadFavorites() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/favorites?select=product&user_id=eq.${window.USER_ID}&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: "Bearer " + window.ACCESS_TOKEN
      }
    }
  );

  const data = await res.json();
  grid.innerHTML = "";

  if (!data || data.length === 0) {
    grid.innerHTML = `
      <div style="width:100%;text-align:center;padding:40px;color:#888">
        💔 Belum ada produk favorit
      </div>
    `;
    return;
  }

  data.forEach(({ product }) => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.nama}">
        <div class="product-name">${product.nama}</div>
        <div class="product-price">${product.harga}</div>

        <button class="buy-btn"
          onclick="window.open('${product.url}', '_blank')">
          Lihat Produk
        </button>
      </div>
    `;
  });
}

waitSession();
