import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const GeneralContext = createContext();

const API = 'http://localhost:6001/api';

export const GeneralContextProvider = ({ children }) => {
  const navigate  = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) { setCartCount(0); return; }
      const r    = await axios.get(`${API}/cart/fetch-cart`);
      const data = Array.isArray(r.data) ? r.data : [];
      const total = data.reduce((s, item) => s + (parseInt(item.quantity) || 0), 0);
      setCartCount(total);
    } catch { setCartCount(0); }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    setCartCount(0);
    navigate('/auth');
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) fetchCartCount();
  }, []);

  return (
    <GeneralContext.Provider value={{ cartCount, setCartCount, fetchCartCount, logout }}>
      {children}
    </GeneralContext.Provider>
  );
};
