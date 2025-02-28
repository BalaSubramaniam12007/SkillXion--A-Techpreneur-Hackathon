import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MockInterview = ({ questions, setScore, timePerQuestion, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(timePerQuestion);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [review, setReview] = useState(false);
  const [reviewQuestion, setReviewQuestion] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Reset timer when moving to a new question
  useEffect(() => {
    if (!review) {
      setRemainingTime(timePerQuestion);
      setIsTimeOut(false);
    }
  }, [currentQuestion, review, timePerQuestion]);

  // Timer countdown
  useEffect(() => {
    if (review || completed) return;
    
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeOut(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, review, completed]);

  // Auto-move to next question when time is up
  useEffect(() => {
    if (isTimeOut && !review) {
      const timeout = setTimeout(() => {
        handleNext();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isTimeOut]);

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    const score = (correct / questions.length) * 100;
    setScore(score.toFixed(2));
    setCompleted(true);
    if (onComplete) onComplete();
  };

  const startReview = () => {
    setReview(true);
    setReviewQuestion(0);
  };

  const nextReviewQuestion = () => {
    if (reviewQuestion < questions.length - 1) {
      setReviewQuestion(reviewQuestion + 1);
    }
  };

  const prevReviewQuestion = () => {
    if (reviewQuestion > 0) {
      setReviewQuestion(reviewQuestion - 1);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Guard against empty questions array
  if (!questions.length) return <p className="text-center">No questions available.</p>;

  if (completed) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Interview Completed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">You've completed all {questions.length} questions.</p>
          <Button onClick={startReview} className="mt-4">
            Review Your Answers
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (review) {
    const q = questions[reviewQuestion];
    const userAnswer = answers[reviewQuestion];
    const isCorrect = userAnswer === q.correctAnswer;

    return (
      <div className="space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Review: Question {reviewQuestion + 1} of {questions.length}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevReviewQuestion} disabled={reviewQuestion === 0}>
                  <ArrowLeft size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={nextReviewQuestion} disabled={reviewQuestion === questions.length - 1}>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{q.question}</p>
            
            <div className="space-y-2 mt-6">
              {q.options.map((option, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-md border ${
                    option === q.correctAnswer ? 'bg-green-50 border-green-200' :
                    option === userAnswer && option !== q.correctAnswer ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="min-w-5">
                      {option === q.correctAnswer && <CheckCircle size={18} className="text-green-500" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p>{q.explanation || "The correct answer is " + q.correctAnswer}</p>
            </div>

            <div className="mt-4">
              <p className="font-medium">
                Your answer: {userAnswer ? (
                  <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                    {userAnswer} {isCorrect ? "(Correct)" : "(Incorrect)"}
                  </span>
                ) : (
                  <span className="text-gray-400">No answer provided</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <Clock size={16} className={isTimeOut ? "text-red-500" : "text-gray-500"} />
          <span className={`text-sm font-mono ${isTimeOut ? "text-red-500 font-bold" : "text-gray-500"}`}>
            {formatTime(remainingTime)}
          </span>
        </div>
      </div>
      <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Question</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{questions[currentQuestion].question}</p>
              </CardContent>
              <CardFooter className="justify-between border-t pt-4">
                <Button 
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  className={currentQuestion === questions.length - 1 ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                        answers[currentQuestion] === option
                          ? "bg-blue-100 border-blue-300 shadow-sm"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Question navigation */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => jumpToQuestion(idx)}
            className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center
            ${
              idx === currentQuestion
                ? "bg-blue-500 text-white"
                : answers[idx]
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MockInterview;