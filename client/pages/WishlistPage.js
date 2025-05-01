import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { apiGet, apiPost, apiDelete } from '../js/api.js';

export async function WishlistPage(app) {
  const token = localStorage.getItem('token');
  if (!token) {
    app.innerHTML = '<h1>You must be logged in to view your wishlist</h1>';
    return;
  }

  app.innerHTML = `
    ${Navbar()}
    <h1>My Wishlist</h1>
    <div id="wishlistItems"></div>
    ${Footer()}
  `;

  const wishlistContainer = document.getElementById('wishlistItems');

  try {
    const wishlistItems = await apiGet('/api/wishlist', token);

    if (wishlistItems.length === 0) {
      wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
    } else {
      wishlistItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'wishlist-item';
        div.innerHTML = `
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p>Price: ${item.price} DKK</p>
          <button onclick="addToCartFromWishlist(${item.id})">Add to Cart</button>
          <button onclick="removeFromWishlist(${item.wishlistItemId})">Remove</button>
        `;
        wishlistContainer.appendChild(div);
      });
    }

  } catch (error) {
    console.error('Failed to load wishlist', error);
    wishlistContainer.innerHTML = '<p>Failed to load wishlist items.</p>';
  }
}

window.addToCartFromWishlist = async function(productId) {
  const token = localStorage.getItem('token');
  if (!token) return alert('Login required');
  await apiPost('/api/cart', { productId: productId, quantity: 1 }, token);
  alert('Added to cart!');
}

window.removeFromWishlist = async function(wishlistItemId) {
  const token = localStorage.getItem('token');
  if (!token) return alert('Login required');
  await apiDelete(`/api/wishlist/${wishlistItemId}`, token);
  alert('Item removed from wishlist');
  window.location.reload();
}
