import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import debounce from 'lodash/debounce'; // Add lodash for debouncing

function CreateResumePage() {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    experience: '',
    education: '',
    skills: ''
  });
  const [template, setTemplate] = useState('modern');
  const [colorScheme, setColorScheme] = useState('blue');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Debounced preview update
  const debouncedSetResumeData = debounce((data) => setResumeData(data), 300);

  const validateForm = () => {
    const newErrors = {};
    if (!resumeData.name.trim()) newErrors.name = 'Name is required';
    if (!resumeData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(resumeData.email)) newErrors.email = 'Invalid email format';
    if (!resumeData.experience.trim()) newErrors.experience = 'Experience is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const newData = { ...resumeData, [e.target.name]: e.target.value };
    debouncedSetResumeData(newData);
    // Immediate error checking
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const downloadPDF = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    const doc = new jsPDF();
    // Enhanced PDF styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(resumeData.name, 20, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(resumeData.email, 20, 30);
    doc.setFont('helvetica', 'bold');
    doc.text('Experience', 20, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(resumeData.experience.split('\n'), 20, 50, { maxWidth: 170 });
    doc.setFont('helvetica', 'bold');
    doc.text('Education', 20, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(resumeData.education.split('\n'), 20, 90, { maxWidth: 170 });
    doc.setFont('helvetica', 'bold');
    doc.text('Skills', 20, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(resumeData.skills.split(',').join(' • '), 20, 130, { maxWidth: 170 });
    doc.save(`${resumeData.name || 'resume'}.pdf`);
    setIsLoading(false);
  };

  const templates = ['modern', 'classic', 'professional', 'creative'];
  const colorSchemes = ['blue', 'green', 'gray', 'purple'];

  const templateStyles = {
    modern: 'border-l-8 border-blue-500 rounded-lg shadow-md',
    classic: 'border-t-4 border-gray-800 shadow-sm',
    professional: 'shadow-xl border border-gray-200 rounded-lg',
    creative: 'border-2 border-dashed border-purple-500 rounded-xl shadow-md'
  };

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-900 border-blue-100',
    green: 'bg-green-50 text-green-900 border-green-100',
    gray: 'bg-gray-100 text-gray-900 border-gray-200',
    purple: 'bg-purple-50 text-purple-900 border-purple-200'
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Your Resume</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <select 
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          >
            {templates.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          
          <select 
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          >
            {colorSchemes.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <input
              name="name"
              placeholder="Full Name"
              value={resumeData.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <input
              name="email"
              placeholder="Email"
              value={resumeData.email}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <textarea
              name="experience"
              placeholder="Work Experience (use new lines for multiple entries)"
              value={resumeData.experience}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>
          
          <textarea
            name="education"
            placeholder="Education (use new lines for multiple entries)"
            value={resumeData.education}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
          
          <textarea
            name="skills"
            placeholder="Skills (comma-separated, e.g., JavaScript, React)"
            value={resumeData.skills}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        <button
          onClick={downloadPDF}
          disabled={isLoading}
          className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
              </svg>
              Generating...
            </span>
          ) : 'Download PDF'}
        </button>
      </div>

      <div className={`hidden md:block w-1/2 p-8 ${colorStyles[colorScheme]} ${templateStyles[template]}`}>
        <h2 className="text-2xl font-bold mb-6">Preview</h2>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800">{resumeData.name || 'Your Name'}</h3>
          <p className="text-gray-600 mb-4">{resumeData.email || 'Your Email'}</p>
          
          <h4 className="text-lg font-semibold mt-4 text-gray-700">Experience</h4>
          <div className="text-gray-600 whitespace-pre-wrap">
            {resumeData.experience ? (
              resumeData.experience.split('\n').map((line, idx) => (
                line.trim() && <p key={idx} className="mb-2">• {line.trim()}</p>
              ))
            ) : (
              <p>Your Experience</p>
            )}
          </div>
          
          <h4 className="text-lg font-semibold mt-4 text-gray-700">Education</h4>
          <div className="text-gray-600 whitespace-pre-wrap">
            {resumeData.education ? (
              resumeData.education.split('\n').map((line, idx) => (
                line.trim() && <p key={idx} className="mb-2">• {line.trim()}</p>
              ))
            ) : (
              <p>Your Education</p>
            )}
          </div>
          
          <h4 className="text-lg font-semibold mt-4 text-gray-700">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills ? (
              resumeData.skills.split(',').map((skill, idx) => (
                skill.trim() && <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">{skill.trim()}</span>
              ))
            ) : (
              <p className="text-gray-600">Your Skills</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateResumePage;