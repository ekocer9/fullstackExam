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
      ordersContainer.innerHTML = `
      <div class="empty-cart-message">
        <p>You have no orders yet 📦</p>
      </div>
    `;    
    } else {
      orders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order-item';
      
        let itemsHTML = '';
        if (order.items && order.items.length) {
          order.items.forEach(item => {
            itemsHTML += `
              <div class="order-item-detail" style="margin: 1rem 0; border-top: 1px solid #eee; padding-top: 1rem;">
                <p><strong>${item.name}</strong></p>
                <p>Size: ${item.size}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price per item: ${item.price} DKK</p>
                ${item.custom_name ? `<p>Name: ${item.custom_name}</p>` : ''}
                ${item.custom_number ? `<p>Number: ${item.custom_number}</p>` : ''}
              </div>
            `;
          });
        }
      
        div.innerHTML = `
          <h3>Order #${order.id}</h3>
          <p>Total Price: ${order.total_price} DKK</p>
          <p>Ordered At: ${new Date(order.created_at).toLocaleString()}</p>
          ${itemsHTML}
        `;
      
        ordersContainer.appendChild(div);
      });      
    }

  } catch (error) {
    console.error('Failed to load orders', error);
    ordersContainer.innerHTML = '<p>Failed to load orders.</p>';
  }
}
