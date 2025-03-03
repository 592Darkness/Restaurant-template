import React, { useState, useEffect } from 'react';
import { XCircle, ShoppingCart, Menu, X, Phone, Clock, MapPin, ChevronRight, Sun, Moon } from 'lucide-react';

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Initialize dark mode from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('tastyWorldTheme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tastyWorldTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tastyWorldTheme', 'light');
    }
  };
  
  // Navigation handler
  const navigateTo = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };
  
  // Add to cart function
  const addToCart = (item) => {
    const existingItem = cartItems.find(i => i.id === item.id && i.size === item.size);
    
    if (existingItem) {
      setCartItems(cartItems.map(i => 
        i.id === item.id && i.size === item.size 
          ? {...i, quantity: i.quantity + 1} 
          : i
      ));
    } else {
      setCartItems([...cartItems, {...item, quantity: 1}]);
    }
  };
  
  // Remove from cart function
  const removeFromCart = (itemId, size) => {
    setCartItems(cartItems.filter(item => !(item.id === itemId && item.size === size)));
  };
  
  // Update quantity function
  const updateQuantity = (itemId, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === itemId && item.size === size 
        ? {...item, quantity: newQuantity} 
        : item
    ));
  };
  
  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Render the current page
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} darkMode={darkMode} />;
      case 'menu':
        return <MenuPage addToCart={addToCart} darkMode={darkMode} />;
      case 'about':
        return <AboutPage darkMode={darkMode} />;
      case 'contact':
        return <ContactPage darkMode={darkMode} />;
      case 'checkout':
        return (
          <CheckoutPage 
            cartItems={cartItems} 
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            calculateTotal={calculateTotal}
            navigateTo={navigateTo}
            darkMode={darkMode}
          />
        );
      default:
        return <HomePage navigateTo={navigateTo} darkMode={darkMode} />;
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-amber-50 to-amber-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-amber-600 to-orange-500'} shadow-lg`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div 
              className="text-2xl md:text-3xl font-bold text-white cursor-pointer flex items-center"
              onClick={() => navigateTo('home')}
            >
              <span className={`${darkMode ? 'bg-gray-700 text-amber-400' : 'bg-white text-amber-600'} rounded-full w-10 h-10 flex items-center justify-center mr-2`}>
                TW
              </span>
              Tasty World
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => navigateTo('home')}
              className="text-white hover:text-amber-200 transition-colors relative group py-1"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigateTo('menu')}
              className="text-white hover:text-amber-200 transition-colors relative group py-1"
            >
              Menu
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigateTo('about')}
              className="text-white hover:text-amber-200 transition-colors relative group py-1"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigateTo('contact')}
              className="text-white hover:text-amber-200 transition-colors relative group py-1"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>
          
          {/* Cart, Dark Mode Toggle, and Mobile Menu Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="text-white hover:text-amber-200 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            
            <button 
              onClick={() => navigateTo('checkout')}
              className="relative text-white hover:text-amber-200"
            >
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            
            <button 
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {menuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-700' : 'bg-amber-700'} py-4`}>
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <button 
                onClick={() => navigateTo('home')}
                className="text-white hover:text-amber-200 transition-colors text-left py-2"
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo('menu')}
                className="text-white hover:text-amber-200 transition-colors text-left py-2"
              >
                Menu
              </button>
              <button 
                onClick={() => navigateTo('about')}
                className="text-white hover:text-amber-200 transition-colors text-left py-2"
              >
                About
              </button>
              <button 
                onClick={() => navigateTo('contact')}
                className="text-white hover:text-amber-200 transition-colors text-left py-2"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gradient-to-r from-amber-800 to-amber-900 text-white'} py-12 relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${darkMode ? 'bg-gray-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'}`}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? '' : 'text-amber-800'}`}>Tasty World</h3>
              <p className={`mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-300'} font-semibold`}>TRULY TASTY!!</p>
              <p className={darkMode ? 'text-gray-300' : 'text-amber-100'}>Your favourite food dishes. Our pleasure to serve.</p>
              <p className="mt-4">Diamond Car Park, Georgetown, Guyana</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigateTo('home')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('menu')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    Menu
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('about')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('contact')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone size={18} className="mr-2" />
                  <span>+592 695 8806</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  <span>Mon-Sun: 10:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-amber-700'} mt-8 pt-8 text-center`}>
            <p className={darkMode ? 'text-gray-400' : 'text-amber-200'}>&copy; {new Date().getFullYear()} Tasty World. All rights reserved.</p>
            <div className="flex justify-center mt-4 space-x-4">
              <span className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-700 hover:bg-amber-600'} transition-colors flex items-center justify-center cursor-pointer`}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </span>
              <span className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-700 hover:bg-amber-600'} transition-colors flex items-center justify-center cursor-pointer`}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </span>
              <span className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-700 hover:bg-amber-600'} transition-colors flex items-center justify-center cursor-pointer`}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Home Page Component
const HomePage = ({ navigateTo, darkMode }) => {
  return (
    <div>
      {/* Hero Section */}
      <div 
        className={`${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900' 
            : 'bg-gradient-to-r from-amber-500 via-amber-600 to-red-500'
        } text-white py-24 md:py-32 relative overflow-hidden`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Welcome to Tasty World</h1>
          <p className="text-xl md:text-3xl mb-4 italic font-light">TRULY TASTY!!</p>
          <p className="text-lg md:text-xl mb-8 opacity-90">Your favourite food dishes. Our pleasure to serve.</p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigateTo('menu')}
              className={`${
                darkMode 
                  ? 'bg-amber-500 text-white hover:bg-amber-600' 
                  : 'bg-white text-amber-600 hover:bg-amber-100'
              } px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg`}
            >
              View Our Menu
            </button>
          </div>
        </div>
      </div>
      
      {/* Featured Items Section */}
      <div className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
        <div className={`absolute top-0 left-0 w-full h-16 ${
          darkMode 
            ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
            : 'bg-gradient-to-b from-amber-50 to-white'
        }`}></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>Featured Items</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeaturedItem 
              title="Chicken & Chips"
              price="from $600"
              description="Our delicious fried chicken served with crispy chips."
              image="chicken"
              navigateTo={navigateTo}
              darkMode={darkMode}
            />
            
            <FeaturedItem 
              title="Chicken Burger & Fries with Milkshake"
              price="$1500"
              description="The perfect combo! Juicy chicken burger, fries and refreshing milkshake."
              image="combo"
              navigateTo={navigateTo}
              darkMode={darkMode}
            />
            
            <FeaturedItem 
              title="Cheese Please with Milkshake Combo"
              price="$700"
              description="Cheesy goodness paired with a creamy milkshake."
              image="cheese"
              navigateTo={navigateTo}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className={`${
        darkMode 
          ? 'bg-gradient-to-r from-amber-800 to-amber-900' 
          : 'bg-gradient-to-r from-amber-600 to-red-500'
        } py-20 relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Order?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white opacity-90">
            Experience the delicious taste of Tasty World. Order now for pickup or delivery!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => navigateTo('menu')}
              className={`${
                darkMode 
                  ? 'bg-amber-500 text-white hover:bg-amber-600' 
                  : 'bg-white text-amber-600 hover:bg-amber-50'
                } px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              View Full Menu
            </button>
            <a 
              href="tel:+5926958806"
              className={`${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-amber-800 hover:bg-amber-900'
                } text-white px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center`}
            >
              <Phone size={18} className="mr-2" />
              Call to Order
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Item Component
const FeaturedItem = ({ title, price, description, image, navigateTo, darkMode }) => {
  // Generate placeholder image based on the item type
  const getImageBackground = () => {
    switch(image) {
      case 'chicken':
        return darkMode ? 'bg-gradient-to-br from-amber-700 to-amber-900' : 'bg-gradient-to-br from-amber-300 to-amber-500';
      case 'combo':
        return darkMode ? 'bg-gradient-to-br from-red-700 to-red-900' : 'bg-gradient-to-br from-red-300 to-red-500';
      case 'cheese':
        return darkMode ? 'bg-gradient-to-br from-yellow-700 to-amber-800' : 'bg-gradient-to-br from-yellow-300 to-yellow-500';
      default:
        return darkMode ? 'bg-gradient-to-br from-amber-700 to-amber-900' : 'bg-gradient-to-br from-amber-300 to-amber-500';
    }
  };
  
  return (
    <div className={`${
      darkMode 
        ? 'bg-gray-700 border-gray-600 hover:shadow-amber-900/20' 
        : 'bg-white border-amber-100 hover:shadow-xl'
      } rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border`}>
      <div className={`h-48 ${getImageBackground()} flex items-center justify-center p-6`}>
        <div className={`w-24 h-24 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full flex items-center justify-center`}>
          <span className="text-3xl font-bold text-amber-600">
            {image === 'chicken' && '🍗'}
            {image === 'combo' && '🍔'}
            {image === 'cheese' && '🧀'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>{title}</h3>
        <p className="text-amber-600 font-bold mb-4 text-lg">{price}</p>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{description}</p>
        <button 
          onClick={() => navigateTo('menu')}
          className={`${
            darkMode 
              ? 'bg-amber-500 text-white hover:bg-amber-600' 
              : 'bg-amber-600 text-white hover:bg-amber-700'
            } px-4 py-2 rounded-full font-medium flex items-center transition-colors w-full justify-center`}
        >
          Order Now <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

// Menu Page Component
const MenuPage = ({ addToCart, darkMode }) => {
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
  
  const categories = [
    { id: "all", name: "All Items" },
    { id: "main", name: "Main Dishes" },
    { id: "burgers", name: "Burgers" },
    { id: "combos", name: "Combos" },
    { id: "drinks", name: "Drinks" }
  ];
  
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);
  
  return (
    <div className={`py-16 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-white to-amber-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>Our Menu</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-4 max-w-2xl mx-auto`}>Discover our delicious selection of meals, combos, and refreshing drinks</p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-12 gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-6 py-3 rounded-full transition-all duration-300 shadow-sm font-medium ${
                activeCategory === category.id 
                  ? darkMode 
                    ? "bg-amber-500 text-white shadow-md transform -translate-y-1" 
                    : "bg-amber-600 text-white shadow-md transform -translate-y-1" 
                  : darkMode
                    ? "bg-gray-700 text-amber-400 hover:bg-gray-600 border border-gray-600"
                    : "bg-white text-amber-800 hover:bg-amber-100 border border-amber-200"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => {
            // Generate placeholder image based on the item type
            const getImageBackground = () => {
              switch(item.image) {
                case 'chicken':
                  return 'bg-gradient-to-br from-amber-300 to-amber-500';
                case 'fish':
                  return 'bg-gradient-to-br from-blue-300 to-blue-500';
                case 'burger':
                  return 'bg-gradient-to-br from-red-300 to-red-500';
                case 'combo':
                  return 'bg-gradient-to-br from-purple-300 to-purple-500';
                case 'cheese':
                  return 'bg-gradient-to-br from-yellow-300 to-yellow-500';
                case 'shake':
                  return 'bg-gradient-to-br from-pink-300 to-pink-500';
                case 'wings':
                  return 'bg-gradient-to-br from-orange-300 to-orange-500';
                default:
                  return 'bg-gradient-to-br from-amber-300 to-amber-500';
              }
            };
            
            // Generate emoji for each item
            const getEmoji = () => {
              switch(item.image) {
                case 'chicken': return '🍗';
                case 'fish': return '🐟';
                case 'burger': return '🍔';
                case 'combo': return '🍟';
                case 'cheese': return '🧀';
                case 'shake': return '🥤';
                case 'wings': return '🍖';
                default: return '🍽️';
              }
            };
            
            return (
              <div 
                key={item.id} 
                className="rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-amber-100"
              >
                <div className={`h-40 ${getImageBackground()} flex items-center justify-center p-4`}>
                  <div className="w-20 h-20 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-3xl">{getEmoji()}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-amber-800">{item.name}</h3>
                  <p className="text-gray-600 mb-4 h-12 overflow-hidden">{item.description}</p>
                  
                  <div className="space-y-3 mt-6">
                    {item.sizes.map((sizeOption, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border-b border-amber-100 last:border-b-0">
                        <div>
                          <span className="font-medium text-gray-700">{sizeOption.size}</span>
                          <span className="text-amber-600 font-bold ml-4">${sizeOption.price}</span>
                        </div>
                        <button 
                          className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-all duration-300 text-sm flex items-center shadow-sm hover:shadow"
                          onClick={() => addToCart({
                            id: item.id,
                            name: item.name,
                            size: sizeOption.size,
                            price: sizeOption.price
                          })}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// About Page Component
const AboutPage = ({ darkMode }) => {
  return (
    <div className={`py-16 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-white to-amber-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>About Tasty World</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 flex justify-center">
            <div className={`w-64 h-64 ${
              darkMode 
                ? 'bg-gradient-to-br from-amber-600 to-amber-800' 
                : 'bg-gradient-to-br from-amber-400 to-amber-600'
              } rounded-full flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform duration-300`}>
              <div className="text-white text-center">
                <div className="text-3xl font-bold">Tasty World</div>
                <div className="mt-2 text-xl font-light italic">TRULY TASTY!!</div>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg mx-auto">
            <p className={darkMode ? 'text-gray-300' : ''}>
              Welcome to Tasty World, where flavor meets satisfaction! We pride ourselves on serving
              delicious, freshly prepared food that delights our customers.
            </p>
            
            <p className={darkMode ? 'text-gray-300' : ''}>
              Located in Diamond Car Park, Georgetown, Guyana, our restaurant has become a favorite 
              destination for food lovers. Our mission is simple: "Your favourite food dishes. Our pleasure to serve."
            </p>
            
            <p className={darkMode ? 'text-gray-300' : ''}>
              Our menu features a variety of dishes including our famous Chicken & Chips, 
              mouth-watering Chicken Burgers, and refreshing Milkshakes. Whether you're in the 
              mood for a quick snack or a hearty meal, we've got you covered.
            </p>
            
            <p className={darkMode ? 'text-gray-300' : ''}>
              At Tasty World, we believe that good food brings people together. Our mission is to 
              provide high-quality, tasty meals at affordable prices, served with a smile.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Promise</h2>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Fresh ingredients used daily</li>
              <li>Meals prepared with care and attention</li>
              <li>Friendly service with every order</li>
              <li>Convenient pickup and delivery options</li>
            </ul>
            
            <p className="mt-8">
              We look forward to serving you soon. Remember, at Tasty World, it's all about being TRULY TASTY!!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page Component
const ContactPage = ({ darkMode }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [contactErrors, setContactErrors] = useState({});
  const [messageSent, setMessageSent] = useState(false);
  
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };
  
  const validateContactForm = () => {
    const errors = {};
    
    if (!contactForm.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = "Email address is invalid";
    }
    
    if (!contactForm.message.trim()) {
      errors.message = "Message is required";
    }
    
    return errors;
  };
  
  const handleSubmitContactForm = (e) => {
    e.preventDefault();
    
    const errors = validateContactForm();
    setContactErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Form is valid, simulate sending message
      setMessageSent(true);
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setMessageSent(false);
      }, 5000);
    }
  };
  
  return (
    <div className={`py-16 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-white to-amber-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>Contact Us</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>Get In Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone size={20} className={`mr-3 ${darkMode ? 'text-amber-400' : 'text-amber-600'} mt-1`} />
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>+592 695 8806</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={20} className={`mr-3 ${darkMode ? 'text-amber-400' : 'text-amber-600'} mt-1`} />
                  <div>
                    <h3 className="font-bold">Hours</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Monday - Sunday: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={20} className={`mr-3 ${darkMode ? 'text-amber-400' : 'text-amber-600'} mt-1`} />
                  <div>
                    <h3 className="font-bold">Location</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Diamond Car Park, Georgetown, Guyana</p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mt-12 mb-6">Send Us a Message</h2>
              
              {messageSent && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">Your message has been sent successfully!</span>
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleSubmitContactForm}>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="contact-name">Name</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                      contactErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your name"
                  />
                  {contactErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{contactErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="contact-email">Email</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                      contactErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your email"
                  />
                  {contactErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{contactErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="contact-message">Message</label>
                  <textarea 
                    id="contact-message" 
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    rows="4"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                      contactErrors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your message"
                  ></textarea>
                  {contactErrors.message && (
                    <p className="text-red-500 text-sm mt-1">{contactErrors.message}</p>
                  )}
                </div>
                
                <button 
                  type="submit"
                  className="bg-amber-600 text-white px-6 py-2 rounded font-bold hover:bg-amber-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="bg-amber-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Order Now</h2>
              
              <p className="mb-6">
                Ready to enjoy our delicious food? Place your order now for pickup or delivery!
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">By Phone</h3>
                  <p className="text-gray-700 mb-3">Call us directly to place your order:</p>
                  <a 
                    href="tel:+5926958806"
                    className="bg-amber-600 text-white px-4 py-2 rounded inline-flex items-center hover:bg-amber-700 transition-colors"
                  >
                    <Phone size={16} className="mr-2" />
                    +592 695 8806
                  </a>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Online</h3>
                  <p className="text-gray-700 mb-3">Browse our menu and order online:</p>
                  <button 
                    onClick={() => {}}
                    className="bg-amber-800 text-white px-4 py-2 rounded hover:bg-amber-900 transition-colors"
                  >
                    Order Online
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = ({ 
  cartItems, 
  removeFromCart, 
  updateQuantity, 
  calculateTotal,
  navigateTo,
  darkMode
}) => {
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('delivery');
  };
  
  const [formErrors, setFormErrors] = useState({});

  const validateDeliveryForm = () => {
    const errors = {};
    
    if (!customerInfo.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    
    if (!customerInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = "Email address is invalid";
    }
    
    if (deliveryOption === 'delivery' && !customerInfo.address.trim()) {
      errors.address = "Delivery address is required";
    }
    
    return errors;
  };

  const handleDeliverySelection = () => {
    const errors = validateDeliveryForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setCheckoutStep('payment');
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  const [paymentError, setPaymentError] = useState("");
  
  const handlePayment = () => {
    // Reset any previous errors
    setPaymentError("");
    
    // Example validation - in a real app, you would verify payment confirmation
    // For this demo, let's simulate a payment confirmation check
    const paymentConfirmed = Math.random() > 0.3; // 70% chance of success for demo purposes
    
    if (paymentConfirmed) {
      // Simulate payment processing
      setPaymentCompleted(true);
      setCheckoutStep('confirmation');
    } else {
      // Show payment error
      setPaymentError("Payment verification failed. Please ensure you've completed the M.M.G. payment and try again.");
    }
  };
  
  // Render based on checkout step
  const renderCheckoutStep = () => {
    switch(checkoutStep) {
      case 'cart':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-6">Your cart is empty</p>
                <button 
                  onClick={() => navigateTo('menu')}
                  className="bg-amber-600 text-white px-6 py-2 rounded font-bold hover:bg-amber-700 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {cartItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between border-b border-gray-200 pb-4"
                    >
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-gray-600">{item.size}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center mr-6">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="bg-gray-200 text-gray-600 w-8 h-8 rounded-l flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="bg-gray-100 w-10 h-8 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="bg-gray-200 text-gray-600 w-8 h-8 rounded-r flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold">${item.price * item.quantity}</p>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-red-500 text-sm flex items-center hover:text-red-700"
                          >
                            <XCircle size={14} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-amber-50 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="border-t border-amber-200 my-2 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => navigateTo('menu')}
                    className="text-amber-600 font-bold hover:text-amber-800"
                  >
                    Continue Shopping
                  </button>
                  
                  <button 
                    onClick={handleCheckout}
                    className="bg-amber-600 text-white px-6 py-2 rounded font-bold hover:bg-amber-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        );
        
      case 'delivery':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
            
            <div className="mb-8">
              <div className="flex gap-4 mb-6">
                <button 
                  className={`flex-1 p-4 border rounded-lg ${
                    deliveryOption === 'pickup' 
                      ? 'border-amber-600 bg-amber-50' 
                      : 'border-gray-300 hover:border-amber-300'
                  }`}
                  onClick={() => setDeliveryOption('pickup')}
                >
                  <h3 className="font-bold mb-2">Pickup</h3>
                  <p className="text-gray-600 text-sm">Collect your order from our location</p>
                </button>
                
                <button 
                  className={`flex-1 p-4 border rounded-lg ${
                    deliveryOption === 'delivery' 
                      ? 'border-amber-600 bg-amber-50' 
                      : 'border-gray-300 hover:border-amber-300'
                  }`}
                  onClick={() => setDeliveryOption('delivery')}
                >
                  <h3 className="font-bold mb-2">Delivery</h3>
                  <p className="text-gray-600 text-sm">We'll deliver to your address</p>
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your name"
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your phone number"
                    required
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your email"
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                {deliveryOption === 'delivery' && (
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="address">Delivery Address</label>
                    <textarea 
                      id="address" 
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your delivery address"
                      required
                    ></textarea>
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                    )}
                  </div>
                )}
              </form>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setCheckoutStep('cart')}
                className="text-amber-600 font-bold hover:text-amber-800"
              >
                Back to Cart
              </button>
              
              <button 
                onClick={handleDeliverySelection}
                className="bg-amber-600 text-white px-6 py-2 rounded font-bold hover:bg-amber-700 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            
            <div className="mb-8">
              <div className="p-6 border border-amber-300 rounded-lg bg-amber-50 mb-6">
                <h3 className="font-bold text-lg mb-4">Mobile Money Payment (M.M.G.)</h3>
                <p className="mb-4">Complete your payment using Mobile Money:</p>
                
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Open your Mobile Money app</li>
                  <li>Select "Send Money" option</li>
                  <li>Enter the following number: +592 695 8806</li>
                  <li>Enter the amount: ${calculateTotal()}</li>
                  <li>Use your order number as reference</li>
                  <li>Complete the transaction</li>
                </ol>
                
                <div className="mt-6 p-4 bg-white rounded border border-amber-200">
                  <p className="font-bold">Order Total: ${calculateTotal()}</p>
                  <p className="text-sm text-gray-600 mt-1">Order Reference: TW-{Math.floor(Math.random() * 10000)}</p>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-bold mb-2">Order Summary</h3>
                
                {cartItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <span>{item.quantity}x {item.name} ({item.size})</span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
                
                <div className="mt-4 pt-2 border-t border-gray-300 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
            
                          {paymentError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                  <span className="block sm:inline">{paymentError}</span>
                </div>
              )}
              
              <div className="mt-8 flex justify-between">
                <button 
                  onClick={() => setCheckoutStep('delivery')}
                  className="text-amber-600 font-bold hover:text-amber-800"
                >
                  Back
                </button>
                
                <button 
                  onClick={handlePayment}
                  className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition-colors"
                >
                  Complete Payment
                </button>
              </div>
          </div>
        );
        
      case 'confirmation':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
            <p className="mb-6">Thank you for your order. Your order has been received and is being processed.</p>
            
            <div className="max-w-md mx-auto bg-amber-50 p-6 rounded-lg mb-8">
              <h3 className="font-bold mb-4 text-lg">Order Details</h3>
              <p className="mb-2"><span className="font-medium">Order Number:</span> TW-{Math.floor(Math.random() * 10000)}</p>
              <p className="mb-2"><span className="font-medium">Method:</span> {deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}</p>
              <p><span className="font-medium">Total Amount:</span> ${calculateTotal()}</p>
            </div>
            
            <button 
              onClick={() => {
                setCartItems([]);
                navigateTo('home');
              }}
              className="bg-amber-600 text-white px-6 py-2 rounded font-bold hover:bg-amber-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`py-16 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-white to-amber-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>Checkout</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Checkout Progress */}
          <div className="mb-12">
            <div className="flex justify-between">
              <div className={`text-center flex-1 ${checkoutStep === 'cart' 
                ? 'text-amber-600 font-bold' 
                : checkoutStep === 'delivery' || checkoutStep === 'payment' || checkoutStep === 'confirmation' 
                  ? 'text-green-600' 
                  : 'text-gray-400'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  checkoutStep === 'cart' 
                    ? 'bg-amber-600 text-white' 
                    : checkoutStep === 'delivery' || checkoutStep === 'payment' || checkoutStep === 'confirmation'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                Cart
              </div>
              <div className={`text-center flex-1 ${checkoutStep === 'delivery' 
                ? 'text-amber-600 font-bold' 
                : checkoutStep === 'payment' || checkoutStep === 'confirmation' 
                  ? 'text-green-600' 
                  : 'text-gray-400'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  checkoutStep === 'delivery' 
                    ? 'bg-amber-600 text-white' 
                    : checkoutStep === 'payment' || checkoutStep === 'confirmation'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                Delivery
              </div>
              <div className={`text-center flex-1 ${checkoutStep === 'payment' 
                ? 'text-amber-600 font-bold' 
                : checkoutStep === 'confirmation' 
                  ? 'text-green-600' 
                  : 'text-gray-400'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  checkoutStep === 'payment' 
                    ? 'bg-amber-600 text-white' 
                    : checkoutStep === 'confirmation'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                Payment
              </div>
              <div className={`text-center flex-1 ${checkoutStep === 'confirmation' ? 'text-amber-600 font-bold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  checkoutStep === 'confirmation' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  4
                </div>
                Confirmation
              </div>
            </div>
            
            <div className="flex mt-4 mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
              <div className={`absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 -translate-y-1/2 transition-all duration-500 ${
                checkoutStep === 'cart' ? 'w-0' :
                checkoutStep === 'delivery' ? 'w-1/3' :
                checkoutStep === 'payment' ? 'w-2/3' :
                'w-full'
              }`}></div>
            </div>
          </div>
          
          {renderCheckoutStep()}
        </div>
      </div>
    </div>
  );
};

export default App;