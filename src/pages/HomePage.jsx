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
    { title: "AI Business Assistant", description: "Generate ideas, names, and logos with super speed.", icon: "🦸‍♂️" },
    { title: "Job & Resume Tools", description: "Power up your resume and ace interviews.", icon: "⚡" },
    { title: "Fund Finder", description: "Unleash funding opportunities for your mission.", icon: "💸" },
    { title: "Freelancer Hub", description: "Assemble your team of super talents.", icon: "🦸‍♀️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 text-gray-800 overflow-hidden">
      {/* Sun Animation */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-64 h-64 bg-blue-300 rounded-full animate-pulse opacity-50 blur-3xl z-0"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-48 h-48 bg-blue-200 rounded-full animate-spin-slow opacity-70 z-0"></div>

      {/* Header */}
      <Header isForDashboard={false} />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-800">
              Become a <span>Superhero</span> with SkillXion
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md">
              Harness AI-powered tools to conquer business challenges, soar through job markets, and build your empire.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? 'To the Dashboard!' : 'Gain Your Powers'}
              </Button>
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
                onClick={handleLearnMore}
              >
                Discover Your Arsenal
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 border-4 border-blue-500">
              <div className="aspect-video bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden">
                <span className="text-blue-600 text-2xl font-bold animate-bounce">Supercharge Your Future</span>
              </div>
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 drop-shadow-lg">
            Your Superhero Toolkit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-blue-500"
              >
                <div className="text-4xl mb-4 animate-spin-slow">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-500 to-blue-800 rounded-2xl text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-900 opacity-10 animate-pulse"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
            Ready to Save the Day?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto relative z-10">
            Join the league of extraordinary entrepreneurs and freelancers powering the future.
          </p>
          <Button 
            className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-3 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all relative z-10"
            onClick={handleGetStarted}
          >
            Activate Now
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-700 relative z-10">
        <p>© 2025 SkillXion. Unleash Your Inner Hero.</p>
      </footer>
    </div>
  );
};

export default Homepage;