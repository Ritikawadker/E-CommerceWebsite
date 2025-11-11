import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/checkOut.css';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


const CheckOut = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address, setAddress] = useState({
    id: null,
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });


  const [loadingAddress, setLoadingAddress] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);


  const [promoCode, setPromoCode] = useState('');
  const [availablePromoCodes, setAvailablePromoCodes] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(totalAmount);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    axios.get('http://localhost:8080/AddressItem/getAddress')
      .then(res => {
        if (res.data.length > 0) {
          const savedAddress = res.data[0];
          setAddress({
            id: savedAddress.id,
            fullName: savedAddress.fullName,
            phone: savedAddress.phone,
            addressLine1: savedAddress.addressLine1,
            addressLine2: savedAddress.addressLine2,
            city: savedAddress.city,
            state: savedAddress.state,
            pincode: savedAddress.pincode,
          });
        }
        setLoadingAddress(false);
      })
      .catch(() => setLoadingAddress(false));
  }, []);


  useEffect(() => {
    setFinalAmount(totalAmount - discountAmount);
  }, [totalAmount, discountAmount]);


  useEffect(() => {
    axios.get('http://localhost:8080/promocode/getpromocode')
      .then(res => {
        const activePromos = res.data.filter(promo => promo.isActive);
        setAvailablePromoCodes(activePromos);
      })
      .catch(() => setAvailablePromoCodes([]));
  }, []);


  const handleAddressChange = e => {
    if (!isEditMode) return;
    setAddress({ ...address, [e.target.name]: e.target.value });
  };


  const handleEditOrSave = () => {
    if (!isEditMode) {
      // Switch to edit mode
      setIsEditMode(true);
    } else {
      // Save mode - save to database
      if (address.id) {
        // Update existing address
        axios.put(`http://localhost:8080/AddressItem/update/${address.id}`, address)
          .then(() => {
            setIsEditMode(false);
          })
          .catch(() => {});
      } else {
        // Save new address
        axios.post('http://localhost:8080/AddressItem/insert', address)
          .then(res => {
            setAddress(prev => ({ ...prev, id: res.data.id }));
            setIsEditMode(false);
          })
          .catch(() => {});
      }
    }
  };


  const applyDiscountByCode = code => {
    const promo = availablePromoCodes.find(p => p.code === code);
    return promo ? totalAmount * (promo.discountPercentage / 100) : 0;
  };


  const handleApplyPromo = () => {
    const discount = applyDiscountByCode(promoCode.trim().toUpperCase());
    if (discount > 0) setDiscountAmount(discount);
    else setDiscountAmount(0);
  };


  const handleProceedToPay = () => {
    if (cartItems.length === 0) return;


    const requiredFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!address[field]) return;
    }


    const orderRequest = {
      userId: "Ritik",
      totalAmount,
      discountAmount,
      finalAmount,
      status: "PENDING",
      orderDate: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      promoCodeUsed: promoCode.trim().toUpperCase(),
      orderItems: cartItems.map(item => ({
        productId: item.id,
        productTitle: item.title,
        productPrice: item.price,
        quantity: item.quantity,
        lineTotal: item.price * item.quantity,
        productImage: item.image,
      })),
      address: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
    };


    axios.post('http://localhost:8080/order/insert', orderRequest)
      .then(() => {
        setModalVisible(true);
        dispatch(clearCart());
      })
      .catch(() => {});
  };


  const handleCloseModal = () => setModalVisible(false);
  const handleSeeOrderDetails = () => {
    setModalVisible(false);
    navigate('/myorders');
  };


  if (loadingAddress) return <div>Loading address...</div>;


  return (
    <div className="checkout-container">
      <div className="checkout-main">
        <form className="checkout-form" onSubmit={e => e.preventDefault()}>
          <h3>Shipping Address</h3>
          {['fullName', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'pincode'].map(field => (
            <div key={field} className="form-row">
              <label>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                {field !== 'addressLine2' && <span>*</span>}
              </label>
              <input
                type={field === 'phone' ? "tel" : "text"}
                name={field}
                value={address[field]}
                onChange={handleAddressChange}
                disabled={!isEditMode}
                required={field !== 'addressLine2'}
                placeholder={field === "addressLine2" ? "Optional" : ""}
              />
            </div>
          ))}
          <div className="address-buttons">
            <button 
              type="button" 
              className="edit-save-btn"
              onClick={handleEditOrSave}
            >
              {isEditMode ? 'Save' : 'Edit'}
            </button>
          </div>
        </form>


        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul className="summary-list">
            {cartItems.map(item => (
              <li key={item.id} className="summary-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <p className="title">{item.title}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>


          <div className="promo-code-container gift-theme">
            <label htmlFor="promo-input">Enter Promo Code</label>
            <div className="promo-row">
              <input 
                list="promo-codes" 
                id="promo-input" 
                value={promoCode} 
                onChange={e => setPromoCode(e.target.value)} 
                placeholder="Select or enter promo code" 
              />
              <datalist id="promo-codes">
                {availablePromoCodes.map(promo => (
                  <option key={promo.id} value={promo.code} />
                ))}
              </datalist>
              <button type="button" onClick={handleApplyPromo}>Apply</button>
            </div>
          </div>


          <div className="summary-totals">
            <p>Total: <strong>${totalAmount.toFixed(2)}</strong></p>
            <p>Discount: <strong>${discountAmount.toFixed(2)}</strong></p>
            <p>Final Amount: <strong>${finalAmount.toFixed(2)}</strong></p>
          </div>


          <button 
            type="button" 
            className="place-order-btn" 
            onClick={handleProceedToPay}
          >
            Proceed to Pay
          </button>
        </div>
      </div>


      {modalVisible && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <ThumbUpIcon fontSize="large" htmlColor="#28a745" style={{ marginRight: 10 }} />
            <h3>Order Placed Successfully !!</h3>
            <button onClick={handleSeeOrderDetails} className="modal-btn">See Your Order Details</button>
            <button onClick={handleCloseModal} className="modal-btn modal-close">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default CheckOut;