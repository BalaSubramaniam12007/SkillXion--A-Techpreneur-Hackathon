import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase'; // Adjust path based on your project structure
import Header from './Header';
import { 
  BookmarkIcon, 
  BriefcaseIcon, 
  NewspaperIcon, 
  CalendarIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  LightningBoltIcon, 
  ChartBarIcon, 
  BadgeCheckIcon, 
  StarIcon, 
  FireIcon, 
  LightBulbIcon, 
  CheckCircleIcon,
} from '@heroicons/react/outline';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('funding');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Authentication error:', userError.message);
        setLoading(false);
        return;
      }
      if (!userData.user) {
        console.error('No authenticated user found');
        setLoading(false);
        return;
      }

      const userId = userData.user.id;
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        setLoading(false);
        return;
      }

      const processedProfile = {
        id: profileData.id,
        name: profileData.name || "Anonymous",
        bio: profileData.bio || "No bio provided",
        location: profileData.location || "Location not specified",
        profileStrength: profileData.profile_strength || 75,
        avatar: profileData.avatar_url || null,
        type: profileData.type || "student",
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        experience: Array.isArray(profileData.experience) ? profileData.experience : [],
        education: Array.isArray(profileData.education) ? profileData.education : [],
        certifications: Array.isArray(profileData.certifications) ? profileData.certifications : [],
        interests: Array.isArray(profileData.interests) ? profileData.interests : []
      };
      
      setProfile(processedProfile);
      
      if (profileData.avatar_url) {
        const { data: avatarData, error: avatarError } = await supabase.storage
          .from('avatars')
          .getPublicUrl(profileData.avatar_url);
        if (!avatarError && avatarData) {
          setAvatarUrl(avatarData.publicUrl);
        } else {
          setAvatarUrl('https://via.placeholder.com/100');
        }
      } else {
        setAvatarUrl('https://via.placeholder.com/100');
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error in fetchUserProfile:", error.message);
      setLoading(false);
      setAvatarUrl('https://via.placeholder.com/100');
    }
  };

  const opportunitiesData = {
    funding: [
      { id: 1, title: 'Tamil Nadu Innovation Grant', description: 'Government grants for tech startups in Tamil Nadu', deadline: 'March 15, 2025', relevanceScore: 92, type: 'Grant' },
      { id: 2, title: 'AI Innovation Fund 2025', description: 'Early-stage funding for ML-based startups', deadline: 'April 5, 2025', relevanceScore: 88, type: 'Venture Capital' },
      { id: 3, title: 'Technology Incubator Program', description: 'Six-month incubation with seed funding of ₹5L', deadline: 'March 30, 2025', relevanceScore: 75, type: 'Incubator' },
    ],
    career: [
      { id: 1, title: 'Junior ML Engineer', company: 'TechSolutions India', location: 'Chennai (Hybrid)', description: 'Build and deploy ML models for financial services', relevanceScore: 91, postDate: '2 days ago', type: 'Full-time' },
      { id: 2, title: 'AI Research Intern', company: 'Innovation Lab', location: 'Remote', description: 'Research and implement cutting-edge ML algorithms', relevanceScore: 87, postDate: '1 week ago', type: 'Internship' },
      { id: 3, title: 'Data Scientist', company: 'GlobalTech', location: 'Bangalore', description: 'Analyze complex datasets and build predictive models', relevanceScore: 83, postDate: '3 days ago', type: 'Full-time' },
    ],
    business: [
      { id: 1, title: 'AI-Powered EdTech Solution', description: 'Personalized learning platform using ML algorithms', marketPotential: 'High', relevanceScore: 95, skillMatch: '94% match with your skills', difficulty: 'Medium' },
      { id: 2, title: 'Healthcare Diagnostic Tool', description: 'ML-based early disease prediction system', marketPotential: 'Very High', relevanceScore: 84, skillMatch: '82% match with your skills', difficulty: 'High' },
      { id: 3, title: 'Agricultural Yield Predictor', description: 'Help local farmers optimize crop production', marketPotential: 'Medium', relevanceScore: 79, skillMatch: '88% match with your skills', difficulty: 'Low' },
    ],
  };

  const savedItems = [
    { title: 'Project Proposal', type: 'document' },
    { title: 'Job Posting', type: 'job' },
    { title:
 'Article: AI Trends', type: 'article' }
  ];

  const upcomingEvents = [
    { title: 'ML Workshop: Practical Applications', date: 'Mar 12', time: '10:00 AM - 12:00 PM', location: 'Virtual' },
    { title: 'Tamil Nadu Tech Startup Meetup', date: 'Mar 18', time: '6:00 PM - 8:00 PM', location: 'Chennai' },
    { title: 'Career Fair: AI & ML Professionals', date: 'Apr 02', time: '9:00 AM - 5:00 PM', location: 'Bangalore' },
  ];

  const weekSchedule = [
    { day: 'Mon', date: 'Mar 3', tasks: [
      { time: '9:00 AM', title: 'ML Project Review', completed: true },
      { time: '2:00 PM', title: 'Funding Application', completed: false }
    ]},
    { day: 'Tue', date: 'Mar 4', tasks: [
      { time: '10:00 AM', title: 'Team Meeting', completed: false },
      { time: '3:00 PM', title: 'Code Review', completed: false }
    ]},
    { day: 'Wed', date: 'Mar 5', tasks: [
      { time: '11:00 AM', title: 'Workshop Prep', completed: false }
    ]},
  ];

  const mockTestData = {
    title: 'Machine Learning Basics Mock Test',
    date: 'Feb 25, 2025',
    score: '85%',
    feedback: 'Great understanding of core concepts, improve on advanced algorithms.'
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const renderOpportunities = () => {
    const opportunities = opportunitiesData[activeTab];
    
    if (activeTab === 'funding') {
      return opportunities.map((opportunity) => (
        <motion.div key={opportunity.id} variants={cardVariants} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-2">{opportunity.type}</span>
              <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">{opportunity.relevanceScore}% <StarIcon className="h-3 w-3 ml-1" /></span>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-red-600 flex items-center"><ClockIcon className="h-3 w-3 mr-1" />Deadline: {opportunity.deadline}</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">Apply</button>
              <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50">Save</button>
            </div>
          </div>
        </motion.div>
      ));
    }
    
    if (activeTab === 'career') {
      return opportunities.map((opportunity) => (
        <motion.div key={opportunity.id} variants={cardVariants} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">{opportunity.type}</span>
                {opportunity.relevanceScore > 90 && (
                  <span className="ml-2 inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Best Match</span>
                )}
              </div>
              <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
              <p className="text-sm font-medium text-gray-700">{opportunity.company}</p>
              <p className="text-xs text-gray-600">{opportunity.location}</p>
              <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
              {opportunity.relevanceScore > 90 && (
                <p className="text-xs text-green-600 mt-1">Matches your skills in ML and location preference!</p>
              )}
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">{opportunity.relevanceScore}% <StarIcon className="h-3 w-3 ml-1" /></span>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-gray-600">Posted: {opportunity.postDate}</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">Apply</button>
              <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50">Save</button>
            </div>
          </div>
        </motion.div>
      ));
    }
    
    if (activeTab === 'business') {
      return opportunities.map((opportunity) => (
        <motion.div key={opportunity.id} variants={cardVariants} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">{opportunity.skillMatch}</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Difficulty: {opportunity.difficulty}</span>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">{opportunity.relevanceScore}% <StarIcon className="h-3 w-3 ml-1" /></span>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-green-600 flex items-center"><ChartBarIcon className="h-3 w-3 mr-1" />Market: {opportunity.marketPotential}</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">Generate Plan</button>
              <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50">Save</button>
            </div>
          </div>
        </motion.div>
      ));
    }
    
    return null;
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header isForDashboard={true} />
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-3 space-y-5">
            <motion.div className="bg-white rounded-lg shadow overflow-hidden" variants={cardVariants} initial="hidden" animate="visible">
              <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <div className="px-4 py-4 -mt-10">
                <div className="flex flex-col items-center">
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-4 border-white object-cover bg-white" 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                  />
                  <h2 className="mt-2 text-xl font-bold text-center">{profile.name}</h2>
                  <p className="text-sm text-gray-600 text-center mt-1">{profile.bio}</p>
                  <p className="text-xs text-gray-500 text-center">{profile.location}</p>
                  <div className="w-full mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">Profile Strength</span>
                      <span className="text-xs font-medium text-blue-600">{profile.profileStrength}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${profile.profileStrength}%` }}></div>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">Complete Your Profile</button>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-lg shadow p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-900">Profile Saved</h3>
                <Link to="/saved" className="text-xs text-blue-600 hover:text-blue-800">View all</Link>
              </div>
              <ul className="space-y-2">
                {savedItems.map((item, index) => (
                  <li key={index} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                    {item.type === 'document' && <BookmarkIcon className="h-4 w-4 text-gray-500 mr-2" />}
                    {item.type === 'job' && <BriefcaseIcon className="h-4 w-4 text-gray-500 mr-2" />}
                    {item.type === 'article' && <NewspaperIcon className="h-4 w-4 text-gray-500 mr-2" />}
                    <span className="text-sm text-gray-700">{item.title}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="bg-white rounded-lg shadow p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-semibold text-gray-900">Week Schedule</h3>
                <Link to="/schedule" className="text-xs text-blue-600 hover:text-blue-800">Full Calendar</Link>
              </div>
              <div className="space-y-2">
                {weekSchedule.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="border-l-4 border-blue-500 pl-2"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{day.day}, {day.date}</span>
                      <span className="text-xs text-gray-500">{day.tasks.length} tasks</span>
                    </div>
                    {day.tasks.map((task, taskIndex) => (
                      <div 
                        key={taskIndex} 
                        className="flex items-center mb-1 p-1 rounded-lg hover:bg-gray-50"
                      >
                        <CheckCircleIcon 
                          className={`h-5 w-5 mr-2 ${task.completed ? 'text-green-500' : 'text-gray-300'}`} 
                        />
                        <div>
                          <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">{task.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
              <button className="mt-2 w-full py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                Add New Task
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <motion.div className="bg-white rounded-lg shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="border-b border-gray-200">
                <div className="px-4 py-3">
                  <h2 className="text-lg font-semibold text-gray-900">Opportunity Hub</h2>
                  <p className="text-sm text-gray-600">Personalized opportunities matching your profile</p>
                </div>
                <div className="flex border-b border-gray-200">
                  <button className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'funding' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('funding')}>
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />Funding
                  </button>
                  <button className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'career' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('career')}>
                    <BadgeCheckIcon className="h-4 w-4 mr-1" />Career
                  </button>
                  <button className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'business' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('business')}>
                    <LightBulbIcon className="h-4 w-4 mr-1" />Business
                  </button>
                </div>
              </div>
              <motion.div className="p-4 space-y-4" variants={staggerContainer} initial="hidden" animate="visible">
                {renderOpportunities()}
              </motion.div>
              <div className="border-t border-gray-200 px-4 py-3">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">View More Opportunities</button>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-lg shadow p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-900">AI Notifications</h3>
                <span className="text-xs text-blue-600 cursor-pointer">View All</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <BriefcaseIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">New Job Posted!</h4>
                    <p className="text-xs text-gray-600">"Senior ML Engineer" at AIWorks just posted - 92% match with your skills.</p>
                  </div>
                  <button className="ml-auto px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Apply Now</button>
                </div>
                <div className="flex items-center p-2 bg-green-50 border border-green-200 rounded-lg">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">Startup Funding Alert!</h4>
                    <p className="text-xs text-gray-600">"EduAI" secured $2M seed funding - seeking ML experts like you.</p>
                  </div>
                  <button className="ml-auto px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Explore</button>
                </div>
                <div className="flex items-center p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <FireIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">Trending Opportunity</h4>
                    <p className="text-xs text-gray-600">"AI Innovation Fund 2025" application opened - 3 days left!</p>
                  </div>
                  <button className="ml-auto px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600">Act Now</button>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-lg shadow p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-900">Recent Mock Test</h3>
                <span className="text-xs text-blue-600 cursor-pointer">View All Tests</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium">{mockTestData.title}</h4>
                <p className="text-xs text-gray-600 mt-1">Date: {mockTestData.date}</p>
                <p className="text-xs text-gray-600">Score: {mockTestData.score}</p>
                <p className="text-sm text-gray-700 mt-2">Feedback: {mockTestData.feedback}</p>
                <button className="mt-2 w-full py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                  Take Another Test
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3 space-y-5">
            <motion.div className="bg-white rounded-lg shadow p-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <Link to="/events" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.date} • {event.time}</p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-lg shadow p-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-900">Latest Updates</h3>
                <span className="text-xs text-blue-600 cursor-pointer">Clear All</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                  <BriefcaseIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm">New job: "AI Research Intern" - 87% match</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                  <FireIcon className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm">"EduAI" startup funded - seeking talent</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-lg shadow p-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-900">Learning Resources</h3>
                <Link to="/resources" className="text-xs text-blue-600 hover:text-blue-800">View all</Link>
              </div>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <h4 className="text-sm font-medium">Advanced ML Model Deployment</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">Course</span>
                    <span className="text-xs text-gray-600">4.8 ★ • 8h total</span>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <h4 className="text-sm font-medium">Product Management for ML Engineers</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">Free</span>
                    <span className="text-xs text-gray-600">4.9 ★ • 3h total</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;