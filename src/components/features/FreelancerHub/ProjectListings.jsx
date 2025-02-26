import React, { useState, useMemo, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';

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
  const [isContacting, setIsContacting] = useState(null);
  const [projects, setProjects] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);
  const PROJECTS_PER_PAGE = 4;
  const FREELANCERS_PER_PAGE = 9;

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'design', name: 'Design' },
    { id: 'data', name: 'Data Science' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('posted_date', { ascending: false });
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchFreelancers = async () => {
      setLoadingFreelancers(true);
      try {
        const { data, error } = await supabase
          .from('freelancers')
          .select('*')
          .order('rating', { ascending: false });
        if (error) throw error;
        setFreelancers(data || []);
      } catch (error) {
        console.error('Error fetching freelancers:', error.message);
        setFreelancers([]);
      } finally {
        setLoadingFreelancers(false);
      }
    };

    fetchProjects();
    fetchFreelancers();
  }, []);

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
  }, [projects, activeTab, searchQuery, sortOrder]);

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
      result.sort((a, b) => a.rate_value - b.rate_value);
    }
    return result;
  }, [freelancers, searchQuery, sortOrder]);

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
  };

  const handleBuy = async (projectId) => {
    setIsBuying(projectId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsBuying(null);
  };

  const handleContact = async (freelancerId) => {
    setIsContacting(freelancerId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsContacting(null);
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    pressed: { scale: 0.95 }
  };

  const SkeletonProjectCard = () => (
    <Card className="border border-gray-100 bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 w-full">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="h-16 w-full bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonFreelancerCard = () => (
    <Card className="border border-gray-100 bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-3 mt-6">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </motion.div>
        {pageNumbers.map(number => (
          <motion.div key={number} variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
            <Button
              variant={currentPage === number ? "default" : "outline"}
              onClick={() => setPage(number)}
              className={`w-10 h-10 rounded-full ${currentPage === number ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
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
            className="p-2 rounded-full hover:bg-gray-100"
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
        
        <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 pt-20 sm:pt-24 space-y-12">
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full sm:w-auto">
              <Input
                placeholder="Search projects or freelancers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 rounded-lg"
                prefix={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                <Button
                  variant={sortOrder === 'default' ? "default" : "outline"}
                  onClick={() => setSortOrder('default')}
                  className="shadow-sm rounded-lg hover:bg-gray-100"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Default
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                <Button
                  variant={sortOrder === 'rating' ? "default" : "outline"}
                  onClick={() => setSortOrder('rating')}
                  className="shadow-sm rounded-lg hover:bg-gray-100"
                >
                  {sortOrder === 'rating' ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
                  Rating
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                <Button
                  variant={sortOrder === 'views' || sortOrder === 'rate' ? "default" : "outline"}
                  onClick={() => setSortOrder(activeTab === 'all' ? 'views' : 'rate')}
                  className="shadow-sm rounded-lg hover:bg-gray-100"
                >
                  {sortOrder === 'views' || sortOrder === 'rate' ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
                  {activeTab === 'all' ? 'Views' : 'Rate'}
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  Project Listings
                  <Badge className="bg-blue-100 text-blue-600">{filteredProjects.length} Projects</Badge>
                </h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
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
              {loadingProjects ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {Array.from({ length: PROJECTS_PER_PAGE }).map((_, index) => (
                    <SkeletonProjectCard key={index} />
                  ))}
                </motion.div>
              ) : (
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
                        <Card className="transition-all duration-300 border border-gray-100 bg-white shadow-md hover:shadow-xl rounded-xl">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-2">
                                <div className="flex gap-2 flex-wrap">
                                  <Badge className="bg-blue-50 text-blue-600">{project.category}</Badge>
                                  <Badge className="bg-purple-50 text-purple-600">{project.type}</Badge>
                                  <Badge className={project.status === 'Completed' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}>
                                    {project.status}
                                  </Badge>
                                </div>
                                <h3 className="font-bold text-xl text-gray-800">{project.title}</h3>
                                <p className="text-gray-500 text-sm">by {project.creator} {project.institution ? `- ${project.institution}` : ''}</p>
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
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-xs font-medium">Completion</span>
                                </div>
                                <p className="font-semibold text-sm">{project.completion_date}</p>
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
                                <p className="font-semibold text-sm">{project.for_sale ? project.price : 'N/A'}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{project.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{project.rating.toFixed(1)}</span>
                              </div>
                              {project.link && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <LinkIcon className="w-4 h-4" />
                                  <a href={`https://${project.link}`} className="text-blue-600 hover:underline truncate">
                                    {project.link}
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-3 mt-6">
                              <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                                <Button 
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg transition-all duration-200"
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
                              {project.for_sale && (
                                <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                                  <Button 
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm rounded-lg transition-all duration-200"
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
              )}
            </AnimatePresence>
            {renderPagination(projectPage, totalProjectPages, setProjectPage)}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              Top Freelancers
              <Badge className="bg-green-100 text-green-600">{filteredFreelancers.length} Available</Badge>
            </h2>

            <AnimatePresence>
              {loadingFreelancers ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {Array.from({ length: FREELANCERS_PER_PAGE }).map((_, index) => (
                    <SkeletonFreelancerCard key={index} />
                  ))}
                </motion.div>
              ) : (
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
                        <Card className="transition-all duration-300 border border-gray-100 bg-white shadow-md hover:shadow-xl rounded-xl">
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
                                      <span className="text-sm font-medium text-gray-600">{freelancer.rating.toFixed(1)}</span>
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
                                    <Badge key={index} variant="outline" className="text-gray-600 hover:bg-gray-100 transition-colors rounded">{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                              {freelancer.specialties && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-2">Specialties</p>
                                  <div className="flex flex-wrap gap-2">
                                    {freelancer.specialties.split(', ').map((specialty, index) => (
                                      <Badge key={index} className="bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors rounded">{specialty}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{freelancer.location}</span>
                                </div>
                                {freelancer.response_time && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{freelancer.response_time}</span>
                                  </div>
                                )}
                                {freelancer.success_rate && (
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{freelancer.success_rate} Success</span>
                                  </div>
                                )}
                                {freelancer.portfolio && (
                                  <div className="flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" />
                                    <a href={`https://${freelancer.portfolio}`} className="text-blue-600 hover:underline truncate">
                                      {freelancer.portfolio}
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-3 mt-6">
                                <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
                                  <Button 
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg transition-all duration-200"
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
                                  <Button variant="outline" className="flex-1 shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100">
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
              )}
            </AnimatePresence>
            {renderPagination(freelancerPage, totalFreelancerPages, setFreelancerPage)}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default ProjectListings;