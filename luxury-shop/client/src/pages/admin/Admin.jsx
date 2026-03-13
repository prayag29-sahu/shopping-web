import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiUsers, FiShoppingBag, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { MdInventory } from 'react-icons/md';

const API = 'http://localhost:6001/api';

const s = {
  page:    { minHeight:'100vh', background:'var(--bg)', padding:'40px 48px' },
  heading: { marginBottom:40 },
  eyebrow: { fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',display:'block',marginBottom:8 },
  title:   { fontFamily:'Cormorant Garamond,serif',fontSize:'38px',fontWeight:400,color:'var(--navy)' },
  grid4:   { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:40 },
  statCard:{ background:'#fff', borderRadius:8, padding:'24px', border:'1px solid var(--border)' },
  statIcon:{ width:44,height:44,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:16 },
  statNum: { fontFamily:'Cormorant Garamond,serif',fontSize:'36px',fontWeight:500,color:'var(--navy)',lineHeight:1 },
  statLbl: { fontSize:'12px',color:'var(--text-muted)',marginTop:4,letterSpacing:'0.5px' },
  grid2:   { display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 },
  panel:   { background:'#fff',borderRadius:8,border:'1px solid var(--border)',padding:'28px' },
  panHead: { display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 },
  panTitle:{ fontFamily:'Cormorant Garamond,serif',fontSize:'22px',fontWeight:400,color:'var(--navy)' },
  panLink: { fontSize:'11px',letterSpacing:'1px',textTransform:'uppercase',color:'var(--gold)',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:4 },
  row:     { display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid var(--border)' },
  rowImg:  { width:44,height:52,objectFit:'cover',borderRadius:4,flexShrink:0,background:'#f0ede8' },
  rowName: { fontFamily:'Cormorant Garamond,serif',fontSize:'15px',fontWeight:500,color:'var(--navy)',flex:1 },
  rowMeta: { fontSize:'11px',color:'var(--text-muted)' },
  banner:  { background:'var(--navy)',borderRadius:8,padding:'32px',display:'flex',gap:24,alignItems:'center',marginBottom:32 },
  banImg:  { width:120,height:80,objectFit:'cover',borderRadius:4,flexShrink:0 },
  banInfo: { flex:1 },
  banTitle:{ fontFamily:'Cormorant Garamond,serif',fontSize:'20px',color:'#fff',marginBottom:6 },
  banSub:  { fontSize:'12px',color:'rgba(255,255,255,0.5)',marginBottom:12 },
};

const STAT_COLORS = [
  { bg:'#EFF6FF', color:'#1D4ED8' },
  { bg:'#FFF7ED', color:'#C2410C' },
  { bg:'#F0FDF4', color:'#15803D' },
  { bg:'#FAF5FF', color:'#7E22CE' },
];

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [users,    setUsers]    = useState([]);
  const [banner,   setBanner]   = useState('');
  const [newBanner,setNewBanner]= useState('');
  const [toast,    setToast]    = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    axios.get(`${API}/products/fetch-products`).then(r => setProducts(r.data)).catch(()=>{});
    axios.get(`${API}/orders/all-orders`).then(r => setOrders(Array.isArray(r.data)?r.data:[])).catch(()=>{});
    axios.get(`${API}/admin/fetch-all-users`).then(r => setUsers(Array.isArray(r.data)?r.data:[])).catch(()=>{});
    axios.get(`${API}/banners`).then(r => setBanner(r.data)).catch(()=>{});
  }, []);

  const totalRevenue = orders.reduce((s,o) => {
    const fp = Math.round(o.price - (o.price*(o.discount||0)/100));
    return s + fp*(o.quantity||1);
  }, 0);

  const updateBanner = async () => {
    if (!newBanner.trim()) return;
    try {
      await axios.put(`${API}/admin/update-banner`, { banner: newBanner });
      setBanner(newBanner); setNewBanner('');
      showToast('Banner updated!');
    } catch { showToast('Failed to update banner'); }
  };

  const stats = [
    { icon: <MdInventory />,    label:'Total Products', value: products.length, ...STAT_COLORS[0] },
    { icon: <FiShoppingBag />, label:'Total Orders',   value: orders.length,   ...STAT_COLORS[1] },
    { icon: <FiUsers />,       label:'Customers',      value: users.filter(u=>u.usertype!=='admin').length, ...STAT_COLORS[2] },
    { icon: <FiTrendingUp />,  label:'Revenue',        value:`₹${Math.floor(totalRevenue/1000)}k`, ...STAT_COLORS[3] },
  ];

  return (
    <div style={s.page}>
      <div style={s.heading}>
        <span style={s.eyebrow}>Control Centre</span>
        <h1 style={s.title}>Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div style={s.grid4}>
        {stats.map(st => (
          <div key={st.label} style={s.statCard}>
            <div style={{...s.statIcon, background:st.bg, color:st.color}}>{st.icon}</div>
            <div style={s.statNum}>{st.value}</div>
            <div style={s.statLbl}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div style={s.banner}>
        {banner && <img src={banner} alt="banner" style={s.banImg} />}
        <div style={s.banInfo}>
          <div style={s.banTitle}>Hero Banner</div>
          <div style={s.banSub}>Update the homepage banner image URL below</div>
          <div style={{display:'flex',gap:8}}>
            <input value={newBanner} onChange={e=>setNewBanner(e.target.value)}
              placeholder="Paste new Unsplash image URL..."
              style={{flex:1,padding:'10px 14px',borderRadius:4,border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',color:'#fff',fontSize:12,outline:'none'}} />
            <button className="btn-gold" onClick={updateBanner} style={{padding:'10px 20px',fontSize:'10px'}}>Update</button>
          </div>
        </div>
      </div>

      <div style={s.grid2}>
        {/* Recent Orders */}
        <div style={s.panel}>
          <div style={s.panHead}>
            <h3 style={s.panTitle}>Recent Orders</h3>
            <button style={s.panLink} onClick={() => navigate('/all-orders')}>View All <FiArrowRight /></button>
          </div>
          {orders.slice(0,6).map(o => (
            <div key={o._id} style={s.row}>
              <img src={o.mainImg} alt={o.title} style={s.rowImg} />
              <div style={{flex:1}}>
                <div style={s.rowName}>{o.title}</div>
                <div style={s.rowMeta}>{o.name} · {o.orderStatus}</div>
              </div>
              <div style={{fontSize:'14px',fontWeight:600,color:'var(--navy)'}}>
                ₹{Math.round(o.price-(o.price*(o.discount||0)/100)).toLocaleString()}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p style={{color:'var(--text-muted)',fontSize:13,textAlign:'center',padding:'20px 0'}}>No orders yet</p>}
        </div>

        {/* Product Inventory */}
        <div style={s.panel}>
          <div style={s.panHead}>
            <h3 style={s.panTitle}>Inventory</h3>
            <button style={s.panLink} onClick={() => navigate('/all-products')}>Manage <FiArrowRight /></button>
          </div>
          {products.slice(0,6).map(p => (
            <div key={p._id} style={s.row}>
              <img src={p.mainImg} alt={p.name} style={s.rowImg} />
              <div style={{flex:1}}>
                <div style={s.rowName}>{p.name}</div>
                <div style={s.rowMeta}>{p.category} · {p.stock} in stock</div>
              </div>
              <div style={{fontSize:'14px',fontWeight:600,color:'var(--navy)'}}>₹{p.price.toLocaleString()}</div>
            </div>
          ))}
          {products.length === 0 && (
            <div style={{textAlign:'center',padding:'24px 0'}}>
              <p style={{color:'var(--text-muted)',fontSize:13,marginBottom:12}}>No products yet</p>
              <button className="btn-luxury" onClick={() => navigate('/new-product')} style={{fontSize:'10px',padding:'8px 16px'}}>Add First Product</button>
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast-luxury">{toast}</div>}
    </div>
  );
};

export default Admin;
