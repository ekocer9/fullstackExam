import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { apiGet, apiPost } from '../js/api.js';
import { showToast } from "../util/toast.js";

export async function ProductDetailsPage(app) {
  const params = new URLSearchParams(location.search);
  const productId = params.get("id");
  const token = localStorage.getItem("token");

  const product = await apiGet(`/api/products/${productId}`, token);

  app.innerHTML = `
    ${Navbar()}
    <section class="product-detail">
      <img src="${product.image || '/images/default.jpg'}" alt="${product.name}" class="product-detail-img"/>

      <div class="product-info">
        <h2>${product.name}</h2>
        <p class="product-team">${product.team} - ${product.playerName}</p>
        <p class="product-desc">${product.description}</p>
        <p class="product-price"><strong>${product.price} DKK</strong></p>

        <label for="size">Choose size:</label>
        <select id="size">
          <option>S</option>
          <option selected>M</option>
          <option>L</option>
          <option>XL</option>
          <option>XXL</option>
          <option>XXXL</option>
        </select>

        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" min="1" value="1" />

        <div class="customization-options">
          <h3>Customize:</h3>
          <label><input type="radio" name="customType" value="none" checked /> No name/number</label>
          <label><input type="radio" name="customType" value="custom" /> self-chosen name</label>
          <label><input type="radio" name="customType" value="player" /> Choose a player</label>

          <input type="text" id="customNameInput" placeholder="Enter name" style="display: none;" />
          <input type="number" id="customNumberInput" placeholder="Enter number" style="display: none;" />

          <select id="playerSelect" style="display: none;">
            <option value="Messi-10">Messi #10</option>
            <option value="Ronaldo-7">Ronaldo #7</option>
            <option value="Mbappe-7">Mbappé #7</option>
          </select>
        </div>

        <button class="btn-primary" id="addToCartBtn">Add to Cart</button>
        <button class="btn-primary" id="addToWishlistBtn">♡ Add to Wishlist</button>
      </div>
    </section>
    ${Footer()}
  `;

  document.querySelectorAll('input[name="customType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const type = document.querySelector('input[name="customType"]:checked').value;
      document.getElementById("customNameInput").style.display = type === 'custom' ? 'block' : 'none';
      document.getElementById("customNumberInput").style.display = type === 'custom' ? 'block' : 'none';
      document.getElementById("playerSelect").style.display = type === 'player' ? 'block' : 'none';
    });
  });

  document.getElementById("addToCartBtn").addEventListener("click", async () => {
    const size = document.getElementById("size").value;
    const quantity = parseInt(document.getElementById("quantity").value) || 1;
    const type = document.querySelector('input[name="customType"]:checked').value;
  
    let custom_name = null;
    let custom_number = null;
  
    if (type === "custom") {
      custom_name = document.getElementById("customNameInput").value.trim();
      custom_number = document.getElementById("customNumberInput").value.trim();
    
      if (!custom_name || !custom_number) {
        showToast("Please enter both name and number.", "error");
        return;
      }
    
      if (!/^\d+$/.test(custom_number)) {
        showToast("Jersey number must be a valid number.", "error");
        return;
      }
    
      custom_number = parseInt(custom_number);
    }
  
    const payload = {
      productId,
      size,
      quantity,
      custom_name,
      custom_number
    };
  
    if (token) {
      try {
        await apiPost("/api/cart", payload, token);
        showToast("Item added to cart!", "success");
      } catch (err) {
        console.error("Error adding to cart:", err);
        showToast("Failed to add to cart.", "error");
      }      
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      guestCart.push({ productId, size, quantity, custom_name, custom_number });
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      showToast("Item added to guest cart", "info");
    }
  });  

  document.getElementById("addToWishlistBtn").addEventListener("click", async () => {
    if (!token) return
  
    const size = document.getElementById("size").value;
    const type = document.querySelector('input[name="customType"]:checked').value;
  
    let custom_name = null, custom_number = null;
    if (type === "custom") {
      custom_name = document.getElementById("customNameInput").value;
      custom_number = document.getElementById("customNumberInput").value;
    } else if (type === "player") {
      const selected = document.getElementById("playerSelect").value;
      [custom_name, custom_number] = selected.split("-");
    }
  
    try {
      await apiPost("/api/wishlist", { productId, size, custom_name, custom_number }, token);
      showToast("Added to wishlist ❤️", "success");
    } catch (err) {
      console.error("Wishlist error:", err);
      showToast("Failed to add to wishlist", "error");
    }    
  });  
}
