import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ArrowUpRight, RefreshCw } from "lucide-react";

const ConfettiPiece = ({ delay }) => {
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${randomColor}`}
      initial={{
        opacity: 1,
        x: Math.random() * window.innerWidth,
        y: -20,
      }}
      animate={{
        opacity: [1, 1, 0],
        y: window.innerHeight + 20,
        x: Math.random() * window.innerWidth,
        rotate: Math.random() * 720,
      }}
      transition={{
        duration: 2.5,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
};

const ResultsCelebration = ({ score, onRestart, onReview }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000); // Stop after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const getMessage = () => {
    if (score >= 90) return { title: "Outstanding!", message: "You've mastered this!", color: "green" };
    if (score >= 80) return { title: "Excellent!", message: "Great performance!", color: "blue" };
    if (score >= 70) return { title: "Well Done!", message: "Solid effort!", color: "purple" };
    return { title: "Keep Practicing!", message: "You're improving!", color: "yellow" };
  };

  const { title, message, color } = getMessage();

  const colorStyles = {
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-indigo-600",
    purple: "from-purple-500 to-violet-600",
    yellow: "from-yellow-500 to-amber-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <ConfettiPiece key={i} delay={i * 0.05} />
          ))}
        </div>
      )}

      <Card className="relative overflow-hidden shadow-xl border-0 max-w-2xl mx-auto">
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${colorStyles[color]}`} />
        <CardHeader className="pb-4">
          <CardTitle className="text-center">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold flex items-center justify-center gap-2"
            >
              <Award className={`text-${color}-600`} size={28} />
              {title}
            </motion.span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke={`url(#gradient-${color})`}
                  strokeWidth="3"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - score }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                />
                <defs>
                  <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={colorStyles[color].split(" ")[0]} />
                    <stop offset="100%" className={colorStyles[color].split(" ")[1]} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className="text-4xl font-bold"
                >
                  {Math.round(score)}%
                </motion.span>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center text-gray-600 text-lg"
          >
            {message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex justify-center gap-4"
          >
            <Button
              onClick={onReview}
              variant="outline"
              className="flex items-center gap-2 px-6 py-2"
            >
              <ArrowUpRight size={18} />
              Review
            </Button>
            <Button
              onClick={onRestart}
              className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r ${colorStyles[color]}`}
            >
              <RefreshCw size={18} />
              Try Again
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultsCelebration;