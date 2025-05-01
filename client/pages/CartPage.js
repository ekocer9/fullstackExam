import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";
import { apiGet, apiPost, apiDelete } from "../js/api.js";

export async function CartPage(app) {
  const token = localStorage.getItem("token");

  // First render page structure (always)
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

  // Guest logic
  if (!token) {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    if (guestCart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      guestCart.forEach((item, index) => {
        cartContainer.innerHTML += `
          <div class="cart-item">
            <p>Product ID: ${item.productId}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="removeGuestCartItem(${index})">Remove</button>
          </div>
        `;
      });      
      cartContainer.innerHTML += `
      <div style="text-align: center; margin-top: 1rem;">
        <p><strong>Please log in or sign up to check out:</strong></p>
        <div class="cart-controls">
          <button class="btn-primary" onclick="navigateToLogin()">Log In</button>
          <button class="btn-primary" onclick="navigateToSignup()">Sign Up</button>
        </div>
      </div>
    `;
    }
    return; 
  }

  // Logged-in logic
  try {
    const cartItems = await apiGet("/api/cart", token);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cartItems.forEach((item) => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: ${item.price} DKK</p>
        <button onclick="removeFromCart(${item.cartItemId})">Remove</button>
      `;
      cartContainer.appendChild(div);
    });

    document
      .getElementById("checkoutBtn")
      .addEventListener("click", async () => {
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

  window.removeFromCart = async function (cartItemId) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      await apiDelete(`/api/cart/${cartItemId}`, token);
      alert("Removed from cart");
      window.location.reload();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };
}

window.navigateToLogin = function () {
  history.pushState(null, "", "/login");
  window.dispatchEvent(new Event("popstate"));
};

window.navigateToSignup = function () {
  history.pushState(null, "", "/signup");
  window.dispatchEvent(new Event("popstate"));
};

window.removeGuestCartItem = function(index) {
  const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
  guestCart.splice(index, 1);
  localStorage.setItem('guestCart', JSON.stringify(guestCart));

  // Refresh page or re-render
  history.pushState(null, '', '/cart');
  window.dispatchEvent(new Event('popstate'));
};
