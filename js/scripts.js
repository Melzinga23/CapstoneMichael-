const baseUrl = "http://localhost:3000";
const cartItems = [];

document.addEventListener("DOMContentLoaded", async () => {
  async function loadCategories() {
    const categoriesContainer = document.getElementById("categories-container");
    try {
      const response = await fetch(`${baseUrl}/api/categories`);
      const categories = await response.json();
      categoriesContainer.innerHTML =
        '<li><a class="dropdown-item" href="#!">All Products</a></li><li><hr class="dropdown-divider" /></li>';
      categories.forEach((category) => {
        const categoryItem = document.createElement("li");
        categoryItem.innerHTML = `<a class="dropdown-item" data-category="${category.category_id}" href="#!">${category.name}</a>`;
        categoriesContainer.appendChild(categoryItem);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  //get products by category on selecting a product category frm the dropdown
  document
    .getElementById("categories-container")
    .addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        const category = event.target.dataset.category || "";
        loadProducts(category);
      }
    });

  async function loadProduct(productId) {
    try {
      const response = await fetch(`${baseUrl}/api/headphones/${productId}`);
      const product = await response.json();
      const productContainer = document.getElementById("product-container");
      productContainer.innerHTML = `
      <!-- Product section-->
      <section class="py-5">
        <div class="container px-4 px-lg-5 my-5">
          <div class="row gx-4 gx-lg-5 align-items-center">
            <div class="col-md-6">
              <img
                class="card-img-top mb-5 mb-md-0"
                src="/assets/images/${product.image_url}"
                alt="..."
              />
            </div>
            <div class="col-md-6">
              <div class="small mb-1">SKU: ${product.category} ${product.product_id}</div>
              <h1 class="display-5 fw-bolder">${product.name}</h1>
              <div class="d-flex justify-content-center small text-warning mb-2">

            </div>
              <div class="fs-5 mb-5">
                <span>&pound; $${product.price}</span>
              </div>
              <p class="lead">${product.description}</p>
              <div class="d-flex">
                <input
                  class="form-control text-center me-3"
                  id="product.quantity"
                  type="number"
                  value="1"
                  max="100"
                  min="1"
                  style="max-width: 4rem"
                />
                <button data-product-id="${product.product_id}"
                  class="btn btn-outline-dark flex-shrink-0"
                  type="button"
                >
                  <i class="bi-cart-fill me-1"></i>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Related items section-->
        <section class="py-5 bg-light">
        <div class="container px-4 px-lg-5 mt-5">
            <h2 class="fw-bolder mb-4">Related products</h2>
            <div id="related-products-container"
            class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            <!-- Related products will be injected here by JavaScript -->
            </div>
        </div>
        </section>    
        `;

      const relatedProductsContainer = document.getElementById(
        "related-products-container"
      );

      try {
        const relatedProducts = await fetchRelatedProducts(); // Fetch related products data
        relatedProducts.slice(0, 4).forEach((product) => {
          // Limit to 4 products
          const productHtml = `
              <div class="col mb-5 product">
                <a href="/product.html/${product.product_id}">
                  <div class="card h-100">
                    <!-- Product image-->
                    <img class="card-img-top product-image" src="/assets/images/${product.image_url}" alt="...">
                    <!-- Product details-->
                    <div class="card-body p-4">
                      <div class="text-center">
                        <h5 class="fw-bolder">${product.name}</h5>
                        $${product.price}
                      </div>
                    </div>
                    <!-- Product actions-->
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                      <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#" data-product-id=${product.product_id}>Add to cart</a></div>
                    </div>
                  </div>
                </a>
              </div>
            `;
          relatedProductsContainer.innerHTML += productHtml; // Append the product card to the container
        });
      } catch (error) {
        console.error("Error fetching related products:", error);
        relatedProductsContainer.innerHTML =
          "<p>Error loading related products.</p>"; // Error handling
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  async function loadProducts(category = "") {
    const productsContainer = document.getElementById("products-container");
    try {
      let response = await fetch(`${baseUrl}/api/headphones`);
      if (category) {
        response = await fetch(
          `${baseUrl}/api/headphones/category/${category}`
        );
      }

      const products = await response.json();
      productsContainer.innerHTML = "";
      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "col mb-5";
        productDiv.innerHTML = `
            <div class="card h-100">
            <a href="/product.html?id=${product.product_id}">
              <div class="card-header">
                <h6 class="card-title">${product.name}</h6>
              </div>
            </a>
            <a href="/product.html?id=${product.product_id}" title="View product">
              <img class="card-img-top product-image" src="/assets/images/${product.image_url}" alt="${product.brand}">
              </a>
              <div class="card-body p-4">
                <div class="text-center">
                  <h5 class="fw-bolder">$${product.price}</h5>
                  <p>Stock: ${product.stock_quantity}</p>
                  <a class="btn btn-outline-dark mt-auto" href="#" data-product-id="${product.product_id}">Add to cart</a>
                </div>
              </div>
            </div>
          `;
        productsContainer.appendChild(productDiv);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  loadCategories();
  updateAuthLinks();

  if (window.location.search) {
    const productId = window.location.search.split("=")[1];
    loadProduct(productId);
    document
      .getElementById("product-container")
      .addEventListener("click", (event) => {
        if (event.target.dataset.productId) {
          addToCart(event.target.dataset.productId);
        }
      });
  } else {
    loadProducts();
    document
      .getElementById("products-container")
      .addEventListener("click", (event) => {
        if (event.target.dataset.productId) {
          addToCart(event.target.dataset.productId);
        }
      });
  }
});

function updateAuthLinks() {
  const authLinks = document.getElementById("auth-links");
  const isLoggedIn = checkLoginStatus();

  if (isLoggedIn) {
    const username = localStorage.getItem("username");
    authLinks.innerHTML = `
        <span class="nav-link">
          Logged in as <strong>${username}</strong>
        </span>
        <a class="nav-link" href="#" onclick="logout()">Logout</a>
      `;
  } else {
    authLinks.innerHTML = `
        <span class="nav-link">
          <a href="#!/login">Login</a> or <a href="#!/register">Register</a>
        </span>
      `;
  }
}

function checkLoginStatus() {
  return !!localStorage.getItem("userToken");
}

function logout() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("username");
  updateAuthLinks();
  alert("You have been logged out.");
}

function addToCart(productId) {
  console.log("Adding product to cart with ID:", productId);
  fetch(`${baseUrl}/api/headphones/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      console.log("Product details:", product);
      const found = cartItems.find((item) => item.product_id == productId);
      if (found) {
        found.quantity += 1;
      } else {
        product.quantity = 1;
        cartItems.push(product);
      }
      //updateCartDisplay();
      updateCartTotal();
      updateCartCount();
    })
    .catch((error) => console.error("Failed to fetch product details:", error));
}

async function login() {
  const response = await fetch(`${baseUrl}/login`);
  const userToken = await response.json();
  localStorage.setItem("userToken", userToken);
  updateAuthLinks();
  alert("You have been logged in.");
}

function updateCartDisplay() {
  const cartDisplay = document.getElementById("cart-display");
  cartDisplay.innerHTML = cartItems
    .map((item) => `<li>${item.brand} - $${item.price} x ${item.quantity}</li>`)
    .join("");
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.innerHTML = totalItems;
}

async function fetchRelatedProducts() {
  const response = await fetch(`${baseUrl}/api/headphones`);
  return await response.json();
}

function updateCartTotal() {
  const cartTotal = document.getElementById("cart-total");
  cartTotal.classList.remove("visually-hidden");
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  cartTotal.innerHTML = `Total: <strong>$${total.toFixed(2)}</strong>`;
}
