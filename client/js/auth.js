import { apiPost } from "./api.js";

export async function handleLogin(form) {
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;

  try {
    const response = await apiPost("/api/auth/login", { email, password });
    if (response.token) {
      localStorage.setItem("token", response.token);
      alert("Login successful");
      history.pushState(null, "", "/");
      window.dispatchEvent(new Event("popstate"));
    } else {
      alert(response.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong.");
  }

  const response = await apiPost("/api/auth/login", { email, password });

  if (response.token) {
    localStorage.setItem("token", response.token);

    // Transfer guestCart to real cart
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        await apiPost("/api/cart", item, response.token);
      }
      localStorage.removeItem("guestCart");
    }

    alert("Login successful");
    history.pushState(null, "", "/");
    window.dispatchEvent(new Event("popstate"));
  }
}

export async function handleSignup(form) {
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;

  try {
    const response = await apiPost("/api/auth/signup", { email, password });
    if (response.user) {
      alert("Signup successful! Please log in.");
      history.pushState(null, "", "/login");
      window.dispatchEvent(new Event("popstate"));
    } else {
      alert(response.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong.");
  }
}

export function logout() {
  localStorage.removeItem("token");
  alert("You have been logged out.");
  history.pushState(null, "", "/");
  window.dispatchEvent(new Event("popstate"));
}
