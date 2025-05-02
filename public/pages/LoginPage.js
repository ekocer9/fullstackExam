import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { apiPost } from '../js/api.js';
import { showToast } from "../util/toast.js";

export function LoginPage(app) {
  app.innerHTML = `
    ${Navbar()}
    <h1>Login</h1>
    <form id="loginForm">
      <input type="email" placeholder="Email" name="email" required />
      <input type="password" placeholder="Password" name="password" required />
      <button type="submit">Login</button>
    </form>
    <div id="loginMessage"></div>
    ${Footer()}
  `;

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await apiPost('/api/auth/login', { email, password });

      if (response.token) {
        localStorage.setItem('token', response.token);

        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

        for (const item of guestCart) {
          if (!item.productId || !item.quantity || !item.size) continue;
      
          try {
            await apiPost('/api/cart', {
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
            }, response.token);
          } catch (err) {
            console.error('Failed to merge guest cart item:', err);
          }
        }

        localStorage.removeItem('guestCart');
        showToast("Login successful!", "success");
        history.pushState(null, '', '/');
        window.dispatchEvent(new Event('popstate'));
      } else {
        showToast("Login failed. Please check your credentials.", "error");
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast("Login failed. Server error or invalid credentials.", "error");
    }
  });
}
