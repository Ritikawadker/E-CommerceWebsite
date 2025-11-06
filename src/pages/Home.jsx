import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = ({ searchbar }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

const filteredProducts = products.filter((product) => {
  let title = product.title || "";
  let category = product.category || "";
  
  let searchTerm = searchbar.toLowerCase();

  title = title.toLowerCase();
  category = category.toLowerCase();

  return title.includes(searchTerm) || category.includes(searchTerm);
});

  return (
    <div className="home-container">
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
              <img src={product.image} alt={product.title} className="product-image" />
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">${product.price}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No products found !! Please enter valid search</p>
         
        )}
      </div>
    </div>
  );
};

export default Home;
