import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, DollarSign, MapPin, Clock, Star, Search, Filter, 
  Bookmark, Send, Building, Calendar, GraduationCap, ChevronLeft, 
  ChevronRight, Grid, List, ChevronDown, ChevronUp
} from "lucide-react";
import Header from '../../../pages/Header';
import { supabase } from '@/lib/supabase';

const JobListings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('matchScore');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const jobsPerPage = 6;

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'IT Services', name: 'IT Services' },
    { id: 'EdTech', name: 'EdTech' },
    { id: 'FoodTech', name: 'FoodTech' },
    { id: 'Telecom', name: 'Telecom' },
    { id: 'E-commerce', name: 'E-commerce' },
    { id: 'Banking', name: 'Banking' },
    { id: 'Retail', name: 'Retail' },
  ];

  const jobTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'Full-time', name: 'Full-time' },
    { id: 'Part-time', name: 'Part-time' },
    { id: 'Internship', name: 'Internship' },
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'Remote', name: 'Remote' },
    { id: 'Mumbai, Maharashtra', name: 'Mumbai' },
    { id: 'Bengaluru, Karnataka', name: 'Bengaluru' },
    { id: 'Delhi', name: 'Delhi' },
    { id: 'Hyderabad, Telangana', name: 'Hyderabad' },
  ];

  const sortOptions = [
    { id: 'matchScore', name: 'Best Match' },
    { id: 'posted', name: 'Date Posted' },
    { id: 'salary', name: 'Salary' },
  ];

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('skills, interests, experience')
            .eq('id', user.id)
            .single();
          if (error) throw error;
          setUserProfiles(data || {});
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
        setUserProfiles({});
      }
    };
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('jobs')
          .select('*')
          .order('posted', { ascending: false });

        if (searchQuery) {
          query = query.or(
            `title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
          );
        }

        const { data, error } = await query;
        if (error) throw error;

        const mappedJobs = (data || []).map(job => ({
          ...job,
          matchScore: calculateMatchScore(job, userProfiles)
        }));

        setJobs(mappedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error.message);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchQuery, userProfiles]);

  const calculateMatchScore = (job, userProfiles) => {
    if (!userProfiles || !userProfiles.skills) return 0;
    let score = 0;
    const userSkills = userProfiles.skills.map(s => s.toLowerCase());
    const userInterests = userProfiles.interests?.map(s => s.toLowerCase()) || [];
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());

    const skillMatches = jobSkills.filter(skill => userSkills.includes(skill)).length;
    score += (skillMatches / Math.max(jobSkills.length, 1)) * 40;

    const interestMatches = jobSkills.filter(skill => userInterests.includes(skill)).length;
    score += (interestMatches / Math.max(jobSkills.length, 1)) * 30;

    if (userProfiles.experience && job.experience) {
      const expMatch = userProfiles.experience.toLowerCase() === job.experience.toLowerCase() ? 1 : 0.5;
      score += expMatch * 30;
    }

    return Math.min(Math.round(score), 100);
  };

  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    if (filterIndustry !== 'all') {
      result = result.filter(j => j.industry === filterIndustry);
    }
    if (filterType !== 'all') {
      result = result.filter(j => j.type === filterType);
    }
    if (filterLocation !== 'all') {
      result = result.filter(j => j.location === filterLocation);
    }

    result.sort((a, b) => {
      if (sortBy === 'matchScore') return b.matchScore - a.matchScore;
      if (sortBy === 'posted') return new Date(b.posted) - new Date(a.posted);
      if (sortBy === 'salary') {
        const salaryA = parseInt(a.salary?.replace(/[^0-9]/g, '') || '0');
        const salaryB = parseInt(b.salary?.replace(/[^0-9]/g, '') || '0');
        return salaryB - salaryA;
      }
      return 0;
    });

    return result;
  }, [jobs, filterIndustry, filterType, filterLocation, sortBy]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage]);

  const handleSaveJob = async (jobId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSavedJobs(prev => {
      const newSet = new Set(prev);
      const isSaved = newSet.has(jobId);
      isSaved ? newSet.delete(jobId) : newSet.add(jobId);

      supabase
        .from('saved_jobs')
        .upsert({ user_id: user.id, job_id: jobId, saved: !isSaved })
        .then(({ error }) => {
          if (error) console.error('Error saving job:', error.message);
        });

      return newSet;
    });
  };

  const handleApplyJob = async (jobId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('Please log in to apply');
      return;
    }

    const { error } = await supabase
      .from('applications')
      .insert({ user_id: user.id, job_id: jobId, applied_at: new Date() });
    if (error) {
      console.error('Error applying to job:', error.message);
    } else {
      console.log(`Applied to job ${jobId}`);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Skeleton Component
  const SkeletonCard = () => (
    <Card className={`transform border border-gray-100 bg-white ${viewMode === 'list' ? 'flex flex-col sm:flex-row gap-4 p-4' : ''}`}>
      <CardContent className={viewMode === 'grid' ? 'p-6' : 'p-0 flex-1'}>
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

        <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4 mb-4' : 'flex flex-wrap gap-4 mb-4'}>
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          {viewMode === 'grid' && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </>
          )}
        </div>

        <div className={viewMode === 'grid' ? 'flex gap-3 mt-6' : 'mt-4 sm:mt-0 sm:ml-auto'}>
          <div className="h-10 w-full sm:w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header isForDashboard={true} />
      
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 pt-20 sm:pt-24 space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Input
              placeholder="Search jobs or internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/3 shadow-sm"
              prefix={<Search className="w-4 h-4 text-gray-400" />}
            />
            <div className="flex gap-4 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] shadow-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="shadow-sm"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="shadow-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {isFilterOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                  <SelectTrigger className="shadow-sm">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry.id} value={industry.id}>{industry.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="shadow-sm">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="shadow-sm">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              Job & Internship Opportunities
              <Badge className="bg-blue-100 text-blue-600">{filteredJobs.length} Active</Badge>
            </h2>
          </div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-6"}
            >
              {Array.from({ length: jobsPerPage }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </motion.div>
          ) : filteredJobs.length === 0 ? (
            <p className="text-center text-gray-600">No jobs found. Try adjusting your filters or search.</p>
          ) : (
            <AnimatePresence>
              <motion.div
                key={`${currentPage}-${viewMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-6"}
              >
                {paginatedJobs.map((job) => (
                  <Card 
                    key={job.id}
                    className={`transform transition-all duration-300 hover:shadow-xl border border-gray-100 bg-white ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row gap-4 p-4' : ''
                    }`}
                  >
                    <CardContent className={viewMode === 'grid' ? 'p-6' : 'p-0 flex-1'}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-blue-50 text-blue-600">{job.industry}</Badge>
                            <Badge className={job.type === "Internship" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"}>
                              {job.type}
                            </Badge>
                            {job.matchScore >= 50 && (
                              <Badge className="bg-yellow-50 text-yellow-600">
                                {job.matchScore}% Match
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-bold text-lg sm:text-xl text-gray-800">{job.title}</h3>
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

                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{job.description}</p>

                      <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4 mb-4' : 'flex flex-wrap gap-4 mb-4'}>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-medium">{job.type === "Internship" ? "Stipend" : "Salary"}</span>
                          </div>
                          <p className="font-semibold text-sm">{job.salary || 'Not specified'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">Posted</span>
                          </div>
                          <p className="font-semibold text-sm">
                            {job.posted ? new Date(job.posted).toLocaleDateString() : 'Not specified'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            {job.type === "Internship" ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                            <span className="text-xs font-medium">Experience</span>
                          </div>
                          <p className="font-semibold text-sm">{job.experience || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location || 'Not specified'}</span>
                        </div>
                        {viewMode === 'grid' && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>Rating: {job.rating || 'Not rated'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building className="w-4 h-4" />
                              <span>{job.openings ? `${job.openings} Openings` : 'Openings not specified'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Skills: {(job.skills || []).join(", ") || 'None specified'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Briefcase className="w-4 h-4" />
                              {job.website ? (
                                <a href={`https://${job.website}`} className="text-blue-600 hover:underline">
                                  {job.website}
                                </a>
                              ) : (
                                <span>Not specified</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className={viewMode === 'grid' ? 'flex gap-3 mt-6' : 'mt-4 sm:mt-0 sm:ml-auto'}>
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