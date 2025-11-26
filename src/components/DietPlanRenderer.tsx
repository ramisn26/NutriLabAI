import React, { useState, useMemo } from 'react';
import { DietPlan, Meal, UserPreferences, JsPDFInstance, Html2CanvasFunction, DailyPlan } from '../types';
import { ChefHat, ShoppingBag, ChevronRight, Coffee, Sun, Moon, Apple, Clock, Flame, Share2, Check, Filter, RefreshCw, Download, Loader2, Activity, X, ClipboardList, CheckCircle2, Languages, Droplet, Dumbbell, Sprout, Zap } from 'lucide-react';

interface Props {
    plan: DietPlan;
    onUpdatePreferences: (prefs: UserPreferences) => void;
    isUpdating?: boolean;
}

// Translation Dictionary
const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    'Personalized Nutrition': 'Personalized Nutrition Summary',
    'Goal': 'Goal',
    'Breakfast': 'Breakfast',
    'Lunch': 'Lunch',
    'Dinner': 'Dinner',
    'Snacks': 'Snacks',
    'Grocery List': 'Grocery List',
    'Daily Goal': 'Daily Goal',
    'All 7 Days': 'All 7 Days',
    'Download PDF': 'Download PDF',
    'Share Plan': 'Share Plan',
    'Weekly Shopping Guide': 'Weekly Shopping Guide',
    'Items are approximate': 'Items are approximate based on the meal plan. Check pantry before buying.',
    'Page': 'Page',
    'of': 'of',
    'For 7-Day Plan': 'For 7-Day Plan',
    'Protein': 'Protein',
    'Fiber': 'Fiber',
    'Iron': 'Iron',
    'Vit D': 'Vit D'
  },
  Hindi: {
    'Personalized Nutrition': 'व्यक्तिगत पोषण सारांश',
    'Goal': 'लक्ष्य',
    'Breakfast': 'नाश्ता',
    'Lunch': 'दोपहर का भोजन',
    'Dinner': 'रात का खाना',
    'Snacks': 'नाश्ता/स्नैक्स',
    'Grocery List': 'किराने की सूची',
    'Daily Goal': 'दैनिक लक्ष्य',
    'All 7 Days': 'सभी 7 दिन',
    'Download PDF': 'PDF डाउनलोड करें',
    'Share Plan': 'योजना साझा करें',
    'Weekly Shopping Guide': 'साप्ताहिक खरीदारी गाइड',
    'Items are approximate': 'सामान अनुमानित हैं। खरीदने से पहले पेंट्री की जाँच करें।',
    'Page': 'पृष्ठ',
    'of': 'का',
    'For 7-Day Plan': '7-दिवसीय योजना के लिए',
    'Protein': 'प्रोटीन',
    'Fiber': 'फाइबर',
    'Iron': 'आयरन',
    'Vit D': 'विटामिन डी'
  },
  Tamil: {
    'Personalized Nutrition': 'தனிப்பயனாக்கப்பட்ட ஊட்டச்சத்து சுருக்கம்',
    'Goal': 'இலக்கு',
    'Breakfast': 'காலை உணவு',
    'Lunch': 'மதிய உணவு',
    'Dinner': 'இரவு உணவு',
    'Snacks': 'சிற்றுண்டி',
    'Grocery List': 'மளிகை பட்டியல்',
    'Daily Goal': 'தினசரி இலக்கு',
    'All 7 Days': 'அனைத்து 7 நாட்கள்',
    'Download PDF': 'PDF பதிவிறக்கம்',
    'Share Plan': 'பகிர்',
    'Weekly Shopping Guide': 'வாராந்திர ஷாப்பிங் வழிகாட்டி',
    'Items are approximate': 'பொருட்கள் தோராயமானவை. வாங்குவதற்கு முன் சரிபார்க்கவும்.',
    'Page': 'பக்கம்',
    'of': 'இல்',
    'For 7-Day Plan': '7 நாள் திட்டத்திற்கு',
    'Protein': 'புரதம்',
    'Fiber': 'நார்ச்சத்து',
    'Iron': 'இரும்புச்சத்து',
    'Vit D': 'விட்டமின் டி'
  },
  Telugu: {
    'Personalized Nutrition': 'వ్యక్తిగతీకరించిన పోషకాహార సారాంశం',
    'Goal': 'లక్ష్యం',
    'Breakfast': 'అల్పాహారం',
    'Lunch': 'మధ్యాహ్న భోజనం',
    'Dinner': 'రాత్రి భోజనం',
    'Snacks': 'స్నాక్స్',
    'Grocery List': 'కిరాణా జాబితా',
    'Daily Goal': 'రోజువారీ లక్ష్యం',
    'All 7 Days': 'అన్ని 7 రోజులు',
    'Download PDF': 'PDF డౌన్‌లోడ్',
    'Share Plan': 'భాగస్వామ్యం చేయండి',
    'Weekly Shopping Guide': 'వారపు షాపింగ్ గైడ్',
    'Items are approximate': 'అంశాలు సుమారుగా ఉన్నాయి. కొనుగోలు చేయడానికి ముందు సరిచూసుకోండి.',
    'Page': 'పేజీ',
    'of': 'లో',
    'For 7-Day Plan': '7-రోజుల ప్రణాళిక కోసం',
    'Protein': 'ప్రోటీన్',
    'Fiber': 'ఫైబర్',
    'Iron': 'ఐరన్',
    'Vit D': 'విటమిన్ డి'
  },
  Malayalam: {
    'Personalized Nutrition': 'വ്യക്തിഗത പോഷകാഹാര ചുരുക്കം',
    'Goal': 'ലക്ഷ്യം',
    'Breakfast': 'പ്രഭാതഭക്ഷണം',
    'Lunch': 'ഉച്ചഭക്ഷണം',
    'Dinner': 'അത്താഴം',
    'Snacks': 'ലഘുഭക്ഷണം',
    'Grocery List': 'പലചരക്ക് പട്ടിക',
    'Daily Goal': 'പ്രതിദിന ലക്ഷ്യം',
    'All 7 Days': 'എല്ലാ 7 ദിവസവും',
    'Download PDF': 'PDF ഡൗൺലോഡ്',
    'Share Plan': 'പ്ലാൻ പങ്കിടുക',
    'Weekly Shopping Guide': 'പ്രതിവാര ഷോപ്പിംഗ് ഗൈഡ്',
    'Items are approximate': 'ഇനങ്ങൾ ഏകദേശമാണ്. വാങ്ങുന്നതിന് മുമ്പ് പരിശോധിക്കുക.',
    'Page': 'പേജ്',
    'of': 'ൽ',
    'For 7-Day Plan': '7 ദിവസത്തെ പ്ലാനിനായി',
    'Protein': 'പ്രോട്ടീൻ',
    'Fiber': 'നാരുകൾ',
    'Iron': 'ഇരുമ്പ്',
    'Vit D': 'വിറ്റാമിൻ ഡി'
  },
  Kannada: {
    'Personalized Nutrition': 'ವೈಯಕ್ತಿಕ ಪೋಷಣೆಯ ಸಾರಾಂಶ',
    'Goal': 'ಗುರಿ',
    'Breakfast': 'ತಿಂಡಿ',
    'Lunch': 'ಊಟ',
    'Dinner': 'ರಾತ್ರಿ ಊಟ',
    'Snacks': 'ತಿನಿಸುಗಳು',
    'Grocery List': 'ದಿನಸಿ ಪಟ್ಟಿ',
    'Daily Goal': 'ದೈನಂದಿನ ಗುರಿ',
    'All 7 Days': 'ಎಲ್ಲಾ 7 ದಿನಗಳು',
    'Download PDF': 'PDF ಡೌನ್‌ಲೋಡ್',
    'Share Plan': 'ಹಂಚಿಕೊಳ್ಳಿ',
    'Weekly Shopping Guide': 'ಸಾಪ್ತಾಹಿಕ ಶಾಪಿಂಗ್ ಮಾರ್ಗದರ್ಶಿ',
    'Items are approximate': 'ಅಂಶಗಳು ಅಂದಾಜು. ಖರೀದಿಸುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ.',
    'Page': 'ಪುಟ',
    'of': 'ರ',
    'For 7-Day Plan': '7 ದಿನಗಳ ಯೋಜನೆಗಾಗಿ',
    'Protein': 'ಪ್ರೋಟೀನ್',
    'Fiber': 'ನಾರಿನಂಶ',
    'Iron': 'ಕಬ್ಬಿಣಾಂಶ',
    'Vit D': 'ವಿಟಮಿನ್ ಡಿ'
  }
};

export const DietPlanRenderer: React.FC<Props> = ({ plan, onUpdatePreferences, isUpdating = false }) => {
  const [activeDay, setActiveDay] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadAllDays, setDownloadAllDays] = useState(false);
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [dietType, setDietType] = useState<UserPreferences['dietType']>('Veg');
  const [cuisine, setCuisine] = useState<UserPreferences['cuisine']>('Mixed');
  const [language, setLanguage] = useState<UserPreferences['language']>('English');

  // Translation Helper
  const t = (key: string) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['English'][key] || key;
  };

  // Group shopping list by category
  const groupedShoppingList = useMemo((): Record<string, string[]> => {
    if (!plan?.shoppingList) return {};
    return plan.shoppingList.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item.item);
      return acc;
    }, {} as Record<string, string[]>)
  }, [plan?.shoppingList]);

  // Safety check: Ensure weeklyPlan exists and has items
  if (!plan || !plan.weeklyPlan || plan.weeklyPlan.length === 0) {
    return (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-500">Diet plan details are currently unavailable.</p>
        </div>
    );
  }

  const currentDayPlan = plan.weeklyPlan[activeDay];

  // Safety check: Ensure current day exists
  if (!currentDayPlan) {
     return null;
  }

  const handleShare = () => {
    // Simulate generating a unique, shareable URL
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const day = currentDayPlan.day;
    const shareUrl = `https://nutrilab.ai/share/${uniqueId}?day=${day}`;
    
    const shareText = `Check out my personalized ${day} meal plan on NutriLab AI! 🥗\n${shareUrl}`;

    navigator.clipboard.writeText(shareText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      // Dynamic imports to prevent load-time crashes if modules have issues
      // @ts-ignore
      const jsPDFModule = await import('jspdf');
      // @ts-ignore
      const html2canvasModule = await import('html2canvas');

      // Handle both default and named exports for jsPDF
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      // Handle both default and named exports for html2canvas
      const html2canvas = html2canvasModule.default || html2canvasModule;

      if (!jsPDF || !html2canvas) {
        throw new Error("Failed to load PDF libraries");
      }

      // @ts-ignore
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Select elements to print based on checkbox
      // If downloadAllDays is true, we select all .pdf-page-content (Days + Grocery List)
      // If false, we only select the active day ID
      const pagesToPrint = downloadAllDays 
          ? Array.from(document.querySelectorAll('.pdf-page-content'))
          : [document.getElementById(`pdf-page-${activeDay}`)];

      if (!pagesToPrint.length || !pagesToPrint[0]) {
        throw new Error("PDF Content not found");
      }

      for (let i = 0; i < pagesToPrint.length; i++) {
        const page = pagesToPrint[i] as HTMLElement;
        
        const canvas = await html2canvas(page, {
          scale: 2, // Improves resolution
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        // @ts-ignore
        const imgProps = pdf.getImageProperties(imgData);
        // @ts-ignore
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) {
          // @ts-ignore
          pdf.addPage();
        }
        
        // @ts-ignore
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      const fileName = downloadAllDays 
        ? 'NutriLab_Weekly_Diet_Plan.pdf' 
        : `NutriLab_DietPlan_${plan.weeklyPlan[activeDay].day}.pdf`;
      
      // @ts-ignore
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpdateClick = () => {
    onUpdatePreferences({ dietType, cuisine, language });
  };

  const MealCard: React.FC<{ title: string; meal: Meal; icon: React.ReactNode; time: string; calories?: string }> = ({ title, meal, icon, time, calories }) => (
    <div className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 relative overflow-hidden break-inside-avoid">
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-teal-50 p-1.5 rounded-full">
           <Flame className="h-4 w-4 text-teal-600" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
          {icon}
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> {time}</span>
        </div>
      </div>
      
      <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-teal-700 transition-colors">{meal?.name || "Meal Info Unavailable"}</h4>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">{meal?.description || "No description provided."}</p>
      
      {/* Nutrient Breakdown */}
      {meal?.nutritionalInfo && (
          <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
             <div className="text-center">
                 <span className="block text-[10px] text-slate-400 font-bold uppercase">{t('Protein')}</span>
                 <span className="text-xs font-bold text-slate-700">{meal.nutritionalInfo.protein}</span>
             </div>
             <div className="text-center border-l border-slate-200">
                 <span className="block text-[10px] text-slate-400 font-bold uppercase">{t('Fiber')}</span>
                 <span className="text-xs font-bold text-slate-700">{meal.nutritionalInfo.fiber}</span>
             </div>
             <div className="text-center border-l border-slate-200">
                 <span className="block text-[10px] text-slate-400 font-bold uppercase">{t('Iron')}</span>
                 <span className="text-xs font-bold text-slate-700">{meal.nutritionalInfo.iron}</span>
             </div>
             <div className="text-center border-l border-slate-200">
                 <span className="block text-[10px] text-slate-400 font-bold uppercase">{t('Vit D')}</span>
                 <span className="text-xs font-bold text-slate-700">{meal.nutritionalInfo.vitaminD}</span>
             </div>
          </div>
      )}

      <div className="flex flex-wrap gap-2">
        {meal?.tags?.map((tag, i) => (
          <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 group-hover:border-teal-100 group-hover:text-teal-600 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up">
      {/* Overview Header */}
      <div className="p-8 bg-gradient-to-r from-teal-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
               <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat className="h-6 w-6 text-teal-400" />
                    <span className="text-teal-400 font-bold uppercase tracking-widest text-sm">{t('Personalized Nutrition')}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">7-Day Recovery Plan</h2>
                  <p className="text-slate-300 max-w-2xl text-lg leading-relaxed">{plan.overview}</p>
               </div>
               
               <div className="hidden md:block bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                 <div className="text-center">
                   <span className="block text-3xl font-bold text-white">7</span>
                   <span className="text-xs text-teal-200 uppercase font-bold">Days</span>
                 </div>
               </div>
           </div>

           {/* Preference Controls */}
           <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center animate-fade-in">
             <div className="flex items-center gap-2 text-teal-200 font-medium text-sm">
               <Filter className="h-4 w-4" />
               Customize:
             </div>
             
             <div className="flex flex-wrap gap-3 flex-1 w-full sm:w-auto">
                 <select 
                   value={dietType}
                   onChange={(e) => setDietType(e.target.value as any)}
                   className="bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[120px]"
                 >
                   <option value="Veg">Vegetarian</option>
                   <option value="Non-Veg">Non-Vegetarian</option>
                   <option value="Eggetarian">Eggetarian</option>
                   <option value="Vegan">Vegan</option>
                 </select>

                 <select 
                   value={cuisine}
                   onChange={(e) => setCuisine(e.target.value as any)}
                   className="bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[140px]"
                 >
                   <option value="Mixed">Mixed Indian</option>
                   <option value="North Indian">North Indian</option>
                   <option value="South Indian">South Indian</option>
                   <option value="Gujarati">Gujarati</option>
                   <option value="East Indian">East Indian</option>
                   <option value="West Indian">West Indian</option>
                 </select>

                 <div className="relative">
                   <Languages className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                   <select 
                     value={language}
                     onChange={(e) => setLanguage(e.target.value as any)}
                     className="bg-slate-800 text-white border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[130px]"
                   >
                     <option value="English">English</option>
                     <option value="Tamil">Tamil</option>
                     <option value="Hindi">Hindi</option>
                     <option value="Telugu">Telugu</option>
                     <option value="Malayalam">Malayalam</option>
                     <option value="Kannada">Kannada</option>
                   </select>
                 </div>
             </div>

             <button 
               onClick={handleUpdateClick}
               disabled={isUpdating}
               className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20"
             >
               <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
               {isUpdating ? 'Updating...' : 'Regenerate Plan'}
             </button>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[700px]">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 bg-slate-50/80 border-r border-slate-200 p-4 flex flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2 hidden lg:block">Schedule</span>
          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 min-w-max lg:min-w-0">
            {plan.weeklyPlan.map((dayPlan, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`group relative flex items-center w-full lg:w-auto p-4 rounded-xl text-left transition-all duration-300 ${
                  activeDay === idx
                    ? 'bg-white shadow-md ring-1 ring-slate-200'
                    : 'hover:bg-white/60 hover:shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 transition-colors ${
                  activeDay === idx ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <span className={`block font-bold text-sm ${activeDay === idx ? 'text-slate-900' : 'text-slate-500'}`}>{dayPlan.day}</span>
                  <span className="text-xs text-slate-400 font-medium block truncate max-w-[120px]">{dayPlan.focus}</span>
                </div>
                {activeDay === idx && <ChevronRight className="h-4 w-4 ml-auto text-teal-600 hidden lg:block" />}
              </button>
            ))}
          </div>
          
          <div className="mt-auto pt-6 hidden lg:block">
             <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-3 flex items-center text-sm">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {t('Grocery List')}
                </h4>
                <div className="space-y-2">
                  {plan.shoppingList && plan.shoppingList.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-indigo-800 bg-white/60 px-2 py-1.5 rounded-md">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                      {item.item}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowGroceryModal(true)}
                  className="w-full mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1"
                >
                   View Full List <ChevronRight className="h-3 w-3" />
                </button>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-10 bg-white" id="daily-meal-plan">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
             <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{currentDayPlan.day}</h3>
                <p className="text-slate-500">{t('Daily Goal')}: <span className="font-medium text-teal-600">{currentDayPlan.focus}</span></p>
             </div>
             
             <div className="flex flex-wrap items-center gap-3">
                 {/* Download Options */}
                 <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                    <input 
                      type="checkbox" 
                      id="download-all" 
                      checked={downloadAllDays} 
                      onChange={(e) => setDownloadAllDays(e.target.checked)} 
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="download-all" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                      {t('All 7 Days')}
                    </label>
                 </div>

                 <button 
                   onClick={handleDownloadPDF}
                   disabled={isDownloading}
                   className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                   <span className="hidden sm:inline">{isDownloading ? 'Generating...' : t('Download PDF')}</span>
                 </button>

                 <button 
                  onClick={handleShare}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-95 ${
                    isCopied 
                    ? 'bg-green-100 text-green-700 shadow-none' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600 hover:shadow-md'
                  }`}
                 >
                   {isCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                   <span className="hidden sm:inline">{isCopied ? 'Link Copied!' : t('Share Plan')}</span>
                 </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <MealCard 
                title={t('Breakfast')}
                time="8:00 AM"
                meal={currentDayPlan.breakfast} 
                icon={<Coffee className="h-5 w-5" />} 
             />
             <MealCard 
                title={t('Lunch')}
                time="1:00 PM"
                meal={currentDayPlan.lunch} 
                icon={<Sun className="h-5 w-5" />} 
             />
             <MealCard 
                title={t('Dinner')}
                time="8:00 PM"
                meal={currentDayPlan.dinner} 
                icon={<Moon className="h-5 w-5" />} 
             />
             
             {/* Snacks Section */}
             <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 relative overflow-hidden break-inside-avoid">
                <div className="flex items-center gap-2 mb-4">
                   <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                     <Apple className="h-5 w-5" />
                   </div>
                   <div>
                      <span className="text-xs font-bold text-amber-600/60 uppercase tracking-wider block">{t('Snacks')}</span>
                      <span className="text-xs text-amber-600/60 font-medium">11:00 AM & 5:00 PM</span>
                   </div>
                </div>
                <div className="space-y-4 relative z-10">
                   {currentDayPlan.snacks && currentDayPlan.snacks.map((snack, idx) => (
                     <div key={idx} className="bg-white/60 p-3 rounded-xl backdrop-blur-sm">
                       <h4 className="font-bold text-slate-800 text-sm">{snack.name}</h4>
                       <p className="text-xs text-slate-600 mt-1">{snack.description}</p>
                       {snack.nutritionalInfo && (
                            <div className="flex gap-3 mt-2 text-[10px] font-bold text-slate-500 uppercase">
                                <span>{t('Protein')}: {snack.nutritionalInfo.protein}</span>
                                <span>{t('Fiber')}: {snack.nutritionalInfo.fiber}</span>
                            </div>
                       )}
                     </div>
                   ))}
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-200 rounded-full blur-2xl opacity-20"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Grocery List Modal */}
      {showGroceryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-0 max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2.5 rounded-xl">
                            <ShoppingBag className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{t('Weekly Shopping Guide')}</h3>
                            <p className="text-sm text-slate-500">Based on your personalized plan</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowGroceryModal(false)}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="grid sm:grid-cols-2 gap-6">
                        {Object.entries(groupedShoppingList).map(([category, items]) => (
                            <div key={category} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    {category}
                                </h4>
                                <ul className="space-y-3">
                                    {(items as string[]).map((item, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-slate-600">
                                            <CheckCircle2 className="h-4 w-4 text-slate-300 mr-2 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                    <p className="text-xs text-slate-400">{t('Items are approximate')}</p>
                </div>
            </div>
        </div>
      )}

      {/* Hidden Container for PDF Generation - Formatted for A4 */}
      <div style={{ position: 'absolute', top: -10000, left: -10000 }}>
         {/* 1. Daily Plan Pages */}
         {plan.weeklyPlan.map((dayPlan, index) => (
             <div key={index} id={`pdf-page-${index}`} className="pdf-page-content w-[794px] min-h-[1123px] bg-white p-12 relative flex flex-col font-sans">
                 {/* PDF Header */}
                 <div className="flex justify-between items-center border-b-2 border-teal-500 pb-6 mb-8">
                      <div className="flex items-center gap-3">
                         <div className="bg-teal-600 p-2.5 rounded-xl">
                             <Activity className="h-8 w-8 text-white" />
                         </div>
                         <div>
                             <h1 className="text-3xl font-bold text-slate-900 leading-none">NutriLab<span className="text-teal-600">AI</span></h1>
                             <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Personalized Nutrition Engine</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-bold text-slate-900">7-Day Personalized Plan</p>
                         <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
                      </div>
                 </div>

                 {/* Page Content */}
                 <div className="flex-1">
                      {/* ADDED: Overview Section on First Page */}
                      {index === 0 && (
                          <div className="mb-8 p-6 bg-slate-50 border-l-4 border-teal-500 rounded-r-xl">
                              <h3 className="text-sm font-bold text-teal-700 uppercase tracking-widest mb-2">
                                  {t('Personalized Nutrition')}
                              </h3>
                              <p className="text-slate-700 text-sm leading-relaxed italic">
                                  "{plan.overview}"
                              </p>
                          </div>
                      )}

                      <div className="bg-teal-50 rounded-2xl p-6 mb-8 border border-teal-100">
                         <div className="flex items-center justify-between">
                             <h2 className="text-3xl font-bold text-teal-800">{dayPlan.day}</h2>
                             <span className="px-4 py-1.5 bg-white rounded-full text-teal-700 font-bold text-sm shadow-sm border border-teal-100">
                                {t('Goal')}: {dayPlan.focus}
                             </span>
                         </div>
                      </div>
                      
                      <div className="space-y-6">
                         {/* PDF Meal Cards - Simplified style for print */}
                         {/* Breakfast */}
                         <div className="flex gap-6">
                            <div className="w-32 pt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('Breakfast')}</span>
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> 8:00 AM</span>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{dayPlan.breakfast?.name}</h3>
                                <p className="text-slate-600 text-sm mb-3">{dayPlan.breakfast?.description}</p>
                                {dayPlan.breakfast?.nutritionalInfo && (
                                    <div className="flex gap-4 text-xs font-bold text-slate-500 border-t border-slate-200 pt-2">
                                        <span>{t('Protein')}: {dayPlan.breakfast.nutritionalInfo.protein}</span>
                                        <span>{t('Iron')}: {dayPlan.breakfast.nutritionalInfo.iron}</span>
                                    </div>
                                )}
                            </div>
                         </div>

                         {/* Lunch */}
                         <div className="flex gap-6">
                            <div className="w-32 pt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('Lunch')}</span>
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> 1:00 PM</span>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{dayPlan.lunch?.name}</h3>
                                <p className="text-slate-600 text-sm mb-3">{dayPlan.lunch?.description}</p>
                                {dayPlan.lunch?.nutritionalInfo && (
                                    <div className="flex gap-4 text-xs font-bold text-slate-500 border-t border-slate-200 pt-2">
                                        <span>{t('Protein')}: {dayPlan.lunch.nutritionalInfo.protein}</span>
                                        <span>{t('Iron')}: {dayPlan.lunch.nutritionalInfo.iron}</span>
                                    </div>
                                )}
                            </div>
                         </div>

                         {/* Dinner */}
                         <div className="flex gap-6">
                            <div className="w-32 pt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('Dinner')}</span>
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> 8:00 PM</span>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{dayPlan.dinner?.name}</h3>
                                <p className="text-slate-600 text-sm mb-3">{dayPlan.dinner?.description}</p>
                                {dayPlan.dinner?.nutritionalInfo && (
                                    <div className="flex gap-4 text-xs font-bold text-slate-500 border-t border-slate-200 pt-2">
                                        <span>{t('Protein')}: {dayPlan.dinner.nutritionalInfo.protein}</span>
                                        <span>{t('Iron')}: {dayPlan.dinner.nutritionalInfo.iron}</span>
                                    </div>
                                )}
                            </div>
                         </div>

                         {/* Snacks */}
                         <div className="flex gap-6">
                            <div className="w-32 pt-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('Snacks')}</span>
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> 11 & 5</span>
                            </div>
                            <div className="flex-1 bg-amber-50 rounded-xl p-5 border border-amber-100">
                                {(dayPlan.snacks || []).map((snack, sIdx) => (
                                    <div key={sIdx} className="mb-2 last:mb-0">
                                        <h3 className="font-bold text-slate-900 text-sm">{snack.name}</h3>
                                        <p className="text-slate-600 text-xs">{snack.description}</p>
                                    </div>
                                ))}
                            </div>
                         </div>
                      </div>
                 </div>

                 {/* PDF Footer */}
                 <div className="mt-auto pt-8 border-t border-slate-200 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
                         <Activity className="h-4 w-4 text-slate-400" />
                         <span className="font-bold text-slate-400 text-sm">NutriLab AI</span>
                      </div>
                      <p className="text-[10px] text-slate-400 max-w-lg mx-auto">
                         © {new Date().getFullYear()} NutriLab AI. This plan is generated based on biomarkers and is not medical advice. Consult your doctor before making significant dietary changes.
                      </p>
                      <p className="text-sm text-slate-400 mt-2 font-mono">{t('Page')} {index + 1} {t('of')} {plan.weeklyPlan.length + 1}</p>
                 </div>
             </div>
         ))}

         {/* 2. Grocery List Page (Appended to PDF) */}
         <div id="pdf-page-grocery" className="pdf-page-content w-[794px] min-h-[1123px] bg-white p-12 relative flex flex-col font-sans">
             <div className="flex justify-between items-center border-b-2 border-indigo-500 pb-6 mb-8">
                  <div className="flex items-center gap-3">
                     <div className="bg-indigo-600 p-2.5 rounded-xl">
                         <ShoppingBag className="h-8 w-8 text-white" />
                     </div>
                     <div>
                         <h1 className="text-3xl font-bold text-slate-900 leading-none">Grocery<span className="text-indigo-600">List</span></h1>
                         <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">{t('Weekly Shopping Guide')}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-bold text-slate-900">{t('For 7-Day Plan')}</p>
                     <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
                  </div>
             </div>

             <div className="flex-1 bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <div className="grid grid-cols-2 gap-8">
                    {Object.entries(groupedShoppingList).map(([category, items]) => (
                        <div key={category} className="break-inside-avoid">
                            <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                {category}
                            </h4>
                            <ul className="space-y-3">
                                {(items as string[]).map((item, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-slate-600">
                                        <div className="w-4 h-4 border-2 border-slate-300 rounded mr-3"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
             </div>

             <div className="mt-auto pt-8 border-t border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
                     <Activity className="h-4 w-4 text-slate-400" />
                     <span className="font-bold text-slate-400 text-sm">NutriLab AI</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2 font-mono">{t('Page')} {plan.weeklyPlan.length + 1} {t('of')} {plan.weeklyPlan.length + 1}</p>
             </div>
         </div>
      </div>
    </div>
  );
};