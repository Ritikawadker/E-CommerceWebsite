import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Product.css"

const Product = () => {
  const { id } = useParams();  
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-container">
      <button onClick={() => navigate('/')} className="back-button">Go Back</button>
      <div className="product-details">
        <img src={product.image} alt={product.title} className="product-image" />
        <h2>{product.title}</h2>
        <p><strong>Category:</strong> {product.category}</p>
        <p className="description">{product.description}</p>
        <p><strong>Price:</strong> ${product.price}</p>
      </div>
    </div>
  );
};

export default Product;

