import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";
import { apiGet, apiPost } from "../js/api.js";


export async function HomePage(app) {
  app.innerHTML = `
    ${Navbar()}
    <h1>Welcome to Fullstack Shop</h1>
    <p style="text-align: center;">Browse our latest jerseys below.</p>
    <div class="products-grid" id="productList"></div>
    ${Footer()}
  `;

  const productList = document.getElementById("productList");

  try {
    const products = await apiGet("/api/products");

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>${product.price} DKK</strong></p>
        <p>${product.team} - ${product.playerName}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button onclick="addToWishlist(${product.id})">♡ Wishlist</button>
    `;
      productList.appendChild(card);
    });
  } catch (error) {
    productList.innerHTML = `<p>Failed to load products.</p>`;
    console.error("Error loading products:", error);
  }

  window.addToCart = async function (productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      // Guest cart logic
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const existing = guestCart.find((item) => item.productId === productId);

      if (existing) {
        existing.quantity += 1;
      } else {
        guestCart.push({ productId, quantity: 1 });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      refreshNavbar();
      alert("Added to guest cart!");
      return;
    }

    // Logged-in user cart
    try {
      await apiPost("/api/cart", { productId, quantity: 1 }, token);
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };
}

window.addToWishlist = async function(productId) {
  const token = localStorage.getItem('token');
  if (!token) return alert('You must be logged in to use the wishlist');

  try {
    await apiPost('/api/wishlist', { productId }, token);
    alert('Added to wishlist!');
  } catch (error) {
    console.error('Wishlist error:', error);
    alert('Failed to add to wishlist');
  }
};