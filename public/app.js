document.addEventListener('DOMContentLoaded', async function() {
    try {
        const productContainer = document.querySelector('.product-list');

        if (!productContainer) {
            throw new Error('Product container not found in the DOM');
        }

        // Fetch products from your server (adjust URL as per your setup)
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();

        // Loop through each product and create a card with options
        products.forEach(product => {
            // Create product card container
            const card = document.createElement('div');
            card.classList.add('product-card');

            // Create clickable link to product details page
            const link = document.createElement('a');
            link.href = `/productdetails?id=${product._id}`; // Link to product details page
            link.classList.add('product-link');

            // Create image element
            const image = document.createElement('img');
            image.src = product.imageUrl;
            image.alt = product.name;

            // Create product name element
            const productName = document.createElement('h3');
            productName.textContent = product.name;

            // Create price element
            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = `₹${product.price.toFixed(2)}`; // Format price as needed

            // Append elements to link
            link.appendChild(image);
            link.appendChild(productName);
            link.appendChild(price);

            // Append link to card
            card.appendChild(link);

            // Create quantity input and add to cart button
            const quantityLabel = document.createElement('label');
            quantityLabel.textContent = 'Quantity:';
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = 1;
            quantityInput.value = 1;
            quantityInput.classList.add('quantity-input');

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Add to Cart';
            addToCartButton.classList.add('add-to-cart-button');
            addToCartButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent form submission

                const quantity = parseInt(quantityInput.value);
                if (quantity > 0) {
                    addToCart(product._id, quantity); // Call function to add to cart
                } else {
                    alert('Please enter a valid quantity.');
                }
            });

            // Append quantity input and add to cart button to card
            card.appendChild(quantityLabel);
            card.appendChild(quantityInput);
            card.appendChild(addToCartButton);

            // Append card to product container
            productContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        // Optionally, display an error message to the user
    }
});


// Function to add product to cart
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch('cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization headers if required
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
            throw new Error('Failed to add product to cart');
        }

        const product = await response.json();
        console.log('Product added to cart:', product);

        // Optional: Update the UI to reflect the added product (e.g., display in cart table)
        updateCartUI(product);
        
        // Optionally, you can display a success message to the user
        alert('Product added to cart successfully!');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again later.');
    }
}

// Function to update UI with added product (example implementation)
function updateCartUI(product) {
    const cartTable = document.getElementById('cartTable');
    if (!cartTable) return;

    const row = document.createElement('tr');

    const imageCell = document.createElement('td');
    const image = document.createElement('img');
    image.src = product.imageUrl; // Assuming product object has 'imageUrl' property
    image.alt = product.name;
    image.classList.add('cart-product-image');
    imageCell.appendChild(image);

    const nameCell = document.createElement('td');
    nameCell.textContent = product.name;

    const priceCell = document.createElement('td');
    priceCell.textContent = `$${product.price.toFixed(2)}`;

    const quantityCell = document.createElement('td');
    quantityCell.textContent = product.quantity;

    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(quantityCell);

    cartTable.appendChild(row);
}



document.addEventListener('DOMContentLoaded', async function() {
    const productContainer = document.getElementById('productContainer');

    try {
        // Fetch products from backend (assuming JSON format)
        const response = await fetch('/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();

        // Generate HTML for each product card
        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');

            // Create a clickable link for each product card
            const link = document.createElement('a');
            link.href = `/productdetails?id=${product._id}`; // Adjust URL path based on server-side routing
            link.classList.add('product-link');

            const image = document.createElement('img');
            image.src = product.imageUrl;
            image.alt = product.name;

            const productName = document.createElement('h3');
            productName.textContent = product.name;

            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = `Price: $${product.price.toFixed(2)}`;

            // Append elements to the link
            link.appendChild(image);
            link.appendChild(productName);
            link.appendChild(price);
            
            // Append the link to the card and the card to the product container
            card.appendChild(link);
            productContainer.appendChild(card);

            // Event listener to handle redirection
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                window.location.href = this.href; // Redirect to product details page
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        // Optionally handle error display
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const searchInput = document.getElementById('searchInput').value.trim();
        if (searchInput === '') {
            return; // Do nothing if search input is empty
        }

        try {
            const response = await fetch('http://localhost:5000/products/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchQuery: searchInput })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const products = await response.json();

            // Store products in sessionStorage to access on searchResults.html
            sessionStorage.setItem('searchResults', JSON.stringify(products));

            // Navigate to searchResults.html
            window.location.href = '/search';
        } catch (error) {
            console.error('Error fetching products:', error);
            // Optionally, display an error message to the user
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.querySelector('nav ul li a[href="/cart"]');
    if (cartLink) {
        cartLink.addEventListener('click', function(event) {
            event.preventDefault();
            fetchCartItems(); // Fetch cart items when Cart link is clicked
            window.location.href = '/cart'; // Redirect to cart.html page
        });
    }

    // Event listener for buy button in modal
    const buyButton = document.getElementById('modalBuyButton');
    if (buyButton) {
        buyButton.addEventListener('click', async function() {
            const quantityInput = document.getElementById('modalQuantityInput');
            const quantity = parseInt(quantityInput.value);
            const productId = modal.dataset.productId;

            if (quantity > 0) {
                if (!loggedInUser) {
                    alert('Please login first to buy.');
                    return;
                }

                try {
                    const response = await fetch('/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${loggedInUser.token}`
                        },
                        body: JSON.stringify({ productId, quantity })
                    });

                    if (!response.ok) {
                        const errorMessage = await response.json();
                        throw new Error(errorMessage.message || 'Failed to add to cart');
                    }

                    console.log(`Added ${quantity} of ${selectedProduct.name} to cart.`);
                    alert('Product added to cart successfully!');
                    modal.style.display = 'none'; // Close modal after adding to cart
                    fetchCartItems(); // Refresh cart items after adding to cart
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Failed to add product to cart. Please try again later.');
                }
            } else {
                alert('Please enter a valid quantity.');
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', async function() {
    try {

        const productId = getProductIdFromUrl();
        

        const response = await fetch(`/products/productdetails/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }

        const product = await response.json();
        console.log('Fetched Product:', product);

        // Update DOM with product details
        const productImage = document.getElementById('productImage');
        const productName = document.getElementById('productName');
        const productPrice = document.getElementById('productPrice');
        const productDescription = document.getElementById('productDescription');

        productImage.src = product.imageUrl;
        productName.textContent = product.name;
        productPrice.textContent = `₹${product.price.toFixed(2)}`;
        productDescription.textContent = product.description;

    } catch (error) {
        console.error('Error fetching product details:', error);
        // Handle error display or recovery
    }
});

function getProductIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}
async function login(username, password) {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData)); // Save user data in localStorage
        location.reload(); // Refresh the page to reflect login state
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}
   // Function to fetch cart items from server
   async function fetchCartItems() {
    try {
        const response = await fetch('http://localhost:5000/cart/cartItems');
        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }
        const cartItems = await response.json(); // Parse JSON response

        const cartTable = document.getElementById('cart-items');
        cartTable.innerHTML = ''; // Clear existing table rows

        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productId.name}</td>
                <td>₹${item.productId.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
            `;
            cartTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        // Optionally, display an error message to the user
    }
}
function buyItem(itemId) {
    // Logic to buy the item, e.g., redirect to checkout or perform purchase action
    console.log('Buying item:', itemId);
    // Example: window.location.href = `/checkout/${itemId}`;
}

function removeItem(itemId) {
    // Logic to remove the item from cart, e.g., make a DELETE request to backend
    console.log('Removing item:', itemId);
    // Example using fetch API:
    fetch(`/cart/remove/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove item from cart');
        }
        // Optionally update UI after successful removal
        // Example: document.getElementById(itemId).remove();
    })
    .catch(error => {
        console.error('Error removing item:', error);
        // Optionally display error message to user
    });
}/*
// Function to search products by category
function searchByCategory(category) {
    fetch(`/shop/category/${category}`)
        .then(response => response.json())
        .then(products => {
            displayProducts(products); // Example function to display products
        })
        .catch(error => console.error('Error fetching products by category:', error));
}

// Function to filter products by price range
function filterByPrice(minPrice, maxPrice) {
    fetch(`/shop/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`)
        .then(response => response.json())
        .then(products => {
            displayProducts(products); // Example function to display products
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
*/
// Example function to display products (replace with actual UI update logic)
function displayProducts(products) {
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
}

// Function to close sidebar
// Function to handle search form submission
function searchProducts(event) {
    event.preventDefault(); // Prevent form submission

    const searchInput = document.getElementById('searchInput').value;
    // Implement search functionality if needed
    console.log('Search term:', searchInput);
}

// Function to redirect to sidebar page and search by category
function searchByCategory(category) {
    // Redirect to sidebar page with category parameter
    window.location.href = `/sidebar?category=${category}`;
}

// Function to filter products by price range
function filterByPrice(minPrice, maxPrice) {
    fetch(`/shop/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`)
        .then(response => response.json())
        .then(products => {
            displayProducts(products); // Update UI with filtered products
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


function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
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
function fetchProductsByCategory(category) {
    fetch(`shop/sidebar?category=${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No products found for this category');
            }
            return response.json();
        })
        .then(products => {
            if (products.length === 0) {
                // Handle case when no products are found
                const productList = document.querySelector('.product-list');
                productList.innerHTML = '<p>No products found for this category.</p>';
            } else {
                // Update UI with products
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
            }
        })
        .catch(error => {
            console.error('Error fetching products by category:', error);
            // Handle error scenario, e.g., display error message
        });
}
// Assuming you have a form with id="btn" and a button with id=""

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn');
    //const  = document.getElementById('');

    if (btn ) {
        btn.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            try {
                const itemId = btn.dataset.itemId; // Get itemId from dataset or hidden input

                // Fetch CSRF token if you have CSRF protection enabled
                const csrfToken = ''; // Replace with your method to fetch CSRF token

                // Send POST request to /checkout/:itemId endpoint
                const response = await fetch(`/checkout/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken // Include CSRF token if needed
                    },
                    body: JSON.stringify({}) // Optionally pass any data if required
                });

                if (!response.ok) {
                    throw new Error('Failed to place order');
                }

                const data = await response.json();
                console.log('Order placed successfully:', data);

                // Redirect to a confirmation page or update UI as needed
                window.location.href = `/home`; // Example: redirect to order confirmation page

            } catch (error) {
                console.error('Error placing order:', error);
                // Handle error (e.g., display error message to the user)
            }
        });
    }
});