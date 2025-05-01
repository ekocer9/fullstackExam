import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { apiGet, apiPost } from '../js/api.js';

export async function ProductDetailsPage(app) {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    app.innerHTML = '<h1>Invalid product</h1>';
    return;
  }

  try {
    const product = await apiGet(`/api/products/${productId}`);

    app.innerHTML = `
      ${Navbar()}
      <div class="product-detail">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>${product.price} DKK</strong></p>

        <button id="addToCart">Add to Cart</button>
        <button id="addToWishlist">Add to Wishlist</button>

        <h3>Reviews</h3>
        <div id="reviewSection">
          ${product.reviews.length === 0 ? '<p>No reviews yet.</p>' : ''}
          ${product.reviews.map(r => `
            <div class="review">
              <strong>${r.email}</strong> ⭐️${r.rating}
              <p>${r.comment}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ${Footer()}
    `;

    // Button event listeners
    document.getElementById('addToCart').addEventListener('click', async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        const cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const existing = cart.find(item => item.productId === product.id);

        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ productId: product.id, quantity: 1 });
        }

        localStorage.setItem('guestCart', JSON.stringify(cart));
        alert('Added to cart as guest');
        return;
      }

      // Logged-in cart
      await apiPost('/api/cart', { productId: product.id, quantity: 1 }, token);
      alert('Added to cart!');
    });

    document.getElementById('addToWishlist').addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      if (!token) return alert('Login required');
      await apiPost('/api/wishlist', { productId: product.id }, token);
      alert('Added to wishlist!');
    });

  } catch (error) {
    console.error('Error loading product', error);
    app.innerHTML = '<h1>Failed to load product</h1>';
  }
}
