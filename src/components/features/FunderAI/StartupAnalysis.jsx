import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, Users, Clock, MapPin, Star, TrendingUp, Briefcase, 
  ChevronLeft, Bookmark
} from "lucide-react";
import Header from '../../../pages/Header';
import { supabase } from '../../../lib/supabase';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StartupAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedStartups, setSavedStartups] = useState(new Set());

  useEffect(() => {
    const fetchStartup = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setStartup(data);
      } catch (error) {
        console.error('Error fetching startup:', error.message);
        setStartup(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedStartups = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('saved_startups')
          .select('startup_id')
          .eq('user_id', user.id);
        if (error) console.error('Error fetching saved startups:', error.message);
        else setSavedStartups(new Set(data.map(item => item.startup_id)));
      }
    };

    fetchStartup();
    fetchSavedStartups();
  }, [id]);

  const handleSaveStartup = async (startupId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSavedStartups(prev => {
      const newSet = new Set(prev);
      const isSaved = newSet.has(startupId);
      isSaved ? newSet.delete(startupId) : newSet.add(startupId);

      supabase
        .from('saved_startups')
        .upsert({ user_id: user.id, startup_id: startupId, saved: !isSaved })
        .then(({ error }) => {
          if (error) console.error('Error saving startup:', error.message);
        });

      return newSet;
    });
  };

  const handleFundStartup = async (startupId) => {
    console.log(`Initiating funding for startup ${startupId}`);
  };

  // Sample chart data (replace with real data if available)
  const revenueData = {
    labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'],
    datasets: [{
      label: 'Revenue ($M)',
      data: [1.2, 1.8, 2.5, 3.1, 4.0, 5.2],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false,
    }]
  };

  const fundingData = {
    labels: ['Seed', 'Series A', 'Series B', 'Series C'],
    datasets: [{
      label: 'Funding Raised ($M)',
      data: [2, 5, 8, 15],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Company Performance' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading startup analysis...</div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Startup not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Header isForDashboard={true} />

      <main className="flex-1 w-full p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/fund-finder')} 
            className="shadow-sm mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>

          <Card className="w-full border border-gray-100 bg-white shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-blue-50 text-blue-600">{startup.industry}</Badge>
                    <Badge className="bg-purple-50 text-purple-600">{startup.stage}</Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{startup.name}</h1>
                  <p className="text-gray-500 text-lg">Founded by {startup.founder}</p>
                </div>
                <Button 
                  variant="ghost"
                  onClick={() => handleSaveStartup(startup.id)}
                  className={`p-2 ${savedStartups.has(startup.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Bookmark className={`w-6 h-6 ${savedStartups.has(startup.id) ? 'fill-blue-600' : ''}`} />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Company Overview */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Company Overview</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{startup.pitch}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm font-medium">Funding</span>
                    </div>
                    <p className="font-semibold text-lg">{startup.funding_raised} / {startup.funding_goal}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-medium">Time Left</span>
                    </div>
                    <p className="font-semibold text-lg">{startup.days_left} days</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-sm font-medium">Team Size</span>
                    </div>
                    <p className="font-semibold text-lg">{startup.team_size}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="font-semibold text-lg">{startup.location}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-2 text-lg text-gray-600">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>Rating: {startup.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-gray-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>{startup.investors} Investors</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-gray-600">
                    <Briefcase className="w-5 h-5" />
                    <a href={`https://${startup.website}`} className="text-blue-600 hover:underline">
                      {startup.website}
                    </a>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-800">Performance Metrics</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <Line data={revenueData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Revenue Growth' } } }} />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <Bar data={fundingData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Funding Rounds' } } }} />
                    </div>
                  </div>
                </div>

                {/* Fund Button */}
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm py-6 text-lg"
                  onClick={() => handleFundStartup(startup.id)}
                >
                  <DollarSign className="w-5 h-5 mr-3" />
                  Fund This Startup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StartupAnalysis;