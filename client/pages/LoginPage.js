import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { apiPost } from '../js/api.js';

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

        // ✅ Merge guest cart into user cart
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

        for (const item of guestCart) {
          try {
            await apiPost('/api/cart', {
              productId: item.productId,
              quantity: item.quantity,
            }, response.token);
          } catch (err) {
            console.error('Failed to merge guest cart item:', err);
          }
        }

        localStorage.removeItem('guestCart'); // ✅ Clear guest cart after merge

        alert('Login successful!');
        history.pushState(null, '', '/');
        window.dispatchEvent(new Event('popstate'));
      } else {
        document.getElementById('loginMessage').textContent = 'Login failed.';
      }
    } catch (error) {
      console.error('Login error:', error);
      document.getElementById('loginMessage').textContent = 'Invalid credentials or server error.';
    }
  });
}
