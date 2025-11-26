import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, Loader2, ScanLine, FileCheck } from 'lucide-react';
import { ReportData } from '../types';
import { parseBloodReport } from '../services/geminiService';

// Updated Mock Data to match "Mr K Ramesh" Thyrocare Report
const MOCK_PARSED_DATA: ReportData = {
  patientName: "Mr K Ramesh (39Y/M)",
  date: "14 Sep, 2025",
  labName: "Thyrocare Technologies",
  riskScore: 58, // Lower score due to multiple out-of-range markers (Liver, Iron, Vit D)
  summary: "Report indicates Anemia (Low Iron/Hb), Vitamin D deficiency, and elevated Liver Enzymes (GGT, SGOT).",
  biomarkers: [
    // Glycemic (Low/Normal)
    { name: "HbA1c", value: 4.5, unit: "%", range: "< 5.7", status: "Normal", category: "Glycemic", explanation: "Long-term blood sugar is within excellent range." },
    { name: "Avg Blood Glucose", value: 82, unit: "mg/dL", range: "90 - 120", status: "Low", category: "Glycemic", explanation: "Slightly lower than average estimated glucose." },
    
    // Lipid (Mostly Normal, HDL Ratio Low)
    { name: "Total Cholesterol", value: 96, unit: "mg/dL", range: "< 200", status: "Normal", category: "Lipid", explanation: "Total cholesterol is well within range." },
    { name: "Triglycerides", value: 61, unit: "mg/dL", range: "< 150", status: "Normal", category: "Lipid", explanation: "Triglycerides are normal." },
    { name: "HDL Cholesterol", value: 41, unit: "mg/dL", range: "40 - 60", status: "Normal", category: "Lipid", explanation: "Good cholesterol is borderline but normal." },
    { name: "LDL/HDL Ratio", value: 1.1, unit: "Ratio", range: "1.5 - 3.5", status: "Low", category: "Lipid", explanation: "Ratio is below the reference interval." },

    // Vitamins (Mixed)
    { name: "Vitamin B-12", value: 1631, unit: "pg/mL", range: "197 - 771", status: "Critical High", category: "Vitamin", explanation: "Significantly elevated B12 levels." },
    { name: "25-OH Vitamin D", value: 23.1, unit: "ng/mL", range: "30 - 100", status: "Low", category: "Vitamin", explanation: "Indicates Vitamin D insufficiency/deficiency." },

    // Liver (Elevated)
    { name: "GGT", value: 68.91, unit: "U/L", range: "< 55", status: "High", category: "Liver", explanation: "Elevated GGT suggests liver stress or bile duct issues." },
    { name: "SGOT (AST)", value: 38.36, unit: "U/L", range: "< 35", status: "High", category: "Liver", explanation: "Slightly elevated liver enzyme." },
    { name: "Albumin", value: 2.74, unit: "gm/dL", range: "3.2 - 4.8", status: "Low", category: "Liver", explanation: "Low albumin can indicate liver or kidney concerns." },

    // Iron / Blood (Anemia Indicators)
    { name: "Iron", value: 55.03, unit: "µg/dL", range: "65 - 175", status: "Low", category: "Other", explanation: "Low iron levels." },
    { name: "Hemoglobin", value: 12.5, unit: "g/dL", range: "13.0 - 17.0", status: "Low", category: "Other", explanation: "Below normal range for adult male, indicating mild anemia." },
    { name: "Calcium", value: 8.39, unit: "mg/dL", range: "8.8 - 10.6", status: "Low", category: "Other", explanation: "Hypocalcemia detected." }
  ]
};

interface Props {
  onAnalysisComplete: (data: ReportData) => void;
}

export const ReportUpload: React.FC<Props> = ({ onAnalysisComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'ocr' | 'done'>('idle');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (uploadedFile: File) => {
    setStatus('uploading');
    
    // Simulate Network Upload time
    setTimeout(async () => {
      setStatus('ocr');
      
      try {
        const data = await parseBloodReport(uploadedFile);
        setStatus('done');
        setTimeout(() => {
            onAnalysisComplete(data);
        }, 1000);
      } catch (error) {
        console.error("Analysis failed", error);
        setStatus('idle');
        alert("Failed to analyze report. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div 
        className={`group relative overflow-hidden border-3 border-dashed rounded-3xl p-12 transition-all duration-500 ease-out ${
          isDragging 
            ? 'border-teal-500 bg-teal-50/50 scale-[1.02] shadow-xl' 
            : 'border-slate-200 hover:border-teal-400 bg-white shadow-lg hover:shadow-xl'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="relative z-10 text-center">
          {status === 'idle' && (
            <>
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-teal-50/50 group-hover:scale-110 transition-transform duration-500">
                <Upload className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Upload Blood Report</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">Drag and drop your PDF/JPG report here, or click to browse files.</p>
              
              <label className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 cursor-pointer transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 transform hover:-translate-y-0.5">
                <span>Select Document</span>
                <input type="file" className="hidden" onChange={handleFileInput} accept=".pdf,.jpg,.png,.jpeg" />
              </label>

              <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <span className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full"><CheckCircle className="h-3.5 w-3.5 mr-1.5 text-teal-500" /> PDF / JPG / PNG</span>
                <span className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full"><CheckCircle className="h-3.5 w-3.5 mr-1.5 text-teal-500" /> AES-256 Encryption</span>
              </div>
            </>
          )}

          {status === 'uploading' && (
            <div className="py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-teal-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Securely Uploading</h3>
              <p className="text-slate-500">Encrypting and transmitting your data...</p>
            </div>
          )}

          {status === 'ocr' && (
            <div className="py-12">
              <div className="relative w-24 h-24 mx-auto mb-8">
                 <div className="absolute inset-0 bg-teal-50 rounded-2xl animate-pulse"></div>
                 <ScanLine className="absolute inset-0 m-auto h-12 w-12 text-teal-600 animate-bounce" />
                 <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-lg">
                    <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Extraction in Progress</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Parsing Thyrocare report structure...</p>
            </div>
          )}

          {status === 'done' && (
             <div className="py-12">
               <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-[bounce_1s_infinite]">
                 <CheckCircle className="h-10 w-10 text-green-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Analysis Complete!</h3>
               <p className="text-slate-500">Redirecting to your dashboard...</p>
             </div>
          )}
        </div>
        
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f172a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {status === 'idle' && (
        <div className="mt-8 text-center animate-fade-in-up">
             <button 
                onClick={() => processFile(new File([""], "demo.pdf"))}
                className="inline-flex items-center text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors group"
             >
                <FileCheck className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Try with demo data
             </button>
        </div>
      )}
    </div>
  );
};
