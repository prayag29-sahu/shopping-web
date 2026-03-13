import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { GeneralContext } from '../../context/GeneralContext';

const API = 'http://localhost:6001/api';

const s = {
  page:    { minHeight:'100vh', background:'var(--bg)', padding:'40px 48px' },
  header:  { display:'flex', alignItems:'center', gap:'16px', marginBottom:'40px' },
  backBtn: { background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase' },
  title:   { fontFamily:'Cormorant Garamond,serif', fontSize:'36px', fontWeight:400, color:'var(--navy)' },
  grid:    { display:'grid', gridTemplateColumns:'1fr 380px', gap:'32px', alignItems:'start' },
  items:   { display:'flex', flexDirection:'column', gap:'16px' },
  card:    { background:'#fff', borderRadius:8, padding:'20px', display:'flex', gap:'20px', border:'1px solid var(--border)' },
  img:     { width:100, height:120, objectFit:'cover', borderRadius:4, flexShrink:0, background:'#f0ede8' },
  info:    { flex:1, display:'flex', flexDirection:'column', gap:'6px' },
  brand:   { fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gold)' },
  name:    { fontFamily:'Cormorant Garamond,serif', fontSize:'18px', fontWeight:500, color:'var(--navy)' },
  meta:    { fontSize:'12px', color:'var(--text-muted)' },
  row:     { display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' },
  price:   { fontSize:'18px', fontWeight:700, color:'var(--navy)' },
  qtyWrap: { display:'flex', alignItems:'center', border:'1px solid var(--border)', borderRadius:2 },
  qtyBtn:  { width:32, height:32, background:'none', border:'none', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--navy)' },
  qtyVal:  { width:36, textAlign:'center', fontSize:'14px', fontWeight:600, borderLeft:'1px solid var(--border)', borderRight:'1px solid var(--border)', lineHeight:'32px' },
  del:     { background:'none', border:'none', cursor:'pointer', color:'#DC2626', padding:'6px', borderRadius:4, transition:'background 0.2s' },
  summary: { background:'#fff', borderRadius:8, border:'1px solid var(--border)', padding:'28px', position:'sticky', top:'88px' },
  sumTitle:{ fontFamily:'Cormorant Garamond,serif', fontSize:'22px', fontWeight:500, color:'var(--navy)', marginBottom:'20px' },
  sumRow:  { display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'13px', marginBottom:'12px', color:'var(--text-muted)' },
  sumFinal:{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'18px', fontWeight:700, color:'var(--navy)', borderTop:'2px solid var(--navy)', paddingTop:'16px', marginTop:'16px' },
  divider: { height:1, background:'var(--border)', margin:'16px 0' },
  empty:   { textAlign:'center', padding:'80px 20px', gridColumn:'1/-1' },
  modal:   { position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  mBox:    { background:'#fff', borderRadius:8, padding:'40px', maxWidth:500, width:'100%', maxHeight:'90vh', overflowY:'auto' },
  inp:     { width:'100%', padding:'12px 16px', border:'1px solid var(--border)', borderRadius:2, fontSize:'13px', outline:'none', marginBottom:'12px', fontFamily:'Inter,sans-serif' },
  row2:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
};

const Cart = () => {
  const navigate = useNavigate();
  const { setCartCount } = useContext(GeneralContext);
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]       = useState('');
  const [name, setName]         = useState('');
  const [mobile, setMobile]     = useState('');
  const [email, setEmail]       = useState('');
  const [address, setAddress]   = useState('');
  const [pincode, setPincode]   = useState('');
  const [payment, setPayment]   = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchCart = async () => {
    try {
      const r = await axios.get(`${API}/cart/fetch-cart`);
      const data = Array.isArray(r.data) ? r.data : [];
      setItems(data);
      setCartCount(data.reduce((a, i) => a + (parseInt(i.quantity) || 0), 0));
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const remove = async id => {
    await axios.delete(`${API}/cart/remove-item/${id}`).catch(() => {});
    fetchCart();
  };

  const changeQty = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return remove(item._id);
    try {
      if (delta > 0) await axios.put(`${API}/cart/increase-cart-quantity`, { id: item._id });
      else           await axios.put(`${API}/cart/decrease-cart-quantity`, { id: item._id });
      fetchCart();
    } catch { showToast('Error updating quantity'); }
  };

  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount  = items.reduce((s, i) => s + (i.price * i.discount / 100) * i.quantity, 0);
  const delivery  = subtotal - discount > 2999 || items.length === 0 ? 0 : 99;
  const total     = subtotal - Math.floor(discount) + delivery;

  const placeOrder = async () => {
    if (!name || !mobile || !address || !payment) return showToast('Please fill all required fields');
    try {
      await axios.post(`${API}/orders/place-cart-order`, {
        name, mobile, email, address, pincode, paymentMethod: payment, orderDate: new Date()
      });
      setShowModal(false);
      showToast('Order placed successfully!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch { showToast('Please sign in to place order'); }
  };

  if (loading) return <div className="luxury-spinner" style={{marginTop:'20vh'}}><div className="spinner-ring" /></div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1 style={s.title}>Your Bag <span style={{fontSize:'18px',color:'var(--text-muted)',fontFamily:'Inter'}}>({items.length})</span></h1>
      </div>

      {items.length === 0 ? (
        <div style={s.empty}>
          <FiShoppingBag style={{fontSize:56, color:'var(--border)', marginBottom:20}} />
          <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'32px',color:'var(--navy)',marginBottom:8}}>Your bag is empty</h3>
          <p style={{color:'var(--text-muted)',marginBottom:32}}>Looks like you haven't added anything yet.</p>
          <button className="btn-luxury" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <div style={s.grid}>
          {/* Items */}
          <div style={s.items}>
            {items.map(item => {
              const fp = Math.round(item.price - (item.price * item.discount) / 100);
              return (
                <div key={item._id} style={s.card}>
                  <img src={item.mainImg} alt={item.title} style={s.img} />
                  <div style={s.info}>
                    <div style={s.brand}>VELOUR</div>
                    <div style={s.name}>{item.title}</div>
                    <div style={s.meta}>
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` · ${item.color}`}
                    </div>
                    <div style={s.row}>
                      <div style={s.price}>₹{(fp * item.quantity).toLocaleString()}</div>
                      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <div style={s.qtyWrap}>
                          <button style={s.qtyBtn} onClick={() => changeQty(item, -1)}>−</button>
                          <div style={s.qtyVal}>{item.quantity}</div>
                          <button style={s.qtyBtn} onClick={() => changeQty(item, +1)}>+</button>
                        </div>
                        <button style={s.del} onClick={() => remove(item._id)}><FiTrash2 /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={s.summary}>
            <div style={s.sumTitle}>Order Summary</div>
            <div style={s.sumRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div style={s.sumRow}><span>Discount</span><span style={{color:'#16A34A'}}>−₹{Math.floor(discount).toLocaleString()}</span></div>
            <div style={s.sumRow}><span>Delivery</span><span style={{color: delivery===0 ? '#16A34A' : 'inherit'}}>{delivery===0 ? 'FREE' : `₹${delivery}`}</span></div>
            {delivery === 0 && <p style={{fontSize:'11px',color:'#16A34A',marginTop:-8,marginBottom:8}}>✓ You qualify for free delivery</p>}
            <div style={s.sumFinal}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            <button className="btn-gold" style={{width:'100%',justifyContent:'center',marginTop:'24px'}}
              onClick={() => setShowModal(true)}>
              Proceed to Checkout
            </button>
            <button className="btn-outline" style={{width:'100%',justifyContent:'center',marginTop:'12px'}}
              onClick={() => navigate('/')}>
              Continue Shopping
            </button>
            <div style={s.divider} />
            <p style={{fontSize:'11px',color:'var(--text-muted)',textAlign:'center',lineHeight:1.6}}>
              🔒 Secure checkout · Free 30-day returns · 100% authentic
            </p>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showModal && (
        <div style={s.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.mBox}>
            <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'28px',color:'var(--navy)',marginBottom:'6px'}}>Complete Your Order</h3>
            <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'24px'}}>{items.length} item{items.length>1?'s':''} · Total: ₹{total.toLocaleString()}</p>
            <input style={s.inp} placeholder="Full Name *" value={name} onChange={e=>setName(e.target.value)} />
            <div style={s.row2}>
              <input style={s.inp} placeholder="Mobile *" value={mobile} onChange={e=>setMobile(e.target.value)} />
              <input style={s.inp} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <input style={s.inp} placeholder="Delivery Address *" value={address} onChange={e=>setAddress(e.target.value)} />
            <input style={s.inp} placeholder="Pincode" value={pincode} onChange={e=>setPincode(e.target.value)} />
            <select style={{...s.inp,marginBottom:'24px'}} value={payment} onChange={e=>setPayment(e.target.value)}>
              <option value="">Payment Method *</option>
              <option value="upi">UPI</option>
              <option value="card">Credit / Debit Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="cod">Cash on Delivery</option>
            </select>
            <div style={{display:'flex',gap:'12px'}}>
              <button className="btn-outline" onClick={() => setShowModal(false)} style={{flex:1,justifyContent:'center'}}>Cancel</button>
              <button className="btn-gold" onClick={placeOrder} style={{flex:1,justifyContent:'center'}}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-luxury">{toast}</div>}
    </div>
  );
};

export default Cart;
