import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiShoppingBag, FiHeart, FiStar, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import { GeneralContext } from '../../context/GeneralContext';

const API = 'http://localhost:6001/api';

const s = {
  page:     { minHeight:'100vh', background:'var(--bg)' },
  back:     { display:'inline-flex', alignItems:'center', gap:'8px', padding:'20px 48px', fontSize:'12px', letterSpacing:'1px', color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer', textTransform:'uppercase' },
  grid:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0', minHeight:'80vh', maxWidth:'1200px', margin:'0 auto' },
  imgWrap:  { position:'relative', background:'#f0ede8' },
  mainImg:  { width:'100%', height:'100%', objectFit:'cover', minHeight:'600px' },
  thumbs:   { display:'flex', gap:'8px', padding:'16px 0' },
  thumb:    { width:72, height:88, objectFit:'cover', cursor:'pointer', border:'2px solid transparent', borderRadius:2, transition:'border-color 0.2s' },
  thumbActive:{ borderColor:'var(--navy)' },
  info:     { padding:'56px 48px', display:'flex', flexDirection:'column', gap:'20px', background:'#fff' },
  brand:    { fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--gold)' },
  name:     { fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(28px,3vw,40px)', fontWeight:400, color:'var(--navy)', lineHeight:1.2 },
  rating:   { display:'flex', alignItems:'center', gap:'8px' },
  ratingVal:{ fontWeight:600, fontSize:'14px' },
  stars:    { display:'flex', gap:2 },
  reviewCt: { fontSize:'12px', color:'var(--text-muted)' },
  priceRow: { display:'flex', alignItems:'baseline', gap:'12px' },
  priceFin: { fontSize:'28px', fontWeight:700, color:'var(--navy)' },
  priceOld: { fontSize:'18px', color:'var(--text-muted)', textDecoration:'line-through' },
  priceOff: { fontSize:'13px', fontWeight:600, color:'#16A34A', background:'#F0FDF4', padding:'2px 8px', borderRadius:99 },
  divider:  { height:1, background:'var(--border)' },
  label:    { fontSize:'11px', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'10px' },
  sizeGrid: { display:'flex', gap:'8px', flexWrap:'wrap' },
  sizeBtn:  { padding:'10px 18px', border:'1px solid var(--border)', borderRadius:2, fontSize:'13px', background:'transparent', cursor:'pointer', transition:'all 0.2s', minWidth:52, textAlign:'center' },
  sizeBtnAct:{ background:'var(--navy)', color:'#fff', borderColor:'var(--navy)' },
  colorRow: { display:'flex', gap:'10px', flexWrap:'wrap' },
  colorBtn: { padding:'6px 16px', border:'1px solid var(--border)', borderRadius:99, fontSize:'12px', background:'transparent', cursor:'pointer', transition:'all 0.2s' },
  colorBtnAct:{ background:'var(--navy)', color:'#fff', borderColor:'var(--navy)' },
  qtyRow:   { display:'flex', alignItems:'center', gap:0, border:'1px solid var(--border)', borderRadius:2, width:'fit-content' },
  qtyBtn:   { width:40, height:40, background:'none', border:'none', fontSize:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--navy)' },
  qtyVal:   { width:48, textAlign:'center', fontSize:'15px', fontWeight:600, borderLeft:'1px solid var(--border)', borderRight:'1px solid var(--border)', lineHeight:'40px' },
  ctas:     { display:'flex', flexDirection:'column', gap:'12px' },
  features: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', borderTop:'1px solid var(--border)', paddingTop:'20px' },
  feat:     { display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', textAlign:'center' },
  featIcon: { fontSize:'20px', color:'var(--gold)' },
  featTxt:  { fontSize:'11px', color:'var(--text-muted)', lineHeight:1.4 },
  desc:     { fontSize:'14px', color:'var(--text-muted)', lineHeight:1.8 },
  modal:    { position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  modalBox: { background:'#fff', borderRadius:8, padding:'40px', maxWidth:520, width:'100%', maxHeight:'90vh', overflowY:'auto' },
  inp:      { width:'100%', padding:'12px 16px', border:'1px solid var(--border)', borderRadius:2, fontSize:'13px', outline:'none', marginBottom:'12px', fontFamily:'Inter,sans-serif', transition:'border-color 0.2s' },
  row2:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
};

const Star = ({ filled }) => (
  <FiStar style={{ fontSize:14, fill: filled ? '#C9A227' : 'none', color: filled ? '#C9A227' : '#D1D5DB' }} />
);

const IndividualProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(GeneralContext);

  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize]           = useState('');
  const [color, setColor]         = useState('');
  const [qty, setQty]             = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState('');

  const [name, setName]           = useState('');
  const [mobile, setMobile]       = useState('');
  const [email, setEmail]         = useState('');
  const [address, setAddress]     = useState('');
  const [pincode, setPincode]     = useState('');
  const [payment, setPayment]     = useState('');

  useEffect(() => {
    axios.get(`${API}/products/fetch-product-details/${id}`)
      .then(r => { setProduct(r.data); if (r.data.sizes?.[0]) setSize(r.data.sizes[0]); if (r.data.colors?.[0]) setColor(r.data.colors[0]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const addToCart = async () => {
    if (!size) return showToast('Please select a size');
    try {
      await axios.post(`${API}/cart/add-to-cart`, {
        productId: product._id, title: product.name, mainImg: product.mainImg,
        size, color, quantity: qty, price: product.price, discount: product.discount
      });
      fetchCartCount();
      showToast('Added to your bag!');
    } catch { showToast('Please sign in to add to bag'); }
  };

  const buyNow = async () => {
    if (!size) return showToast('Please select a size');
    if (!name || !mobile || !address || !payment) return showToast('Please fill all fields');
    try {
      await axios.post(`${API}/orders/buy-product`, {
        title: product.name, mainImg: product.mainImg, size, color, quantity: qty,
        price: product.price, discount: product.discount,
        name, mobile, email, address, pincode, paymentMethod: payment, orderDate: new Date()
      });
      setShowModal(false);
      showToast('Order placed successfully!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch { showToast('Please sign in to place order'); }
  };

  if (loading) return <div className="luxury-spinner"><div className="spinner-ring" /></div>;
  if (!product) return <div style={{textAlign:'center',padding:'80px',color:'var(--text-muted)'}}>Product not found</div>;

  const allImgs = [product.mainImg, ...(product.images || [])];
  const finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
  const ratingStars = Math.round(product.rating || 4);

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}><FiArrowLeft />Back</button>

      <div style={s.grid}>
        {/* ── Images ── */}
        <div style={s.imgWrap}>
          <img style={s.mainImg} src={allImgs[activeImg]} alt={product.name} />
          {allImgs.length > 1 && (
            <div style={{...s.thumbs, padding:'16px 24px'}}>
              {allImgs.map((img, i) => (
                <img key={i} src={img} alt="" style={{...s.thumb,...(i===activeImg?s.thumbActive:{})}}
                  onClick={() => setActiveImg(i)} />
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div style={s.info}>
          <div style={s.brand}>{product.brand}</div>
          <h1 style={s.name}>{product.name}</h1>
          <div style={s.rating}>
            <span style={s.ratingVal}>{product.rating?.toFixed(1) || '4.2'}</span>
            <div style={s.stars}>{[1,2,3,4,5].map(n=><Star key={n} filled={n<=ratingStars}/>)}</div>
            <span style={s.reviewCt}>(124 reviews)</span>
          </div>

          <div style={s.priceRow}>
            <span style={s.priceFin}>₹{finalPrice.toLocaleString()}</span>
            {product.discount > 0 && <>
              <span style={s.priceOld}>₹{product.price.toLocaleString()}</span>
              <span style={s.priceOff}>{product.discount}% off</span>
            </>}
          </div>
          <div style={s.divider} />

          {/* Size */}
          <div>
            <div style={s.label}>Size — <span style={{color:'var(--navy)',textTransform:'none'}}>{size}</span></div>
            <div style={s.sizeGrid}>
              {(product.sizes || []).map(sz => (
                <button key={sz} style={{...s.sizeBtn,...(sz===size?s.sizeBtnAct:{})}} onClick={() => setSize(sz)}>{sz}</button>
              ))}
            </div>
          </div>

          {/* Color */}
          {(product.colors || []).length > 0 && (
            <div>
              <div style={s.label}>Colour — <span style={{color:'var(--navy)',textTransform:'none'}}>{color}</span></div>
              <div style={s.colorRow}>
                {product.colors.map(c => (
                  <button key={c} style={{...s.colorBtn,...(c===color?s.colorBtnAct:{})}} onClick={() => setColor(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div>
            <div style={s.label}>Quantity</div>
            <div style={s.qtyRow}>
              <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
              <div style={s.qtyVal}>{qty}</div>
              <button style={s.qtyBtn} onClick={() => setQty(q => Math.min(10,q+1))}>+</button>
            </div>
          </div>

          {/* CTAs */}
          <div style={s.ctas}>
            <button className="btn-luxury" onClick={addToCart} style={{justifyContent:'center'}}>
              <FiShoppingBag /> Add to Bag
            </button>
            <button className="btn-gold" onClick={() => setShowModal(true)} style={{justifyContent:'center'}}>
              Buy Now
            </button>
          </div>

          <div style={s.divider} />
          <p style={s.desc}>{product.description}</p>

          <div style={s.features}>
            {[
              {icon:<FiTruck style={s.featIcon}/>,    txt:'Free delivery above ₹2,999'},
              {icon:<FiRefreshCw style={s.featIcon}/>, txt:'30-day easy returns'},
              {icon:<FiShield style={s.featIcon}/>,   txt:'100% authentic product'},
            ].map((f,i) => (
              <div key={i} style={s.feat}>{f.icon}<span style={s.featTxt}>{f.txt}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Checkout Modal ── */}
      {showModal && (
        <div style={s.modal} onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div style={s.modalBox}>
            <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'28px',marginBottom:'24px',color:'var(--navy)'}}>Complete Your Order</h3>
            <div style={{background:'var(--bg)',borderRadius:4,padding:'16px',marginBottom:'24px',display:'flex',gap:'16px',alignItems:'center'}}>
              <img src={product.mainImg} alt="" style={{width:60,height:72,objectFit:'cover',borderRadius:2}} />
              <div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'16px',fontWeight:500}}>{product.name}</div>
                <div style={{fontSize:'12px',color:'var(--text-muted)'}}>Size: {size} · Colour: {color} · Qty: {qty}</div>
                <div style={{fontSize:'16px',fontWeight:700,color:'var(--navy)',marginTop:4}}>₹{(finalPrice*qty).toLocaleString()}</div>
              </div>
            </div>
            <input style={s.inp} placeholder="Full Name *" value={name} onChange={e=>setName(e.target.value)} onFocus={e=>e.target.style.borderColor='var(--navy)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
            <div style={s.row2}>
              <input style={s.inp} placeholder="Mobile *" value={mobile} onChange={e=>setMobile(e.target.value)} onFocus={e=>e.target.style.borderColor='var(--navy)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={s.inp} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} onFocus={e=>e.target.style.borderColor='var(--navy)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
            </div>
            <input style={s.inp} placeholder="Delivery Address *" value={address} onChange={e=>setAddress(e.target.value)} onFocus={e=>e.target.style.borderColor='var(--navy)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
            <input style={s.inp} placeholder="Pincode" value={pincode} onChange={e=>setPincode(e.target.value)} onFocus={e=>e.target.style.borderColor='var(--navy)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
            <select style={{...s.inp,marginBottom:'24px'}} value={payment} onChange={e=>setPayment(e.target.value)}>
              <option value="">Select Payment Method *</option>
              <option value="upi">UPI</option>
              <option value="card">Credit / Debit Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="cod">Cash on Delivery</option>
            </select>
            <div style={{display:'flex',gap:'12px'}}>
              <button className="btn-outline" onClick={() => setShowModal(false)} style={{flex:1,justifyContent:'center'}}>Cancel</button>
              <button className="btn-gold" onClick={buyNow} style={{flex:1,justifyContent:'center'}}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-luxury">{toast}</div>}
    </div>
  );
};

export default IndividualProduct;
