import { useEffect, useState } from 'react';
import { getAssignments, getMySubmissions, submitAssignment } from '../api/assignments';

function StudentView({ onLogout }) {
  const [tab, setTab] = useState('pending');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  const refresh = async () => {
    const [available, mine] = await Promise.all([getAssignments(), getMySubmissions()]);
    setAssignments(available);
    setSubmissions(mine);
  };

  useEffect(() => {
    refresh()
      .catch((err) => setError(err.message || 'Could not load your assignments.'))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (assignmentId) => {
    const content = (drafts[assignmentId] || '').trim();
    if (!content) return;
    setSavingId(assignmentId);
    setError('');
    try {
      await submitAssignment(assignmentId, content);
      setDrafts((current) => ({ ...current, [assignmentId]: '' }));
      await refresh();
      setTab('grades');
    } catch (err) {
      setError(err.message || 'Submission failed.');
    } finally {
      setSavingId(null);
    }
  };

  const navBtn = (active) => ({
    padding: '6px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
    background: tab === active ? '#EEEDFE' : 'none',
    color: tab === active ? '#3C3489' : '#555',
    fontWeight: tab === active ? 600 : 400,
  });

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #eee',padding:'0 1.5rem',display:'flex',alignItems:'center',height:'52px',gap:'8px'}}>
        <span style={{fontWeight:600,marginRight:'1rem'}}>GradeFlow</span>
        <button style={navBtn('grades')} onClick={() => setTab('grades')}>My submissions</button>
        <button style={navBtn('pending')} onClick={() => setTab('pending')}>Available assignments</button>
        <button onClick={onLogout} style={{marginLeft:'auto',padding:'6px 12px',border:'1px solid #ddd',borderRadius:'8px',background:'none',cursor:'pointer',fontSize:'13px'}}>Sign out</button>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'1.5rem'}}>
        {error && <div role="alert" style={{padding:'10px 12px',marginBottom:'1rem',background:'#FCEBEB',color:'#A32D2D',borderRadius:'8px',fontSize:'12px'}}>{error}</div>}
        {loading && <p style={{color:'#666'}}>Loading your workspace...</p>}
        {!loading && tab === 'pending' && (
          <>
            <h2 style={{marginTop:0}}>Available assignments</h2>
            {assignments.length === 0 && <p style={{color:'#666'}}>There are no active assignments available right now.</p>}
            {assignments.map((assignment) => {
              const existing = submissions.find((item) => item.assignment_id === assignment.id);
              return (
                <div key={assignment.id} style={{background:'#fff',borderRadius:'10px',padding:'1.25rem',marginBottom:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center'}}>
                    <strong>{assignment.title}</strong>
                    <span style={{fontSize:'11px',color:'#666'}}>{existing ? 'Submitted — resubmission allowed' : 'Not submitted'}</span>
                  </div>
                  <p style={{fontSize:'13px',color:'#666',lineHeight:1.6}}>{assignment.description || 'No additional instructions provided.'}</p>
                  <div style={{fontSize:'12px',color:'#888',marginBottom:10}}>
                    {assignment.total_points} points{assignment.due_date ? ` · Due ${assignment.due_date}` : ''}
                  </div>
                  <textarea
                    value={drafts[assignment.id] || ''}
                    onChange={(event) => setDrafts((current) => ({...current, [assignment.id]: event.target.value}))}
                    placeholder="Write or paste your submission here..."
                    rows={5}
                    style={{width:'100%',padding:10,border:'1px solid #ddd',borderRadius:8,boxSizing:'border-box',resize:'vertical'}}
                  />
                  <button disabled={!(drafts[assignment.id] || '').trim() || savingId === assignment.id} onClick={() => submit(assignment.id)} style={{marginTop:10,padding:'8px 16px',background:'#534AB7',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',opacity:savingId === assignment.id ? 0.6 : 1}}>
                    {savingId === assignment.id ? 'Submitting...' : existing ? 'Update submission' : 'Submit assignment'}
                  </button>
                </div>
              );
            })}
          </>
        )}
        {!loading && tab === 'grades' && (
          <>
            <h2 style={{marginTop:0}}>My submissions</h2>
            {submissions.length === 0 && <p style={{color:'#666'}}>You have not submitted any assignments yet.</p>}
            {submissions.map((submission) => {
              const assignment = assignments.find((item) => item.id === submission.assignment_id);
              return (
                <div key={submission.id} style={{background:'#fff',borderRadius:10,padding:'1rem',marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',gap:12}}>
                    <strong>{assignment?.title || `Assignment #${submission.assignment_id}`}</strong>
                    <span style={{fontSize:11,color:'#3B6D11'}}>{submission.status}</span>
                  </div>
                  <p style={{fontSize:12,color:'#888'}}>Submitted {new Date(submission.submitted_at).toLocaleString()}</p>
                  <div style={{fontSize:13,whiteSpace:'pre-wrap',lineHeight:1.6}}>{submission.content}</div>
                  <p style={{fontSize:11,color:'#888',marginBottom:0}}>Instructor review and grading are not yet enabled for this submission.</p>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentView;
