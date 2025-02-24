import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Link as LinkIcon,
  Github,
  Linkedin,
  Award,
  BookOpen
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';

import Header from './Header';
import EditProfileForm from './EditProfileForm';
import { supabase } from '../lib/supabase';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    projectsCompleted: 23,
    connections: 156,
    hoursWorked: 450,
    endorsements: 87
  });

  useEffect(() => {
    getUser();
    getStats();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const getStats = async () => {
    setStats({
      projectsCompleted: 23,
      connections: 156,
      hoursWorked: 450,
      endorsements: 87
    });
  };

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
      setProfile({
        ...data,
        name: data.name || "John Doe",
        type: data.type || "entrepreneur",
        bio: data.bio || "Passionate entrepreneur and developer",
        location: data.location || "San Francisco, CA",
        avatar: data.avatar,
        socialLinks: {
          github: "https://github.com/username",
          linkedin: "https://linkedin.com/in/username",
          website: "https://example.com"
        },
        experience: [
          { title: "Founder", company: "TechStartup", duration: "2022-Present" },
          { title: "Developer", company: "TechCorp", duration: "2020-2022" }
        ],
        education: [
          { degree: "MBA", school: "Stanford", year: "2020-2022" },
          { degree: "BS Computer Science", school: "MIT", year: "2016-2020" }
        ],
        skills: [
          { name: "JavaScript", proficiency: "Advanced" },
          { name: "Entrepreneurship", proficiency: "Advanced" },
          { name: "Project Management", proficiency: "Intermediate" }
        ]
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      
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
    const badgeStyles = {
      entrepreneur: "bg-emerald-100 text-emerald-800 border-emerald-200",
      student: "bg-blue-100 text-blue-800 border-blue-200",
      professional: "bg-purple-100 text-purple-800 border-purple-200"
    };
    
    return (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Badge variant="outline" className={`px-3 py-1 ${badgeStyles[type]}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      </motion.div>
    );
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2 rounded-full bg-blue-100"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-5 w-5 text-blue-600" />
            </motion.div>
            <div>
              <p className="text-xs text-gray-600">{title || "N/A"}</p>
              <motion.p 
                className="text-xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {value !== undefined ? value : 0}
              </motion.p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  const SkillItem = ({ skill, proficiency }) => (
    <motion.div 
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-2 py-4 border-b last:border-0"
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-lg">{skill}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary">{proficiency}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Based on endorsements and projects</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Progress value={proficiency === 'Advanced' ? 85 : proficiency === 'Intermediate' ? 60 : 35} className="h-2" />
    </motion.div>
  );

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-500"
        />
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to view your profile.</p>
          <Button className="mt-4">Sign In</Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header isForDashboard={true} />
      
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
            >
              <EditProfileForm 
                user={profile}
                onSubmit={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="space-y-6"
            >
              {/* Profile Header */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start gap-6">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border-4 border-white shadow-lg overflow-hidden">
                            {profile?.avatar ? (
                              <img 
                                src={profile.avatar} 
                                alt="Profile" 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-20 w-20 text-blue-500" />
                            )}
                          </div>
                        </motion.div>
                        <div className="flex-grow">
                          <motion.div 
                            className="flex items-center gap-3 mb-2"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
                            <UserBadge type={profile?.type} />
                          </motion.div>
                          <div className="space-y-2 text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {profile?.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </span>
                            <div className="flex gap-4">
                              {profile?.socialLinks && (
                                <>
                                  <a href={profile.socialLinks.github} className="flex items-center gap-1 hover:text-blue-600">
                                    <Github className="w-4 h-4" />
                                    GitHub
                                  </a>
                                  <a href={profile.socialLinks.linkedin} className="flex items-center gap-1 hover:text-blue-600">
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn
                                  </a>
                                  <a href={profile.socialLinks.website} className="flex items-center gap-1 hover:text-blue-600">
                                    <LinkIcon className="w-4 h-4" />
                                    Website
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button 
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit Profile
                        </Button>
                        <Button 
                          variant="secondary"
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard title="Projects" value={stats.projectsCompleted} icon={Briefcase} />
                  <StatCard title="Connections" value={stats.connections} icon={User} />
                  <StatCard title="Hours" value={stats.hoursWorked} icon={Calendar} />
                  <StatCard title="Endorsements" value={stats.endorsements} icon={Award} />
                </div>
              </motion.div>

              {/* Overview */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-gray-600">{profile?.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Experience */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Experience</h2>
                    <div className="space-y-6">
                      {profile?.experience?.map((exp, index) => (
                        <motion.div 
                          key={index} 
                          className="flex gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{exp.title}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">{exp.duration}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Education */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Education</h2>
                    <div className="space-y-6">
                      {profile?.education?.map((edu, index) => (
                        <motion.div 
                          key={index} 
                          className="flex gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.school}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Skills</h2>
                    <div className="space-y-2">
                      {profile?.skills?.map((skill, index) => (
                        <SkillItem key={index} skill={skill.name} proficiency={skill.proficiency} />
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Request Endorsement
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default ProfilePage;