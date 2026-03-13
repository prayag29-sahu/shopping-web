import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

const API = 'http://localhost:6001/api';

const s = {
  page:    { minHeight:'100vh', background:'var(--bg)', padding:'40px 48px' },
  topBar:  { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 },
  title:   { fontFamily:'Cormorant Garamond,serif',fontSize:'36px',fontWeight:400,color:'var(--navy)' },
  search:  { display:'flex',alignItems:'center',gap:8,padding:'0 16px',border:'1px solid var(--border)',borderRadius:'var(--radius)',background:'#fff',width:280 },
  sinp:    { border:'none',outline:'none',padding:'10px 8px',fontSize:13,flex:1,color:'var(--text)',fontFamily:'Inter,sans-serif' },
  table:   { background:'#fff',borderRadius:8,border:'1px solid var(--border)',overflow:'hidden' },
  thead:   { background:'var(--navy)' },
  th:      { padding:'14px 16px',fontSize:'10px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(255,255,255,0.7)',textAlign:'left',whiteSpace:'nowrap' },
  td:      { padding:'14px 16px',fontSize:'13px',color:'var(--text)',verticalAlign:'middle',borderBottom:'1px solid var(--border)' },
  img:     { width:48,height:58,objectFit:'cover',borderRadius:4,background:'#f0ede8' },
  name:    { fontFamily:'Cormorant Garamond,serif',fontSize:'16px',fontWeight:500,color:'var(--navy)' },
  cat:     { display:'inline-block',padding:'2px 10px',background:'#EFF6FF',color:'#1D4ED8',borderRadius:2,fontSize:'10px',fontWeight:600,letterSpacing:'0.5px' },
  price:   { fontWeight:700,color:'var(--navy)',fontSize:'14px' },
  actRow:  { display:'flex',gap:8 },
  editBtn: { padding:'6px 14px',border:'1px solid var(--border)',borderRadius:4,background:'transparent',cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',gap:4,color:'var(--text)',transition:'all 0.2s' },
  delBtn:  { padding:'6px 14px',border:'1px solid #FECACA',borderRadius:4,background:'transparent',cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',gap:4,color:'#DC2626',transition:'all 0.2s' },
  empty:   { textAlign:'center',padding:'60px 20px',color:'var(--text-muted)' },
  modal:   { position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center' },
  mBox:    { background:'#fff',borderRadius:8,padding:'32px',maxWidth:400,width:'90%' },
  mTitle:  { fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'var(--navy)',marginBottom:8 },
  mSub:    { fontSize:'13px',color:'var(--text-muted)',marginBottom:24,lineHeight:1.6 },
  mRow:    { display:'flex',gap:12 },
};

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [query,    setQuery]    = useState('');
  const [delId,    setDelId]    = useState(null);
  const [toast,    setToast]    = useState('');
  const [loading,  setLoading]  = useState(true);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = () => {
    setLoading(true);
    axios.get(`${API}/products/fetch-products`)
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/products/delete-product/${delId}`);
      showToast('Product deleted');
      setDelId(null);
      load();
    } catch { showToast('Delete failed'); setDelId(null); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <span style={{fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',display:'block',marginBottom:4}}>Manage</span>
          <h1 style={s.title}>All Products <span style={{fontSize:'18px',fontFamily:'Inter',color:'var(--text-muted)',fontWeight:400}}>({products.length})</span></h1>
        </div>
        <div style={{display:'flex',gap:12}}>
          <div style={s.search}>
            <FiSearch style={{color:'var(--text-muted)',flexShrink:0}} />
            <input style={s.sinp} placeholder="Search products…" value={query} onChange={e=>setQuery(e.target.value)} />
          </div>
          <button className="btn-gold" onClick={() => navigate('/new-product')}><FiPlus /> Add Product</button>
        </div>
      </div>

      <div style={s.table}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead style={s.thead}>
            <tr>
              {['Product','Category','Sizes','Price','Discount','Stock','Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'40px'}}><div className="spinner-ring" style={{margin:'0 auto'}} /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}><div style={s.empty}>
                <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'var(--navy)',marginBottom:8}}>No products found</h3>
                <p style={{marginBottom:16}}>Try a different search or add a new product.</p>
                <button className="btn-luxury" onClick={() => navigate('/new-product')}><FiPlus /> Add Product</button>
              </div></td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p._id} style={{background: i%2===0?'#fff':'#FAFAF9'}}>
                <td style={s.td}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <img src={p.mainImg} alt={p.name} style={s.img} />
                    <div>
                      <div style={s.name}>{p.name}</div>
                      <div style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{p.brand}</div>
                    </div>
                  </div>
                </td>
                <td style={s.td}><span style={s.cat}>{p.category}</span></td>
                <td style={s.td}><span style={{fontSize:12,color:'var(--text-muted)'}}>{(p.sizes||[]).join(', ')}</span></td>
                <td style={s.td}><span style={s.price}>₹{p.price?.toLocaleString()}</span></td>
                <td style={s.td}>{p.discount > 0 ? <span style={{color:'#16A34A',fontWeight:600}}>{p.discount}%</span> : <span style={{color:'var(--text-muted)'}}>—</span>}</td>
                <td style={s.td}><span style={{color: p.stock < 20 ? '#DC2626':'var(--text)'}}>{p.stock}</span></td>
                <td style={s.td}>
                  <div style={s.actRow}>
                    <button style={s.editBtn} onClick={() => navigate(`/update-product/${p._id}`)}
                      onMouseEnter={e=>{e.currentTarget.style.background='var(--navy)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='var(--navy)'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text)';e.currentTarget.style.borderColor='var(--border)'}}>
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button style={s.delBtn} onClick={() => setDelId(p._id)}
                      onMouseEnter={e=>{e.currentTarget.style.background='#FEF2F2'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Modal */}
      {delId && (
        <div style={s.modal}>
          <div style={s.mBox}>
            <h3 style={s.mTitle}>Delete Product?</h3>
            <p style={s.mSub}>This action cannot be undone. The product will be permanently removed from the store.</p>
            <div style={s.mRow}>
              <button className="btn-outline" style={{flex:1,justifyContent:'center'}} onClick={() => setDelId(null)}>Cancel</button>
              <button style={{flex:1,justifyContent:'center',padding:'12px 24px',background:'#DC2626',color:'#fff',border:'none',borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase'}}
                onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-luxury">{toast}</div>}
    </div>
  );
};

export default AllProducts;
