import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, DollarSign, MapPin, Clock, Star, Building, 
  Calendar, GraduationCap, ChevronLeft, Send, Bookmark
} from "lucide-react";
import Header from '../../../pages/Header';
import { supabase } from '@/lib/supabase';

const JobDescription = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error.message);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);
        if (error) {
          console.error('Error fetching saved jobs:', error.message);
        } else {
          setSavedJobs(new Set(data.map(item => item.job_id)));
        }
      }
    };

    fetchJob();
    fetchSavedJobs();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Job not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header isForDashboard={true} />
      
      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 pt-20 sm:pt-24">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>

        <Card className="border border-gray-100 bg-white shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-blue-50 text-blue-600">{job.industry}</Badge>
                  <Badge className={job.type === "Internship" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"}>
                    {job.type}
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{job.title}</h1>
                <p className="text-gray-500 text-base">{job.company}</p>
              </div>
              <Button 
                variant="ghost"
                onClick={() => handleSaveJob(job.id)}
                className={`p-2 ${savedJobs.has(job.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Bookmark className={`w-6 h-6 ${savedJobs.has(job.id) ? 'fill-blue-600' : ''}`} />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">{job.type === "Internship" ? "Stipend" : "Salary"}</span>
                  </div>
                  <p className="font-semibold text-base">{job.salary || 'Not specified'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Posted</span>
                  </div>
                  <p className="font-semibold text-base">
                    {job.posted ? new Date(job.posted).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    {job.type === "Internship" ? <GraduationCap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <p className="font-semibold text-base">{job.experience || 'Not specified'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="font-semibold text-base">{job.location || 'Not specified'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-base text-gray-600">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>Rating: {job.rating || 'Not rated'}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-600">
                  <Building className="w-5 h-5" />
                  <span>{job.openings ? `${job.openings} Openings` : 'Openings not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>Skills: {(job.skills || []).join(", ") || 'None specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-600">
                  <Briefcase className="w-5 h-5" />
                  {job.website ? (
                    <a href={`https://${job.website}`} className="text-blue-600 hover:underline">
                      {job.website}
                    </a>
                  ) : (
                    <span>Not specified</span>
                  )}
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm py-6 text-lg"
                onClick={() => handleApplyJob(job.id)}
              >
                <Send className="w-5 h-5 mr-3" />
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JobDescription;