document.addEventListener('DOMContentLoaded', function() {
    // Menu data
    const menuItems = [
        {
            id: 1,
            name: "Chicken & Chips",
            description: "Perfectly seasoned crispy fried chicken with golden chips",
            image: "chicken",
            sizes: [
                { size: "Small", price: 600 },
                { size: "Medium", price: 1000 },
                { size: "Large", price: 1200 }
            ],
            category: "main"
        },
        {
            id: 2,
            name: "Fish & Chips",
            description: "Fresh fish fillets in a light crispy batter with golden chips",
            image: "fish",
            sizes: [
                { size: "Small", price: 600 },
                { size: "Medium", price: 1000 },
                { size: "Large", price: 1200 }
            ],
            category: "main"
        },
        {
            id: 3,
            name: "Chicken Burger",
            description: "Juicy chicken patty with fresh lettuce, tomato and our special sauce",
            image: "burger",
            sizes: [
                { size: "Regular", price: 1000 }
            ],
            category: "burgers"
        },
        {
            id: 4,
            name: "Chicken Burger & Fries with Milkshake",
            description: "Our famous chicken burger served with fries and a creamy milkshake",
            image: "combo",
            sizes: [
                { size: "Combo", price: 1500 }
            ],
            category: "combos"
        },
        {
            id: 5,
            name: "Cheese Please with Milkshake Combo",
            description: "Delicious cheese sandwich with your choice of milkshake flavor",
            image: "cheese",
            sizes: [
                { size: "Combo", price: 700 }
            ],
            category: "combos"
        },
        {
            id: 6,
            name: "Milkshake",
            description: "Creamy, thick milkshake made with premium ingredients",
            image: "shake",
            sizes: [
                { size: "Regular", price: 400 }
            ],
            category: "drinks"
        },
        {
            id: 7,
            name: "Chicken Wings",
            description: "Crispy wings tossed in your choice of sauce - mild, spicy or BBQ",
            image: "wings",
            sizes: [
                { size: "Small", price: 600 },
                { size: "Medium", price: 1000 },
                { size: "Large", price: 1200 }
            ],
            category: "main"
        }
    ];
    
    // Category filter functionality
    let activeCategory = 'all';
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            activeCategory = category;
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            renderMenuItems();
        });
    });
    
    // Render menu items based on active category
    function renderMenuItems() {
        const menuGrid = document.querySelector('.menu-grid');
        
        // Filter items
        const filteredItems = activeCategory === 'all' 
            ? menuItems 
            : menuItems.filter(item => item.category === activeCategory);
        
        // Generate HTML
        let html = '';
        filteredItems.forEach(item => {
            html += `
                <div class="menu-item">
                    <div class="menu-img featured-img-${item.image}">
                        <div class="featured-img-badge">${getItemEmoji(item.image)}</div>
                    </div>
                    <div class="menu-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="menu-sizes">
                            ${item.sizes.map(sizeOpt => `
                                <div class="menu-size-option">
                                    <div class="size-price">
                                        <span class="size-label">${sizeOpt.size}</span>
                                        <span class="price">$${sizeOpt.price}</span>
                                    </div>
                                    <button class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-size="${sizeOpt.size}" data-price="${sizeOpt.price}">
                                        <i class="fas fa-plus"></i> Add
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        
        menuGrid.innerHTML = html;
        
        // Add event listeners to "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                const itemName = this.dataset.name;
                const itemSize = this.dataset.size;
                const itemPrice = parseInt(this.dataset.price);
                
                addToCart({
                    id: itemId,
                    name: itemName,
                    size: itemSize,
                    price: itemPrice
                });
            });
        });
    }
    
    // Helper to get emoji for menu item
    function getItemEmoji(image) {
        switch(image) {
            case 'chicken': return '🍗';
            case 'fish': return '🐟';
            case 'burger': return '🍔';
            case 'combo': return '🍟';
            case 'cheese': return '🧀';
            case 'shake': return '🥤';
            case 'wings': return '🍖';
            default: return '🍽️';
        }
    }
    
    // Initialize the menu
    renderMenuItems();
});
