import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const OptionsPanel = ({ question, selectedAnswer, onAnswer }) => {
  // Guard against missing options
  if (!question.options || !Array.isArray(question.options)) {
    return <p className="text-red-500">Invalid options format</p>;
  }
  
  return (
    <div className="space-y-4">
      <RadioGroup value={selectedAnswer || ""} onValueChange={onAnswer}>
        {question.options.map((option, idx) => (
          <div key={idx} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
            <RadioGroupItem value={option} id={`option-${idx}`} />
            <Label htmlFor={`option-${idx}`} className="flex-grow cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default OptionsPanel;