import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { AssessmentSchema, AssessmentResult } from '../types';

interface Props {
  schema: AssessmentSchema;
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
}

const Assessment: React.FC<Props> = ({ schema, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(schema.questions.length).fill(-1));

  const currentQuestion = schema.questions[currentIndex];
  const progress = ((currentIndex + 1) / schema.questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);

    if (currentIndex < schema.questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 250);
    }
  };

  const handleSubmit = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const severityInfo = schema.severityMap(totalScore);
    
    const result: AssessmentResult = {
      date: new Date().toISOString(),
      scaleId: schema.id,
      score: totalScore,
      maxScore: schema.questions.length * 3, // Assuming 0-3 scale
      severity: severityInfo.level,
      answers: answers
    };
    
    onComplete(result);
  };

  const isCompleted = answers.every(a => a !== -1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={onCancel} className="text-slate-500 hover:text-brand-600 mb-6 flex items-center gap-1 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 返回首页
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <span className="text-xs font-bold tracking-wider text-brand-600 uppercase mb-2 block">
              第 {currentIndex + 1} 题 / 共 {schema.questions.length} 题
            </span>
            <h2 className="text-2xl font-medium text-slate-800 leading-relaxed">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentIndex] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                    isSelected 
                      ? 'border-brand-500 bg-brand-50 text-brand-900' 
                      : 'border-slate-100 hover:border-brand-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {isSelected && <Check className="w-5 h-5 text-brand-600" />}
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <button 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors font-medium"
            >
              上一题
            </button>
            
            {currentIndex === schema.questions.length - 1 && (
              <button 
                onClick={handleSubmit}
                disabled={!isCompleted}
                className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2"
              >
                查看结果 <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;