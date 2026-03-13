import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';

const API = 'http://localhost:6001/api';
const CATEGORIES = ['Men', 'Women', 'Boys', 'Girls', 'Kids'];
const ALL_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const s = {
  page:  { minHeight:'100vh', background:'var(--bg)', padding:'40px 48px' },
  back:  { display:'inline-flex',alignItems:'center',gap:6,fontSize:12,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer',marginBottom:24 },
  title: { fontFamily:'Cormorant Garamond,serif',fontSize:'36px',fontWeight:400,color:'var(--navy)',marginBottom:32 },
  grid:  { display:'grid',gridTemplateColumns:'1fr 1fr',gap:40 },
  panel: { background:'#fff',borderRadius:8,border:'1px solid var(--border)',padding:'32px' },
  ph:    { fontFamily:'Cormorant Garamond,serif',fontSize:'20px',fontWeight:400,color:'var(--navy)',marginBottom:20,paddingBottom:16,borderBottom:'1px solid var(--border)' },
  field: { marginBottom:18 },
  label: { display:'block',fontSize:'10px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:6 },
  inp:   { width:'100%',padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:4,fontSize:13,color:'var(--text)',outline:'none',fontFamily:'Inter,sans-serif',transition:'border-color 0.2s',background:'var(--bg)' },
  sel:   { width:'100%',padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:4,fontSize:13,color:'var(--text)',outline:'none',fontFamily:'Inter,sans-serif',background:'var(--bg)',cursor:'pointer' },
  textarea:{ width:'100%',padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:4,fontSize:13,color:'var(--text)',outline:'none',fontFamily:'Inter,sans-serif',resize:'vertical',minHeight:100,background:'var(--bg)' },
  sizeGrid:{ display:'flex',flexWrap:'wrap',gap:8 },
  sizeBtn: { padding:'8px 16px',border:'1.5px solid var(--border)',borderRadius:4,fontSize:12,background:'transparent',cursor:'pointer',transition:'all 0.2s' },
  sizeBtnA:{ background:'var(--navy)',color:'#fff',borderColor:'var(--navy)' },
  tagRow:  { display:'flex',flexWrap:'wrap',gap:8,marginTop:8 },
  tag:     { display:'inline-flex',alignItems:'center',gap:4,padding:'4px 10px',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:99,fontSize:12 },
  tagX:    { background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:14,lineHeight:1,padding:0 },
  addRow:  { display:'flex',gap:8,marginTop:8 },
  preview: { width:'100%',aspectRatio:'3/4',objectFit:'cover',borderRadius:4,marginTop:8 },
  previewPh:{ width:'100%',aspectRatio:'3/4',background:'var(--bg)',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:13,marginTop:8 },
  toggle:  { display:'flex',alignItems:'center',gap:10 },
  sw:      { width:40,height:22,borderRadius:99,border:'none',cursor:'pointer',transition:'background 0.2s',position:'relative',flexShrink:0 },
  swDot:   { position:'absolute',top:3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s' },
  submitBar:{ display:'flex',justifyContent:'flex-end',gap:12,marginTop:32 },
};

const NewProduct = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const [form, setForm] = useState({
    name:'', description:'', category:'Men', brand:'VELOUR',
    price:'', discount:'0', stock:'100',
    mainImg:'', isFeatured:false, isTrending:false,
  });
  const [sizes,  setSizes]  = useState(['S','M','L','XL']);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState(['','','']);
  const [colorInput, setColorInput] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSize = s => setSizes(p => p.includes(s) ? p.filter(x=>x!==s) : [...p, s]);
  const addColor   = () => { if (colorInput.trim() && !colors.includes(colorInput.trim())) { setColors(c => [...c, colorInput.trim()]); setColorInput(''); } };
  const removeColor= c => setColors(p => p.filter(x => x !== c));
  const setImg     = (i, v) => setImages(imgs => imgs.map((img, idx) => idx===i ? v : img));

  const handleFocus = e => { e.target.style.borderColor='var(--navy)'; e.target.style.background='#fff'; };
  const handleBlur  = e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--bg)'; };

  const submit = async () => {
    if (!form.name || !form.description || !form.price || !form.mainImg)
      return showToast('Please fill Name, Description, Price and Main Image');
    setSaving(true);
    try {
      await axios.post(`${API}/products/add-new-product`, {
        ...form,
        price:    Number(form.price),
        discount: Number(form.discount),
        stock:    Number(form.stock),
        sizes, colors,
        images: images.filter(Boolean),
      });
      showToast('Product added successfully!');
      setTimeout(() => navigate('/all-products'), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add product');
    } finally { setSaving(false); }
  };

  const Toggle = ({ val, onChange }) => (
    <button type="button" style={{...s.sw, background: val ? 'var(--gold)':'var(--border)'}} onClick={() => onChange(!val)}>
      <div style={{...s.swDot, left: val ? 21:3}} />
    </button>
  );

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/all-products')}><FiArrowLeft /> Back to Products</button>
      <div style={s.title}>Add New Product</div>

      <div style={s.grid}>
        {/* Left Column */}
        <div style={{display:'flex',flexDirection:'column',gap:24}}>
          <div style={s.panel}>
            <div style={s.ph}>Basic Information</div>

            <div style={s.field}>
              <label style={s.label}>Product Name *</label>
              <input style={s.inp} value={form.name} onChange={e=>set('name',e.target.value)}
                placeholder="e.g. Classic Slim Fit Oxford Shirt" onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Description *</label>
              <textarea style={s.textarea} value={form.description} onChange={e=>set('description',e.target.value)}
                placeholder="Describe the fabric, fit, and style of this piece…" onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={s.field}>
                <label style={s.label}>Category *</label>
                <select style={s.sel} value={form.category} onChange={e=>set('category',e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Brand</label>
                <input style={s.inp} value={form.brand} onChange={e=>set('brand',e.target.value)}
                  onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>
          </div>

          <div style={s.panel}>
            <div style={s.ph}>Pricing & Stock</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
              {[['Price (₹) *','price','2499'],['Discount (%)','discount','0'],['Stock','stock','100']].map(([lbl,key,ph]) => (
                <div key={key} style={s.field}>
                  <label style={s.label}>{lbl}</label>
                  <input style={s.inp} type="number" value={form[key]} onChange={e=>set(key,e.target.value)}
                    placeholder={ph} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
              ))}
            </div>
          </div>

          <div style={s.panel}>
            <div style={s.ph}>Variants</div>
            <div style={s.field}>
              <label style={s.label}>Available Sizes</label>
              <div style={s.sizeGrid}>
                {ALL_SIZES.map(sz => (
                  <button key={sz} type="button"
                    style={{...s.sizeBtn,...(sizes.includes(sz)?s.sizeBtnA:{})}}
                    onClick={() => toggleSize(sz)}>{sz}</button>
                ))}
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Colours</label>
              <div style={s.addRow}>
                <input style={{...s.inp,flex:1}} value={colorInput}
                  onChange={e=>setColorInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addColor())}
                  placeholder="e.g. Ivory, Navy, Sage…" onFocus={handleFocus} onBlur={handleBlur} />
                <button type="button" className="btn-outline" style={{padding:'10px 16px',fontSize:12}} onClick={addColor}><FiPlus /></button>
              </div>
              {colors.length > 0 && (
                <div style={s.tagRow}>
                  {colors.map(c => (
                    <span key={c} style={s.tag}>{c} <button style={s.tagX} onClick={() => removeColor(c)}><FiX /></button></span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={s.panel}>
            <div style={s.ph}>Visibility</div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {[['isFeatured','Featured on Home Page'],['isTrending','Mark as Trending']].map(([key,lbl]) => (
                <div key={key} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:13,color:'var(--text)'}}>{lbl}</span>
                  <Toggle val={form[key]} onChange={v => set(key,v)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Images */}
        <div style={{display:'flex',flexDirection:'column',gap:24}}>
          <div style={s.panel}>
            <div style={s.ph}>Main Image *</div>
            <div style={s.field}>
              <label style={s.label}>Image URL (Unsplash recommended)</label>
              <input style={s.inp} value={form.mainImg} onChange={e=>set('mainImg',e.target.value)}
                placeholder="https://images.unsplash.com/photo-…" onFocus={handleFocus} onBlur={handleBlur} />
              {form.mainImg
                ? <img src={form.mainImg} alt="preview" style={s.preview} onError={e=>e.target.style.display='none'} />
                : <div style={s.previewPh}>Image preview will appear here</div>
              }
            </div>
          </div>

          <div style={s.panel}>
            <div style={s.ph}>Gallery Images</div>
            {[0,1,2].map(i => (
              <div key={i} style={{...s.field,marginBottom:i===2?0:16}}>
                <label style={s.label}>Image {i+1}</label>
                <input style={s.inp} value={images[i]} onChange={e=>setImg(i,e.target.value)}
                  placeholder="https://images.unsplash.com/photo-…" onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            ))}
          </div>

          <div style={s.submitBar}>
            <button className="btn-outline" onClick={() => navigate('/all-products')}>Cancel</button>
            <button className="btn-gold" onClick={submit} disabled={saving}
              style={{minWidth:160,justifyContent:'center'}}>
              {saving ? 'Saving…' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>

      {toast && <div className="toast-luxury">{toast}</div>}
    </div>
  );
};

export default NewProduct;
