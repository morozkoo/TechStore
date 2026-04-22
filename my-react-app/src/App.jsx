import { useState } from 'react';
import Header from './components/layout/Header';
import ProductGrid from './components/features/ProductGrid';
import ShoppingCart from './components/features/ShoppingCart';
import PriceFilter from './components/features/PriceFilter';
import { products as initialProducts } from './data/products';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const filteredProducts = initialProducts.filter((product) => {
    const matchesPrice =
      (!minPrice || product.price >= Number(minPrice)) &&
      (!maxPrice || product.price <= Number(maxPrice));
    const matchesRating = product.rating >= minRating;
    return matchesPrice && matchesRating;
  });

  return (
    <div className="app">
      <Header title="🛒 TechStore" />

      <div className="main-content">
        <aside className="sidebar">
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
          />

          <div className="rating-filter">
            <h4>Рейтинг</h4>
            <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value={0}>Любой</option>
              <option value={4}>4+ звезды</option>
              <option value={4.5}>4.5+ звезды</option>
            </select>
          </div>
        </aside>

        <main className="products">
          <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
        </main>

        <aside className="cart-sidebar">
          <ShoppingCart
            items={cart}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
