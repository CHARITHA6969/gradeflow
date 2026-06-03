import { useState } from 'react';

const grades = [
  { title: 'REST API Design', submitted: 'Nov 19', score: 79, total: 100, status: 'Graded',
    feedback: [
      { type: 'pos', text: 'Strong RESTful endpoint naming and correct use of HTTP verbs.' },
      { type: 'pos', text: 'JSON response schemas are consistent with good error handling.' },
      { type: 'neg', text: 'Authentication implementation is missing rate limiting.' },
      { type: 'neg', text: 'OpenAPI documentation is incomplete.' },
    ],
    breakdown: [
      { name: 'Endpoint design', earned: 27, total: 30 },
      { name: 'Request/response', earned: 21, total: 25 },
      { name: 'Authentication', earned: 17, total: 25 },
      { name: 'Documentation', earned: 14, total: 20 },
    ]
  },
  { title: 'Database Schema', submitted: 'Nov 17', score: 88, total: 100, status: 'Graded',
    feedback: [
      { type: 'pos', text: 'Excellent normalization up to 3NF.' },
      { type: 'neg', text: 'Missing composite indexes on frequently joined columns.' },
    ],
    breakdown: [
      { name: 'Schema design', earned: 24, total: 25 },
      { name: 'Normalization', earned: 23, total: 25 },
      { name: 'Indexing', earned: 22, total: 25 },
      { name: 'Documentation', earned: 19, total: 25 },
    ]
  },
  { title: 'Unit Testing Lab', submitted: 'Nov 9', score: 91, total: 100, status: 'Graded',
    feedback: [
      { type: 'pos', text: 'Excellent test coverage with meaningful assertions.' },
      { type: 'pos', text: 'Edge cases well handled throughout.' },
    ],
    breakdown: [
      { name: 'Test coverage', earned: 24, total: 25 },
      { name: 'Test quality', earned: 23, total: 25 },
      { name: 'Edge cases', earned: 22, total: 25 },
      { name: 'Documentation', earned: 22, total: 25 },
    ]
  },
  { title: 'System Design Doc', submitted: null, score: null, total: 100, status: 'Pending', feedback: [], breakdown: [] },
];

function StudentView({ onLogout }) {
  const [tab, setTab] = useState('grades');
  const [selected, setSelected] = useState(null);

  const navBtn = (t) => ({
    padding: '6px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
    background: tab === t ? '#EEEDFE' : 'none', color: tab === t ? '#3C3489' : '#555',
    fontWeight: tab === t ? 600 : 400,
  });

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 1.5rem',display:'flex',alignItems:'center',height:'52px',gap:'8px'}}>
        <span style={{fontWeight:600,marginRight:'1rem'}}>GradeFlow</span>
        <button style={navBtn('grades')} onClick={() => setTab('grades')}>My grades</button>
        <button style={navBtn('pending')} onClick={() => setTab('pending')}>Pending</button>
        <button onClick={onLogout} style={{marginLeft:'auto',padding:'6px 12px',border:'1px solid #ddd',borderRadius:'8px',background:'none',cursor:'pointer',fontSize:'13px'}}>Sign out</button>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'1.5rem'}}>
        {tab === 'grades' && (
          <>
            <div style={{marginBottom:'1.5rem'}}>
              <h2 style={{margin:0}}>My grades</h2>
              <p style={{color:'#666',fontSize:'13px',margin:0}}>CS 301 — Fall 2025</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'1.5rem'}}>
              {[['Overall','B+'],['Average','84%'],['Completed','3/4'],['Rank','#8']].map(([l,v]) => (
                <div key={l} style={{background:'#fff',borderRadius:'10px',padding:'1rem'}}>
                  <div style={{fontSize:'12px',color:'#888'}}>{l}</div>
                  <div style={{fontSize:'22px',fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
            {grades.map((g,i) => (
              <div key={i} onClick={() => g.status === 'Graded' && setSelected(g)}
                style={{background:'#fff',borderRadius:'10px',padding:'1rem',marginBottom:'10px',display:'flex',alignItems:'center',gap:'1rem',cursor:g.status==='Graded'?'pointer':'default'}}>
                <div style={{width:'52px',height:'52px',borderRadius:'50%',background:g.score?'#EEEDFE':'#f0f0f0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {g.score
                    ? <><span style={{fontSize:'17px',fontWeight:600,color:'#3C3489',lineHeight:1}}>{g.score}</span><span style={{fontSize:'10px',color:'#534AB7'}}>/{g.total}</span></>
                    : <span style={{fontSize:'11px',color:'#888'}}>Due</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500}}>{g.title}</div>
                  <div style={{fontSize:'12px',color:'#888'}}>{g.submitted ? `Submitted ${g.submitted}` : 'Not yet submitted'}{g.status==='Graded'?' · Click to view feedback':''}</div>
                </div>
                <span style={{padding:'3px 10px',borderRadius:'999px',fontSize:'11px',fontWeight:600,background:g.status==='Graded'?'#EAF3DE':'#FAEEDA',color:g.status==='Graded'?'#3B6D11':'#854F0B'}}>{g.status}</span>
              </div>
            ))}
          </>
        )}

        {tab === 'pending' && (
          <>
            <h2 style={{marginBottom:'1.5rem'}}>Pending assignments</h2>
            {[
              { title: 'System Design Doc', due: 'Nov 25', desc: 'Design a scalable system for a social media platform. Include component diagrams, data flow, and API contracts.' },
              { title: 'Microservices Lab', due: 'Dec 3', desc: 'Decompose a monolithic app into microservices. Implement at least 3 services with inter-service communication.' },
            ].map((a,i) => (
              <div key={i} style={{background:'#fff',borderRadius:'10px',padding:'1.25rem',marginBottom:'10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                  <span style={{fontWeight:600}}>{a.title}</span>
                  <span style={{background:'#FAEEDA',color:'#854F0B',padding:'3px 10px',borderRadius:'999px',fontSize:'11px',fontWeight:600}}>Due {a.due}</span>
                </div>
                <p style={{fontSize:'13px',color:'#666',marginBottom:'1rem',lineHeight:1.6}}>{a.desc}</p>
                <button style={{padding:'8px 16px',background:'#534AB7',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>Submit</button>
              </div>
            ))}
          </>
        )}
      </div>

      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}} onClick={() => setSelected(null)}>
          <div style={{background:'#fff',borderRadius:'12px',padding:'1.5rem',width:'560px',maxHeight:'80vh',overflowY:'auto'}} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
              <h3 style={{margin:0}}>Feedback — {selected.title}</h3>
              <button onClick={() => setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'20px'}}>×</button>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'1rem',background:'#f5f5f5',borderRadius:'10px',padding:'1rem',marginBottom:'1rem'}}>
              <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'#EEEDFE',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <span style={{fontSize:'17px',fontWeight:600,color:'#3C3489',lineHeight:1}}>{selected.score}</span>
                <span style={{fontSize:'10px',color:'#534AB7'}}>/{selected.total}</span>
              </div>
              <div>
                <div style={{fontWeight:500}}>Submitted {selected.submitted}</div>
                <div style={{fontSize:'12px',color:'#888'}}>AI-assisted review</div>
              </div>
            </div>
            <div style={{marginBottom:'1rem'}}>
              {selected.feedback.map((f,i) => (
                <div key={i} style={{padding:'10px 12px',borderRadius:'8px',marginBottom:'8px',borderLeft:`3px solid ${f.type==='pos'?'#639922':'#E24B4A'}`,background:f.type==='pos'?'#EAF3DE':'#FCEBEB',fontSize:'13px',lineHeight:1.6}}>{f.text}</div>
              ))}
            </div>
            <h4 style={{fontSize:'13px',color:'#888',marginBottom:'10px'}}>Score breakdown</h4>
            {selected.breakdown.map((s,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <span style={{flex:1,fontSize:'13px'}}>{s.name}</span>
                <div style={{flex:2,height:'6px',background:'#eee',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{width:`${(s.earned/s.total)*100}%`,height:'100%',background:'#7F77DD',borderRadius:'3px'}} />
                </div>
                <span style={{fontSize:'13px',fontWeight:600,minWidth:'40px',textAlign:'right'}}>{s.earned}/{s.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentView;