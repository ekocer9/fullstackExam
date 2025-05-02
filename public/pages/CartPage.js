import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";
import { apiGet, apiPost, apiDelete } from "../js/api.js";
import { showToast } from "../util/toast.js"; 

export async function CartPage(app) {
  const token = localStorage.getItem("token");

  app.innerHTML = `
    ${Navbar()}
    <h1>My Cart</h1>
    <div id="cartItems"></div>
    ${token ? `
      <div class="cart-controls">
        <button id="checkoutBtn" class="btn-primary">Checkout</button>
      </div>
    ` : ""}
    ${Footer()}
  `;

  const cartContainer = document.getElementById("cartItems");

  async function renderCartItem(item, index, isGuest = false) {
    const div = document.createElement("div");
    div.className = "cart-item";
    let product = item;

    if (isGuest) {
      try {
        const data = await apiGet(`/api/products/${item.productId}`);
        product = { ...data, ...item };
      } catch (err) {
        div.innerHTML = `<p>Product not found (ID: ${item.productId})</p>`;
        cartContainer.appendChild(div);
        return;
      }
    }

    div.innerHTML = `
      <div class="cart-item-inner">
        <img src="${product.image || '/images/default.jpg'}" alt="${product.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <h3>${product.name}</h3>
          <p><strong>Size:</strong> ${product.size || "N/A"}</p>
          <div class="cart-quantity-group">
            <label for="qty-${index}"><strong>Quantity:</strong></label>
            <input type="number" id="qty-${index}" class="quantity-input" value="${product.quantity || 1}" min="1" />
          </div>
          <p><strong>Price:</strong> ${product.price} DKK</p>
          ${product.custom_name ? `<p><strong>Name:</strong> ${product.custom_name}</p>` : ""}
          ${product.custom_number ? `<p><strong>Number:</strong> ${product.custom_number}</p>` : ""}
          <div class="cart-buttons">
            <button class="btn-primary update-btn">Update Quantity</button>
            <button class="remove-btn">REMOVE ITEM</button>
          </div>
        </div>
      </div>
    `;

    div.querySelector(".remove-btn").addEventListener("click", () => {
      if (isGuest) {
        removeGuestCartItem(index);
      } else {
        removeFromCart(product.cartItemId);
      }
    });

    div.querySelector(".update-btn").addEventListener("click", async () => {
      const qtyInput = div.querySelector(".quantity-input").value.trim();
      const newQty = Number(qtyInput);
      
      if (!Number.isInteger(newQty) || newQty < 1) {
        showToast("Please enter a valid quantity (whole number ≥ 1)", "error");
        return;
      }
      

      try {
        await apiPost("/api/cart", {
          productId: product.id,
          quantity: newQty,
          size: product.size,
          custom_name: product.custom_name || null,
          custom_number: product.custom_number || null,
        }, token);
        showToast("Quantity updated!", "success");
        history.pushState(null, "", "/cart");
        window.dispatchEvent(new Event("popstate"));
      } catch (err) {
        console.error("Failed to update quantity", err);
        showToast("Error updating quantity", "error");
      }
    });

    cartContainer.appendChild(div);
  }

  function removeGuestCartItem(index) {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    guestCart.splice(index, 1);
    localStorage.setItem("guestCart", JSON.stringify(guestCart));
    showToast("Item removed from cart", "success");
    history.pushState(null, "", "/cart");
    window.dispatchEvent(new Event("popstate"));
  }

  async function removeFromCart(cartItemId) {
    try {
      await apiDelete(`/api/cart/${cartItemId}`, token);
      showToast("Item removed from cart", "success");
      history.pushState(null, "", "/cart");
      window.dispatchEvent(new Event("popstate"));
    } catch (error) {
      console.error("Remove error:", error);
      showToast("Failed to remove item", "error");
    }
  }

  function navigateToLogin() {
    history.pushState(null, "", "/login");
    window.dispatchEvent(new Event("popstate"));
  }

  function navigateToSignup() {
    history.pushState(null, "", "/signup");
    window.dispatchEvent(new Event("popstate"));
  }

  if (!token) {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    if (guestCart.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart-message">
          <p>Your cart is empty 🛒</p>
        </div>
      `;
      return;
    }

    for (let i = 0; i < guestCart.length; i++) {
      await renderCartItem(guestCart[i], i, true);
    }

    const authPrompt = document.createElement("div");
    authPrompt.innerHTML = `
      <div style="text-align: center; margin-top: 1rem;">
        <p><strong>Please log in or sign up to check out:</strong></p>
        <div class="cart-controls">
          <button class="btn-primary">Log In</button>
          <button class="btn-primary">Sign Up</button>
        </div>
      </div>
    `;
    authPrompt.querySelector("button:nth-child(1)").addEventListener("click", navigateToLogin);
    authPrompt.querySelector("button:nth-child(2)").addEventListener("click", navigateToSignup);
    cartContainer.appendChild(authPrompt);
    return;
  }

  try {
    const cartItems = await apiGet("/api/cart", token);
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart-message">
          <p>Your cart is empty 🛒</p>
        </div>
      `;
      const controls = document.querySelector(".cart-controls");
      if (controls) controls.style.display = "none";
      return;
    }

    for (let i = 0; i < cartItems.length; i++) {
      await renderCartItem(cartItems[i], i, false);
    }

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", async () => {
        try {
          await apiPost("/api/orders/checkout", {}, token);
          showToast("Order placed successfully!", "success");
          history.pushState(null, "", "/orders");
          window.dispatchEvent(new Event("popstate"));
        } catch (error) {
          console.error("Checkout failed", error);
          showToast("Checkout failed. Please try again.", "error");
        }
      });
    }
  } catch (error) {
    console.error("Failed to load cart", error);
    cartContainer.innerHTML = "<p>Unable to load cart. Are you logged in?</p>";
    showToast("Error loading cart. Try again.", "error");
  }
}
