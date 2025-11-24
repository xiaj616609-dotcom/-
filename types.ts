export enum ScaleType {
  PHQ9 = 'PHQ-9', // Depression
  GAD7 = 'GAD-7', // Anxiety
}

export interface Question {
  id: number;
  text: string;
  options: { label: string; value: number }[];
}

export interface AssessmentSchema {
  id: ScaleType;
  title: string;
  description: string;
  questions: Question[];
  severityMap: (score: number) => { level: string; color: string; advice: string };
}

export interface UserSession {
  studentId: string; // Anonymized or optional
  nickname: string;
  agreedToTerms: boolean;
  isAdmin?: boolean;
}

export interface AssessmentResult {
  date: string;
  scaleId: ScaleType;
  score: number;
  maxScore: number;
  severity: string;
  answers: number[]; // Array of values corresponding to question indices
}

export interface AIAnalysis {
  summary: string;
  copingStrategies: string[];
  isCrisis: boolean;
}
