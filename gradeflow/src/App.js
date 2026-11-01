import { useState } from 'react';
import Login from './components/Login';
import InstructorDashboard from './components/InstructorDashboard';
import StudentView from './components/StudentView';
import { setAccessToken } from './api/assignments';

function App() {
  const [session, setSession] = useState(null);

  const handleLogin = (nextSession) => {
    setAccessToken(nextSession.access_token);
    setSession(nextSession.user);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setSession(null);
  };

  return (
    <div>
      {!session && <Login onLogin={handleLogin} />}
      {session?.role === 'instructor' && <InstructorDashboard onLogout={handleLogout} />}
      {session?.role === 'student' && <StudentView onLogout={handleLogout} />}
    </div>
  );
}

export default App;
