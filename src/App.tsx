import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReportUpload } from './components/ReportUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { DietPlanRenderer } from './components/DietPlanRenderer';
import { HowItWorks, ForClinics, Pricing } from './components/StaticPages';
import { AppState, ReportData, DietPlan, UserPreferences } from './types';
import { generateAIAnalysis } from './services/geminiService';
import { ArrowRight, Sparkles, Database, Lock, Play, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState]);

  const handleAnalysisComplete = async (data: ReportData) => {
    setReportData(data);
    setAppState('processing');
    
    // Call AI Service
    const { dietPlan, detailedSummary } = await generateAIAnalysis(data);
    setDietPlan(dietPlan);
    setSummary(detailedSummary);
    setAppState('results');
  };

  const handleUpdatePreferences = async (prefs: UserPreferences) => {
    if (!reportData) return;
    
    setIsUpdatingPlan(true);
    try {
        const { dietPlan: newPlan, detailedSummary: newSummary } = await generateAIAnalysis(reportData, prefs);
        setDietPlan(newPlan);
        setSummary(newSummary);
    } catch (error) {
        console.error("Failed to update plan:", error);
    }
    setIsUpdatingPlan(false);
  };

  const handleReset = () => {
    setAppState('landing');
    setReportData(null);
    setDietPlan(null);
  };

  const handleNavigate = (view: AppState) => {
    setAppState(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <Header onReset={handleReset} onNavigate={handleNavigate} />
      
      <main className="flex-grow w-full pt-20">
        
        {appState === 'landing' && (
          <div className="relative animate-fade-in">
             {/* Hero Background Elements */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-teal-50 to-transparent rounded-[100%] blur-3xl opacity-60"></div>
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-40"></div>
             </div>

             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-32 lg:pb-40 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium mb-8 animate-fade-in-up hover:scale-105 transition-transform cursor-default">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  AI-Powered Nutrition Intelligence
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight animate-fade-in-up delay-100">
                  Turn Blood Reports into <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Actionable Health Plans</span>
                </h1>
                
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
                  Don't just read your lab numbers. Understand them. <br className="hidden md:block" />
                  Upload your report to get a <span className="font-semibold text-slate-800">personalized 7-day Indian meal plan</span> engineered to improve your specific biomarkers in seconds.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up delay-300">
                  <button 
                    onClick={() => setAppState('uploading')}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    Analyze My Report <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setAppState('how-it-works')}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-slate-200 text-lg font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-300"
                  >
                    <Play className="ml-2 h-4 w-4 mr-2 fill-slate-700" /> Watch Demo
                  </button>
                </div>

                {/* Social Proof / Trust Indicators */}
                <div className="mt-20 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto animate-fade-in-up delay-500">
                   <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted Technology Stack</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { icon: <Database className="h-6 w-6 text-indigo-500" />, title: "Lab Agnostic", desc: "Supports Thyrocare, 1mg, Lal PathLabs & more" },
                        { icon: <Sparkles className="h-6 w-6 text-teal-500" />, title: "Clinical AI", desc: "Maps biomarkers to specific nutrients" },
                        { icon: <Lock className="h-6 w-6 text-emerald-500" />, title: "Bank-Grade Privacy", desc: "AES-256 Encryption. No data selling." }
                      ].map((feature, i) => (
                        <div key={i} className="flex flex-col items-center p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 cursor-default">
                           <div className="bg-slate-50 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                           <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                           <p className="text-sm text-slate-500">{feature.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {appState === 'how-it-works' && <HowItWorks onNavigate={handleNavigate} />}
            
            {appState === 'for-clinics' && <ForClinics onNavigate={handleNavigate} />}
            
            {appState === 'pricing' && <Pricing onNavigate={handleNavigate} />}

            {appState === 'uploading' && (
              <div className="flex flex-col items-center pt-10 animate-fade-in">
                <ReportUpload onAnalysisComplete={handleAnalysisComplete} />
              </div>
            )}

            {appState === 'processing' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
                 <div className="relative">
                   <div className="absolute inset-0 bg-teal-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                   <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                     <Sparkles className="h-16 w-16 text-teal-600 animate-[spin_3s_linear_infinite]" />
                   </div>
                 </div>
                 <h2 className="text-3xl font-bold text-slate-900 mt-10 mb-3 tracking-tight">Constructing Diet Matrix</h2>
                 <p className="text-slate-500 max-w-md text-center text-lg">
                   Analyzing <span className="text-teal-600 font-semibold">42 biomarkers</span> and matching against <span className="text-teal-600 font-semibold">Indian food database</span>...
                 </p>
                 
                 <div className="w-80 h-1.5 bg-slate-100 rounded-full mt-10 overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/3 rounded-full"></div>
                 </div>
              </div>
            )}

            {appState === 'results' && reportData && dietPlan && (
              <div className="space-y-12 pb-12 animate-fade-in">
                 <AnalysisDashboard data={reportData} />
                 
                 {/* AI Summary Section - Refined */}
                 <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl p-1 shadow-lg shadow-indigo-200">
                    <div className="bg-white rounded-[22px] p-8 md:p-10">
                      <div className="flex items-start gap-5">
                          <div className="bg-indigo-50 p-3 rounded-2xl flex-shrink-0 hidden md:block">
                             <Sparkles className="h-8 w-8 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                              <Sparkles className="h-5 w-5 text-indigo-600 mr-2 md:hidden" />
                              Clinical Insight
                            </h3>
                            <p className="text-slate-600 leading-8 text-lg">{summary}</p>
                          </div>
                      </div>
                    </div>
                 </div>

                 <DietPlanRenderer 
                    plan={dietPlan} 
                    onUpdatePreferences={handleUpdatePreferences}
                    isUpdating={isUpdatingPlan}
                 />

                 <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-200">
                   <p className="text-slate-500 mb-4">Want to track your progress?</p>
                   <button onClick={handleReset} className="px-6 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                     Upload Another Report
                   </button>
                 </div>
              </div>
            )}
        </div>

      </main>

      <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
         <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
             <Activity className="h-5 w-5" />
             <span className="font-bold">NutriLab AI</span>
           </div>
           <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
             © 2024 NutriLab AI. Not medical advice. The generated plans are recommendations based on biomarkers. Consult a doctor for diagnosis.
           </p>
         </div>
      </footer>
    </div>
  );
};

export default App;