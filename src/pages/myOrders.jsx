import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/myOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/order/getOrder')
      .then(response => {
        const ordersWithUpdatedStatus = response.data.map(order => {
          const orderTime = new Date(order.orderDate).getTime();
          const now = Date.now();
          const hoursElapsed = (now - orderTime) / (1000 * 60 * 60);

          // Update status: PENDING -> SUCCESS after 6 hours
          let updatedStatus = order.status;
          if (order.status === 'PENDING' && hoursElapsed > 6) {
            updatedStatus = 'SUCCESS';
          }
          return { ...order, status: updatedStatus };
        });
        setOrders(ordersWithUpdatedStatus);
      })
      .catch(error => {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      });
  }, []);

  return (
    <div className="myorders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders-msg">You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div><strong>Order ID:</strong> {order.id}</div>
                <div><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</div>
                <div>
                  <strong>Status:</strong>{' '}
                  <span className={`status-label status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-section">
                <h4>Shipping Address</h4>
                {order.address ? (
                  <>
                    <p>{order.address.fullName}</p>
                    <p>{order.address.phone}</p>
                    <p>{order.address.addressLine1}</p>
                    {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  </>
                ) : (
                  <p>No address available</p>
                )}
              </div>

              <div className="order-section">
                <h4>Order Items</h4>
                {order.orderItems && order.orderItems.length > 0 ? (
                  <ul className="order-items-list">
                    {order.orderItems.map(item => (
                      <li key={item.productId} className="order-item">
                        <img src={item.productImage} alt={item.productTitle} />
                        <div className="item-details">
                          <p className="item-title">{item.productTitle}</p>
                          <p>Price: ${item.productPrice.toFixed(2)}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Total: ${(item.lineTotal).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No order items available</p>
                )}
              </div>

              <div className="order-totals">
                <p><strong>Promo Code Used:</strong> {order.promoCodeUsed || 'N/A'}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                <p><strong>Discount:</strong> ${order.discountAmount.toFixed(2)}</p>
                <p><strong>Final Amount:</strong> ${order.finalAmount.toFixed(2)}</p>
                <p><strong>Expected Delivery:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
