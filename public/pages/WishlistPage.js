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
      wishlistContainer.innerHTML = `
      <div class="empty-cart-message">
        <p>Your wishlist is empty ❤️</p>
      </div>
    `;    
    } else {
      wishlistItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'wishlist-item';
        div.innerHTML = `
          <div class="cart-item-inner">
            <img src="${item.image || '/images/default.jpg'}" alt="${item.name}" class="cart-item-image" />
            <div class="cart-item-details">
              <h3>${item.name}</h3>
              <p><strong>Size:</strong> ${item.size || 'N/A'}</p>
              ${item.custom_name ? `<p><strong>Name:</strong> ${item.custom_name}</p>` : ""}
              ${item.custom_number ? `<p><strong>Number:</strong> ${item.custom_number}</p>` : ""}
              <p><strong>Price:</strong> ${item.price} DKK</p>

              <button class="btn-primary" onclick="addToCartFromWishlist(${item.id}, '${item.size}', '${item.custom_name || ""}', '${item.custom_number || ""}')">Add to Cart</button>
              <button class="remove-btn" onclick="removeFromWishlist(${item.wishlistItemId})">Remove</button>
            </div>
          </div>
        `;
        wishlistContainer.appendChild(div);
      });
    }

  } catch (error) {
    console.error('Failed to load wishlist', error);
    wishlistContainer.innerHTML = '<p>Failed to load wishlist items.</p>';
  }
}

window.addToCartFromWishlist = async function(productId, size, name, number) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  try {
    await apiPost("/api/cart", {
      productId,
      quantity: 1,
      size,
      name: name || null,
      number: number || null
    }, token);
    alert("Added to cart from wishlist!");
  } catch (error) {
    console.error("Failed to add from wishlist:", error);
    alert("Failed to add to cart. Please try again.");
  }
};

window.removeFromWishlist = async function(wishlistItemId) {
  const token = localStorage.getItem('token');
  if (!token) return alert('Login required');
  await apiDelete(`/api/wishlist/${wishlistItemId}`, token);
  alert('Item removed from wishlist');
  window.location.reload();
};
