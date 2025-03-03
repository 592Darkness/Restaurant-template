document.addEventListener('DOMContentLoaded', function() {
    // Checkout state
    const checkoutState = {
        step: 'cart',
        customerInfo: {
            name: '',
            phone: '',
            email: '',
            address: ''
        },
        deliveryOption: 'pickup',
        formErrors: {},
        orderPlaced: false
    };
    
    // Initialize checkout page
    initCheckoutPage();
    
    function initCheckoutPage() {
        renderCartStep();
        
        // Set up event listeners
        document.addEventListener('click', function(e) {
            // Proceed to checkout button
            if (e.target.id === 'proceed-to-checkout') {
                if (cartItems.length > 0) {
                    checkoutState.step = 'delivery';
                    updateCheckoutProgress();
                    renderDeliveryStep();
                }
            }
            
            // Continue shopping button
            if (e.target.id === 'continue-shopping') {
                window.location.href = 'menu.html';
            }
            
            // Back to cart button
            if (e.target.id === 'back-to-cart') {
                checkoutState.step = 'cart';
                updateCheckoutProgress();
                renderCartStep();
            }
            
            // Continue to payment button
            if (e.target.id === 'continue-to-payment') {
                const errors = validateDeliveryForm();
                checkoutState.formErrors = errors;
                
                if (Object.keys(errors).length === 0) {
                    checkoutState.step = 'payment';
                    updateCheckoutProgress();
                    renderPaymentStep();
                } else {
                    renderDeliveryStep(); // Re-render with errors
                    
                    // Scroll to first error
                    const firstErrorField = document.querySelector('.error-message[style*="block"]');
                    if (firstErrorField) {
                        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
            
            // Complete payment button
            if (e.target.id === 'complete-payment') {
                // Simulate payment processing (70% success rate)
                const paymentSuccess = Math.random() > 0.3;
                
                if (paymentSuccess) {
                    checkoutState.step = 'confirmation';
                    checkoutState.orderPlaced = true;
                    updateCheckoutProgress();
                    renderConfirmationStep();
                    
                    // Clear cart
                    cartItems = [];
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    updateCartCount();
                } else {
                    // Show payment error
                    document.querySelector('.payment-error').style.display = 'block';
                }
            }
            
            // Return to home button
            if (e.target.id === 'return-home') {
                window.location.href = 'index.html';
            }
            
            // Delivery option selection
            if (e.target.closest('.delivery-option')) {
                const option = e.target.closest('.delivery-option');
                checkoutState.deliveryOption = option.dataset.type;
                
                // Update UI
                document.querySelectorAll('.delivery-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                
                // Show/hide address field
                const addressContainer = document.getElementById('address-container');
                if (addressContainer) {
                    addressContainer.style.display = 
                        checkoutState.deliveryOption === 'delivery' ? 'block' : 'none';
                }
            }
            
            // Remove item from cart
            if (e.target.closest('.remove-item')) {
                const btn = e.target.closest('.remove-item');
                const itemId = parseInt(btn.dataset.id);
                const itemSize = btn.dataset.size;
                
                removeFromCart(itemId, itemSize);
                renderCartStep();
            }
            
            // Quantity decrease button
            if (e.target.closest('.quantity-btn.decrease')) {
                const btn = e.target.closest('.quantity-btn.decrease');
                const itemId = parseInt(btn.dataset.id);
                const itemSize = btn.dataset.size;
                const itemIndex = cartItems.findIndex(i => i.id === itemId && i.size === itemSize);
                
                if (itemIndex !== -1) {
                    const newQuantity = cartItems[itemIndex].quantity - 1;
                    
                    if (newQuantity < 1) {
                        removeFromCart(itemId, itemSize);
                    } else {
                        updateQuantity(itemId, itemSize, newQuantity);
                    }
                    
                    renderCartStep();
                }
            }
            
            // Quantity increase button
            if (e.target.closest('.quantity-btn.increase')) {
                const btn = e.target.closest('.quantity-btn.increase');
                const itemId = parseInt(btn.dataset.id);
                const itemSize = btn.dataset.size;
                const itemIndex = cartItems.findIndex(i => i.id === itemId && i.size === itemSize);
                
                if (itemIndex !== -1) {
                    const newQuantity = cartItems[itemIndex].quantity + 1;
                    updateQuantity(itemId, itemSize, newQuantity);
                    renderCartStep();
                }
            }
        });
        
        // Form input event listeners
        document.addEventListener('input', function(e) {
            if (e.target.matches('.form-control')) {
                const name = e.target.name;
                const value = e.target.value;
                
                checkoutState.customerInfo[name] = value;
                
                // Clear error when typing
                const errorEl = document.getElementById(`${name}-error`);
                if (errorEl) {
                    errorEl.style.display = 'none';
                }
            }
        });
    }
    
    // Update checkout progress bar
    function updateCheckoutProgress() {
        const progressSteps = {
            cart: 0,
            delivery: 1,
            payment: 2,
            confirmation: 3
        };
        
        const stepElements = document.querySelectorAll('.progress-step');
        const currentStepIndex = progressSteps[checkoutState.step];
        const progressBar = document.querySelector('.progress-bar');
        
        if (progressBar) {
            const widthPercentage = currentStepIndex * 33.33;
            progressBar.style.width = `${widthPercentage}%`;
            
            if (checkoutState.step === 'confirmation') {
                progressBar.style.width = '100%';
            }
        }
        
        stepElements.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index === currentStepIndex) {
                step.classList.add('active');
            } else if (index < currentStepIndex) {
                step.classList.add('completed');
            }
        });
    }
    
    // Render cart step
    function renderCartStep() {
        const checkoutContent = document.querySelector('.checkout-content');
        
        if (cartItems.length === 0) {
            checkoutContent.innerHTML = `
                <h2>Your Cart</h2>
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <button id="continue-shopping" class="btn btn-primary">Browse Menu</button>
                </div>
            `;
        } else {
            let cartItemsHTML = '';
            let subtotal = 0;
            
            cartItems.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                cartItemsHTML += `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p>${item.size}</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn decrease" data-id="${item.id}" data-size="${item.size}">-</button>
                                <div class="quantity">${item.quantity}</div>
                                <button class="quantity-btn increase" data-id="${item.id}" data-size="${item.size}">+</button>
                            </div>
                            <div class="cart-item-price">
                                <div>$${itemTotal}</div>
                                <div class="remove-item" data-id="${item.id}" data-size="${item.size}">
                                    <i class="fas fa-times-circle"></i> Remove
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            checkoutContent.innerHTML = `
                <h2>Your Cart</h2>
                <div class="cart-items">
                    ${cartItemsHTML}
                </div>
                <div class="cart-summary">
                    <div class="summary-row">
                        <div>Subtotal</div>
                        <div>$${subtotal}</div>
                    </div>
                    <div class="summary-total">
                        <div>Total</div>
                        <div>$${subtotal}</div>
                    </div>
                </div>
                <div class="checkout-actions">
                    <button id="continue-shopping" class="btn btn-white">Continue Shopping</button>
                    <button id="proceed-to-checkout" class="btn btn-primary">Proceed to Checkout</button>
                </div>
            `;
        }
    }
    
    // Render delivery step
    function renderDeliveryStep() {
        const checkoutContent = document.querySelector('.checkout-content');
        
        checkoutContent.innerHTML = `
            <h2>Delivery Information</h2>
            
            <div class="delivery-options">
                <div class="delivery-option ${checkoutState.deliveryOption === 'pickup' ? 'selected' : ''}" data-type="pickup">
                    <h3>Pickup</h3>
                    <p>Collect your order from our location</p>
                </div>
                <div class="delivery-option ${checkoutState.deliveryOption === 'delivery' ? 'selected' : ''}" data-type="delivery">
                    <h3>Delivery</h3>
                    <p>We'll deliver to your address</p>
                </div>
            </div>
            
            <form id="delivery-form">
                <div class="form-group">
                    <label class="form-label" for="name">Name</label>
                    <input type="text" class="form-control ${checkoutState.formErrors.name ? 'border-red-500' : ''}" 
                        id="name" name="name" placeholder="Your name" value="${checkoutState.customerInfo.name}">
                    <div class="error-message" id="name-error" style="display: ${checkoutState.formErrors.name ? 'block' : 'none'}">
                        ${checkoutState.formErrors.name || ''}
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="phone">Phone</label>
                    <input type="tel" class="form-control ${checkoutState.formErrors.phone ? 'border-red-500' : ''}" 
                        id="phone" name="phone" placeholder="Your phone number" value="${checkoutState.customerInfo.phone}">
                    <div class="error-message" id="phone-error" style="display: ${checkoutState.formErrors.phone ? 'block' : 'none'}">
                        ${checkoutState.formErrors.phone || ''}
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="email">Email</label>
                    <input type="email" class="form-control ${checkoutState.formErrors.email ? 'border-red-500' : ''}" 
                        id="email" name="email" placeholder="Your email" value="${checkoutState.customerInfo.email}">
                    <div class="error-message" id="email-error" style="display: ${checkoutState.formErrors.email ? 'block' : 'none'}">
                        ${checkoutState.formErrors.email || ''}
                    </div>
                </div>
                
                <div class="form-group" id="address-container" style="display: ${checkoutState.deliveryOption === 'delivery' ? 'block' : 'none'}">
                    <label class="form-label" for="address">Delivery Address</label>
                    <textarea class="form-control ${checkoutState.formErrors.address ? 'border-red-500' : ''}" 
                        id="address" name="address" rows="3" placeholder="Your delivery address">${checkoutState.customerInfo.address}</textarea>
                    <div class="error-message" id="address-error" style="display: ${checkoutState.formErrors.address ? 'block' : 'none'}">
                        ${checkoutState.formErrors.address || ''}
                    </div>
                </div>
            </form>
            
            <div class="checkout-actions">
                <button id="back-to-cart" class="btn btn-white">Back to Cart</button>
                <button id="continue-to-payment" class="btn btn-primary">Continue to Payment</button>
            </div>
        `;
    }
    
    // Render payment step
    function renderPaymentStep() {
        const checkoutContent = document.querySelector('.checkout-content');
        const total = calculateTotal();
        const orderRef = `TW-${Math.floor(Math.random() * 10000)}`;
        
        checkoutContent.innerHTML = `
            <h2>Payment Method</h2>
            
            <div class="payment-error">
                Payment verification failed. Please ensure you've completed the M.M.G. payment and try again.
            </div>
            
            <div class="payment-info">
                <h3>Mobile Money Payment (M.M.G.)</h3>
                <p>Complete your payment using Mobile Money:</p>
                
                <ol class="payment-steps">
                    <li>Open your Mobile Money app</li>
                    <li>Select "Send Money" option</li>
                    <li>Enter the following number: +592 695 8806</li>
                    <li>Enter the amount: $${total}</li>
                    <li>Use your order number as reference</li>
                    <li>Complete the transaction</li>
                </ol>
                
                <div class="payment-reference">
                    <p><strong>Order Total:</strong> $${total}</p>
                    <p><strong>Order Reference:</strong> <span class="reference-number">${orderRef}</span></p>
                </div>
            </div>
            
            <div class="cart-summary">
                <h3>Order Summary</h3>
                ${cartItems.map(item => `
                    <div class="summary-row">
                        <div>${item.quantity}x ${item.name} (${item.size})</div>
                        <div>$${item.price * item.quantity}</div>
                    </div>
                `).join('')}
                <div class="summary-total">
                    <div>Total</div>
                    <div>$${total}</div>
                </div>
            </div>
            
            <div class="checkout-actions">
                <button id="back-to-cart" class="btn btn-white">Back</button>
                <button id="complete-payment" class="btn btn-primary">Complete Payment</button>
            </div>
        `;
    }
    
    // Render confirmation step
    function renderConfirmationStep() {
        const checkoutContent = document.querySelector('.checkout-content');
        const orderRef = `TW-${Math.floor(Math.random() * 10000)}`;
        
        checkoutContent.innerHTML = `
            <div class="confirmation">
                <div class="confirmation-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your order. Your order has been received and is being processed.</p>
                
                <div class="order-details">
                    <h3>Order Details</h3>
                    <div class="order-detail-row">
                        <div class="order-detail-label">Order Number:</div>
                        <div>${orderRef}</div>
                    </div>
                    <div class="order-detail-row">
                        <div class="order-detail-label">Method:</div>
                        <div>${checkoutState.deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}</div>
                    </div>
                    <div class="order-detail-row">
                        <div class="order-detail-label">Total Amount:</div>
                        <div>$${calculateTotal()}</div>
                    </div>
                </div>
                
                <button id="return-home" class="btn btn-primary">Return to Home</button>
            </div>
        `;
    }
    
    // Validate delivery form
    function validateDeliveryForm() {
        const errors = {};
        
        if (!checkoutState.customerInfo.name.trim()) {
            errors.name = "Name is required";
        }
        
        if (!checkoutState.customerInfo.phone.trim()) {
            errors.phone = "Phone number is required";
        }
        
        if (!checkoutState.customerInfo.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(checkoutState.customerInfo.email)) {
            errors.email = "Email address is invalid";
        }
        
        if (checkoutState.deliveryOption === 'delivery' && !checkoutState.customerInfo.address.trim()) {
            errors.address = "Delivery address is required";
        }
        
        return errors;
    }
});
