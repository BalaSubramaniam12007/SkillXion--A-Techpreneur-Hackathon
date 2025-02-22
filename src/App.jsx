import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Homepage from './pages/HomePage';
import Dashboard from './pages/DashBoard';
import ProfilePage from './pages/ProfilePage';
import Auth from './pages/Auth';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
    <Route path="/auth/callback" element={<AuthCallback />} />
  }
  
  return children;
};

const AuthCallback = () => {
  const { search } = useLocation();
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const params = new URLSearchParams(search);
      const token = params.get('token');
      const type = params.get('type');
      
      if (type === 'email_confirmation') {
        try {
          await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email_confirmation'
          });
          // Redirect to success page or login
          navigate('/auth');
        } catch (error) {
          console.error('Error confirming email:', error);
        }
      }
    };
    
    handleEmailConfirmation();
  }, [search]);

  return <div>Confirming your email...</div>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/brand-assistant" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/job-assistant" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/fund-finder" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/freelancer-hub" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;