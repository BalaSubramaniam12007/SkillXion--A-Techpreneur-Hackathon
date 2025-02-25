import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Add animation library

function LandingPage() {
  const navigate = useNavigate();

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-10 text-center"
      >
        Resume Builder & Analyzer
      </motion.h1>
      <div className="flex flex-col sm:flex-row gap-6">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          onClick={() => navigate('/resume-assistant/analyze')}
        >
          Upload Your Resume
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="px-8 py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors text-lg font-semibold"
          onClick={() => navigate('/resume-assistant/create')}
        >
          Create from Scratch
        </motion.button>
      </div>
      <p className="mt-6 text-gray-600 text-sm">Craft ATS-friendly resumes or get AI-powered insights!</p>
    </div>
  );
}

export default LandingPage;