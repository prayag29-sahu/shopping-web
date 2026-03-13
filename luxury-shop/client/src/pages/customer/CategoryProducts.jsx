import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { ProductCard } from '../Home';

const API = 'http://localhost:6001/api';
const SIZES = ['XS','S','M','L','XL'];
const SORT_OPTIONS = [
  { label: 'Newest First',    value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated',       value: 'rating' },
];

const styles = {
  page:    { display:'flex', minHeight:'100vh', background:'var(--bg)' },
  sidebar: { width:260, flexShrink:0, background:'#fff', borderRight:'1px solid var(--border)', padding:'32px 24px', position:'sticky', top:72, height:'calc(100vh - 72px)', overflowY:'auto' },
  main:    { flex:1, padding:'40px 40px' },
  filterTitle: { fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--navy)', marginBottom:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' },
  filterGroup: { marginBottom:'32px', borderBottom:'1px solid var(--border)', paddingBottom:'24px' },
  checkRow: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px', cursor:'pointer' },
  checkbox: { width:16, height:16, accentColor:'var(--navy)', cursor:'pointer' },
  label:    { fontSize:'13px', color:'var(--text)', flex:1 },
  sizeBtn:  { padding:'6px 14px', border:'1px solid var(--border)', borderRadius:2, fontSize:'12px', background:'transparent', cursor:'pointer', transition:'all 0.2s' },
  sizeBtnActive: { background:'var(--navy)', color:'#fff', borderColor:'var(--navy)' },
  header:   { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px' },
  sortSel:  { padding:'8px 16px', border:'1px solid var(--border)', borderRadius:'var(--radius)', fontSize:'12px', color:'var(--text)', background:'#fff', cursor:'pointer', outline:'none' },
  empty:    { textAlign:'center', padding:'80px 20px', color:'var(--text-muted)' },
  range:    { display:'flex', alignItems:'center', gap:'8px' },
  rangeInput:{ width:'80px', padding:'6px 10px', border:'1px solid var(--border)', borderRadius:2, fontSize:'12px', outline:'none' },
};

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice]       = useState('');
  const [maxPrice, setMaxPrice]       = useState('');
  const [sort, setSort]               = useState('newest');
  const [allColors, setAllColors]     = useState([]);
  const [showFilter, setShowFilter]   = useState(true);

  useEffect(() => {
    setLoading(true);
    setSelectedSizes([]); setSelectedColors([]); setMinPrice(''); setMaxPrice('');
    axios.get(`${API}/products/fetch-products${category !== 'all' ? `?category=${category}` : ''}`)
      .then(r => {
        setProducts(r.data);
        const colors = [...new Set(r.data.flatMap(p => p.colors || []))];
        setAllColors(colors);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    let data = [...products];
    if (selectedSizes.length)  data = data.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));
    if (selectedColors.length) data = data.filter(p => p.colors?.some(c => selectedColors.includes(c)));
    if (minPrice) data = data.filter(p => p.price >= Number(minPrice));
    if (maxPrice) data = data.filter(p => p.price <= Number(maxPrice));
    if (sort === 'price_asc')  data.sort((a,b) => a.price - b.price);
    if (sort === 'price_desc') data.sort((a,b) => b.price - a.price);
    if (sort === 'rating')     data.sort((a,b) => (b.rating||0) - (a.rating||0));
    setFiltered(data);
  }, [products, selectedSizes, selectedColors, minPrice, maxPrice, sort]);

  const toggleSize  = s => setSelectedSizes(p  => p.includes(s) ? p.filter(x=>x!==s) : [...p, s]);
  const toggleColor = c => setSelectedColors(p => p.includes(c) ? p.filter(x=>x!==c) : [...p, c]);
  const clearAll    = () => { setSelectedSizes([]); setSelectedColors([]); setMinPrice(''); setMaxPrice(''); };

  return (
    <div style={styles.page}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'28px'}}>
          <h3 style={{fontFamily:'Cormorant Garamond',fontSize:'22px',fontWeight:500}}><FiFilter style={{marginRight:8}}/>Filters</h3>
          {(selectedSizes.length || selectedColors.length || minPrice || maxPrice) > 0 &&
            <button onClick={clearAll} style={{fontSize:'11px',color:'var(--gold)',background:'none',border:'none',cursor:'pointer',letterSpacing:'0.5px'}}>Clear All</button>
          }
        </div>

        {/* Size */}
        <div style={styles.filterGroup}>
          <div style={styles.filterTitle}>Size</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {SIZES.map(s => (
              <button key={s} style={{...styles.sizeBtn,...(selectedSizes.includes(s)?styles.sizeBtnActive:{})}}
                onClick={() => toggleSize(s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div style={styles.filterGroup}>
          <div style={styles.filterTitle}>Price Range</div>
          <div style={styles.range}>
            <input style={styles.rangeInput} type="number" placeholder="Min ₹" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
            <span style={{color:'var(--text-muted)'}}>—</span>
            <input style={styles.rangeInput} type="number" placeholder="Max ₹" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
          </div>
        </div>

        {/* Color */}
        {allColors.length > 0 && (
          <div style={styles.filterGroup}>
            <div style={styles.filterTitle}>Colour</div>
            {allColors.map(c => (
              <label key={c} style={styles.checkRow}>
                <input type="checkbox" style={styles.checkbox} checked={selectedColors.includes(c)} onChange={() => toggleColor(c)} />
                <span style={styles.label}>{c}</span>
              </label>
            ))}
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <span style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--gold)'}}>Collection</span>
            <h2 style={{fontFamily:'Cormorant Garamond',fontSize:'32px',fontWeight:400,color:'var(--navy)'}}>{category}</h2>
            <p style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'4px'}}>{filtered.length} styles</p>
          </div>
          <select style={styles.sortSel} value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="luxury-spinner"><div className="spinner-ring" /></div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <h3 style={{fontFamily:'Cormorant Garamond',fontSize:'28px',marginBottom:'8px'}}>No styles found</h3>
            <p style={{fontSize:'13px'}}>Try adjusting your filters</p>
            <button className="btn-luxury" style={{marginTop:'24px'}} onClick={clearAll}>Clear Filters</button>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => (
              <ProductCard key={p._id} product={p} onClick={() => navigate(`/product/${p._id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryProducts;
