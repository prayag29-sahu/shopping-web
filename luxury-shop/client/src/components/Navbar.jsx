import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiSearch, FiLogOut } from 'react-icons/fi';
import { MdDashboard, MdInventory, MdPeople, MdListAlt, MdAddBox } from 'react-icons/md';
import { GeneralContext } from '../context/GeneralContext';
import '../styles/Navbar.css';

const CATEGORIES = ['Men', 'Women', 'Boys', 'Girls', 'Kids'];

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount, logout } = useContext(GeneralContext);
    const [search, setSearch] = useState('');

    const userType = localStorage.getItem('userType');
    const username = localStorage.getItem('username');

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/category/${search.trim()}`);
    };

    if (!userType) return (
        <nav className="navbar-luxury">
            <div className="navbar-top">Free shipping on orders over <span>₹2999</span> — Shop the new collection</div>
            <div className="navbar-main">
                <div className="navbar-brand" onClick={() => navigate('/')}>VEL<span>O</span>UR</div>
                <form className="navbar-search" onSubmit={handleSearch}>
                    <FiSearch className="navbar-search-icon" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search styles, categories..." />
                </form>
                <div className="navbar-actions">
                    <button className="navbar-action-btn" onClick={() => navigate('/auth')}>
                        <FiUser />
                        <span>Sign In</span>
                    </button>
                    <button className="navbar-action-btn" onClick={() => navigate('/auth')}>
                        <FiShoppingBag />
                        <span>Bag</span>
                    </button>
                </div>
            </div>
            <div className="navbar-cats">
                {CATEGORIES.map(cat => (
                    <button key={cat} className="navbar-cat-link" onClick={() => navigate(`/category/${cat}`)}>{cat}</button>
                ))}
            </div>
        </nav>
    );

    if (userType === 'admin') return (
        <nav className="navbar-admin">
            <div className="navbar-admin-brand" onClick={() => navigate('/admin')}>VEL<span>O</span>UR <span style={{ fontSize: '11px', letterSpacing: '2px', opacity: .6 }}>ADMIN</span></div>
            <div className="navbar-admin-links">
                {[
                    { label: 'Dashboard', icon: <MdDashboard />, path: '/admin' },
                    { label: 'Products', icon: <MdInventory />, path: '/all-products' },
                    { label: 'Users', icon: <MdPeople />, path: '/all-users' },
                    { label: 'Orders', icon: <MdListAlt />, path: '/all-orders' },
                    { label: 'Add', icon: <MdAddBox />, path: '/new-product' },
                ].map(item => (
                    <button key={item.path}
                        className={`navbar-admin-link${location.pathname === item.path ? ' active' : ''}`}
                        onClick={() => navigate(item.path)}>
                        {item.icon} {item.label}
                    </button>
                ))}
                <button className="navbar-admin-link" onClick={logout}><FiLogOut /> Logout</button>
            </div>
        </nav>
    );

    return (
        <nav className="navbar-luxury">
            <div className="navbar-top">Free shipping on orders over <span>₹2999</span> — Shop the new collection</div>
            <div className="navbar-main">
                <div className="navbar-brand" onClick={() => navigate('/')}>VEL<span>O</span>UR</div>
                <form className="navbar-search" onSubmit={handleSearch}>
                    <FiSearch className="navbar-search-icon" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search styles, categories..." />
                </form>
                <div className="navbar-actions">
                    <button className="navbar-action-btn" onClick={() => navigate('/profile')}>
                        <FiUser />
                        <span className="navbar-user-name">{username?.split(' ')[0]}</span>
                    </button>
                    <button className="navbar-action-btn" onClick={() => navigate('/cart')}>
                        <FiShoppingBag />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        <span>Bag ({cartCount})</span>
                    </button>
                    <button className="navbar-action-btn" onClick={logout}><FiLogOut /><span>Out</span></button>
                </div>
            </div>
            <div className="navbar-cats">
                {CATEGORIES.map(cat => (
                    <button key={cat}
                        className={`navbar-cat-link${location.pathname === `/category/${cat}` ? ' active' : ''}`}
                        onClick={() => navigate(`/category/${cat}`)}>
                        {cat}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
