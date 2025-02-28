import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateLogoSuggestions } from './api/generateLogoSuggestions';

const LogoGeneration = ({ selectedBrandName, onBack, onNext }) => {
  const [logoSuggestions, setLogoSuggestions] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // User input states for logo preferences
  const [colorPreference, setColorPreference] = useState('modern');
  const [stylePreference, setStylePreference] = useState('minimalist');
  const [iconPreference, setIconPreference] = useState('none');
  const [customExpectations, setCustomExpectations] = useState('');

  // Predefined options for dropdowns
  const colorOptions = [
    { value: 'modern', label: 'Modern (Blues, Grays)' },
    { value: 'vibrant', label: 'Vibrant (Reds, Yellows)' },
    { value: 'earthy', label: 'Earthy (Greens, Browns)' },
    { value: 'monochrome', label: 'Monochrome (Black, White)' },
    { value: 'pastel', label: 'Pastel (Soft Pinks, Blues)' },
  ];

  const styleOptions = [
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'bold', label: 'Bold' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'playful', label: 'Playful' },
    { value: 'elegant', label: 'Elegant' },
  ];

  const iconOptions = [
    { value: 'none', label: 'No Icon' },
    { value: 'geometric', label: 'Geometric Shape' },
    { value: 'abstract', label: 'Abstract Form' },
    { value: 'letter', label: 'Brand Initial' },
    { value: 'symbol', label: 'Custom Symbol' },
  ];

  // Fetch logo suggestions based on user input
  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setError('');
    setLogoSuggestions([]);
    try {
      const promptWithIcon = iconPreference !== 'none' 
        ? `${customExpectations || ''} Include a ${iconPreference} icon.` 
        : customExpectations || '';
      const suggestions = await generateLogoSuggestions(
        selectedBrandName.name,
        colorPreference,
        stylePreference,
        promptWithIcon
      );
      setLogoSuggestions(suggestions);
    } catch (err) {
      setError('Failed to fetch logo suggestions.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate logo image using selected concept
  const handleGenerateLogo = async (concept) => {
    setIsLoading(true);
    setError('');
    setLogoUrl(null);

    const apiKey = import.meta.env.VITE_TOGETHER_API_KEY;
    const prompt = `${concept.description} using colors ${concept.colors.join(', ')}`;

    try {
      const response = await axios.post(
        'https://api.together.xyz/v1/images/generations',
        {
          model: 'black-forest-labs/FLUX.1-schnell-Free',
          prompt: `A professional logo for ${selectedBrandName.name}: ${prompt}`,
          steps: 4,
          n: 1,
          width: 512,
          height: 512,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const imageData = response.data.data[0];
      setLogoUrl(imageData.b64_json ? `data:image/png;base64,${imageData.b64_json}` : imageData.url);
      setSelectedConcept(concept);
    } catch (err) {
      setError('Failed to generate logo. Check console for details.');
      console.error('Error Details:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Brand Info Card */}
      <Card className="bg-blue-50 border-blue-100 shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-xl text-gray-800">{selectedBrandName.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{selectedBrandName.explanation}</p>
            </div>
            <Button variant="outline" onClick={onBack} className="shadow-sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Brand Names
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logo Preferences Input Card */}
      <Card className="border border-gray-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Customize Your Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Color Preference */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Color Scheme</label>
              <Select value={colorPreference} onValueChange={setColorPreference}>
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style Preference */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Style</label>
              <Select value={stylePreference} onValueChange={setStylePreference}>
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Icon Preference */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Icon</label>
              <Select value={iconPreference} onValueChange={setIconPreference}>
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Expectations */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Additional Expectations (optional)</label>
            <Input
              placeholder="e.g., sleek design with sharp edges"
              value={customExpectations}
              onChange={(e) => setCustomExpectations(e.target.value)}
              className="shadow-sm"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateSuggestions}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Logo Concepts
          </Button>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
          )}
        </CardContent>
      </Card>

      {/* Logo Suggestions Card */}
      {logoSuggestions.length > 0 && (
        <Card className="border border-gray-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Logo Concepts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {logoSuggestions.map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-purple-50 border-purple-100 hover:border-purple-200 transition-all">
                    <CardHeader>
                      <CardTitle className="text-md text-gray-800">{concept.concept}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{concept.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Colors: {concept.colors.join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">Font: {concept.font}</p>
                      <p className="text-xs text-gray-500">Symbol: {concept.symbol}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleGenerateLogo(concept)}
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isLoading && selectedConcept === concept ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Generate
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Logo Card */}
      {logoUrl && (
        <Card className="border border-gray-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Generated Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={logoUrl}
              alt={`Logo for ${selectedBrandName.name}`}
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => {
                const link = document.createElement('a');
                link.href = logoUrl;
                link.download = `${selectedBrandName.name}_logo.png`;
                link.click();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Download Logo
            </Button>
            <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
              Next: Business Plan
            </Button>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
};

export default LogoGeneration;