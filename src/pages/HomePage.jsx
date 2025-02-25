import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';

const Homepage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleLearnMore = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { title: "AI Business Assistant", description: "Generate ideas, names, and logos to launch your empire.", icon: "🦸‍♂️" },
    { title: "Job & Resume Tools", description: "Optimize your resume and ace interviews with AI.", icon: "⚡" },
    { title: "Fund Finder", description: "Discover funding to fuel your startup’s growth.", icon: "💸" },
    { title: "Freelancer Hub", description: "Connect with top freelancers to build your team.", icon: "🦸‍♀️" },
  ];

  const userGroups = [
    { title: "Students & Professionals", description: "Unlock potential, compete, and grow your career.", icon: "👩‍🎓" },
    { title: "Companies & Recruiters", description: "Find talent, engage, and build your brand.", icon: "🏢" },
    { title: "Colleges", description: "Bridge academia and industry for real-world opportunities.", icon: "🏫" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      {/* Header */}
      <Header isForDashboard={false} />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-blue-800">
              Unleash Your Career with SkillXion
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl">
              Explore opportunities globally to grow, showcase skills, and land your dream role with AI-powered tools.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-blue-50 rounded-2xl p-6 shadow-lg border border-blue-200">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <span className="text-blue-800 text-2xl font-bold">Supercharge Your Future</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Your Career Toolkit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border-t-4 border-blue-500 transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who’s Using Section */}
        <section className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Who’s Using SkillXion?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userGroups.map((group, index) => (
              <div 
                key={index} 
                className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col items-center text-center"
              >
                <div className="text-4xl mb-4">{group.icon}</div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{group.title}</h3>
                <p className="text-gray-600">{group.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-blue-100 rounded-2xl shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-800">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
            Join thousands of entrepreneurs, job seekers, and freelancers powering the future economy.
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full text-lg font-semibold shadow-md"
            onClick={handleGetStarted}
          >
            Start Now
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-600 border-t border-gray-200">
        <p>© 2025 SkillXion. Empowering Your Future.</p>
      </footer>
    </div>
  );
};

export default Homepage;