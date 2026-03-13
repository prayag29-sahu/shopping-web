import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowRight } from 'react-icons/fi';
import { MdLocalShipping, MdLoop, MdVerified } from 'react-icons/md';
import { FaHeadset } from 'react-icons/fa';
import '../styles/Home.css';

const API = 'http://localhost:6001/api';

const CATEGORIES = [
  { name: 'Men',   img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80', count: 'New Arrivals' },
  { name: 'Women', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80', count: 'Curated Edit' },
  { name: 'Boys',  img: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=500&q=80', count: 'Young & Bold' },
  { name: 'Girls', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSchSccm-S5GbjxoO4CA4JIK0NaIpuVoEaqnQ&s', count: 'Little Luxe' },
  { name: 'Kids',  img: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=500&q=80', count: 'Play & Explore' },
];

const ProductCard = ({ product, onClick }) => {
  const finalPrice = Math.round(product.price - (product.price * product.discount) / 100);
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-card-img">
        <img src={product.mainImg} alt={product.name} loading="lazy" />
        <div className="product-card-badges">
          {product.isTrending && <span className="badge-luxury badge-gold">Trending</span>}
          {product.discount > 0 && <span className="badge-luxury badge-sale">-{product.discount}%</span>}
        </div>
        <div className="product-card-overlay">
          <button className="btn-luxury" style={{fontSize:'10px',padding:'10px 20px'}}>Quick View</button>
        </div>
      </div>
      <div className="product-card-body">
        <div className="product-card-brand">{product.brand}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-colors">
          {(product.colors || []).slice(0,3).map(c => (
            <span key={c} className="color-dot">{c}</span>
          )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`d${i}`} style={{color:'#ccc'}}>·</span>, el], [])}
        </div>
        <div className="product-card-price">
          <span className="price-final">₹{finalPrice.toLocaleString()}</span>
          {product.discount > 0 && <span className="price-original">₹{product.price.toLocaleString()}</span>}
          {product.discount > 0 && <span className="price-off">{product.discount}% off</span>}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured]   = useState([]);
  const [trending, setTrending]   = useState([]);
  const [bannerImg, setBannerImg] = useState('');

  useEffect(() => {
    axios.get(`${API}/products/fetch-products?featured=true`).then(r => setFeatured(r.data)).catch(() => {});
    axios.get(`${API}/products/fetch-products?trending=true`).then(r => setTrending(r.data)).catch(() => {});
    axios.get(`${API}/banners`).then(r => setBannerImg(r.data)).catch(() => {});
  }, []);

  return (
    <div className="page-wrapper">

      {/* ── Hero ── */}
      <section className="hero">
        <img className="hero-img"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=90"
          alt="VELOUR hero" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-eyebrow">New Season Arrivals</span>
          <h1 className="hero-title">Dress with <em>Intent</em>,<br />Live with Style</h1>
          <p className="hero-sub">Thoughtfully crafted clothing for every chapter of life. Premium fabrics, refined silhouettes, timeless design.</p>
          <div className="hero-ctas">
            <button className="btn-gold" onClick={() => navigate('/category/Women')}>
              Shop Women <FiArrowRight />
            </button>
            <button className="btn-luxury" onClick={() => navigate('/category/Men')}>
              Shop Men <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── USP Bar ── */}
      <div className="usp-bar">
        {[
          { icon: <MdLocalShipping className="usp-icon" />, title: 'Free Shipping', sub: 'On orders above ₹2,999' },
          { icon: <MdLoop className="usp-icon" />,          title: 'Easy Returns',  sub: '30-day hassle-free returns' },
          { icon: <MdVerified className="usp-icon" />,      title: 'Authentic',     sub: '100% genuine products' },
          { icon: <FaHeadset className="usp-icon" />,       title: '24/7 Support',  sub: 'Dedicated style advisors' },
        ].map(u => (
          <div className="usp-item" key={u.title}>
            {u.icon}
            <div><h6>{u.title}</h6><p>{u.sub}</p></div>
          </div>
        ))}
      </div>

      {/* ── Categories ── */}
      <section className="section">
        <div className="section-header centered">
          <span className="section-eyebrow">Shop By Category</span>
          <h2 className="section-title">Find Your Style</h2>
          <div className="gold-divider" />
        </div>
        <div className="cat-grid">
          {CATEGORIES.map(cat => (
            <div className="cat-card" key={cat.name} onClick={() => navigate(`/category/${cat.name}`)}>
              <img src={cat.img} alt={cat.name} loading="lazy" />
              <div className="cat-card-overlay" />
              <div className="cat-card-label">
                <h4>{cat.name}</h4>
                <span>{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="section" style={{background:'var(--bg-white)',paddingTop:'64px'}}>
          <div className="section-header">
            <span className="section-eyebrow">Handpicked For You</span>
            <h2 className="section-title">Featured Collection</h2>
            <div className="gold-divider" />
            <p className="section-subtitle">The pieces our stylists are most excited about this season.</p>
          </div>
          <div className="products-grid">
            {featured.slice(0, 8).map(p => (
              <ProductCard key={p._id} product={p} onClick={() => navigate(`/product/${p._id}`)} />
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:'48px'}}>
            <button className="btn-outline" onClick={() => navigate('/category/Men')}>View All Products <FiArrowRight /></button>
          </div>
        </section>
      )}

      {/* ── Banner Strip ── */}
      <section className="banner-strip">
        <div className="banner-strip-img">
          <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85" alt="collection" loading="lazy" />
        </div>
        <div className="banner-strip-content">
          <span className="section-eyebrow">Exclusive Drop</span>
          <h2 className="section-title" style={{color:'#fff',fontSize:'clamp(32px,4vw,52px)'}}>The Evening Edit</h2>
          <div className="gold-divider" />
          <p style={{color:'rgba(255,255,255,0.7)',marginBottom:'32px',lineHeight:1.8}}>
            Sophisticated evening wear crafted for the moments that matter most. 
            Fluid silhouettes, luxurious fabrics, and timeless elegance.
          </p>
          <button className="btn-gold" onClick={() => navigate('/category/Women')}>
            Explore Now <FiArrowRight />
          </button>
        </div>
      </section>

      {/* ── Trending ── */}
      {trending.length > 0 && (
        <section className="section">
          <div className="section-header">
            <span className="section-eyebrow">Right Now</span>
            <h2 className="section-title">Trending This Week</h2>
            <div className="gold-divider" />
          </div>
          <div className="products-grid">
            {trending.slice(0, 4).map(p => (
              <ProductCard key={p._id} product={p} onClick={() => navigate(`/product/${p._id}`)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer style={{background:'var(--navy)',color:'rgba(255,255,255,0.6)',padding:'48px',textAlign:'center'}}>
        <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'28px',fontWeight:600,letterSpacing:'6px',color:'#fff',marginBottom:'8px'}}>
          VEL<span style={{color:'var(--gold)'}}>O</span>UR
        </div>
        <p style={{fontSize:'12px',letterSpacing:'1px',marginBottom:'24px'}}>LUXURY FASHION HOUSE</p>
        <div style={{display:'flex',justifyContent:'center',gap:'32px',flexWrap:'wrap',fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase'}}>
          {['Men','Women','Boys','Girls','Kids'].map(c => (
            <span key={c} style={{cursor:'pointer',transition:'color 0.2s'}}
              onMouseEnter={e=>e.target.style.color='var(--gold)'}
              onMouseLeave={e=>e.target.style.color=''}
              onClick={() => navigate(`/category/${c}`)}>{c}</span>
          ))}
        </div>
        <p style={{marginTop:'32px',fontSize:'11px'}}>© 2024 VELOUR. All rights reserved.</p>
      </footer>

    </div>
  );
};

export { ProductCard };
export default Home;
