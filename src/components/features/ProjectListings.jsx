import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, ArrowLeft, Clock, DollarSign, Users, MapPin, Star, 
  Briefcase, Link as LinkIcon, MessageSquare, Share2, Bookmark,
  TrendingUp, Shield, Award
} from "lucide-react";
import Header from '../../pages/Header';

const ProjectListings = () => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentFreelancerIndex, setCurrentFreelancerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [savedProjects, setSavedProjects] = useState(new Set());

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform Development",
      budget: "$5,000 - $8,000",
      duration: "3 months",
      required: "React, Node.js, AWS",
      applications: 12,
      description: "Looking for an experienced developer to build a modern e-commerce platform with advanced features and seamless user experience.",
      category: "Web Development",
      postedDate: "2 days ago",
      expertise: "Expert",
      projectType: "Fixed Price"
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      budget: "$3,000 - $4,500",
      duration: "6 weeks",
      required: "Figma, Adobe XD",
      applications: 8,
      description: "Need a creative designer to develop an intuitive and engaging mobile app interface for our fitness tracking application.",
      category: "Design",
      postedDate: "1 day ago",
      expertise: "Intermediate",
      projectType: "Fixed Price"
    },
    {
      id: 3,
      title: "Data Analysis Dashboard",
      budget: "$4,000 - $6,000",
      duration: "2 months",
      required: "Python, React, D3.js",
      applications: 15,
      description: "Seeking a data visualization expert to create an interactive dashboard for real-time analytics and reporting.",
      category: "Data Science",
      postedDate: "3 days ago",
      expertise: "Expert",
      projectType: "Fixed Price"
    }
  ];

  const freelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Full Stack Developer",
      rate: "$65/hr",
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
      successRate: "98%"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "UI/UX Designer",
      rate: "$55/hr",
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
      successRate: "95%"
    },
    {
      id: 3,
      name: "Emma Watson",
      role: "Data Scientist",
      rate: "$75/hr",
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
      successRate: "97%"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'design', name: 'Design' },
    { id: 'data', name: 'Data Science' }
  ];

  const handleSaveProject = (projectId) => {
    setSavedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const nextProject = () => {
    setCurrentProjectIndex((prev) => prev === projects.length - 1 ? 0 : prev + 1);
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => prev === 0 ? projects.length - 1 : prev - 1);
  };

  const nextFreelancer = () => {
    setCurrentFreelancerIndex((prev) => prev === freelancers.length - 1 ? 0 : prev + 1);
  };

  const prevFreelancer = () => {
    setCurrentFreelancerIndex((prev) => prev === 0 ? freelancers.length - 1 : prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isForDashboard={true} />
      
      <main className="w-full max-w-7xl mx-auto p-6 pt-20 space-y-8">
        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 font-inter flex items-center gap-2">
                Featured Projects
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                  {projects.length} Active
                </span>
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-500">
                  {currentProjectIndex + 1} of {projects.length}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={prevProject}
                    className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={nextProject}
                    className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
                  >
                    <ArrowRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? "default" : "outline"}
                  className={`rounded-full text-sm ${
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects.map((project, idx) => (
              <Card 
                key={project.id}
                className={`transform transition-all duration-300 hover:shadow-lg border border-gray-100 bg-white ${
                  idx === currentProjectIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-40'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                          {project.category}
                        </span>
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold">
                          {project.expertise}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 font-inter">{project.title}</h3>
                      <p className="text-gray-500 text-sm">Posted {project.postedDate}</p>
                    </div>
                    <button 
                      onClick={() => handleSaveProject(project.id)}
                      className={`p-2 rounded-full transition-all ${
                        savedProjects.has(project.id)
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{project.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-medium">Budget</span>
                      </div>
                      <p className="font-semibold text-sm">{project.budget}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Duration</span>
                      </div>
                      <p className="font-semibold text-sm">{project.duration}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
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
                          <span 
                            key={index}
                            className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Apply Now
                    </Button>
                    <Button variant="outline" className="px-3">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Freelancers Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 font-inter flex items-center gap-2">
              Top Freelancers
              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                {freelancers.length} Available
              </span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-500">
                {currentFreelancerIndex + 1} of {freelancers.length}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={prevFreelancer}
                  className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={nextFreelancer}
                  className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
                >
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freelancers.map((freelancer, idx) => (
              <Card 
                key={freelancer.id}
                className={`transform transition-all duration-300 hover:shadow-lg border border-gray-100 bg-white ${
                  Math.abs(idx - currentFreelancerIndex) <= 2 ? 'scale-100 opacity-100' : 'scale-95 opacity-40'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={freelancer.image}
                        alt={freelancer.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
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
                        <h3 className="font-semibold text-gray-800">{freelancer.name}</h3>
                          <p className="text-sm text-gray-500">{freelancer.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-600">{freelancer.rating}</span>
                            <span className="text-sm text-gray-400">({freelancer.projects} projects)</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-blue-600 font-semibold">{freelancer.rate}</span>
                          <span className="text-xs text-green-600 font-medium">{freelancer.availability}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.split(', ').map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{freelancer.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{freelancer.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>{freelancer.successRate} Success</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LinkIcon className="w-4 h-4" />
                        <a href={`https://${freelancer.portfolio}`} className="text-blue-600 hover:underline">
                          Portfolio
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" className="flex-1">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectListings;