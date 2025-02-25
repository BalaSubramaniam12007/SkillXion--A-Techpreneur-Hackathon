import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Clock, DollarSign, Users, MapPin, Star, 
  Briefcase, Link as LinkIcon, MessageSquare, Share2, Bookmark,
  TrendingUp, Shield, Search, Filter, SortAsc, SortDesc
} from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import Header from '../../../pages/Header';

const ProjectListings = () => {
  const [projectPage, setProjectPage] = useState(1);
  const [freelancerPage, setFreelancerPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [savedProjects, setSavedProjects] = useState(new Set());
  const [savedFreelancers, setSavedFreelancers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [isEnquiring, setIsEnquiring] = useState(null);
  const [isBuying, setIsBuying] = useState(null);
  const [isContacting, setIsContacting] = useState(null); // Add this line
  const PROJECTS_PER_PAGE = 4;
  const FREELANCERS_PER_PAGE = 9;

  const projects = [
    {
      id: 1,
      title: "Smart Home Automation System",
      status: "Completed",
      completionDate: "Jan 2025",
      creator: "John Doe",
      institution: "MIT",
      views: 120,
      description: "A fully functional smart home system built with IoT and React for college final project.",
      category: "Web Development",
      postedDate: "2 weeks ago",
      type: "Academic",
      location: "Cambridge, MA",
      rating: 4.8,
      forSale: true,
      price: "$500",
      link: "smarthome.johndoe.com"
    },
    {
      id: 2,
      title: "Fitness Tracker App Prototype",
      status: "In Progress",
      completionDate: "Mar 2025",
      creator: "Alice Smith",
      institution: "Stanford",
      views: 85,
      description: "A mobile app prototype designed for fitness tracking, created during a design course.",
      category: "Design",
      postedDate: "1 week ago",
      type: "Academic",
      location: "Palo Alto, CA",
      rating: 4.6,
      forSale: false,
      price: null,
      link: "fitness.alicesmith.design"
    },
    {
      id: 3,
      title: "AI-Powered Study Planner",
      status: "Completed",
      completionDate: "Dec 2024",
      creator: "Emma Brown",
      institution: "Oxford",
      views: 150,
      description: "An AI-driven planner for students, developed as a personal project.",
      category: "Data Science",
      postedDate: "3 weeks ago",
      type: "Personal",
      location: "Oxford, UK",
      rating: 4.9,
      forSale: true,
      price: "$300",
      link: "aiplanner.emmabrown.io"
    },
    {
      id: 4,
      title: "Blockchain Voting System",
      status: "In Progress",
      completionDate: "Apr 2025",
      creator: "Liam Johnson",
      institution: "ETH Zurich",
      views: 95,
      description: "A secure voting system using blockchain, part of a research project.",
      category: "Web Development",
      postedDate: "5 days ago",
      type: "Academic",
      location: "Zurich, Switzerland",
      rating: 4.7,
      forSale: false,
      price: null,
      link: "voting.liamjohnson.tech"
    },
    {
      id: 5,
      title: "Eco-Friendly Packaging Design",
      status: "Completed",
      completionDate: "Nov 2024",
      creator: "Sophia Lee",
      institution: "RISD",
      views: 110,
      description: "Sustainable packaging solution designed for a school competition.",
      category: "Design",
      postedDate: "10 days ago",
      type: "Academic",
      location: "Providence, RI",
      rating: 4.85,
      forSale: true,
      price: "$200",
      link: "eco.sophialee.design"
    },
    {
      id: 6,
      title: "Personal Finance Dashboard",
      status: "Completed",
      completionDate: "Oct 2024",
      creator: "Noah Kim",
      institution: "Freelancer",
      views: 130,
      description: "A dashboard to track personal finances, built as a side project.",
      category: "Web Development",
      postedDate: "1 month ago",
      type: "Personal",
      location: "Seoul, South Korea",
      rating: 4.9,
      forSale: true,
      price: "$400",
      link: "finance.noahkim.dev"
    },
    {
      id: 7,
      title: "Machine Learning Quiz Generator",
      status: "In Progress",
      completionDate: "Feb 2025",
      creator: "Olivia Chen",
      institution: "Caltech",
      views: 75,
      description: "An ML-powered tool to generate quizzes, part of a thesis project.",
      category: "Data Science",
      postedDate: "3 days ago",
      type: "Academic",
      location: "Pasadena, CA",
      rating: 4.8,
      forSale: false,
      price: null,
      link: "quiz.oliviachen.ai"
    }
  ];

  const freelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Full Stack Developer",
      rate: "$65/hr",
      rateValue: 65,
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
    },
    {
      id: 5,
      name: "Aisha Patel",
      role: "AI Specialist",
      rate: "$80/hr",
      rateValue: 80,
      availability: "Available now",
      skills: "Python, PyTorch, NLP",
      location: "Mumbai, India",
      rating: 4.9,
      projects: 38,
      image: "/api/placeholder/64/64",
      portfolio: "aishapatel.ai",
      verified: true,
      responseTime: "< 1 hour",
      lastActive: "45 mins ago",
      successRate: "96%",
      specialties: ["AI Chatbots", "Deep Learning"]
    },
    {
      id: 6,
      name: "Lucas Silva",
      role: "Game Developer",
      rate: "$60/hr",
      rateValue: 60,
      availability: "Available in 1 week",
      skills: "Unity, C#, Unreal Engine",
      location: "São Paulo, Brazil",
      rating: 4.75,
      projects: 29,
      image: "/api/placeholder/64/64",
      portfolio: "lucassilva.games",
      verified: true,
      responseTime: "< 2 hours",
      lastActive: "3 hours ago",
      successRate: "94%",
      specialties: ["Game Design", "3D Animation"]
    },
    {
      id: 7,
      name: "Sophie Müller",
      role: "Backend Developer",
      rate: "$70/hr",
      rateValue: 70,
      availability: "Available now",
      skills: "Java, Spring Boot, PostgreSQL",
      location: "Berlin, Germany",
      rating: 4.88,
      projects: 42,
      image: "/api/placeholder/64/64",
      portfolio: "sophiemueller.dev",
      verified: true,
      responseTime: "< 1 hour",
      lastActive: "20 mins ago",
      successRate: "97%",
      specialties: ["Microservices", "API Development"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'design', name: 'Design' },
    { id: 'data', name: 'Data Science' }
  ];

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (activeTab !== 'all') {
      result = result.filter(p => p.category === categories.find(c => c.id === activeTab).name);
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.creator.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortOrder === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'views') {
      result.sort((a, b) => b.views - a.views);
    }
    return result;
  }, [activeTab, searchQuery, sortOrder]);

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

  const totalProjectPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const totalFreelancerPages = Math.ceil(filteredFreelancers.length / FREELANCERS_PER_PAGE);

  const paginatedProjects = filteredProjects.slice(
    (projectPage - 1) * PROJECTS_PER_PAGE,
    projectPage * PROJECTS_PER_PAGE
  );

  const paginatedFreelancers = filteredFreelancers.slice(
    (freelancerPage - 1) * FREELANCERS_PER_PAGE,
    freelancerPage * FREELANCERS_PER_PAGE
  );

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

  const handleEnquire = async (projectId) => {
    setIsEnquiring(projectId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEnquiring(null);
    // Add enquiry logic here (e.g., send email)
  };

  const handleBuy = async (projectId) => {
    setIsBuying(projectId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsBuying(null);
    // Add purchase logic here (e.g., payment gateway)
  };
  
  const handleContact = async (freelancerId) => {
    setIsContacting(freelancerId); // Now this will work
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsContacting(null);
  };


  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    pressed: { scale: 0.95 }
  };

  const renderPagination = (currentPage, totalPages, setPage) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
          <Button
            variant="outline"
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </motion.div>
        {pageNumbers.map(number => (
          <motion.div key={number} variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
            <Button
              variant={currentPage === number ? "default" : "outline"}
              onClick={() => setPage(number)}
              className={`w-10 h-10 ${currentPage === number ? 'bg-blue-600 text-white' : ''}`}
            >
              {number}
            </Button>
          </motion.div>
        ))}
        <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
          <Button
            variant="outline"
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header isForDashboard={true} />
        
        <main className="w-full max-w-7xl mx-auto p-6 pt-24 space-y-12">
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full sm:w-auto">
              <Input
                placeholder="Search projects or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                <Button
                  variant={sortOrder === 'default' ? "default" : "outline"}
                  onClick={() => setSortOrder('default')}
                  className="shadow-sm transition-colors duration-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Default
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                <Button
                  variant={sortOrder === 'rating' ? "default" : "outline"}
                  onClick={() => setSortOrder('rating')}
                  className="shadow-sm transition-colors duration-200"
                >
                  {sortOrder === 'rating' ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
                  Rating
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                <Button
                  variant={sortOrder === 'views' ? "default" : "outline"}
                  onClick={() => setSortOrder('views')}
                  className="shadow-sm transition-colors duration-200"
                >
                  {sortOrder === 'views' ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
                  Views
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  Project Listings
                  <Badge className="bg-blue-100 text-blue-600">{filteredProjects.length} Projects</Badge>
                </h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <motion.div key={category.id} variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                    <Button
                      variant={activeTab === category.id ? "default" : "outline"}
                      className={`rounded-full text-sm shadow-sm transition-all duration-200 ${
                        activeTab === category.id 
                          ? "bg-blue-600 text-white hover:bg-blue-700" 
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab(category.id)}
                    >
                      {category.name}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              <motion.div
                key={projectPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {paginatedProjects.length > 0 ? (
                  paginatedProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <Card 
                        className="transition-all duration-300 border border-gray-100 bg-white shadow-md hover:shadow-lg"
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Badge className="bg-blue-50 text-blue-600">{project.category}</Badge>
                                <Badge className="bg-purple-50 text-purple-600">{project.type}</Badge>
                                <Badge className="bg-green-50 text-green-600">{project.status}</Badge>
                              </div>
                              <h3 className="font-bold text-xl text-gray-800">{project.title}</h3>
                              <p className="text-gray-500 text-sm">by {project.creator} - {project.institution}</p>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost"
                                  onClick={() => handleSaveProject(project.id)}
                                  className={`p-2 ${savedProjects.has(project.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                  <Bookmark className={`w-5 h-5 ${savedProjects.has(project.id) ? 'fill-blue-600' : ''}`} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {savedProjects.has(project.id) ? 'Remove from saved' : 'Save project'}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{project.description}</p>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-medium">Completion</span>
                              </div>
                              <p className="font-semibold text-sm">{project.completionDate}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Users className="w-4 h-4" />
                                <span className="text-xs font-medium">Views</span>
                              </div>
                              <p className="font-semibold text-sm">{project.views}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-xs font-medium">Price</span>
                              </div>
                              <p className="font-semibold text-sm">{project.forSale ? project.price : 'N/A'}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>Rating: {project.rating}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <LinkIcon className="w-4 h-4" />
                              <a href={`https://${project.link}`} className="text-blue-600 hover:underline truncate">
                                {project.link}
                              </a>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-6">
                            <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                              <Button 
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
                                onClick={() => handleEnquire(project.id)}
                                disabled={isEnquiring === project.id}
                              >
                                {isEnquiring === project.id ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Enquiring...
                                  </span>
                                ) : (
                                  <>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Enquire
                                  </>
                                )}
                              </Button>
                            </motion.div>
                            {project.forSale && (
                              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                                <Button 
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200"
                                  onClick={() => handleBuy(project.id)}
                                  disabled={isBuying === project.id}
                                >
                                  {isBuying === project.id ? (
                                    <span className="flex items-center">
                                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                      </svg>
                                      Processing...
                                    </span>
                                  ) : (
                                    <>
                                      <DollarSign className="w-4 h-4 mr-2" />
                                      Buy
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            )}
                            <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" className="px-3 shadow-sm transition-all duration-200">
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Share project</TooltipContent>
                              </Tooltip>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No projects match your criteria.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {renderPagination(projectPage, totalProjectPages, setProjectPage)}
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              Top Freelancers
              <Badge className="bg-green-100 text-green-600">{filteredFreelancers.length} Available</Badge>
            </h2>

            <AnimatePresence>
              <motion.div
                key={freelancerPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedFreelancers.length > 0 ? (
                  paginatedFreelancers.map((freelancer) => (
                    <motion.div
                      key={freelancer.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <Card 
                        className="transition-all duration-300 border border-gray-100 bg-white shadow-md hover:shadow-lg"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="relative">
                              <img
                                src={freelancer.image}
                                alt={freelancer.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm transition-transform duration-200 hover:scale-105"
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
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost"
                                      onClick={() => handleSaveFreelancer(freelancer.id)}
                                      className={`p-2 ${savedFreelancers.has(freelancer.id) ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                      <Bookmark className={`w-5 h-5 ${savedFreelancers.has(freelancer.id) ? 'fill-green-600' : ''}`} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {savedFreelancers.has(freelancer.id) ? 'Remove from saved' : 'Save freelancer'}
                                  </TooltipContent>
                                </Tooltip>
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
                                  <Badge key={index} variant="outline" className="text-gray-600 hover:bg-gray-100 transition-colors">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-2">Specialties</p>
                              <div className="flex flex-wrap gap-2">
                                {freelancer.specialties.map((specialty, index) => (
                                  <Badge key={index} className="bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">{specialty}</Badge>
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
                              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                                <Button 
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
                                  onClick={() => handleContact(freelancer.id)}
                                  disabled={isContacting === freelancer.id}
                                >
                                  {isContacting === freelancer.id ? (
                                    <span className="flex items-center">
                                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                      </svg>
                                      Contacting...
                                    </span>
                                  ) : (
                                    <>
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Contact
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                                <Button variant="outline" className="flex-1 shadow-sm transition-all duration-200 hover:bg-gray-100">
                                  View Profile
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    No freelancers match your criteria.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {renderPagination(freelancerPage, totalFreelancerPages, setFreelancerPage)}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default ProjectListings;