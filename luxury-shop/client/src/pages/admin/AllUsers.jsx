import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiUsers, FiUser } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

const API = 'http://localhost:6001/api';

const s = {
  page:  { minHeight:'100vh', background:'var(--bg)', padding:'40px 48px' },
  topBar:{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32 },
  title: { fontFamily:'Cormorant Garamond,serif',fontSize:'36px',fontWeight:400,color:'var(--navy)' },
  search:{ display:'flex',alignItems:'center',gap:8,padding:'0 16px',border:'1px solid var(--border)',borderRadius:'var(--radius)',background:'#fff',width:280 },
  sinp:  { border:'none',outline:'none',padding:'10px 8px',fontSize:13,flex:1,color:'var(--text)',fontFamily:'Inter,sans-serif' },
  stats: { display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:32 },
  stat:  { background:'#fff',borderRadius:8,border:'1px solid var(--border)',padding:'20px 24px',display:'flex',alignItems:'center',gap:16 },
  sIcon: { width:44,height:44,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 },
  sNum:  { fontFamily:'Cormorant Garamond,serif',fontSize:'32px',fontWeight:500,color:'var(--navy)',lineHeight:1 },
  sLbl:  { fontSize:'11px',color:'var(--text-muted)',marginTop:2 },
  table: { background:'#fff',borderRadius:8,border:'1px solid var(--border)',overflow:'hidden' },
  thead: { background:'var(--navy)' },
  th:    { padding:'14px 20px',fontSize:'10px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(255,255,255,0.7)',textAlign:'left' },
  td:    { padding:'16px 20px',fontSize:'13px',color:'var(--text)',borderBottom:'1px solid var(--border)',verticalAlign:'middle' },
  avt:   { width:36,height:36,borderRadius:'50%',background:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',fontSize:14,flexShrink:0,fontWeight:600 },
  name:  { fontFamily:'Cormorant Garamond,serif',fontSize:'15px',fontWeight:500,color:'var(--navy)' },
  email: { fontSize:'11px',color:'var(--text-muted)',marginTop:2 },
  badge: { display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:2,fontSize:'10px',fontWeight:700,letterSpacing:'0.5px' },
};

const AllUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/admin/fetch-all-users`)
      .then(r => setUsers(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    (u.username||'').toLowerCase().includes(query.toLowerCase()) ||
    (u.email||'').toLowerCase().includes(query.toLowerCase())
  );

  const customers = users.filter(u => u.usertype !== 'admin');
  const admins    = users.filter(u => u.usertype === 'admin');

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <span style={{fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',display:'block',marginBottom:4}}>Manage</span>
          <h1 style={s.title}>All Users <span style={{fontSize:'18px',fontFamily:'Inter',color:'var(--text-muted)',fontWeight:400}}>({users.length})</span></h1>
        </div>
        <div style={s.search}>
          <FiSearch style={{color:'var(--text-muted)',flexShrink:0}} />
          <input style={s.sinp} placeholder="Search users…" value={query} onChange={e=>setQuery(e.target.value)} />
        </div>
      </div>

      <div style={s.stats}>
        {[
          { icon:<FiUsers />, bg:'#EFF6FF', color:'#1D4ED8', num:users.length, lbl:'Total Users' },
          { icon:<FiUser />,  bg:'#F0FDF4', color:'#15803D', num:customers.length, lbl:'Customers' },
          { icon:<MdAdminPanelSettings />, bg:'#FFF7ED', color:'#C2410C', num:admins.length, lbl:'Admins' },
        ].map((st,i) => (
          <div key={i} style={s.stat}>
            <div style={{...s.sIcon, background:st.bg, color:st.color}}>{st.icon}</div>
            <div><div style={s.sNum}>{st.num}</div><div style={s.sLbl}>{st.lbl}</div></div>
          </div>
        ))}
      </div>

      <div style={s.table}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead style={s.thead}>
            <tr>
              {['User','Email','Type','Member Since'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{textAlign:'center',padding:'40px'}}>
                <div className="spinner-ring" style={{margin:'0 auto'}} />
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign:'center',padding:'48px',color:'var(--text-muted)',fontSize:13}}>No users found</td></tr>
            ) : filtered.map((u, i) => (
              <tr key={u._id} style={{background:i%2===0?'#fff':'#FAFAF9'}}>
                <td style={s.td}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={s.avt}>{(u.username||'?')[0].toUpperCase()}</div>
                    <div style={s.name}>{u.username || '—'}</div>
                  </div>
                </td>
                <td style={s.td}><span style={{fontSize:13,color:'var(--text-muted)'}}>{u.email}</span></td>
                <td style={s.td}>
                  {u.usertype === 'admin'
                    ? <span style={{...s.badge,background:'#FFF7ED',color:'#C2410C'}}><MdAdminPanelSettings /> Admin</span>
                    : <span style={{...s.badge,background:'#EFF6FF',color:'#1D4ED8'}}><FiUser /> Customer</span>
                  }
                </td>
                <td style={s.td}>
                  <span style={{fontSize:12,color:'var(--text-muted)'}}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
