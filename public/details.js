// scripts_detail.js
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const productId = getProductIdFromUrl(); 

        const response = await fetch(`/products/${productId}`); // Backend API endpoint for fetching product details

        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const product = await response.json();

        // Update HTML elements with product details
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productImage').src = product.imageUrl;
        document.getElementById('productImage').alt = product.name;
        document.getElementById('productPrice').textContent = `Price: $${product.price.toFixed(2)}`;
        document.getElementById('productDescription').textContent = product.description;
    } catch (error) {
        console.error('Error fetching product details:', error);
        // Optionally handle error display (e.g., show a message to the user)
    }
});

function getProductIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

// Function to search products by category
function searchByCategory(category) {
    fetch(`/shop/category/${category}`)
        .then(response => response.json())
        .then(products => {
            // Handle products received from backend (update UI, etc.)
            const productList = document.querySelector('.product-list');
            productList.innerHTML = ''; // Clear previous products
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price}</p>
                    <button class="add-to-cart-button">Add to Cart</button>
                `;
                productList.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error fetching products by category:', error));
}

// Function to filter products by price range
function filterByPrice(minPrice, maxPrice) {
    fetch(`/shop/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`)
        .then(response => response.json())
        .then(products => {
            // Handle filtered products (update UI, etc.)
            const productList = document.querySelector('.product-list');
            productList.innerHTML = ''; // Clear previous products
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price}</p>
                    <button class="add-to-cart-button">Add to Cart</button>
                `;
                productList.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error filtering products by price:', error));
}

// Function to handle form submission for price filter
function filterProducts(event) {
    event.preventDefault(); // Prevent form submission

    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    filterByPrice(minPrice, maxPrice);
}

// Function to handle search form submission
function searchProducts(event) {
    event.preventDefault(); // Prevent form submission

    const searchInput = document.getElementById('searchInput').value;
    // Implement search functionality if needed
    console.log('Search term:', searchInput);
}

// Function to toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Function to close sidebar
function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('open');
}
