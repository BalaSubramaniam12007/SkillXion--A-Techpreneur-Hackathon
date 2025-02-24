import React, { useState, useEffect } from 'react';

function AnalyzeResumePage() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [skillsReq, setSkillsReq] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    if (file && (jobDesc || skillsReq)) {
      const timer = setTimeout(() => analyzeResume(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [file, jobDesc, skillsReq]);

  const analyzeResume = (isAuto = false) => {
    if (!file) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const results = {
        atsScore: Math.floor(Math.random() * 20 + 80),
        suggestions: [
          'Add more quantifiable achievements',
          'Include relevant keywords from job description',
          'Optimize formatting for ATS systems'
        ],
        missingSkills: skillsReq.split(',').filter(s => s.trim() && Math.random() > 0.7).slice(0, 2),
        keywordMatch: Math.floor(Math.random() * 30 + 70)
      };
      setAnalysis(results);
      setIsLoading(false);
    }, isAuto ? 0 : 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Analyze Your Resume</h2>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 mb-6 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.doc,.docx"
        />
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0113 5a5 5 0 014.9 6.027A4 4 0 0117 16H7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13v6m-3-3l3 3 3-3" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {file ? file.name : 'Drag and drop your resume here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Supports PDF, DOC, DOCX</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <textarea
          placeholder="Paste Job Description"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full p-3 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        />
        <textarea
          placeholder="Required Skills (comma-separated)"
          value={skillsReq}
          onChange={(e) => setSkillsReq(e.target.value)}
          className="w-full p-3 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        />
      </div>
      
      <button
        onClick={() => analyzeResume(false)}
        disabled={isLoading || !file}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-semibold"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
            </svg>
            Analyzing...
          </span>
        ) : 'Analyze Now'}
      </button>

      {analysis && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg mb-2">ATS Score</p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className={`text-xl font-bold ${analysis.atsScore >= 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {analysis.atsScore}%
                  </span>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${analysis.atsScore}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${analysis.atsScore >= 85 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-lg mb-2">Keyword Match</p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">{analysis.keywordMatch}%</span>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${analysis.keywordMatch}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold mt-6 text-gray-700">Suggestions</h4>
          <ul className="list-disc pl-5 mt-2 mb-4">
            {analysis.suggestions.map((sug, idx) => (
              <li key={idx} className="text-gray-600 mb-2">{sug}</li>
            ))}
          </ul>
          
          <h4 className="text-lg font-semibold mt-6 text-gray-700">Missing Skills</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {analysis.missingSkills.length > 0 ? (
              analysis.missingSkills.map((skill, idx) => (
                skill.trim() && <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">{skill.trim()}</span>
              ))
            ) : (
              <p className="text-gray-600">No missing skills detected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyzeResumePage;