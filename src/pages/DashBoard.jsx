import React from 'react';
import Header from './Header';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header isForDashboard={true} />
      
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          {['Applications', 'Connections', 'Projects', 'Opportunities'].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-gray-500 text-sm mb-2">{stat}</h3>
              <p className="text-3xl font-bold text-gray-900">{Math.floor(Math.random() * 100)}</p>
              <div className="mt-4 text-xs text-blue-600">
                +{Math.floor(Math.random() * 20)}% from last week
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activities</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium text-blue-700">Activity Title</h4>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Brief description of the activity that happened on the platform.</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Recommended For You</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded bg-gray-200"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Recommendation Title</h4>
                      <p className="text-xs text-gray-500">Category</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Brief description of why this is recommended for you.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;