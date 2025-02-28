import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const QuestionPanel = ({ question, current, total, onNext, onPrevious }) => {
  return (
    <Card className="h-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Question {current} of {total}</span>
          <span className="text-sm font-normal text-gray-500">
            {Math.round((current / total) * 100)}% Complete
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg leading-relaxed">{question.question}</p>
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={current === 1}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Previous
        </Button>
        <Button 
          onClick={onNext}
          className={`flex items-center gap-1 ${current === total ? "bg-green-600 hover:bg-green-700" : ""}`}
        >
          {current === total ? "Submit" : "Next"} <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionPanel;