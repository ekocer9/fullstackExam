import { apiPost } from "./api.js";
import { showToast } from "../util/toast.js";

export async function handleLogin(form) {
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;

  try {
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
    } else {
      alert(response.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong.");
  }
}

export async function handleSignup(form) {
  const first_name = form.querySelector("#first_name").value;
  const last_name = form.querySelector("#last_name").value;
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;

  try {
    const response = await apiPost("/api/auth/signup", {
      email,
      password,
      first_name,
      last_name
    });

    if (response.user) {
      showToast("Signup successful! Please log in.", "success");
      history.pushState(null, "", "/login");
      window.dispatchEvent(new Event("popstate"));
    } else {
      showToast(response.message || "Signup failed", "error");
    }
  } catch (err) {
    console.error("Signup error:", err);
    showToast("Something went wrong during signup.", "error");
  }
}


export function logout() {
  localStorage.removeItem("token");
  alert("You have been logged out.");
  history.pushState(null, "", "/");
  window.dispatchEvent(new Event("popstate"));
}
