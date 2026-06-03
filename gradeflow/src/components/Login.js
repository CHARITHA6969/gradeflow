import { useState } from 'react';

function Login({ onLogin }) {
  const [role, setRole] = useState('instructor');

  const btn = (r) => ({
    flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer',
    border: role === r ? '2px solid #534AB7' : '1px solid #ddd',
    background: role === r ? '#EEEDFE' : '#fff',
    color: role === r ? '#3C3489' : '#555',
  });

  const input = {
    width: '100%', padding: '8px', marginBottom: '1rem',
    border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box',
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f5f5'}}>
      <div style={{background:'#fff',padding:'2rem',borderRadius:'12px',width:'360px',boxShadow:'0 2px 16px rgba(0,0,0,0.1)'}}>
        <h2>GradeFlow</h2>
        <p style={{color:'#666',fontSize:'13px',marginBottom:'1rem'}}>AI-powered grading platform</p>
        <div style={{display:'flex',gap:'8px',marginBottom:'1rem'}}>
          <button onClick={() => setRole('instructor')} style={btn('instructor')}>Instructor</button>
          <button onClick={() => setRole('student')} style={btn('student')}>Student</button>
        </div>
        <input
          defaultValue={role === 'instructor' ? 'instructor@university.edu' : 'student@university.edu'}
          style={input}
        />
        <input type="password" defaultValue="password" style={input} />
        <button
          onClick={() => onLogin(role)}
          style={{width:'100%',padding:'10px',background:'#534AB7',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'14px',fontWeight:600}}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default Login;