import { AnalysisResult } from "./services/geminiService";

export interface AppSettings {
  theme: 'dark' | 'light';
  targetRole: string;
  analysisMode: 'basic' | 'advanced';
  apiKey: string;
  displayPreferences: {
    showAtsBreakdown: boolean;
    showSuggestions: boolean;
    showSkillGap: boolean;
  };
  userProfile: {
    name: string;
    email: string;
  };
}

export interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  atsScore: number;
  role: string;
  analysis: AnalysisResult;
}
