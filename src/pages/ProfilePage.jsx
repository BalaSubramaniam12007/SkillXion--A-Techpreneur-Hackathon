// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditProfileForm from './EditProfileForm';
import { supabase } from '../lib/supabase';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await getProfile(user.id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      
      // Handle avatar upload if there's a new one
      let avatarUrl = profile.avatar;
      if (updatedData.avatar && updatedData.avatar.startsWith('data:image')) {
        const avatarFile = await fetch(updatedData.avatar).then(res => res.blob());
        const fileExt = avatarFile.type.split('/')[1];
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedData.name,
          type: updatedData.type,
          bio: updatedData.bio,
          location: updatedData.location,
          avatar: avatarUrl,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Refresh profile data
      await getProfile(user.id);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isForDashboard={true} />
      
      <main className="container mx-auto py-8 px-4">
        {isEditing ? (
          <EditProfileForm 
            user={profile}
            onSubmit={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
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
            
            <div className="px-8 py-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="h-48 w-48 rounded-full flex items-center justify-center bg-blue-100 border-4 border-gray-100 overflow-hidden">
                    {profile?.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt="Profile" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <UserIcon className="h-32 w-32 text-blue-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
                    <UserBadge type={profile?.type} />
                  </div>
                  
                  <span className="text-gray-500 flex items-center text-sm mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    {profile?.location}
                  </span>
                  
                  <div className="text-gray-600 mb-6">
                    <h2 className="text-gray-900 font-medium mb-2">About Me</h2>
                    <p>{profile?.bio}</p>
                  </div>
                </div>
              </div>
              
              {profile?.skills && (
                <div className="py-4 border-t border-gray-100">
                  <h2 className="text-gray-900 font-medium mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile?.experience && (
                <div className="py-4 border-t border-gray-100">
                  <h2 className="text-gray-900 font-medium mb-3">Experience</h2>
                  <div className="space-y-4">
                    {profile.experience.map((exp, index) => (
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
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;