import React from 'react';
import { Upload, Cpu, FileText, CheckCircle, ShieldCheck, ArrowRight, Zap, Building, Stethoscope, Users, BarChart3 } from 'lucide-react';
import { AppState } from '../types';

interface StaticPageProps {
  onNavigate: (view: AppState) => void;
}

export const HowItWorks: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <div className="animate-fade-in py-12">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Science-Backed Nutrition <br/><span className="text-teal-600">Simplified.</span></h2>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
        We bridge the gap between complex diagnostic data and your daily plate in three simple steps.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mb-20 relative">
      {/* Connector Line (Desktop) */}
      <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-teal-100 via-teal-200 to-teal-100 -z-10"></div>
      
      {[
        {
          icon: <Upload className="h-8 w-8 text-white" />,
          title: "1. Upload Report",
          desc: "Upload a PDF or photo of your blood test from any major Indian lab (Thyrocare, Lal PathLabs, etc.)."
        },
        {
          icon: <Cpu className="h-8 w-8 text-white" />,
          title: "2. AI Analysis",
          desc: "Our engine extracts 40+ biomarkers, flags risks (Diabetes, Lipid profile), and calculates a health score."
        },
        {
          icon: <FileText className="h-8 w-8 text-white" />,
          title: "3. Get Your Plan",
          desc: "Receive a 7-day personalized Indian meal plan specifically engineered to optimize your levels."
        }
      ].map((step, idx) => (
        <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center relative hover:-translate-y-2 transition-transform duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-teal-500/20 ring-4 ring-white">
            {step.icon}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
          <p className="text-slate-500 leading-relaxed text-lg">{step.desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-slate-900 rounded-3xl p-12 md:p-20 text-center max-w-5xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white mb-6">Ready to decode your health?</h3>
        <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">Join thousands of users who have taken control of their metabolic health with data-driven nutrition.</p>
        <button 
          onClick={() => onNavigate('uploading')}
          className="inline-flex items-center px-10 py-5 border border-transparent text-xl font-bold rounded-2xl text-slate-900 bg-teal-400 hover:bg-teal-300 shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
        >
          Start Your Health Journey <ArrowRight className="ml-2 h-6 w-6" />
        </button>
      </div>
    </div>
  </div>
);

export const ForClinics: React.FC<StaticPageProps> = () => (
  <div className="animate-fade-in py-12">
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-7xl mx-auto border border-slate-700">
      <div className="grid lg:grid-cols-2 gap-16 p-10 md:p-20 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-900/50 border border-teal-700 text-teal-300 text-xs font-bold mb-8 uppercase tracking-wider">
            <Building className="h-3 w-3 mr-2" /> B2B Partner Program
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Supercharge Your <br/><span className="text-teal-400">Diagnostic Lab</span></h2>
          <p className="text-slate-400 text-xl mb-10 leading-relaxed">
            Don't just give patients a PDF of numbers. Give them a path to health. Embed NutriLab AI into your reports and increase patient retention by 40%.
          </p>
          
          <div className="space-y-6 mb-12">
            {[
              { text: "White-label generated diet plans with your branding", icon: <Zap className="h-5 w-5 text-yellow-400" /> },
              { text: "Increase 'Repeat Test' revenue via progress tracking", icon: <BarChart3 className="h-5 w-5 text-teal-400" /> },
              { text: "Provide value beyond just diagnostics", icon: <Users className="h-5 w-5 text-purple-400" /> }
            ].map((item, i) => (
              <div key={i} className="flex items-center text-slate-200 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="mr-4 p-2 bg-white/10 rounded-lg">{item.icon}</div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <button 
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-teal-500/30" 
            onClick={() => alert("Thank you for your interest! A B2B representative will contact you shortly.")}
          >
            Request Partner Demo
          </button>
        </div>

        <div className="relative">
           {/* Abstract Visual Representation */}
           <div className="absolute inset-0 bg-teal-500 blur-[120px] opacity-20 rounded-full"></div>
           <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                 <div className="h-4 w-24 bg-slate-600 rounded"></div>
                 <div className="h-8 w-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">
                    <Stethoscope className="h-4 w-4" />
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <div className="h-3 w-1/3 bg-slate-600 rounded"></div>
                    <div className="h-3 w-1/4 bg-slate-700 rounded"></div>
                 </div>
                 <div className="h-32 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                       <Zap className="h-6 w-6 text-teal-400" />
                    </div>
                    <p className="text-slate-400 font-mono text-sm mb-2">API Integration Ready</p>
                    <span className="text-xs text-slate-600">JSON / REST / Webhooks</span>
                 </div>
                 <div className="h-3 w-2/3 bg-slate-600 rounded"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

export const Pricing: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <div className="animate-fade-in py-12 max-w-6xl mx-auto px-4">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Simple, Transparent Pricing</h2>
      <p className="text-xl text-slate-600">Start for free. Upgrade for full health transformation.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
      {/* Free Tier */}
      <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic</h3>
        <div className="flex items-baseline mb-6">
          <span className="text-5xl font-extrabold text-slate-900">₹0</span>
          <span className="text-slate-500 ml-2 text-xl">/ month</span>
        </div>
        <p className="text-slate-500 mb-8 text-lg">Perfect for getting your first analysis and understanding where you stand.</p>
        <ul className="space-y-4 mb-10">
          {[
            "1 Report Analysis per month",
            "Basic 3-Day Meal Plan",
            "Biomarker Explanations",
            "Standard Indian Cuisine"
          ].map((feat, i) => (
            <li key={i} className="flex items-center text-slate-700 text-lg">
              <CheckCircle className="h-6 w-6 text-slate-300 mr-3 flex-shrink-0" />
              {feat}
            </li>
          ))}
        </ul>
        <button 
          className="w-full py-4 px-6 border-2 border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors text-lg" 
          onClick={() => onNavigate('uploading')}
        >
          Get Started
        </button>
      </div>

      {/* Pro Tier */}
      <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden text-white transform md:-translate-y-6">
        <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg">
          Most Popular
        </div>
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[80px] opacity-20 -z-10"></div>

        <h3 className="text-2xl font-bold mb-2">Pro Health</h3>
        <div className="flex items-baseline mb-6">
          <span className="text-5xl font-extrabold">₹399</span>
          <span className="text-slate-400 ml-2 text-xl">/ month</span>
        </div>
        <p className="text-slate-300 mb-8 text-lg">For those serious about reversing lifestyle conditions and tracking progress.</p>
        <ul className="space-y-4 mb-10">
          {[
            "Unlimited Report Uploads",
            "Full 7-Day Personalized Plans",
            "WhatsApp Adherence Reminders",
            "Grocery List & Cost Estimator",
            "Condition Specific Modes (PCOS, Diabetes)"
          ].map((feat, i) => (
            <li key={i} className="flex items-center text-lg">
              <CheckCircle className="h-6 w-6 text-teal-400 mr-3 flex-shrink-0" />
              {feat}
            </li>
          ))}
        </ul>
        <button 
          className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/40 transition-all text-lg" 
          onClick={() => alert("Pro features are coming soon! We are currently in Beta.")}
        >
          Upgrade to Pro
        </button>
      </div>
    </div>

    <div className="mt-16 text-center text-slate-500 text-sm flex items-center justify-center opacity-70">
       <ShieldCheck className="h-4 w-4 mr-2" />
       Secure payment via UPI, Cards, Netbanking. Cancel anytime.
    </div>
  </div>
);