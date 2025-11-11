import { createSlice } from '@reduxjs/toolkit';

const loadCartFromLocalStorage = () => {
  try {
    const data = localStorage.getItem('cart');
    if (data) return JSON.parse(data);
  } catch (err) {}
  return {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0,
  };
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.cartItems.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
        existing.totalPrice += item.price;
      } else {
        state.cartItems.push({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: 1,
          totalPrice: item.price,
          image: item.image,
        });
      }
      state.totalQuantity += 1;
      state.totalAmount += item.price;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    removeFromCart(state, action) {
      const id = action.payload;
      const existing = state.cartItems.find(i => i.id === id);
      if (existing) {
        state.totalQuantity -= existing.quantity;
        state.totalAmount -= existing.totalPrice;
        state.cartItems = state.cartItems.filter(i => i.id !== id);
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },

    increaseQuantity(state, action) {
      const id = action.payload;
      const item = state.cartItems.find(i => i.id === id);
      if (item) {
        item.quantity += 1;
        item.totalPrice += item.price;
        state.totalQuantity += 1;
        state.totalAmount += item.price;
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },

    decreaseQuantity(state, action) {
      const id = action.payload;
      const item = state.cartItems.find(i => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice -= item.price;
        state.totalQuantity -= 1;
        state.totalAmount -= item.price;
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },

    clearCart(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
