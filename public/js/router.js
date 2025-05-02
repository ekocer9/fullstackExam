import { HomePage } from '../../pages/HomePage.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { SignupPage } from '../../pages/SignupPage.js';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { WishlistPage } from '../../pages/WishlistPage.js';
import { OrdersPage } from '../../pages/OrdersPage.js';
import { ProfilePage } from '../../pages/ProfilePage.js';

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (e) {
    console.error('Error decoding token:', e);
    return true;
  }
}

function router() {
  const token = localStorage.getItem('token');

  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
    alert('Your session has expired. Please log in again.');
    history.pushState(null, '', '/login');
    window.dispatchEvent(new Event('popstate'));
    return;
  }

  const path = window.location.pathname;
  const app = document.getElementById('app');

  if (path === '/' || path === '/index.html') {
    HomePage(app);
  } else if (path === '/login') {
    LoginPage(app);
  } else if (path === '/signup') {
    SignupPage(app);
  } else if (path.startsWith('/product')) {
    ProductDetailsPage(app);
  } else if (path === '/cart') {
    CartPage(app);
  } else if (path === '/wishlist') {
    WishlistPage(app);
  } else if (path === '/orders') {
    OrdersPage(app);
  } else if (path === '/profile') {
    ProfilePage(app);
  } else {
    app.innerHTML = `<h1>404 - Page Not Found</h1>`;
  }
}

window.addEventListener('popstate', router);
router();
