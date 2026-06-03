import { useState } from 'react';
import Login from './components/Login';
import InstructorDashboard from './components/InstructorDashboard';
import StudentView from './components/StudentView';

function App() {
  const [screen, setScreen] = useState('login');

  return (
    <div>
      {screen === 'login' && <Login onLogin={setScreen} />}
      {screen === 'instructor' && <InstructorDashboard onLogout={() => setScreen('login')} />}
      {screen === 'student' && <StudentView onLogout={() => setScreen('login')} />}
    </div>
  );
}

export default App;