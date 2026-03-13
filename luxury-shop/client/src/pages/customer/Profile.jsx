import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiUser, FiMapPin, FiClock } from 'react-icons/fi';

const API = 'http://localhost:6001/api';

const s = {
  page:     { minHeight:'100vh', background:'var(--bg)', padding:'48px' },
  top:      { display:'grid', gridTemplateColumns:'300px 1fr', gap:'32px', alignItems:'start' },
  card:     { background:'#fff', borderRadius:8, border:'1px solid var(--border)', padding:'32px', textAlign:'center' },
  avatar:   { width:80, height:80, borderRadius:'50%', background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28, color:'var(--gold)' },
  uname:    { fontFamily:'Cormorant Garamond,serif', fontSize:'24px', fontWeight:500, color:'var(--navy)', marginBottom:4 },
  uemail:   { fontSize:'12px', color:'var(--text-muted)', marginBottom:20 },
  badge:    { display:'inline-block', padding:'4px 12px', background:'var(--gold)', color:'var(--navy)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', borderRadius:2 },
  statRow:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:24 },
  stat:     { background:'var(--bg)', borderRadius:4, padding:'16px', textAlign:'center' },
  statNum:  { fontFamily:'Cormorant Garamond,serif', fontSize:'28px', fontWeight:500, color:'var(--navy)' },
  statLbl:  { fontSize:'11px', color:'var(--text-muted)', letterSpacing:'0.5px' },
  orders:   { background:'#fff', borderRadius:8, border:'1px solid var(--border)', padding:'32px' },
  otitle:   { fontFamily:'Cormorant Garamond,serif', fontSize:'26px', fontWeight:400, color:'var(--navy)', marginBottom:24 },
  ocard:    { border:'1px solid var(--border)', borderRadius:6, padding:'20px', display:'flex', gap:'20px', marginBottom:'16px', transition:'box-shadow 0.2s' },
  oimg:     { width:72, height:88, objectFit:'cover', borderRadius:4, flexShrink:0, background:'#f0ede8' },
  oinfo:    { flex:1 },
  obrand:   { fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 },
  oname:    { fontFamily:'Cormorant Garamond,serif', fontSize:'17px', fontWeight:500, color:'var(--navy)', marginBottom:6 },
  ometa:    { fontSize:'12px', color:'var(--text-muted)', marginBottom:8 },
  ostatus:  { display:'inline-flex', alignItems:'center', gap:6, fontSize:'11px', fontWeight:600, padding:'4px 10px', borderRadius:2 },
  oprice:   { fontWeight:700, fontSize:'17px', color:'var(--navy)' },
  empty:    { textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' },
};

const statusColors = {
  'Order Placed':  { background:'#EFF6FF', color:'#1D4ED8' },
  'Processing':    { background:'#FFFBEB', color:'#B45309' },
  'Shipped':       { background:'#F0FDF4', color:'#15803D' },
  'Delivered':     { background:'#F0FDF4', color:'#15803D' },
  'Cancelled':     { background:'#FEF2F2', color:'#DC2626' },
};

const Profile = () => {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem('username') || 'Guest';
  const email    = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    axios.get(`${API}/orders/fetch-orders`)
      .then(r => setOrders(Array.isArray(r.data) ? r.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const totalSpend = orders.reduce((s, o) => {
    const fp = Math.round(o.price - (o.price * (o.discount || 0)) / 100);
    return s + fp * (o.quantity || 1);
  }, 0);

  return (
    <div style={s.page}>
      <div style={{marginBottom:32}}>
        <span style={{fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)'}}>My Account</span>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'36px',fontWeight:400,color:'var(--navy)'}}>Profile</h1>
      </div>

      <div style={s.top}>
        {/* Profile Card */}
        <div style={s.card}>
          <div style={s.avatar}><FiUser /></div>
          <div style={s.uname}>{username}</div>
          <div style={s.uemail}>{email}</div>
          <span style={s.badge}>Customer</span>
          <div style={s.statRow}>
            <div style={s.stat}>
              <div style={s.statNum}>{orders.length}</div>
              <div style={s.statLbl}>Orders</div>
            </div>
            <div style={s.stat}>
              <div style={s.statNum}>₹{Math.floor(totalSpend/1000)}k</div>
              <div style={s.statLbl}>Spent</div>
            </div>
          </div>
          <button className="btn-outline" style={{width:'100%',justifyContent:'center',marginTop:24}}
            onClick={() => navigate('/')}>Continue Shopping</button>
        </div>

        {/* Orders */}
        <div style={s.orders}>
          <h2 style={s.otitle}>Order History <span style={{fontSize:'14px',color:'var(--text-muted)',fontFamily:'Inter'}}>({orders.length})</span></h2>

          {loading ? (
            <div className="luxury-spinner"><div className="spinner-ring" /></div>
          ) : orders.length === 0 ? (
            <div style={s.empty}>
              <FiPackage style={{fontSize:48, color:'var(--border)', marginBottom:16}} />
              <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'var(--navy)',marginBottom:8}}>No orders yet</h3>
              <p style={{marginBottom:24}}>Your order history will appear here.</p>
              <button className="btn-luxury" onClick={() => navigate('/')}>Start Shopping</button>
            </div>
          ) : (
            orders.map(order => {
              const fp = Math.round(order.price - (order.price * (order.discount||0)) / 100);
              const sc = statusColors[order.orderStatus] || statusColors['Order Placed'];
              return (
                <div key={order._id} style={s.ocard}
                  onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                  <img src={order.mainImg} alt={order.title} style={s.oimg} />
                  <div style={s.oinfo}>
                    <div style={s.obrand}>VELOUR</div>
                    <div style={s.oname}>{order.title}</div>
                    <div style={s.ometa}>
                      {order.size && `Size: ${order.size}`}
                      {order.color && ` · ${order.color}`}
                      {order.quantity > 1 && ` · Qty: ${order.quantity}`}
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
                      <span style={{...s.ostatus,...sc}}>● {order.orderStatus}</span>
                      <span style={s.oprice}>₹{(fp*(order.quantity||1)).toLocaleString()}</span>
                    </div>
                    {order.orderDate && (
                      <div style={{display:'flex',alignItems:'center',gap:4,marginTop:8,fontSize:'11px',color:'var(--text-muted)'}}>
                        <FiClock style={{fontSize:12}} />
                        {new Date(order.orderDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
                      </div>
                    )}
                    {order.address && (
                      <div style={{display:'flex',alignItems:'center',gap:4,marginTop:4,fontSize:'11px',color:'var(--text-muted)'}}>
                        <FiMapPin style={{fontSize:12}} />
                        {order.address}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
