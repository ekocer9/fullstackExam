export function Navbar() {
  const token = localStorage.getItem('token');

  return `
    <nav>
      <a href="/" onclick="navigate(event)">Home</a>
      <a href="/cart" onclick="navigate(event)">Cart</a>
      ${token ? `
        <a href="/wishlist" onclick="navigate(event)">Wishlist</a>
        <a href="/orders" onclick="navigate(event)">Orders</a>
        <a href="/profile" onclick="navigate(event)">Profile</a>
        <a href="/" onclick="logout(); event.preventDefault();">Logout</a>
      ` : `
        <a href="/login" onclick="navigate(event)">Login</a>
        <a href="/signup" onclick="navigate(event)">Signup</a>
      `}
    </nav>
  `;
}

window.navigate = function (event) {
  event.preventDefault();
  history.pushState(null, '', event.target.href);
  window.dispatchEvent(new Event('popstate'));
}

window.logout = async function () {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const cartItems = await fetch('http://localhost:3000/api/cart', {
        headers: { Authorization: 'Bearer ' + token }
      }).then(res => res.ok ? res.json() : []);

      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart before logout', err);
    }
  }

  localStorage.removeItem('token');
  localStorage.removeItem("guestCart"); 

  await fetch('http://localhost:3000/api/cart/clear', {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token }
  }).catch(console.error);

  alert('You have been logged out.');
  history.pushState(null, '', '/');
  window.dispatchEvent(new Event('popstate'));
};



window.refreshNavbar = function () {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.outerHTML = Navbar();
  }
};
