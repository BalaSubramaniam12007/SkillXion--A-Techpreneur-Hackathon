import React, { useState } from "react";
import MockInterview from "./MockInterview";
import Header from "../../../pages/Header";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Zap, Rocket } from "lucide-react";

const categoryCards = [
  { value: "aptitude", label: "Aptitude Test", bgImage: "https://images.unsplash.com/photo-1456513080510-7bf3d7117e95?q=80&w=2070&auto=format&fit=crop" },
  { value: "logic", label: "Logical Reasoning", bgImage: "https://images.unsplash.com/photo-1509228627918-8f8c7e5c7b8e?q=80&w=2070&auto=format&fit=crop" },
  { value: "python", label: "Python Programming", bgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop" },
  { value: "javascript", label: "JavaScript", bgImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop" },
  { value: "datastructures", label: "Data Structures & Algorithms", bgImage: "https://images.unsplash.com/photo-1509228627918-8f8c7e5c7b8e?q=80&w=2070&auto=format&fit=crop" }, // Repeated, consider a unique image
  { value: "sql", label: "Database & SQL", bgImage: "https://images.unsplash.com/photo-1551288049-b5f3c2b3a6f8?q=80&w=2070&auto=format&fit=crop" },
  { value: "networking", label: "Computer Networking", bgImage: "https://images.unsplash.com/photo-1558499932-9601a0d2b1f9?q=80&w=2070&auto=format&fit=crop" },
  { value: "operatingsystems", label: "Operating Systems", bgImage: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2070&auto=format&fit=crop" }
];

const difficultyLevels = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
];

const MockInterviewPage = () => {
  const [category, setCategory] = useState("");
  const [examType, setExamType] = useState("");
  const [level, setLevel] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(60);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    const genAI = new GoogleGenerativeAI("AIzaSyBT6CywB43tR0XQMV6u4u6E1yr5ZnS7IjA");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const prompt = `
        Generate ${numQuestions} multiple-choice ${category} questions for ${examType || "general assessment"} at ${level} difficulty.
        Return the response in strict JSON format with the following structure for each question:
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
        Provide only the JSON content, without any additional text or markdown.
      `;
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();

      let jsonString = responseText.replace(/```json\s*|\s*```/g, "").trim();
      const parsedQuestions = JSON.parse(jsonString);

      if (!Array.isArray(parsedQuestions) || !parsedQuestions.every(q => 
        q.question && Array.isArray(q.options) && q.correctAnswer
      )) {
        throw new Error("Invalid question format received from API");
      }

      setQuestions(parsedQuestions);
      setShowResults(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (catValue) => {
    setCategory(catValue);
    fetchQuestions();
  };

  const handleRestart = () => {
    setQuestions([]);
    setScore(null);
    setShowResults(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header isForDashboard={true} />
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <Card className="shadow-2xl border-t-4 border-t-indigo-600 rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
            <CardHeader className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <CardTitle className="text-4xl font-extrabold text-white flex items-center justify-center gap-3">
                <Rocket className="w-8 h-8 animate-pulse" />
                Interactive Mock Interview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white rounded-b-xl">
              {!questions.length && !loading ? (
                <div className="flex flex-col items-center gap-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Choose Your Challenge</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {categoryCards.map((cat) => (
                      <div
                        key={cat.value}
                        className="relative h-48 rounded-lg overflow-hidden cursor-pointer shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        style={{ backgroundImage: `url(${cat.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        onClick={() => handleCardClick(cat.value)}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-20">
                          <span className="text-white text-xl font-bold text-center px-4">{cat.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Exam Type (Optional)</label>
                      <Input
                        type="text"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        placeholder="e.g., GATE, Company Interview"
                        className="w-full border-2 border-indigo-200 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Difficulty Level</label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full border-2 border-indigo-200 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300 p-2 rounded-md"
                      >
                        {difficultyLevels.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>
                            {lvl.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Number of Questions</label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                        className="w-full border-2 border-indigo-200 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                      />
                    </div>
                  </div>
                </div>
              ) : loading ? (
                <div className="p-10 space-y-8">
                  <h3 className="text-2xl font-semibold text-center text-indigo-600 mb-8 animate-pulse">
                    Preparing Your Challenge...
                  </h3>
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-8 w-3/4 mx-auto rounded-full" />
                        <div className="pl-6 space-y-3">
                          {[...Array(4)].map((_, j) => (
                            <Skeleton key={j} className="h-5 w-2/3 mx-auto rounded-full" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="text-center p-10">
                  <p className="text-red-600 text-lg mb-6 font-medium animate-pulse">{error}</p>
                  <Button 
                    onClick={handleRestart} 
                    variant="outline" 
                    className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg rounded-full transition-all duration-200 hover:border-indigo-600"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <MockInterview 
                  questions={questions} 
                  setScore={setScore} 
                  timePerQuestion={timePerQuestion}
                  onComplete={() => setShowResults(true)}
                />
              )}

              {showResults && score !== null && (
                <div className="mt-10 text-center p-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 animate-pulse opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-300 to-transparent" />
                  <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                      <Award className="w-10 h-10 animate-spin-slow" />
                      {score >= 70 ? "Excellent Work!" : score >= 50 ? "Good Effort!" : "Keep Practicing!"}
                    </h2>
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="3"
                          strokeDasharray={`${score}, 100`}
                          className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" className="stop-color-indigo-600" />
                            <stop offset="100%" className="stop-color-purple-600" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-indigo-600 animate-pulse">{score}%</span>
                      </div>
                    </div>
                    <p className="mb-8 text-gray-700 text-lg animate-fade-in">
                      {score >= 70
                        ? "You're doing great! Keep up the excellent work."
                        : score >= 50
                        ? "You're on the right track. With more practice, you'll excel!"
                        : "Don't worry! Learning takes time. Keep practicing and you'll improve."}
                    </p>
                    <div className="flex justify-center gap-6">
                      <Button 
                        onClick={handleRestart} 
                        variant="outline" 
                        className="px-8 py-6 text-lg border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200 hover:scale-105"
                      >
                        Start New Challenge
                      </Button>
                      <Button 
                        onClick={() => setQuestions([])} 
                        className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full transition-all duration-200 hover:scale-105"
                      >
                        Change Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MockInterviewPage;