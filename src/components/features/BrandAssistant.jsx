import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Sparkles, 
  Brain, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  Bookmark,
  Star,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { generateIdeas } from '../../api/generateIdeas';
import { generateBrandNames } from '../../api/generateBrandNames';
import Header from '../../pages/Header';
import { supabase } from '../../lib/supabase';

// Enhanced retry logic with exponential backoff
const RETRY_DELAYS = [1000, 2000, 4000, 8000];
const MAX_RETRIES = 4;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateIdeasWithRetry = async (skills, interest, retryCount = 0) => {
  try {
    return await generateIdeas(skills, interest);
  } catch (error) {
    if (error.message?.includes('503') && retryCount < MAX_RETRIES) {
      await delay(RETRY_DELAYS[retryCount]);
      return generateIdeasWithRetry(skills, interest, retryCount + 1);
    }
    throw error;
  }
};

const IdeaCard = ({ idea, index, onSelect, variant = "default", isSelected, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const colorClasses = {
    default: "bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:border-blue-200",
    selected: "bg-gradient-to-br from-green-50 to-white border-green-200",
    interest: "bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:border-purple-200",
    saved: "bg-gradient-to-br from-amber-50 to-white border-amber-200"
  };

  const getConfidenceScore = () => {
    return Math.floor(Math.random() * 30) + 70; // Simulate AI confidence score
  };

  return (
    <Card 
      className={`transition-all duration-300 ${colorClasses[isSelected ? "selected" : variant]} relative transform hover:-translate-y-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full">
        <button 
          className="w-full text-left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`${
                  variant === 'interest' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-blue-100 text-blue-600'
                } w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium`}>
                  {index + 1}
                </span>
                <CardTitle className="text-base font-semibold font-inter leading-tight">
                  {idea.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {idea.saved && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    Saved
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </button>
        
        <CardContent className={`transition-all duration-300 ${isExpanded ? 'py-4' : 'py-2'} px-4`}>
          <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {idea.description}
          </p>
          
          {isExpanded && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">AI Confidence Score</span>
                  <span className="font-medium">{getConfidenceScore()}%</span>
                </div>
                <Progress value={getConfidenceScore()} className="h-2" />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(idea);
                  }}
                  className={`flex-1 ${isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {isSelected ? (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Select
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave(idea);
                  }}
                  className="flex-1"
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${idea.saved ? 'fill-current' : ''}`} />
                  {idea.saved ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

const BrandNameCard = ({ brandName, onLike, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{brandName.name}</h3>
          <div className="flex gap-2">
            {brandName.liked && (
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                Favorite
              </Badge>
            )}
            {brandName.saved && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                Saved
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-4">
        <button 
          className="w-full text-left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {brandName.explanation}
          </p>
          <div className="text-center text-gray-400 mt-2">
            {isExpanded ? <ChevronUp className="mx-auto h-4 w-4" /> : <ChevronDown className="mx-auto h-4 w-4" />}
          </div>
        </button>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline"
            onClick={() => onLike(brandName)}
            className={`flex-1 ${brandName.liked ? 'bg-pink-50 text-pink-600 border-pink-200' : ''}`}
          >
            <Star className={`h-4 w-4 mr-2 ${brandName.liked ? 'fill-current' : ''}`} />
            {brandName.liked ? 'Favorited' : 'Favorite'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => onSave(brandName)}
            className={`flex-1 ${brandName.saved ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}`}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${brandName.saved ? 'fill-current' : ''}`} />
            {brandName.saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const BrandNameGeneration = ({ selectedIdea, onBack }) => {
  const [nameStyle, setNameStyle] = useState('');
  const [brandNames, setBrandNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationCount, setGenerationCount] = useState(0);

  const handleGenerateNames = async () => {
    if (!nameStyle) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const names = await generateBrandNames(selectedIdea, nameStyle);
      setBrandNames(names.map(name => ({ ...name, liked: false, saved: false })));
      setGenerationCount(prev => prev + 1);
    } catch (err) {
      setError('Failed to generate brand names. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = useCallback((brandName) => {
    setBrandNames(prev => prev.map(bn => 
      bn.name === brandName.name ? { ...bn, liked: !bn.liked } : bn
    ));
  }, []);

  const handleSave = useCallback((brandName) => {
    setBrandNames(prev => prev.map(bn => 
      bn.name === brandName.name ? { ...bn, saved: !bn.saved } : bn
    ));
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{selectedIdea.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{selectedIdea.description}</p>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Ideas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg">Generate Brand Names</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Describe your preferred brand name style (e.g., modern, professional, creative)"
              value={nameStyle}
              onChange={(e) => setNameStyle(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={handleGenerateNames}
              disabled={isLoading || !nameStyle}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : generationCount > 0 ? (
                <RefreshCw className="h-4 w-4 mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              <span>{generationCount > 0 ? 'Regenerate' : 'Generate'}</span>
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {brandNames.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Generated Brand Names</h3>
          <div className="grid grid-cols-1 gap-4">
            {brandNames.map((brandName, index) => (
              <BrandNameCard 
                key={index} 
                brandName={brandName}
                onLike={handleLike}
                onSave={handleSave}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const BrandAssistant = () => {
  const [skills, setSkills] = useState([]);
  const [currentInterest, setCurrentInterest] = useState('');
  const [autoGeneratedIdeas, setAutoGeneratedIdeas] = useState([]);
  const [currentInterestIdeas, setCurrentInterestIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [savedIdeas, setSavedIdeas] = useState([]);

  useEffect(() => {
    const fetchSkillsAndGenerateIdeas = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;

        if (!user) {
          setError('Please log in to continue');
          return;
        }

        // Fetch both skills and saved ideas
        const [profileData, savedIdeasData] = await Promise.all([
          supabase
            .from('profiles')
            .select('skills')
            .eq('id', user.id)
            .single(),
          supabase
            .from('saved_ideas')
            .select('*')
            .eq('user_id', user.id)
        ]);

        if (profileData.error) throw profileData.error;
        if (savedIdeasData.error) throw savedIdeasData.error;

        if (profileData.data?.skills) {
          setSkills(profileData.data.skills);
          const ideas = await generateIdeasWithRetry(profileData.data.skills, '');
          setAutoGeneratedIdeas(ideas.map(idea => ({
            ...idea,
            saved: savedIdeasData.data.some(saved => saved.idea_title === idea.title)
          })));
        }

        setSavedIdeas(savedIdeasData.data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message?.includes('503') 
          ? 'The AI service is currently busy. Please try again in a few moments.'
          : 'Failed to load your profile data');
      }
    };

    fetchSkillsAndGenerateIdeas();
  }, []);

  const handleSelectIdea = useCallback((idea) => {
    setSelectedIdea(idea);
    setCurrentPage(1);
  }, []);

  const handleSaveIdea = useCallback(async (idea) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please log in to save ideas');
        return;
      }

      const ideaToSave = {
        user_id: user.id,
        idea_title: idea.title,
        idea_description: idea.description,
        created_at: new Date().toISOString()
      };

      if (!idea.saved) {
        await supabase.from('saved_ideas').insert([ideaToSave]);
      } else {
        await supabase
          .from('saved_ideas')
          .delete()
          .match({ user_id: user.id, idea_title: idea.title });
      }

      // Update local state
      const updateIdeas = (ideas) =>
        ideas.map(i => i.title === idea.title ? { ...i, saved: !i.saved } : i);

      setAutoGeneratedIdeas(prev => updateIdeas(prev));
      setCurrentInterestIdeas(prev => updateIdeas(prev));

    } catch (err) {
      console.error('Error saving idea:', err);
      setError('Failed to save the idea. Please try again.');
    }
  }, []);

  const handleGenerateIdeas = async () => {
    setIsLoading(true);
    setError('');
    setRetryAttempt(0);
    
    try {
      const ideas = await generateIdeasWithRetry(skills, currentInterest);
      setCurrentInterestIdeas(ideas.map(idea => ({
        ...idea,
        saved: savedIdeas.some(saved => saved.idea_title === idea.title)
      })));
      
    } catch (err) {
      setError(err.message?.includes('503')
        ? 'The AI service is currently busy. Please try again in a few moments.'
        : 'Failed to generate business ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const pages = [
    {
      title: "Skills & Ideas",
      content: (
        <div className="space-y-8">
          {/* Skills Overview Card */}
          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                Your Skills Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  These skills will be used to generate relevant business ideas tailored to your expertise.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Auto-generated Ideas Grid */}
          {autoGeneratedIdeas.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 font-inter">
                  Suggested Ideas
                </h3>
                <Badge variant="outline" className="text-blue-600">
                  {autoGeneratedIdeas.length} ideas
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {autoGeneratedIdeas.map((idea, index) => (
                  <IdeaCard 
                    key={index}
                    idea={idea}
                    index={index}
                    onSelect={handleSelectIdea}
                    onSave={handleSaveIdea}
                    isSelected={selectedIdea?.title === idea.title}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Generate New Ideas Section */}
          <Card className="border border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg">Generate New Ideas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="What's your business interest?"
                  value={currentInterest}
                  onChange={(e) => setCurrentInterest(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  onClick={handleGenerateIdeas}
                  disabled={isLoading || !currentInterest}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  <span>Generate</span>
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Ideas for Interest Section */}
          {currentInterestIdeas.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 font-inter">
                  Ideas for {currentInterest}
                </h3>
                <Badge variant="outline" className="text-purple-600">
                  {currentInterestIdeas.length} ideas
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentInterestIdeas.map((idea, index) => (
                  <IdeaCard 
                    key={index}
                    idea={idea}
                    index={index}
                    variant="interest"
                    onSelect={handleSelectIdea}
                    onSave={handleSaveIdea}
                    isSelected={selectedIdea?.title === idea.title}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Brand Name Generation",
      content: (
        selectedIdea ? (
          <BrandNameGeneration 
            selectedIdea={selectedIdea}
            onBack={() => {
              setCurrentPage(0);
              setSelectedIdea(null);
            }}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Please select an idea first to generate brand names.</p>
            <Button
              onClick={() => setCurrentPage(0)}
              className="mt-4"
              variant="outline"
            >
              Go Back to Ideas
            </Button>
          </div>
        )
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isForDashboard={true} />
      
      <main className="container mx-auto p-4 pt-20 max-w-7xl">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b bg-white rounded-t-lg py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <CardTitle className="text-xl flex items-center gap-2 font-inter">
                  <Brain className="w-5 h-5 text-blue-500" />
                  {pages[currentPage].title}
                </CardTitle>
                <div className="flex gap-2">
                  {pages.map((page, index) => (
                    <Badge
                      key={index}
                      variant={currentPage === index ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setCurrentPage(index)}
                    >
                      {page.title}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
                  disabled={currentPage === pages.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            {pages[currentPage].content}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BrandAssistant;