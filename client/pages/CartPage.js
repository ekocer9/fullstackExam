import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";
import { apiGet, apiPost, apiDelete } from "../js/api.js";

export async function CartPage(app) {
  const token = localStorage.getItem("token");

  app.innerHTML = `
    ${Navbar()}
    <h1>My Cart</h1>
    <div id="cartItems"></div>
    <div class="cart-controls">
      <button id="checkoutBtn" class="btn-primary">Checkout</button>
    </div>
    ${Footer()}
  `;

  const cartContainer = document.getElementById("cartItems");

  async function renderCartItem(item, index, isGuest = false) {
    let productData = item;

    if (isGuest) {
      try {
        const products = await apiGet("/api/products");
        productData = products.find((p) => p.id === item.productId);
        if (!productData) throw new Error("Product not found");
      } catch (err) {
        console.error("Failed to fetch product for guest cart:", err);
        return;
      }
    }

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-inner">
        <img src="${productData.image || '/images/default.jpg'}" alt="${productData.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <h3>${productData.name}</h3>
          <p><strong>Size:</strong> ${item.size || "N/A"}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
          ${productData.price ? `<p><strong>Price:</strong> ${productData.price} DKK</p>` : ""}
        </div>
      </div>
    `;

    const button = document.createElement("button");
    button.textContent = "REMOVE ITEM";
    button.className = "remove-btn";
    button.addEventListener("click", () => {
      if (isGuest) {
        removeGuestCartItem(index);
      } else {
        removeFromCart(item.cartItemId);
      }
    });

    div.querySelector(".cart-item-details").appendChild(button);
    cartContainer.appendChild(div);
  }

  function removeGuestCartItem(index) {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    guestCart.splice(index, 1);
    localStorage.setItem("guestCart", JSON.stringify(guestCart));
    history.pushState(null, "", "/cart");
    window.dispatchEvent(new Event("popstate"));
  }

  async function removeFromCart(cartItemId) {
    try {
      await apiDelete(`/api/cart/${cartItemId}`, token);
      alert("Removed from cart");
      history.pushState(null, "", "/cart");
      window.dispatchEvent(new Event("popstate"));
    } catch (error) {
      console.error("Remove error:", error);
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
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
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
    }
    return;
  }

  try {
    const cartItems = await apiGet("/api/cart", token);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cartItems.forEach((item) => renderCartItem(item));

    document.getElementById("checkoutBtn").addEventListener("click", async () => {
      try {
        await apiPost("/api/orders/checkout", {}, token);
        alert("Order placed successfully!");
        history.pushState(null, "", "/orders");
        window.dispatchEvent(new Event("popstate"));
      } catch (error) {
        console.error("Checkout failed", error);
      }
    });
  } catch (error) {
    console.error("Failed to load cart", error);
    cartContainer.innerHTML = "<p>Unable to load cart. Are you logged in?</p>";
  }
}
