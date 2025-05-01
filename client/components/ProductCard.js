export function ProductCard(product) {
    return `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>${product.price} DKK</strong></p>
        <button onclick="viewProduct(${product.id})">View</button>
      </div>
    `;
  }
  
  window.viewProduct = function(productId) {
    history.pushState(null, '', `/product?id=${productId}`);
    window.dispatchEvent(new Event('popstate'));
  }
  