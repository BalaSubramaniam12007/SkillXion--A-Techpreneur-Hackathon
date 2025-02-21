import React, { useState } from 'react';
import Header from './Header';
import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import the EditProfileForm component
import EditProfileForm from './EditProfileForm';

const ProfilePage = () => {
  // State for user data
  const [user, setUser] = useState({
    name: "Alex Johnson",
    type: "entrepreneur",
    bio: "Passionate designer with 5+ years of experience creating intuitive digital experiences. Specialized in user research and accessibility-focused design.",
    location: "San Francisco, CA",
    avatar: null, // Add this to handle profile picture uploads
    skills: ["UI Design", "User Research", "Figma", "Adobe XD", "Prototyping", "Wireframing"],
    experience: [
      {
        title: "Senior UX Designer",
        company: "TechCorp Inc.",
        duration: "2020 - Present"
      },
      {
        title: "UI Designer",
        company: "Creative Solutions",
        duration: "2018 - 2020"
      }
    ]
  });

  // State to control the editing mode
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle saving profile changes
  const handleProfileUpdate = (updatedData) => {
    setUser({
      ...user,
      ...updatedData
    });
    setIsEditing(false);
  };
  
  // Badge component based on user type
  const UserBadge = ({ type }) => {
    const badgeStyles = type === "entrepreneur" 
      ? "bg-green-100 text-green-800" 
      : "bg-blue-100 text-blue-800";
    
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${badgeStyles}`}>
        {type === "entrepreneur" ? "Entrepreneur" : "Student"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isForDashboard={true} />
      
      <main className="container mx-auto py-8 px-4">
        {isEditing ? (
          // Show edit form when in editing mode
          <EditProfileForm 
            user={user}
            onSubmit={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          // Show profile view when not editing
          <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto mb-8">
            {/* LinkedIn-style Header */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
            
            {/* Profile Info Section */}
            <div className="px-8 py-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Large Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="h-48 w-48 rounded-full flex items-center justify-center bg-blue-100 border-4 border-gray-100 overflow-hidden">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <UserIcon className="h-32 w-32 text-blue-500" />
                    )}
                  </div>
                </div>
                
                {/* Name and Info */}
                <div className="flex-grow">
                  {/* Name with Badge */}
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <UserBadge type={user.type} />
                  </div>
                  
                  {/* Location */}
                  <span className="text-gray-500 flex items-center text-sm mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    {user.location}
                  </span>
                  
                  {/* Bio */}
                  <div className="text-gray-600 mb-6">
                    <h2 className="text-gray-900 font-medium mb-2">About Me</h2>
                    <p>{user.bio}</p>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="py-4 border-t border-gray-100">
                <h2 className="text-gray-900 font-medium mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Experience */}
              <div className="py-4 border-t border-gray-100">
                <h2 className="text-gray-900 font-medium mb-3">Experience</h2>
                <div className="space-y-4">
                  {user.experience.map((exp, index) => (
                    <div key={index} className="flex">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                      <div>
                        <h3 className="font-medium text-gray-900">{exp.title}</h3>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-sm">{exp.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Additional Profile Sections - Only show when not editing */}
        {!isEditing && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Activity Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b border-gray-100 pb-4">
                    <p className="text-sm text-gray-600">Posted a new project proposal</p>
                    <span className="text-xs text-gray-400">3 days ago</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Connections Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Connections</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Connection Name</h4>
                      <p className="text-xs text-gray-500">Job Title</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;