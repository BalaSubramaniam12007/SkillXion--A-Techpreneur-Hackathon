import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/DashBoard";
import ProfilePage from "./pages/ProfilePage";
import Auth from "./pages/Auth";
import BrandAssistant from "./components/features/BrandAI/BrandAssistant";
import StartupListings from "./components/features/FunderAI/StartupListing";
import { supabase } from "./lib/supabase";
import ProjectListings from "./components/features/FreelancerHub/ProjectListings";
import JobListings from "./components/features/JobAI/JobListings";
import JobDescription from "./components/features/JobAI/JobDescription"; // Import the new component
import ResumeAssistant from "./components/features/ResumeAI/ResumeAssistant";
import MockInterviewPage from "./components/features/MockInterview/MockInterviewPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import StartupAnalysis from "./components/features/FunderAI/StartupAnalysis";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const AuthCallback = () => {
  const { search } = useLocation();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const params = new URLSearchParams(search);
      const token = params.get("token");
      const type = params.get("type");

      if (type === "email_confirmation" && token) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email_confirmation",
          });
          if (error) throw error;
          window.location.href = "/auth";
        } catch (error) {
          console.error("Error confirming email:", error.message);
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
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/brand-assistant"
          element={<ProtectedRoute><BrandAssistant /></ProtectedRoute>}
        />
        <Route
          path="/resume-assistant/*"
          element={<ProtectedRoute><ResumeAssistant /></ProtectedRoute>}
        />
        <Route
          path="/fund-finder"
          element={<ProtectedRoute><StartupListings /></ProtectedRoute>}
        />
        <Route
          path="/fund-finder/:id"
          element={<ProtectedRoute><StartupAnalysis /></ProtectedRoute>}
        />
        <Route
          path="/freelancer-hub"
          element={<ProtectedRoute><ProjectListings /></ProtectedRoute>}
        />
        <Route
          path="/job-assistant"
          element={<ProtectedRoute><JobListings /></ProtectedRoute>}
        />
        <Route
          path="/job-assistant/:id"
          element={<ProtectedRoute><JobDescription /></ProtectedRoute>}
        />
        <Route
          path="/mock-interview"
          element={<ProtectedRoute><MockInterviewPage /></ProtectedRoute>}
        />
        <Route
          path="/connections"
          element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;