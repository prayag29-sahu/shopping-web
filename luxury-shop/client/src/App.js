import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualProduct from './pages/customer/IndividualProduct';
import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import Admin from './pages/admin/Admin';
import AllProducts from './pages/admin/AllProducts';
import AllOrders from './pages/admin/AllOrders';
import AllUsers from './pages/admin/AllUsers';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import './styles/globals.css';

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const userId   = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  if (!userId)                          return <Navigate to="/auth" replace />;
  if (adminOnly && userType !== 'admin') return <Navigate to="/"    replace />;
  return element;
};

const App = () => (
  <>
    <Navbar />
    <Routes>
      {/* Public */}
      <Route path="/"            element={<Home />} />
      <Route path="/auth"        element={<Authentication />} />
      <Route path="/category/:category" element={<CategoryProducts />} />
      <Route path="/product/:id" element={<IndividualProduct />} />

      {/* Customer */}
      <Route path="/cart"    element={<ProtectedRoute element={<Cart />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

      {/* Admin */}
      <Route path="/admin"          element={<ProtectedRoute element={<Admin />}         adminOnly />} />
      <Route path="/all-products"   element={<ProtectedRoute element={<AllProducts />}   adminOnly />} />
      <Route path="/all-orders"     element={<ProtectedRoute element={<AllOrders />}     adminOnly />} />
      <Route path="/all-users"      element={<ProtectedRoute element={<AllUsers />}      adminOnly />} />
      <Route path="/new-product"    element={<ProtectedRoute element={<NewProduct />}    adminOnly />} />
      <Route path="/update-product/:id" element={<ProtectedRoute element={<UpdateProduct />} adminOnly />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default App;
