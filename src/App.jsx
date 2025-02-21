import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage';
import Dashboard from './pages/DashBoard';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Add placeholder routes for other sections */}
        <Route path="/brand-assistant" element={<Dashboard />} />
        <Route path="/job-assistant" element={<Dashboard />} />
        <Route path="/fund-finder" element={<Dashboard />} />
        <Route path="/freelancer-hub" element={<Dashboard />} />
        <Route path="/signin" element={<div>Sign In Page</div>} />
        <Route path="/signup" element={<div>Sign Up Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;