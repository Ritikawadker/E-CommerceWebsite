// src/components/Navbar.jsx

import React, { useState } from 'react';
import '../styles/Navbar.css';

const categories = [
  { label: 'All', value: 'all' },
  { label: "Men's Clothing", value: "men's clothing" },
  { label: "Women's Clothing", value: "women's clothing" },
  { label: 'Jewelery', value: 'jewelery' },
  { label: 'Electronics', value: 'electronics' },
];

const Navbar = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryClick = (value) => {
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {categories.map((cat) => (
          <li
            key={cat.value}
            className={`nav-item ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.value)}
          >
            {cat.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
