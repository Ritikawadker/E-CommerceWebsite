import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import GavelIcon from '@mui/icons-material/Gavel';
import image from "../assets/logo.png.jpg";
import "../styles/Header.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AnimatedSiteName = ({ text }) => {
  return (
    <h1 className="site-name">
      {text.split('').map((char, i) =>
        char === ' ' ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span key={i} className="site-char">{char}</span>
        )
      )}
    </h1>
  );
};

const Header = ({ searchbar, setSearchbar }) => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const badgeText = cartCount > 9 ? '9+' : cartCount;

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleProfile = () => {
    setProfileOpen(prev => !prev);
  };

  const handleNavigation = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="header">
      <div className="logo-section" onClick={() => navigate('/')}>
        <img src={image} alt="Website Logo" className="logo" />
        <i>
          <AnimatedSiteName text="E-Shop platform" />
        </i>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter product name or category"
          value={searchbar}
          onChange={(e) => setSearchbar(e.target.value)}
        />
        <SearchIcon className="search-icon" />
      </div>

      <div className="icon-section">
        <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
          <ShoppingCartIcon className="icon" />
          {cartCount > 0 && (
            <span className="cart-badge">{badgeText}</span>
          )}
        </div>

        <NotificationsIcon className="icon" />

        <div className="profile-wrapper" ref={profileRef}>
          <PersonOutlineIcon
            className="icon profile-icon"
            onClick={handleToggleProfile}
          />
          {profileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={() => handleNavigation('/login')}>
                <LoginIcon fontSize="small" className="dropdown-icon" /> Login
              </div>
              <div className="dropdown-item" onClick={() => alert("Logout Clicked!")}>
                <LogoutIcon fontSize="small" className="dropdown-icon" /> Logout
              </div>
              <div className="dropdown-item" onClick={() => handleNavigation('/myorders')}>
                <ShoppingBasketIcon fontSize="small" className="dropdown-icon" /> My Orders
              </div>
              <div className="dropdown-item" onClick={() => handleNavigation('/terms')}>
                <GavelIcon fontSize="small" className="dropdown-icon" /> Terms
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
