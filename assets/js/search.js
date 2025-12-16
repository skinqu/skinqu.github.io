const products = [
  { name: "Sunscreen A", category: "sunscreen" },
  { name: "Moisturizer B", category: "moisturizer" },
  { name: "Serum C", category: "serum" },
  { name: "Sunscreen D", category: "sunscreen" }
];

const grid = document.getElementById("productGrid");

function render(list) {
  grid.innerHTML = "";
  list.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <div class="fav">♡</div>
        <img src="assets/img/product-placeholder.png">
        <p>${p.name}</p>
      </div>
    `;
  });
}

function filterCategory(cat) {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  event.target.classList.add("active");

  if (cat === "all") {
    render(products);
  } else {
    render(products.filter(p => p.category === cat));
  }
}

function searchProduct(keyword) {
  render(
    products.filter(p =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

render(products);
