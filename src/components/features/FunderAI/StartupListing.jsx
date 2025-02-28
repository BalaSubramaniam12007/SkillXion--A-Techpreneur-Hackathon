import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Users, Clock, MapPin, Star, Search, Filter, 
  BarChart2, Bookmark, TrendingUp, Briefcase, Send, List, Plus
} from "lucide-react";
import Header from '../../../pages/Header';
import { supabase } from '../../../lib/supabase';

const StartupListings = () => {
  const navigate = useNavigate();
  const [currentStartupIndex, setCurrentStartupIndex] = useState(0);
  const [savedStartups, setSavedStartups] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [startups, setStartups] = useState([]);
  const [startupViewMode, setStartupViewMode] = useState('all'); // New state for view mode

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'agritech', name: 'AgriTech' },
    { id: 'fintech', name: 'FinTech' },
    { id: 'healthtech', name: 'HealthTech' },
    { id: 'mobility', name: 'Mobility' },
    { id: 'edtech', name: 'EdTech' },
    { id: 'ecommerce', name: 'E-commerce' }
  ];

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*');
        
        if (error) throw error;
        setStartups(data);
      } catch (error) {
        console.error('Error fetching startups:', error.message);
      }
    };

    fetchStartups();
  }, []);

  const filteredStartups = useMemo(() => {
    let result = startups;
    if (startupViewMode === 'saved') {
      result = result.filter(s => savedStartups.has(s.id));
    }
    if (filterIndustry !== 'all') {
      result = result.filter(s => s.industry === industries.find(i => i.id === filterIndustry).name);
    }
    if (searchQuery) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.pitch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.founder.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [startups, filterIndustry, searchQuery, startupViewMode, savedStartups]);

  const handleSaveStartup = (startupId) => {
    setSavedStartups(prev => {
      const newSet = new Set(prev);
      newSet.has(startupId) ? newSet.delete(startupId) : newSet.add(startupId);
      return newSet;
    });
  };

  const handleAnalyzeStartup = (startupId) => {
    navigate(`/fund-finder/${startupId}`);
  };

  const handleFundStartup = (startupId) => {
    console.log(`Initiating funding for startup ${startupId}`);
  };

  const handleStartupViewModeChange = (mode) => {
    setStartupViewMode(mode);
    setCurrentStartupIndex(0); // Reset index when changing view mode
  };

  const handlePostStartup = () => {
    // Placeholder for posting a startup logic
    console.log("Post a Startup clicked - Add your navigation or modal logic here");
    navigate('/post-startup'); // Navigate to a hypothetical post startup page
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    pressed: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header isForDashboard={true} />
      
      <main className="w-full max-w-7xl mx-auto p-6 pt-24 space-y-12">
        <div className="flex justify-start gap-4">
          <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
            <Button
              variant={startupViewMode === 'all' ? "default" : "outline"}
              onClick={() => handleStartupViewModeChange('all')}
              className={`rounded-lg shadow-sm transition-all duration-200 ${
                startupViewMode === 'all' ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              All Startups
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
            <Button
              variant={startupViewMode === 'saved' ? "default" : "outline"}
              onClick={() => handleStartupViewModeChange('saved')}
              className={`rounded-lg shadow-sm transition-all duration-200 ${
                startupViewMode === 'saved' ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Saved Startups
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="pressed">
            <Button
              variant="default"
              onClick={handlePostStartup}
              className="rounded-lg shadow-sm bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post a Startup
            </Button>
          </motion.div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">
          <Input
            placeholder="Search startups..."
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
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              {startupViewMode === 'saved' ? 'Saved Startups' : 'Startup Opportunities'}
              <Badge className="bg-blue-100 text-blue-600">{filteredStartups.length} Active</Badge>
            </h2>
          </div>

          <AnimatePresence>
            <motion.div
              key={currentStartupIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredStartups.map((startup) => (
                <Card 
                  key={startup.id}
                  className="transform transition-all duration-300 hover:shadow-xl border border-gray-100 bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Badge className="bg-blue-50 text-blue-600">{startup.industry}</Badge>
                          <Badge className="bg-purple-50 text-purple-600">{startup.stage}</Badge>
                        </div>
                        <h3 className="font-bold text-xl text-gray-800">{startup.name}</h3>
                        <p className="text-gray-500 text-sm">by {startup.founder}</p>
                      </div>
                      <Button 
                        variant="ghost"
                        onClick={() => handleSaveStartup(startup.id)}
                        className={`p-2 ${savedStartups.has(startup.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Bookmark className={`w-5 h-5 ${savedStartups.has(startup.id) ? 'fill-blue-600' : ''}`} />
                      </Button>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{startup.pitch}</p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-xs font-medium">Funding</span>
                        </div>
                        <p className="font-semibold text-sm">{startup.funding_raised}/{startup.funding_goal}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-medium">Time Left</span>
                        </div>
                        <p className="font-semibold text-sm">{startup.days_left} days</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-xs font-medium">Team</span>
                        </div>
                        <p className="font-semibold text-sm">{startup.team_size}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{startup.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>Rating: {startup.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>{startup.investors} Investors</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <a href={`https://${startup.website}`} className="text-blue-600 hover:underline">
                          {startup.website}
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={() => handleAnalyzeStartup(startup.id)}
                      >
                        <BarChart2 className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                        onClick={() => handleFundStartup(startup.id)}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Fund
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default StartupListings;