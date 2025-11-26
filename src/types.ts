
export interface Biomarker {
  name: string;
  value: number;
  unit: string;
  range: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical High' | 'Critical Low';
  category: 'Glycemic' | 'Lipid' | 'Thyroid' | 'Vitamin' | 'Liver' | 'Other';
  explanation: string;
}

export interface ReportData {
  patientName: string;
  date: string;
  labName: string;
  biomarkers: Biomarker[];
  summary: string;
  riskScore: number; // 0-100, where 100 is healthiest
}

export interface NutritionalInfo {
  protein: string;
  fiber: string;
  iron: string;
  vitaminD: string; // or Calcium contextually
}

export interface Meal {
  name: string;
  description: string;
  calories?: number;
  tags: string[]; // e.g., "High Fiber", "Low GI"
  nutritionalInfo?: NutritionalInfo;
}

export interface DailyPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  focus: string; // e.g., "Sugar Control"
}

export interface DietPlan {
  overview: string;
  weeklyPlan: DailyPlan[];
  shoppingList: { item: string; category: string }[];
}

export interface UserPreferences {
  dietType: 'Veg' | 'Non-Veg' | 'Eggetarian' | 'Vegan';
  cuisine: 'North Indian' | 'South Indian' | 'East Indian' | 'West Indian' | 'Gujarati' | 'Mixed';
  language: 'English' | 'Tamil' | 'Malayalam' | 'Telugu' | 'Kannada' | 'Hindi';
}

export type AppState = 'landing' | 'uploading' | 'processing' | 'results' | 'how-it-works' | 'for-clinics' | 'pricing';

// Interfaces for external libraries loaded via importmap or missing types
export interface JsPDFInstance {
  save(filename: string): void;
  addImage(imageData: string, format: string, x: number, y: number, w: number, h: number): void;
  addPage(): void;
  internal: {
    pageSize: {
      getWidth(): number;
      getHeight(): number;
    };
  };
  getImageProperties(imageData: string): { width: number; height: number; };
}

export type Html2CanvasFunction = (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;