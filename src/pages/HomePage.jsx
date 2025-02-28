import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';

const Homepage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/auth');
  };

  const handleLearnMore = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { 
      title: "AI Business Brand Assistant", 
      description: "Personalized business ideas, unique names, AI-generated logos, and structured plans.", 
      icon: "🧠" 
    },
    { 
      title: "AI Job & Resume Suite", 
      description: "ATS-friendly resumes, job matching, and mock interviews with feedback.", 
      icon: "💼" 
    },
    { 
      title: "Fund Finder for Startups", 
      description: "Grants, investors, and funding opportunities aggregated for growth.", 
      icon: "💰" 
    },
    { 
      title: "Freelancer & Project Hub", 
      description: "List projects, connect with freelancers, and boost collaboration.", 
      icon: "🤝" 
    },
  ];

  const impacts = [
    { title: "Empowering Entrepreneurs", description: "Turn ideas into thriving businesses with AI tools.", icon: "🚀" },
    { title: "Enhancing Career Readiness", description: "Land your dream job with optimized tools.", icon: "📈" },
    { title: "Strengthening the Gig Economy", description: "Seamless collaboration for freelancers and businesses.", icon: "🌍" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 overflow-hidden">
      {/* Header */}
      <Header isForDashboard={false} />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-blue-900 leading-tight">
              NexusFlow: Your AI-Powered Career & Startup Engine
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-2xl">
              Bridge the gap between talent and opportunity with real-time AI insights, career support, and business growth tools.
            </p>
            <div className="flex justify-center lg:justify-start gap-6">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? 'Dashboard' : 'Get Started Free'}
              </Button>
              <Button 
                variant="outline" 
                className="text-blue-700 border-blue-700 hover:bg-blue-100 px-10 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleLearnMore}
              >
                Explore Features
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="bg-blue-100 rounded-3xl p-8 shadow-2xl border border-blue-200 transform rotate-2">
              <div className="aspect-video bg-gradient-to-br from-blue-200 to-blue-400 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-blue-900 text-2xl md:text-3xl font-bold text-center px-4">
                  Empowering Careers & Startups Globally
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-500 h-24 w-24 rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Unlock Your Potential with AI-Driven Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border-t-4 border-blue-600 transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-blue-50 rounded-3xl shadow-inner">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900">
            Driving Real Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            {impacts.map((impact, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md border border-blue-100 flex flex-col items-center text-center"
              >
                <div className="text-4xl mb-4 text-blue-600">{impact.icon}</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{impact.title}</h3>
                <p className="text-gray-600 text-sm">{impact.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Built with Cutting-Edge Technology
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["React.js", "Node.js", "Gemini API", "Supabase"].map((tech, index) => (
              <div 
                key={index} 
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
              >
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Shape Your Future?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-100">
            Join a community of innovators, job seekers, and startups thriving with NexusFlow’s AI-powered platform.
          </p>
          <Button 
            className="bg-white text-blue-700 hover:bg-blue-50 px-12 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
            onClick={handleGetStarted}
          >
            Start Your Journey
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 text-center text-gray-600 border-t border-gray-200">
        <p>© 2025 NexusFlow. All rights reserved. Empowering careers, startups, and economic growth.</p>
      </footer>
    </div>
  );
};

export default Homepage;