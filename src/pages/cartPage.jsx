import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../redux/cartSlice';
import '../styles/cartPage.css';

const CartPage = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return <h2 className="empty-cart-msg">Your cart is empty !!</h2>;
  }

  return (
     <>
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.title} className="cart-item-image" />
          <div className="cart-item-details">
            <h4>{item.title}</h4>
            <p>Price: ${item.price.toFixed(2)}</p>
            <div className="quantity-control">
              <button 
                className="quantity-btn" 
                onClick={() => dispatch(decreaseQuantity(item.id))}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={() => dispatch(increaseQuantity(item.id))}
              >
                +
              </button>
            </div>
            <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button onClick={() => dispatch(removeFromCart(item.id))} className="remove-btn">Remove</button>
        </div>
      ))}


    </div>
      <button
        className="checkout-btn"
        onClick={() => navigate('/checkout')}
      >
        Proceed to Checkout
      </button>
     </>

  );
};

export default CartPage;
