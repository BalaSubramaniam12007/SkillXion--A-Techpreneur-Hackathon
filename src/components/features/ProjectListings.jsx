import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Clock, DollarSign, Users, MapPin, Star, 
  Briefcase, Link as LinkIcon, MessageSquare, Share2, Bookmark,
  TrendingUp, Shield, Award, Search, Filter, SortAsc, SortDesc
} from "lucide-react";
import Header from '../../pages/Header';

const ProjectListings = () => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentFreelancerIndex, setCurrentFreelancerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [savedProjects, setSavedProjects] = useState(new Set());
  const [savedFreelancers, setSavedFreelancers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'budget', 'duration', 'rating'

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform Development",
      budget: "$5,000 - $8,000",
      budgetValue: 6500, // For sorting
      duration: "3 months",
      durationDays: 90, // For sorting
      required: "React, Node.js, AWS",
      applications: 12,
      description: "Looking for an experienced developer to build a modern e-commerce platform with advanced features and seamless user experience.",
      category: "Web Development",
      postedDate: "2 days ago",
      expertise: "Expert",
      projectType: "Fixed Price",
      location: "Remote",
      clientRating: 4.8
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      budget: "$3,000 - $4,500",
      budgetValue: 3750,
      duration: "6 weeks",
      durationDays: 42,
      required: "Figma, Adobe XD",
      applications: 8,
      description: "Need a creative designer to develop an intuitive and engaging mobile app interface for our fitness tracking application.",
      category: "Design",
      postedDate: "1 day ago",
      expertise: "Intermediate",
      projectType: "Fixed Price",
      location: "New York, NY",
      clientRating: 4.6
    },
    {
      id: 3,
      title: "Data Analysis Dashboard",
      budget: "$4,000 - $6,000",
      budgetValue: 5000,
      duration: "2 months",
      durationDays: 60,
      required: "Python, React, D3.js",
      applications: 15,
      description: "Seeking a data visualization expert to create an interactive dashboard for real-time analytics and reporting.",
      category: "Data Science",
      postedDate: "3 days ago",
      expertise: "Expert",
      projectType: "Fixed Price",
      location: "Remote",
      clientRating: 4.9
    },
    {
      id: 4,
      title: "Blockchain Integration",
      budget: "$10,000 - $15,000",
      budgetValue: 12500,
      duration: "4 months",
      durationDays: 120,
      required: "Solidity, Web3.js, Ethereum",
      applications: 5,
      description: "Looking for a blockchain developer to integrate smart contracts into an existing fintech platform.",
      category: "Web Development",
      postedDate: "5 days ago",
      expertise: "Expert",
      projectType: "Hourly",
      location: "London, UK",
      clientRating: 4.7
    }
  ];

  const freelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Full Stack Developer",
      rate: "$65/hr",
      rateValue: 65, // For sorting
      availability: "Available now",
      skills: "React, Node.js, MongoDB",
      location: "San Francisco, CA",
      rating: 4.9,
      projects: 45,
      image: "/api/placeholder/64/64",
      portfolio: "sarahchen.dev",
      verified: true,
      responseTime: "< 2 hours",
      lastActive: "1 hour ago",
      successRate: "98%",
      specialties: ["Web Apps", "API Development"]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "UI/UX Designer",
      rate: "$55/hr",
      rateValue: 55,
      availability: "Available in 2 weeks",
      skills: "Figma, Sketch, Adobe XD",
      location: "New York, NY",
      rating: 4.8,
      projects: 32,
      image: "/api/placeholder/64/64",
      portfolio: "michaelrodriguez.design",
      verified: true,
      responseTime: "< 1 hour",
      lastActive: "30 mins ago",
      successRate: "95%",
      specialties: ["Mobile UI", "Prototyping"]
    },
    {
      id: 3,
      name: "Emma Watson",
      role: "Data Scientist",
      rate: "$75/hr",
      rateValue: 75,
      availability: "Available now",
      skills: "Python, R, TensorFlow",
      location: "London, UK",
      rating: 4.95,
      projects: 58,
      image: "/api/placeholder/64/64",
      portfolio: "emmawatson.io",
      verified: true,
      responseTime: "< 3 hours",
      lastActive: "2 hours ago",
      successRate: "97%",
      specialties: ["Machine Learning", "Data Visualization"]
    },
    {
      id: 4,
      name: "James Okoye",
      role: "Blockchain Developer",
      rate: "$85/hr",
      rateValue: 85,
      availability: "Available next month",
      skills: "Solidity, Web3.js, Rust",
      location: "Lagos, Nigeria",
      rating: 4.85,
      projects: 25,
      image: "/api/placeholder/64/64",
      portfolio: "jamesokoye.tech",
      verified: false,
      responseTime: "< 4 hours",
      lastActive: "Yesterday",
      successRate: "93%",
      specialties: ["Smart Contracts", "DApps"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'design', name: 'Design' },
    { id: 'data', name: 'Data Science' }
  ];

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = projects;
    if (activeTab !== 'all') {
      result = result.filter(p => p.category === categories.find(c => c.id === activeTab).name);
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.required.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortOrder === 'budget') {
      result.sort((a, b) => b.budgetValue - a.budgetValue);
    } else if (sortOrder === 'duration') {
      result.sort((a, b) => a.durationDays - b.durationDays);
    }
    return result;
  }, [activeTab, searchQuery, sortOrder]);

  // Filter and sort freelancers
  const filteredFreelancers = useMemo(() => {
    let result = freelancers;
    if (searchQuery) {
      result = result.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.skills.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortOrder === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'rate') {
      result.sort((a, b) => a.rateValue - b.rateValue);
    }
    return result;
  }, [searchQuery, sortOrder]);

  const handleSaveProject = (projectId) => {
    setSavedProjects(prev => {
      const newSet = new Set(prev);
      newSet.has(projectId) ? newSet.delete(projectId) : newSet.add(projectId);
      return newSet;
    });
  };

  const handleSaveFreelancer = (freelancerId) => {
    setSavedFreelancers(prev => {
      const newSet = new Set(prev);
      newSet.has(freelancerId) ? newSet.delete(freelancerId) : newSet.add(freelancerId);
      return newSet;
    });
  };

  const nextProject = () => setCurrentProjectIndex((prev) => (prev + 1) % filteredProjects.length);
  const prevProject = () => setCurrentProjectIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  const nextFreelancer = () => setCurrentFreelancerIndex((prev) => (prev + 1) % filteredFreelancers.length);
  const prevFreelancer = () => setCurrentFreelancerIndex((prev) => (prev - 1 + filteredFreelancers.length) % filteredFreelancers.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header isForDashboard={true} />
      
      <main className="w-full max-w-7xl mx-auto p-6 pt-24 space-y-12">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full sm:w-auto">
            <Input
              placeholder="Search projects or freelancers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full shadow-sm"
              prefix={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortOrder === 'default' ? "default" : "outline"}
              onClick={() => setSortOrder('default')}
              className="shadow-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Default
            </Button>
            <Button
              variant={sortOrder === 'budget' || sortOrder === 'rate' ? "default" : "outline"}
              onClick={() => setSortOrder(activeTab === 'all' ? 'budget' : 'rate')}
              className="shadow-sm"
            >
              {sortOrder === 'budget' || sortOrder === 'rate' ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
              {activeTab === 'all' ? 'Budget' : 'Rate'}
            </Button>
            {activeTab === 'all' ? (
              <Button
                variant={sortOrder === 'duration' ? "default" : "outline"}
                onClick={() => setSortOrder('duration')}
                className="shadow-sm"
              >
                {sortOrder === 'duration' ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
                Duration
              </Button>
            ) : (
              <Button
                variant={sortOrder === 'rating' ? "default" : "outline"}
                onClick={() => setSortOrder('rating')}
                className="shadow-sm"
              >
                {sortOrder === 'rating' ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
                Rating
              </Button>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                Featured Projects
                <Badge className="bg-blue-100 text-blue-600">{filteredProjects.length} Active</Badge>
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">
                  {currentProjectIndex + 1} / {filteredProjects.length}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevProject} className="p-2 shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" onClick={nextProject} className="p-2 shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? "default" : "outline"}
                  className={`rounded-full text-sm shadow-sm ${
                    activeTab === category.id 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              key={currentProjectIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => (
                  <Card 
                    key={project.id}
                    className={`transform transition-all duration-300 hover:shadow-xl border border-gray-100 bg-white ${
                      idx === currentProjectIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-50'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Badge className="bg-blue-50 text-blue-600">{project.category}</Badge>
                            <Badge className="bg-purple-50 text-purple-600">{project.expertise}</Badge>
                            <Badge className="bg-green-50 text-green-600">{project.projectType}</Badge>
                          </div>
                          <h3 className="font-bold text-xl text-gray-800">{project.title}</h3>
                          <p className="text-gray-500 text-sm">Posted {project.postedDate}</p>
                        </div>
                        <Button 
                          variant="ghost"
                          onClick={() => handleSaveProject(project.id)}
                          className={`p-2 ${savedProjects.has(project.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <Bookmark className={`w-5 h-5 ${savedProjects.has(project.id) ? 'fill-blue-600' : ''}`} />
                        </Button>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{project.description}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-medium">Budget</span>
                          </div>
                          <p className="font-semibold text-sm">{project.budget}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">Duration</span>
                          </div>
                          <p className="font-semibold text-sm">{project.duration}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Users className="w-4 h-4" />
                            <span className="text-xs font-medium">Proposals</span>
                          </div>
                          <p className="font-semibold text-sm">{project.applications}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {project.required.split(', ').map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-gray-600">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>Client Rating: {project.clientRating}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                          Apply Now
                        </Button>
                        <Button variant="outline" className="px-3 shadow-sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  No projects match your criteria.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Freelancers Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              Top Freelancers
              <Badge className="bg-green-100 text-green-600">{filteredFreelancers.length} Available</Badge>
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">
                {currentFreelancerIndex + 1} / {filteredFreelancers.length}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevFreelancer} className="p-2 shadow-sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" onClick={nextFreelancer} className="p-2 shadow-sm">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              key={currentFreelancerIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFreelancers.length > 0 ? (
                filteredFreelancers.map((freelancer, idx) => (
                  <Card 
                    key={freelancer.id}
                    className={`transform transition-all duration-300 hover:shadow-xl border border-gray-100 bg-white ${
                      Math.abs(idx - currentFreelancerIndex) <= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-50'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={freelancer.image}
                            alt={freelancer.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                          />
                          {freelancer.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                              <Shield className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">{freelancer.name}</h3>
                              <p className="text-sm text-gray-500">{freelancer.role}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-600">{freelancer.rating}</span>
                                <span className="text-sm text-gray-400">({freelancer.projects} projects)</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost"
                              onClick={() => handleSaveFreelancer(freelancer.id)}
                              className={`p-2 ${savedFreelancers.has(freelancer.id) ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                              <Bookmark className={`w-5 h-5 ${savedFreelancers.has(freelancer.id) ? 'fill-green-600' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 font-semibold">{freelancer.rate}</span>
                          <Badge className="bg-green-50 text-green-600">{freelancer.availability}</Badge>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {freelancer.skills.split(', ').map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-gray-600">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Specialties</p>
                          <div className="flex flex-wrap gap-2">
                            {freelancer.specialties.map((specialty, index) => (
                              <Badge key={index} className="bg-purple-50 text-purple-600">{specialty}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{freelancer.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{freelancer.responseTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>{freelancer.successRate} Success</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            <a href={`https://${freelancer.portfolio}`} className="text-blue-600 hover:underline truncate">
                              {freelancer.portfolio}
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <Button variant="outline" className="flex-1 shadow-sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No freelancers match your criteria.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ProjectListings;