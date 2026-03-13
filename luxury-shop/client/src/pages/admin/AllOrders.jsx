import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiClock, FiPackage } from 'react-icons/fi';

const API = 'http://localhost:6001/api';

const STATUS_OPTIONS = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  'Order Placed':{ bg:'#EFF6FF', color:'#1D4ED8' },
  'Processing':  { bg:'#FFFBEB', color:'#B45309' },
  'Shipped':     { bg:'#F0FDF4', color:'#15803D' },
  'Delivered':   { bg:'#F0FDF4', color:'#15803D' },
  'Cancelled':   { bg:'#FEF2F2', color:'#DC2626' },
};

const s = {
  page:  { minHeight:'100vh', background:'var(--bg)', padding:'40px 48px' },
  topBar:{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32 },
  title: { fontFamily:'Cormorant Garamond,serif',fontSize:'36px',fontWeight:400,color:'var(--navy)' },
  search:{ display:'flex',alignItems:'center',gap:8,padding:'0 16px',border:'1px solid var(--border)',borderRadius:'var(--radius)',background:'#fff',width:280 },
  sinp:  { border:'none',outline:'none',padding:'10px 8px',fontSize:13,flex:1,color:'var(--text)',fontFamily:'Inter,sans-serif' },
  tabs:  { display:'flex',gap:4,marginBottom:28,background:'#fff',border:'1px solid var(--border)',borderRadius:6,padding:4,width:'fit-content' },
  tab:   { padding:'8px 18px',borderRadius:4,border:'none',background:'transparent',cursor:'pointer',fontSize:12,fontWeight:500,color:'var(--text-muted)',letterSpacing:'0.3px',transition:'all 0.2s' },
  tabA:  { background:'var(--navy)',color:'#fff' },
  grid:  { display:'flex',flexDirection:'column',gap:12 },
  card:  { background:'#fff',borderRadius:8,border:'1px solid var(--border)',padding:'20px',display:'flex',gap:'20px',alignItems:'flex-start' },
  img:   { width:64,height:78,objectFit:'cover',borderRadius:4,flexShrink:0,background:'#f0ede8' },
  info:  { flex:1 },
  name:  { fontFamily:'Cormorant Garamond,serif',fontSize:'17px',fontWeight:500,color:'var(--navy)',marginBottom:4 },
  meta:  { fontSize:'12px',color:'var(--text-muted)',marginBottom:8 },
  badge: { display:'inline-flex',alignItems:'center',fontSize:'11px',fontWeight:600,padding:'3px 10px',borderRadius:2 },
  right: { display:'flex',flexDirection:'column',alignItems:'flex-end',gap:10,flexShrink:0 },
  price: { fontSize:'18px',fontWeight:700,color:'var(--navy)' },
  sel:   { padding:'6px 10px',border:'1px solid var(--border)',borderRadius:4,fontSize:12,background:'#fff',cursor:'pointer',outline:'none',fontFamily:'Inter,sans-serif',color:'var(--text)' },
  empty: { textAlign:'center',padding:'80px 20px',color:'var(--text-muted)' },
};

const AllOrders = () => {
  const [orders,   setOrders]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query,    setQuery]    = useState('');
  const [tab,      setTab]      = useState('All');
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = () => {
    setLoading(true);
    axios.get(`${API}/orders/all-orders`)
      .then(r => setOrders(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = [...orders];
    if (tab !== 'All') data = data.filter(o => o.orderStatus === tab);
    if (query) data = data.filter(o =>
      (o.title||'').toLowerCase().includes(query.toLowerCase()) ||
      (o.name||'').toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(data);
  }, [orders, tab, query]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/orders/update-order-status`, { id, orderStatus: status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
      showToast('Status updated');
    } catch { showToast('Failed to update status'); }
  };

  const tabCounts = ['All', ...STATUS_OPTIONS].reduce((acc, t) => {
    acc[t] = t === 'All' ? orders.length : orders.filter(o => o.orderStatus === t).length;
    return acc;
  }, {});

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <span style={{fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',display:'block',marginBottom:4}}>Manage</span>
          <h1 style={s.title}>All Orders <span style={{fontSize:'18px',fontFamily:'Inter',color:'var(--text-muted)',fontWeight:400}}>({orders.length})</span></h1>
        </div>
        <div style={s.search}>
          <FiSearch style={{color:'var(--text-muted)',flexShrink:0}} />
          <input style={s.sinp} placeholder="Search by product or customer…" value={query} onChange={e=>setQuery(e.target.value)} />
        </div>
      </div>

      {/* Status Tabs */}
      <div style={s.tabs}>
        {['All', ...STATUS_OPTIONS].map(t => (
          <button key={t} style={{...s.tab,...(tab===t?s.tabA:{})}} onClick={() => setTab(t)}>
            {t} {tabCounts[t] > 0 && <span style={{marginLeft:4,opacity:.7}}>({tabCounts[t]})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="luxury-spinner"><div className="spinner-ring" /></div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <FiPackage style={{fontSize:48,color:'var(--border)',marginBottom:16}} />
          <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'var(--navy)',marginBottom:8}}>No orders found</h3>
          <p>Try a different filter or search term.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(order => {
            const fp = Math.round(order.price - (order.price * (order.discount||0)) / 100);
            const sc = STATUS_COLORS[order.orderStatus] || STATUS_COLORS['Order Placed'];
            return (
              <div key={order._id} style={s.card}>
                <img src={order.mainImg} alt={order.title} style={s.img} />
                <div style={s.info}>
                  <div style={s.name}>{order.title}</div>
                  <div style={s.meta}>
                    <strong>{order.name}</strong>
                    {order.mobile && ` · ${order.mobile}`}
                    {order.size && ` · Size ${order.size}`}
                    {order.color && ` · ${order.color}`}
                    {order.quantity > 1 && ` · Qty ${order.quantity}`}
                  </div>
                  {order.address && <div style={{...s.meta,marginBottom:0}}>📍 {order.address}{order.pincode && ` - ${order.pincode}`}</div>}
                  {order.paymentMethod && <div style={{...s.meta,marginBottom:0,marginTop:4}}>💳 {order.paymentMethod}</div>}
                  {order.orderDate && (
                    <div style={{display:'flex',alignItems:'center',gap:4,marginTop:6,fontSize:11,color:'var(--text-muted)'}}>
                      <FiClock size={11} /> {new Date(order.orderDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    </div>
                  )}
                </div>
                <div style={s.right}>
                  <div style={s.price}>₹{(fp*(order.quantity||1)).toLocaleString()}</div>
                  <span style={{...s.badge, background:sc.bg, color:sc.color}}>● {order.orderStatus}</span>
                  <select style={s.sel} value={order.orderStatus} onChange={e => updateStatus(order._id, e.target.value)}>
                    {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <div className="toast-luxury">{toast}</div>}
    </div>
  );
};

export default AllOrders;
