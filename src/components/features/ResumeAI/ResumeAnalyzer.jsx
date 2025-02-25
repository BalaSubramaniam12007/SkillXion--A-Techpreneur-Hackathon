import { useState } from 'react';
import axios from 'axios';

const ResumeAnalyzer = () => {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDesc) {
      alert('Please upload a resume and enter a job description.');
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDesc', jobDesc);
  
    try {
      const response = await axios.post('http://localhost:5000/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (error) {
      setResult({ error: 'Failed to analyze resume. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Resume Analyzer</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Your Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Job Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description & Requirements
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="6"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>

      {/* Results Display */}
      {result && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-bold">ATS Score:</span> {result.ats_score}/100
              </p>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Suggestions for Improvement</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion.replace(/^- /, '')}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;