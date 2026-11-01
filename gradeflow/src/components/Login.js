import { useState } from 'react';
import { loginUser, registerStudent } from '../api/assignments';

function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const input = {
    width: '100%', padding: '10px', marginBottom: '12px',
    border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box',
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = mode === 'register'
        ? await registerStudent(email, password, signupCode)
        : await loginUser(email, password);
      onLogin(session);
    } catch (err) {
      setError(err.message || 'Unable to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f5f5'}}>
      <div style={{background:'#fff',padding:'2rem',borderRadius:'12px',width:'360px',boxShadow:'0 2px 16px rgba(0,0,0,0.1)'}}>
        <h2 style={{marginTop:0}}>GradeFlow</h2>
        <p style={{color:'#666',fontSize:'13px',marginBottom:'1rem'}}>
          Secure instructor and student access
        </p>
        <form onSubmit={handleSubmit}>
          <label style={{display:'block',fontSize:'12px',color:'#555',marginBottom:5}}>University email</label>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required style={input} />
          <label style={{display:'block',fontSize:'12px',color:'#555',marginBottom:5}}>Password (minimum 12 characters)</label>
          <input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} minLength={12} maxLength={128} required style={input} />
          {mode === 'register' && (
            <>
              <label style={{display:'block',fontSize:'12px',color:'#555',marginBottom:5}}>Student registration code</label>
              <input value={signupCode} onChange={(e) => setSignupCode(e.target.value)} required style={input} />
            </>
          )}
          {error && <p role="alert" style={{color:'#A32D2D',fontSize:'12px',lineHeight:1.5}}>{error}</p>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'11px',background:'#534AB7',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'14px',fontWeight:600,opacity:loading?0.65:1}}>
            {loading ? 'Please wait...' : mode === 'register' ? 'Create student account' : 'Sign in'}
          </button>
        </form>
        <button onClick={() => {setMode(mode === 'login' ? 'register' : 'login');setError('');}} style={{width:'100%',marginTop:12,padding:8,border:'none',background:'none',color:'#534AB7',cursor:'pointer',fontSize:12}}>
          {mode === 'login' ? 'Register as a student' : 'Back to sign in'}
        </button>
        <p style={{color:'#888',fontSize:'11px',lineHeight:1.5,marginBottom:0}}>
          Instructor accounts are provisioned by the deployment administrator. Student registration requires an administrator-issued code.
        </p>
      </div>
    </div>
  );
}

export default Login;
