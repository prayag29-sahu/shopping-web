import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';

const API = 'http://localhost:6001/api';
const CATEGORIES = ['Men', 'Women', 'Boys', 'Girls', 'Kids'];
const ALL_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const inp = { width:'100%',padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:4,fontSize:13,color:'var(--text)',outline:'none',fontFamily:'Inter,sans-serif',background:'var(--bg)',transition:'border-color 0.2s' };
const s = {
  page:  { minHeight:'100vh',background:'var(--bg)',padding:'40px 48px' },
  back:  { display:'inline-flex',alignItems:'center',gap:6,fontSize:12,letterSpacing:'1px',textTransform:'uppercase',color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer',marginBottom:24 },
  title: { fontFamily:'Cormorant Garamond,serif',fontSize:'36px',fontWeight:400,color:'var(--navy)',marginBottom:32 },
  grid:  { display:'grid',gridTemplateColumns:'1fr 1fr',gap:40 },
  panel: { background:'#fff',borderRadius:8,border:'1px solid var(--border)',padding:'32px',marginBottom:24 },
  ph:    { fontFamily:'Cormorant Garamond,serif',fontSize:'20px',fontWeight:400,color:'var(--navy)',marginBottom:20,paddingBottom:16,borderBottom:'1px solid var(--border)' },
  label: { display:'block',fontSize:'10px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:6 },
  field: { marginBottom:18 },
  sizeBtn:  { padding:'8px 16px',border:'1.5px solid var(--border)',borderRadius:4,fontSize:12,background:'transparent',cursor:'pointer',transition:'all 0.2s' },
  sizeBtnA: { background:'var(--navy)',color:'#fff',borderColor:'var(--navy)' },
  tag:   { display:'inline-flex',alignItems:'center',gap:4,padding:'4px 10px',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:99,fontSize:12 },
  tagX:  { background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:14,lineHeight:1 },
  preview:{ width:'100%',aspectRatio:'3/4',objectFit:'cover',borderRadius:4,marginTop:8 },
  previewPh:{ width:'100%',aspectRatio:'3/4',background:'var(--bg)',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:13,marginTop:8 },
};

const Toggle = ({ val, onChange }) => (
  <button type="button"
    style={{width:40,height:22,borderRadius:99,border:'none',cursor:'pointer',background:val?'var(--gold)':'var(--border)',position:'relative',transition:'background 0.2s',flexShrink:0}}
    onClick={() => onChange(!val)}>
    <div style={{position:'absolute',top:3,left:val?21:3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s'}} />
  </button>
);

const UpdateProduct = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [toast, setToast]   = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name:'', description:'', category:'Men', brand:'VELOUR',
    price:'', discount:'0', stock:'100', mainImg:'',
    isFeatured:false, isTrending:false,
  });
  const [sizes,       setSizes]       = useState([]);
  const [colors,      setColors]      = useState([]);
  const [images,      setImages]      = useState(['','','']);
  const [colorInput,  setColorInput]  = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const set       = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const handleF   = e => { e.target.style.borderColor='var(--navy)'; e.target.style.background='#fff'; };
  const handleB   = e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--bg)'; };

  useEffect(() => {
    axios.get(`${API}/products/fetch-product-details/${id}`)
      .then(r => {
        const p = r.data;
        setForm({
          name: p.name||'', description: p.description||'',
          category: p.category||'Men', brand: p.brand||'VELOUR',
          price: p.price||'', discount: p.discount||0,
          stock: p.stock||100, mainImg: p.mainImg||'',
          isFeatured: p.isFeatured||false, isTrending: p.isTrending||false,
        });
        setSizes(p.sizes||[]);
        setColors(p.colors||[]);
        const imgs = [...(p.images||[])];
        while (imgs.length < 3) imgs.push('');
        setImages(imgs.slice(0,3));
      })
      .catch(() => showToast('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSize  = s => setSizes(p => p.includes(s) ? p.filter(x=>x!==s) : [...p, s]);
  const addColor    = () => { if (colorInput.trim() && !colors.includes(colorInput.trim())) { setColors(c=>[...c,colorInput.trim()]); setColorInput(''); }};
  const removeColor = c => setColors(p => p.filter(x=>x!==c));
  const setImg      = (i, v) => setImages(imgs => imgs.map((img,idx) => idx===i ? v : img));

  const submit = async () => {
    if (!form.name || !form.price || !form.mainImg) return showToast('Please fill Name, Price and Main Image');
    setSaving(true);
    try {
      await axios.put(`${API}/products/update-product/${id}`, {
        ...form, price:Number(form.price), discount:Number(form.discount), stock:Number(form.stock),
        sizes, colors, images: images.filter(Boolean),
      });
      showToast('Product updated!');
      setTimeout(() => navigate('/all-products'), 1500);
    } catch { showToast('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="luxury-spinner" style={{marginTop:'30vh'}}><div className="spinner-ring" /></div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/all-products')}><FiArrowLeft /> Back</button>
      <div style={s.title}>Edit Product</div>

      <div style={s.grid}>
        <div>
          <div style={s.panel}>
            <div style={s.ph}>Basic Information</div>
            <div style={s.field}><label style={s.label}>Product Name</label>
              <input style={inp} value={form.name} onChange={e=>set('name',e.target.value)} onFocus={handleF} onBlur={handleB} /></div>
            <div style={s.field}><label style={s.label}>Description</label>
              <textarea style={{...inp,resize:'vertical',minHeight:100}} value={form.description} onChange={e=>set('description',e.target.value)} onFocus={handleF} onBlur={handleB} /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={s.field}><label style={s.label}>Category</label>
                <select style={inp} value={form.category} onChange={e=>set('category',e.target.value)}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              <div style={s.field}><label style={s.label}>Brand</label>
                <input style={inp} value={form.brand} onChange={e=>set('brand',e.target.value)} onFocus={handleF} onBlur={handleB} /></div>
            </div>
          </div>

          <div style={s.panel}>
            <div style={s.ph}>Pricing & Stock</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
              {[['Price (₹)','price'],['Discount (%)','discount'],['Stock','stock']].map(([lbl,key])=>(
                <div key={key} style={s.field}><label style={s.label}>{lbl}</label>
                  <input style={inp} type="number" value={form[key]} onChange={e=>set(key,e.target.value)} onFocus={handleF} onBlur={handleB} /></div>
              ))}
            </div>
          </div>

          <div style={s.panel}>
            <div style={s.ph}>Variants</div>
            <div style={s.field}><label style={s.label}>Sizes</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {ALL_SIZES.map(sz=>(
                  <button key={sz} type="button" style={{...s.sizeBtn,...(sizes.includes(sz)?s.sizeBtnA:{})}} onClick={()=>toggleSize(sz)}>{sz}</button>
                ))}
              </div>
            </div>
            <div style={s.field}><label style={s.label}>Colours</label>
              <div style={{display:'flex',gap:8,marginBottom:8}}>
                <input style={{...inp,flex:1}} value={colorInput} onChange={e=>setColorInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addColor())}
                  placeholder="Add colour…" onFocus={handleF} onBlur={handleB} />
                <button type="button" className="btn-outline" style={{padding:'10px 14px'}} onClick={addColor}><FiPlus /></button>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {colors.map(c=>(
                  <span key={c} style={s.tag}>{c} <button style={s.tagX} onClick={()=>removeColor(c)}><FiX /></button></span>
                ))}
              </div>
            </div>
          </div>

          <div style={s.panel}>
            <div style={s.ph}>Visibility</div>
            {[['isFeatured','Featured on Home Page'],['isTrending','Mark as Trending']].map(([key,lbl])=>(
              <div key={key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <span style={{fontSize:13}}>{lbl}</span>
                <Toggle val={form[key]} onChange={v=>set(key,v)} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={s.panel}>
            <div style={s.ph}>Main Image</div>
            <div style={s.field}><label style={s.label}>URL</label>
              <input style={inp} value={form.mainImg} onChange={e=>set('mainImg',e.target.value)} onFocus={handleF} onBlur={handleB} placeholder="https://images.unsplash.com/…" />
              {form.mainImg ? <img src={form.mainImg} alt="main" style={s.preview} onError={e=>e.target.style.display='none'} /> : <div style={s.previewPh}>Preview</div>}
            </div>
          </div>
          <div style={s.panel}>
            <div style={s.ph}>Gallery Images</div>
            {[0,1,2].map(i=>(
              <div key={i} style={{...s.field,marginBottom:i===2?0:16}}><label style={s.label}>Image {i+1}</label>
                <input style={inp} value={images[i]} onChange={e=>setImg(i,e.target.value)} onFocus={handleF} onBlur={handleB} placeholder="https://images.unsplash.com/…" />
              </div>
            ))}
          </div>

          <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:8}}>
            <button className="btn-outline" onClick={()=>navigate('/all-products')}>Cancel</button>
            <button className="btn-gold" onClick={submit} disabled={saving} style={{minWidth:160,justifyContent:'center'}}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {toast && <div className="toast-luxury">{toast}</div>}
    </div>
  );
};

export default UpdateProduct;
