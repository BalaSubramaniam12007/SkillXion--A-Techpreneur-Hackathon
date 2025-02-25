// src/components/features/JobListings.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, DollarSign, MapPin, Clock, Star, Search, Filter, 
  Bookmark, Send, Building, Calendar, GraduationCap, ChevronLeft, ChevronRight
} from "lucide-react";
import Header from '../../../pages/Header';

const JobListings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [jobs, setJobs] = useState([]); // State for fetched jobs
  const [loading, setLoading] = useState(false);
  const jobsPerPage = 6;

  // Replace with your Scrapingdog API key
  const API_KEY = '67bcedd14be6d3a785f4e6d6';

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'tech', name: 'Technology' },
    { id: 'healthtech', name: 'HealthTech' },
    { id: 'edtech', name: 'EdTech' },
    { id: 'cleanenergy', name: 'Clean Energy' }
  ];

  const jobTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'fulltime', name: 'Full-Time' },
    { id: 'internship', name: 'Internship' }
  ];

  // Fetch jobs from Scrapingdog API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.scrapingdog.com/linkedinjobs?api_key=${API_KEY}&field=${searchQuery || 'software'}&geoid=103644278&page=${currentPage}`
        );
        const data = await response.json();
        
        // Map Scrapingdog data to your job format
        const mappedJobs = data.map(job => ({
          id: job.job_id,
          title: job.job_position,
          company: job.company_name,
          industry: 'Technology',
          salary: job.salary || 'Not specified', 
          location: job.job_location,
          description: job.job_description || 'No description available',
          skills: job.skills || ['Not specified'],
          experience: job.experience || 'Not specified',
          type: job.type || 'Full-Time', 
          posted: job.job_posting_date,
          rating: 4.5, 
          openings: 1, // Placeholder
          website: job.company_profile.split('?')[0].replace('https://www.linkedin.com/company/', '') + '.com' // Rough approximation
        }));
        setJobs(mappedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]); // Fallback to empty array on error
      }
      setLoading(false);
    };

    fetchJobs();
  }, [searchQuery, currentPage]); // Refetch when search or page changes

  const filteredJobs = useMemo(() => {
    let result = jobs;
    if (filterIndustry !== 'all') {
      result = result.filter(j => j.industry === industries.find(i => i.id === filterIndustry).name);
    }
    if (filterType !== 'all') {
      result = result.filter(j => j.type === jobTypes.find(t => t.id === filterType).name);
    }
    return result;
  }, [jobs, filterIndustry, filterType]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage]);

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      newSet.has(jobId) ? newSet.delete(jobId) : newSet.add(jobId);
      return newSet;
    });
  };

  const handleApplyJob = (jobId) => {
    console.log(`Applying to job ${jobId}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header isForDashboard={true} />
      
      <main className="w-full max-w-7xl mx-auto p-6 pt-24 space-y-12">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">
          <Input
            placeholder="Search jobs or internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 shadow-sm"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
          <div className="flex gap-2 flex-wrap">
            {industries.map(industry => (
              <Button
                key={industry.id}
                variant={filterIndustry === industry.id ? "default" : "outline"}
                onClick={() => setFilterIndustry(industry.id)}
                className="shadow-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                {industry.name}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {jobTypes.map(type => (
              <Button
                key={type.id}
                variant={filterType === type.id ? "default" : "outline"}
                onClick={() => setFilterType(type.id)}
                className="shadow-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                {type.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              Job & Internship Opportunities
              <Badge className="bg-blue-100 text-blue-600">{filteredJobs.length} Active</Badge>
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading jobs...</p>
          ) : (
            <AnimatePresence>
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedJobs.map((job) => (
                  <Card 
                    key={job.id}
                    className="transform transition-all duration-300 hover:shadow-xl border border-gray-100 bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Badge className="bg-blue-50 text-blue-600">{job.industry}</Badge>
                            <Badge className={job.type === "Internship" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"}>
                              {job.type}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-xl text-gray-800">{job.title}</h3>
                          <p className="text-gray-500 text-sm">{job.company}</p>
                        </div>
                        <Button 
                          variant="ghost"
                          onClick={() => handleSaveJob(job.id)}
                          className={`p-2 ${savedJobs.has(job.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <Bookmark className={`w-5 h-5 ${savedJobs.has(job.id) ? 'fill-blue-600' : ''}`} />
                        </Button>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{job.description}</p>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-medium">{job.type === "Internship" ? "Stipend" : "Salary"}</span>
                          </div>
                          <p className="font-semibold text-sm">{job.salary}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">Posted</span>
                          </div>
                          <p className="font-semibold text-sm">{job.posted}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            {job.type === "Internship" ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                            <span className="text-xs font-medium">{job.type === "Internship" ? "Duration" : "Experience"}</span>
                          </div>
                          <p className="font-semibold text-sm">{job.type === "Internship" ? job.duration || 'Not specified' : job.experience}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>Rating: {job.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="w-4 h-4" />
                          <span>{job.openings} Openings</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Skills: {job.skills.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          <a href={`https://${job.website}`} className="text-blue-600 hover:underline">
                            {job.website}
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          onClick={() => handleApplyJob(job.id)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                disabled={currentPage === 1 || loading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className="w-10 h-10 shadow-sm"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages || loading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="shadow-sm"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobListings;