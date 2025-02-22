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
    // Implement  logic here
    // For example, scroll to features section or navigate to about page
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header isForDashboard={false} />
      
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Elevate Your Career with <span className="text-blue-600">SkillXion</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Connect with top brands, find the perfect job, secure funding, and collaborate 
              with talented freelancers - all in one platform.
            </p>
            <div className="flex gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-50 px-8 py-6"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 bg-white rounded-lg overflow-hidden shadow-md">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
              <span className="text-blue-600 text-xl">Platform Preview</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;