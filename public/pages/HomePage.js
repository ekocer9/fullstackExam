import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";
import { apiGet, apiPost } from "../js/api.js";


export async function HomePage(app) {
  app.innerHTML = `
    ${Navbar()}
    <h1>Welcome to Fullstacked Shop</h1>
    <section class="carousel-container">
      <div class="carousel">
        <img id="carouselImage" src="./images/football1.jpeg" alt="Slide" />
      </div>
    </section>
    <p style="text-align: center;">Browse our latest jerseys below.</p>
    <div class="products-grid" id="productList"></div>
    ${Footer()}
  `;

  const images = [
    "/images/football1.jpeg",
    "/images/football2.jpeg",
    "/images/football3.jpeg",
    "/images/football4.jpeg"
  ];
  let currentIndex = 0;
  
  const intervalId = setInterval(() => {
    const img = document.getElementById("carouselImage");
    if (img) {
      currentIndex = (currentIndex + 1) % images.length;
      img.src = images[currentIndex];
    } else {
      clearInterval(intervalId); 
    }
  }, 4000);  

  const productList = document.getElementById("productList");

  try {
    const products = await apiGet("/api/products");

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image || '/images/default.jpg'}" alt="${product.name}" 
             class="product-card-img" 
             onclick="navigateToProduct(${product.id})" />
    
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>${product.price} DKK</strong></p>
        <p>${product.team}</p>
    
        <button onclick="navigateToProduct(${product.id})">View Product</button>
      `;
      productList.appendChild(card);
    });    
  } catch (error) {
    productList.innerHTML = `<p>Failed to load products.</p>`;
    console.error("Error loading products:", error);
  }

window.navigateToProduct = function (productId) {
  history.pushState(null, "", `/product?id=${productId}`);
  window.dispatchEvent(new Event("popstate"));
};

}