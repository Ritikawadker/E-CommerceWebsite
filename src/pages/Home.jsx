import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import Navbar from '../components/Navbar';
import '../styles/Home.css';

const Home = ({ searchbar, selectedCategory, setSearchbar, setSelectedCategory }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('http://localhost:8080/products/getProducts')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error("Failed to fetch products", err));
  }, []);

  const filteredProducts = products.filter(product => {
    const title = product.title?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    const searchTerm = searchbar?.toLowerCase() || '';
    const matchesSearch = title.includes(searchTerm) || category.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const StarRating = ({ rate }) => {
    const validRate = typeof rate === "number" ? rate : 0;
    return (
      <div className="rating">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={`star${i <= Math.round(validRate) ? "filled" : ""}`}>★</span>
        ))}
      </div>
    );
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  return (
    <div className="home-container">
      <Navbar onCategoryChange={setSelectedCategory} />
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img src={product.image} alt={product.title} className="product-image" />
              <h3 className="product-title">{product.title}</h3>
              <StarRating rate={product.rate} />
              <p className="product-price">${product.price?.toFixed(2)}</p>
              <button
                className="add-to-cart-btn"
                onClick={(e) => handleAddToCart(product, e)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No products found !! Please enter a valid search</p>
        )}
      </div>
    </div>
  );
};

export default Home;
