import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { apiGet } from '../js/api.js';

export async function OrdersPage(app) {
  const token = localStorage.getItem('token');
  if (!token) {
    app.innerHTML = '<h1>You must be logged in to view your orders</h1>';
    return;
  }

  app.innerHTML = `
    ${Navbar()}
    <h1>My Orders</h1>
    <div id="ordersContainer"></div>
    ${Footer()}
  `;

  const ordersContainer = document.getElementById('ordersContainer');

  try {
    const orders = await apiGet('/api/orders', token);

    if (orders.length === 0) {
      ordersContainer.innerHTML = '<p>You have no orders yet.</p>';
    } else {
      orders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
          <h3>Order #${order.id}</h3>
          <p>Total Price: ${order.total_price} DKK</p>
          <p>Ordered At: ${new Date(order.created_at).toLocaleString()}</p>
        `;
        ordersContainer.appendChild(div);
      });
    }

  } catch (error) {
    console.error('Failed to load orders', error);
    ordersContainer.innerHTML = '<p>Failed to load orders.</p>';
  }
}
