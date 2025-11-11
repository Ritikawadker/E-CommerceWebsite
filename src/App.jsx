import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import CartPage from './pages/cartPage';
import CheckOut from './pages/checkOut';
import MyOrders from './pages/myOrders';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [searchbar, setSearchbar] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchbar={searchbar}
              selectedCategory={selectedCategory}
              setSearchbar={setSearchbar}
              setSelectedCategory={setSelectedCategory}
            />
          }
        />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/myorders" element={<MyOrders />} />
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
