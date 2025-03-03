// Current Year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    const mobileNav = document.querySelector('.mobile-nav');
    mobileNav.classList.toggle('hidden');
    
    const icon = this.querySelector('i');
    if (mobileNav.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

// Dark Mode Toggle
const themeToggleBtn = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or use user's system preference
if (localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
    updateThemeIcon(true);
} else {
    htmlElement.classList.remove('dark');
    updateThemeIcon(false);
}

themeToggleBtn.addEventListener('click', function() {
    const isDarkMode = htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon(isDarkMode);
});

function updateThemeIcon(isDarkMode) {
    const icon = themeToggleBtn.querySelector('i');
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Shopping Cart Functionality
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
updateCartCount();

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Add to cart function
function addToCart(item) {
    const existingItem = cartItems.find(i => 
        i.id === item.id && i.size === item.size
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({...item, quantity: 1});
    }
    
    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count
    updateCartCount();
    
    // Show feedback
    showAddedToCartMessage(item.name);
}

// Remove from cart function
function removeFromCart(itemId, size) {
    cartItems = cartItems.filter(item => !(item.id === itemId && item.size === size));
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
}

// Update quantity function
function updateQuantity(itemId, size, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId, size);
        return;
    }
    
    const itemIndex = cartItems.findIndex(item => item.id === itemId && item.size === size);
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
    }
}

// Calculate total
function calculateTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Show "Added to Cart" message
function showAddedToCartMessage(itemName) {
    // Create message element if it doesn't exist
    let messageEl = document.getElementById('cart-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'cart-message';
        messageEl.style.position = 'fixed';
        messageEl.style.bottom = '20px';
        messageEl.style.right = '20px';
        messageEl.style.padding = '15px 20px';
        messageEl.style.backgroundColor = '#10b981';
        messageEl.style.color = 'white';
        messageEl.style.borderRadius = '5px';
        messageEl.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.3s';
        messageEl.style.zIndex = '1000';
        document.body.appendChild(messageEl);
    }
    
    // Update message content and show
    messageEl.textContent = `${itemName} added to cart`;
    messageEl.style.opacity = '1';
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
    }, 3000);
}
