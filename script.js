// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('tastyCart')) || [];

// DOM Elements
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const totalAmount = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const cartCount = document.querySelector('.cart-count');

// Update cart count in navigation
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    
    // Show or hide the cart count
    if (totalItems > 0) {
      cartCount.style.display = 'inline-flex';
    } else {
      cartCount.style.display = 'none';
    }
  }
}

// Function to add item to cart
function addToCart(name, price) {
  // Check if item already in cart
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }
  
  // Save to localStorage
  localStorage.setItem('tastyCart', JSON.stringify(cart));
  
  // Update cart count and display
  updateCartCount();
  
  // Show success message
  showMessage(`${name} added to cart!`);
  
  // Update cart display if on cart page
  if (cartItems) {
    updateCartDisplay();
  }
}

// Function to update cart display
function updateCartDisplay() {
  // Clear current cart display
  if (!cartItems) return;
  
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
    if (cartTotal) cartTotal.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }
  
  // Add each cart item to display
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
      <div class="cart-item-name">${item.name} x${item.quantity}</div>
      <div class="cart-item-price">G$${(item.price * item.quantity).toLocaleString()}</div>
      <button class="remove-item" data-name="${item.name}">Remove</button>
    `;
    
    cartItems.appendChild(cartItem);
  });
  
  // Add event listeners to all "Remove" buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      removeFromCart(name);
    });
  });
  
  // Calculate and display total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (totalAmount) totalAmount.textContent = `G$${total.toLocaleString()}`;
  
  // Show total and checkout button
  if (cartTotal) cartTotal.style.display = 'flex';
  if (checkoutBtn) checkoutBtn.style.display = 'block';
}

// Function to remove item from cart
function removeFromCart(name) {
  const itemIndex = cart.findIndex(item => item.name === name);
  
  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    
    // Save to localStorage
    localStorage.setItem('tastyCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Update cart display if on cart page
    if (cartItems) {
      updateCartDisplay();
    }
  }
}

// Function to clear cart
function clearCart() {
  cart = [];
  localStorage.setItem('tastyCart', JSON.stringify(cart));
  updateCartCount();
  
  // Update cart display if on cart page
  if (cartItems) {
    updateCartDisplay();
  }
}

// Display temporary message
function showMessage(message, isError = false) {
  // Create message element if it doesn't exist
  let messageEl = document.getElementById('message-popup');
  
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.id = 'message-popup';
    messageEl.style.position = 'fixed';
    messageEl.style.top = '20px';
    messageEl.style.right = '20px';
    messageEl.style.padding = '10px 20px';
    messageEl.style.borderRadius = '4px';
    messageEl.style.zIndex = '1000';
    messageEl.style.fontWeight = 'bold';
    messageEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    document.body.appendChild(messageEl);
  }
  
  // Set message style based on type
  if (isError) {
    messageEl.style.backgroundColor = '#FF5555';
    messageEl.style.color = 'white';
  } else {
    messageEl.style.backgroundColor = '#4CAF50';
    messageEl.style.color = 'white';
  }
  
  // Set message text
  messageEl.textContent = message;
  
  // Show the message
  messageEl.style.display = 'block';
  
  // Hide after 3 seconds
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

// Add event listeners to all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart count
  updateCartCount();
  
  // Add to cart buttons (menu page)
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        addToCart(name, price);
      });
    });
  }
  
  // Update cart display (cart page)
  if (cartItems) {
    updateCartDisplay();
  }
  
  // Payment Modal
  const modal = document.querySelector('.modal');
  const closeModal = document.querySelector('.close-modal');
  
  if (modal && closeModal) {
    const checkoutButton = document.querySelector('.checkout-btn');
    const paymentForm = document.querySelector('.payment-form');
    const amountInput = document.getElementById('amount');
    
    // Open modal when checkout button is clicked
    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        amountInput.value = `G$${total.toLocaleString()}`;
        modal.style.display = 'flex';
      });
    }
    
    // Close modal when close button is clicked
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Handle payment form submission
    if (paymentForm) {
      paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // In a real application, you would integrate with M.M.G. API here
        showMessage('Payment processed successfully! Your order is on the way.');
        
        // Clear cart and close modal
        clearCart();
        modal.style.display = 'none';
      });
    }
  }
  
  // Smooth scrolling for navigation
  document.querySelectorAll('nav a').forEach(anchor => {
    // Only apply to hash links (internal page links)
    if (anchor.getAttribute('href').startsWith('#')) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    }
  });
});