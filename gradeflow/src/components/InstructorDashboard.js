import { useState } from 'react';

const submissions = [
  { student: 'Aisha Johnson', assignment: 'REST API Design', time: '2h ago', status: 'Pending' },
  { student: 'Marcus Chen', assignment: 'Database Schema', time: '5h ago', status: 'Pending' },
  { student: 'Priya Patel', assignment: 'REST API Design', time: '1d ago', status: 'AI Graded' },
  { student: 'James Walker', assignment: 'Unit Testing Lab', time: '1d ago', status: 'Finalized' },
  { student: 'Sofia Torres', assignment: 'Database Schema', time: '2d ago', status: 'Finalized' },
];

function badge(status) {
  if (status === 'Pending') return { background: '#FAEEDA', color: '#854F0B' };
  if (status === 'AI Graded') return { background: '#EEEDFE', color: '#3C3489' };
  return { background: '#EAF3DE', color: '#3B6D11' };
}

function InstructorDashboard({ onLogout }) {
  const [tab, setTab] = useState('dashboard');
  const [modal, setModal] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navBtn = (t) => ({
    padding: '6px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
    background: tab === t ? '#EEEDFE' : 'none', color: tab === t ? '#3C3489' : '#555',
    fontWeight: tab === t ? 600 : 400,
  });

  const openReview = async (sub) => {
    setModal(sub);
    setAiResult(null);
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are an AI grading assistant. Respond ONLY with a JSON object, no markdown. Fields: summary (string), scores (array of {criterion, earned, total}), tags (array of strings).',
          messages: [{ role: 'user', content: `Grade this: Student: ${sub.student}, Assignment: ${sub.assignment}. Rubric: Endpoint design (30pts), Request/response (25pts), Authentication (25pts), Documentation (20pts).` }],
        }),
      });
      const data = await res.json();
      const text = data.content.map((b) => b.text || '').join('');
      setAiResult(JSON.parse(text));
    } catch {
      setAiResult({
        summary: `${sub.student}'s submission shows solid understanding. Authentication needs improvement.`,
        scores: [
          { criterion: 'Endpoint design', earned: 26, total: 30 },
          { criterion: 'Request/response', earned: 20, total: 25 },
          { criterion: 'Authentication', earned: 16, total: 25 },
          { criterion: 'Documentation', earned: 15, total: 20 },
        ],
        tags: ['Good REST naming', 'Missing rate limiting', 'Incomplete docs'],
      });
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 1.5rem',display:'flex',alignItems:'center',height:'52px',gap:'8px'}}>
        <span style={{fontWeight:600,marginRight:'1rem'}}>GradeFlow</span>
        {['dashboard','assignments','rubric','create'].map(t => (
          <button key={t} style={navBtn(t)} onClick={() => setTab(t)}>
            {t === 'create' ? 'New assignment' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <button onClick={onLogout} style={{marginLeft:'auto',padding:'6px 12px',border:'1px solid #ddd',borderRadius:'8px',background:'none',cursor:'pointer',fontSize:'13px'}}>Sign out</button>
      </div>

      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'1.5rem'}}>
        {tab === 'dashboard' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <div><h2 style={{margin:0}}>Dashboard</h2><p style={{color:'#666',fontSize:'13px',margin:0}}>Fall 2025 — CS 301</p></div>
              <button onClick={() => setTab('create')} style={{padding:'8px 16px',background:'#534AB7',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer'}}>+ New assignment</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'1.5rem'}}>
              {[['Assignments','6'],['Pending','14'],['Graded','38'],['Avg','82%']].map(([l,v]) => (
                <div key={l} style={{background:'#fff',borderRadius:'10px',padding:'1rem'}}>
                  <div style={{fontSize:'12px',color:'#888'}}>{l}</div>
                  <div style={{fontSize:'22px',fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',borderRadius:'10px',padding:'1rem'}}>
              <h3 style={{fontSize:'14px',marginBottom:'1rem'}}>Recent submissions</h3>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
                <thead>
                  <tr>{['Student','Assignment','Submitted','Status','Action'].map(h => <th key={h} style={{textAlign:'left',padding:'8px',borderBottom:'1px solid #eee',color:'#888',fontWeight:400}}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {submissions.map((s,i) => (
                    <tr key={i}>
                      <td style={{padding:'10px 8px'}}>{s.student}</td>
                      <td style={{padding:'10px 8px'}}>{s.assignment}</td>
                      <td style={{padding:'10px 8px',color:'#888'}}>{s.time}</td>
                      <td style={{padding:'10px 8px'}}><span style={{...badge(s.status),padding:'3px 8px',borderRadius:'999px',fontSize:'11px',fontWeight:600}}>{s.status}</span></td>
                      <td style={{padding:'10px 8px'}}><button onClick={() => openReview(s)} style={{background:'none',border:'none',color:'#534AB7',cursor:'pointer'}}>Review</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'assignments' && (
          <div style={{background:'#fff',borderRadius:'10px',padding:'1rem'}}>
            <h2 style={{fontSize:'16px',marginBottom:'1rem'}}>Assignments</h2>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
              <thead><tr>{['Title','Due','Submissions','Avg','Status'].map(h => <th key={h} style={{textAlign:'left',padding:'8px',borderBottom:'1px solid #eee',color:'#888',fontWeight:400}}>{h}</th>)}</tr></thead>
              <tbody>
                {[['REST API Design','Nov 20','28/32','79%','Active'],['Database Schema','Nov 18','30/32','84%','Active'],['Unit Testing Lab','Nov 10','32/32','88%','Closed']].map(([t,d,s,a,st],i) => (
                  <tr key={i}>
                    <td style={{padding:'10px 8px',fontWeight:500}}>{t}</td>
                    <td style={{padding:'10px 8px'}}>{d}</td>
                    <td style={{padding:'10px 8px'}}>{s}</td>
                    <td style={{padding:'10px 8px'}}>{a}</td>
                    <td style={{padding:'10px 8px'}}><span style={{...badge(st==='Active'?'Pending':'Finalized'),padding:'3px 8px',borderRadius:'999px',fontSize:'11px',fontWeight:600}}>{st}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'rubric' && (
          <div>
            <h2 style={{marginBottom:'1rem'}}>Rubric Editor</h2>
            {[['Endpoint design & RESTful conventions','30'],['Request / response structure','25'],['Authentication & security','25'],['Documentation & code quality','20']].map(([name,pts],i) => (
              <div key={i} style={{background:'#fff',borderRadius:'10px',padding:'1rem',marginBottom:'12px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                  <span style={{fontWeight:600}}>{name}</span>
                  <span style={{background:'#f0f0f0',padding:'3px 10px',borderRadius:'999px',fontSize:'12px'}}>{pts} pts</span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px'}}>
                  {[['Excellent','#EAF3DE','#3B6D11'],['Proficient','#FAEEDA','#854F0B'],['Developing','#FAECE7','#993C1D'],['Insufficient','#FCEBEB','#A32D2D']].map(([l,bg,color]) => (
                    <div key={l} style={{background:bg,borderRadius:'8px',padding:'8px',textAlign:'center'}}>
                      <div style={{fontWeight:600,color}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'create' && (
          <div style={{background:'#fff',borderRadius:'10px',padding:'1.5rem'}}>
            <h2 style={{marginBottom:'1.5rem'}}>New Assignment</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {[['Title','text'],['Due Date','date'],['Points','number']].map(([l,t]) => (
                <div key={l}>
                  <label style={{display:'block',fontSize:'13px',marginBottom:'6px',color:'#555'}}>{l}</label>
                  <input type={t} style={{width:'100%',padding:'8px',border:'1px solid #ddd',borderRadius:'8px',boxSizing:'border-box'}} />
                </div>
              ))}
              <div style={{gridColumn:'1/-1',display:'flex',gap:'8px',marginTop:'1rem'}}>
                <button onClick={() => { alert('Assignment created!'); setTab('assignments'); }} style={{padding:'9px 18px',background:'#534AB7',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600}}>Create assignment</button>
                <button style={{padding:'9px 18px',border:'1px solid #ddd',borderRadius:'8px',background:'none',cursor:'pointer'}}>Save as draft</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}} onClick={() => setModal(null)}>
          <div style={{background:'#fff',borderRadius:'12px',padding:'1.5rem',width:'560px',maxHeight:'80vh',overflowY:'auto'}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
              <h3 style={{margin:0}}>{modal.student} — {modal.assignment}</h3>
              <button onClick={() => setModal(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'20px'}}>×</button>
            </div>
            {loading && <div style={{padding:'1rem',background:'#EEEDFE',borderRadius:'8px',color:'#3C3489'}}>⏳ AI is analyzing this submission...</div>}
            {aiResult && (
              <>
                <div style={{background:'#f5f5f5',borderRadius:'8px',padding:'1rem',fontSize:'13px',lineHeight:1.7,marginBottom:'1rem'}}>{aiResult.summary}</div>
                {aiResult.scores.map((s,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                    <span style={{flex:1,fontSize:'13px'}}>{s.criterion}</span>
                    <div style={{flex:2,height:'6px',background:'#eee',borderRadius:'3px',overflow:'hidden'}}>
                      <div style={{width:`${(s.earned/s.total)*100}%`,height:'100%',background:'#7F77DD',borderRadius:'3px'}} />
                    </div>
                    <span style={{fontSize:'13px',fontWeight:600,minWidth:'40px',textAlign:'right'}}>{s.earned}/{s.total}</span>
                  </div>
                ))}
                <div style={{marginTop:'1rem'}}>{aiResult.tags.map((t,i) => <span key={i} style={{display:'inline-block',background:'#f0f0f0',borderRadius:'6px',padding:'3px 8px',fontSize:'11px',margin:'2px'}}>{t}</span>)}</div>
              </>
            )}
            <div style={{display:'flex',gap:'8px',marginTop:'1rem'}}>
              <button onClick={() => { alert('Grade finalized!'); setModal(null); }} style={{padding:'8px 16px',background:'#534AB7',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer'}}>Approve & finalize</button>
              <button onClick={() => setModal(null)} style={{padding:'8px 16px',border:'1px solid #ddd',borderRadius:'8px',background:'none',cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;