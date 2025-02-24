import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LogoGeneration = ({ selectedBrandName, onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateLogo = async () => {
    if (!prompt) {
      setError('Please enter a prompt to generate a logo.');
      return;
    }
  
    setIsLoading(true);
    setError('');
    setLogoUrl(null);
  
    const apiKey = import.meta.env.VITE_TOGETHER_API_KEY;
  
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
  
      console.log('API Response:', response.data); // Log full response
      const imageData = response.data.data[0];
      setLogoUrl(imageData.b64_json ? `data:image/png;base64,${imageData.b64_json}` : imageData.url);
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

      <Card className="border border-gray-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Generate Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="e.g., modern minimalist logo with blue tones"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-grow shadow-sm"
            />
            <Button
              onClick={handleGenerateLogo}
              disabled={isLoading || !prompt}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-5 w-5 mr-2" />
              )}
              Generate
            </Button>
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

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
          <CardFooter className="flex justify-end">
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
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
};

export default LogoGeneration;