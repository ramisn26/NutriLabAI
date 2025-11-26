import React from 'react';
import { ReportData, Biomarker } from '../types';
import { AlertTriangle, TrendingUp, HeartPulse, Activity, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const AnalysisDashboard: React.FC<{ data: ReportData }> = ({ data }) => {
  // Safety check
  if (!data || !data.biomarkers) return null;

  const highRiskItems = data.biomarkers.filter(b => b.status === 'High' || b.status === 'Critical High' || b.status === 'Low' || b.status === 'Critical Low');
  const normalItems = data.biomarkers.filter(b => b.status === 'Normal');

  // Prepare data for Donut Chart (Status Distribution)
  const statusCounts = data.biomarkers.reduce((acc, curr) => {
    const status = curr.status.includes('Critical') || curr.status === 'High' || curr.status === 'Low' ? 'Attention Needed' : 'Normal';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'Normal', value: statusCounts['Normal'] || 0, color: '#10b981' }, // emerald-500
    { name: 'Attention', value: statusCounts['Attention Needed'] || 0, color: '#f97316' }, // orange-500
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="z-10">
           <div className="flex items-center gap-3 mb-2">
             <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold tracking-wider uppercase border border-teal-100">{data.labName || "Lab Report"}</span>
             <span className="text-slate-400 text-sm">{data.date || "Date N/A"}</span>
           </div>
           <h2 className="text-3xl font-bold text-slate-900 mb-1">{data.patientName || "Patient"}'s Health Profile</h2>
           <p className="text-slate-500 text-lg">AI-powered analysis of {data.biomarkers.length} biomarkers.</p>
        </div>

        <div className="flex items-center gap-6 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex flex-col items-end px-4">
             <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Health Score</span>
             <span className={`text-4xl font-black ${data.riskScore < 70 ? 'text-orange-500' : 'text-emerald-500'}`}>{data.riskScore}</span>
           </div>
           <div className={`h-20 w-20 rounded-xl flex items-center justify-center shadow-inner ${data.riskScore < 70 ? 'bg-orange-50' : 'bg-emerald-50'}`}>
             <Activity className={`h-10 w-10 ${data.riskScore < 70 ? 'text-orange-500' : 'text-emerald-500'}`} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Critical Alerts */}
         <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="bg-orange-50/50 px-6 py-4 border-b border-orange-100 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-slate-800">Action Required</h3>
                <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{highRiskItems.length} items</span>
              </div>
              <div className="divide-y divide-slate-50">
                {highRiskItems.length > 0 ? (
                  highRiskItems.map((item, idx) => (
                    <div key={idx} className="p-6 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${item.status.includes('Critical') ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                           <h4 className="font-bold text-slate-900 text-lg">{item.name}</h4>
                           <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${item.status.includes('Critical') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                             {item.status}
                           </span>
                        </div>
                        <div className="text-right pl-5 sm:pl-0 border-l-2 sm:border-l-0 border-slate-100">
                          <span className="block font-bold text-slate-900 text-xl leading-none mb-1">{item.value} <span className="text-xs font-medium text-slate-400">{item.unit}</span></span>
                          <span className="text-xs text-slate-400 font-medium">Target: {item.range}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed pl-5 sm:pl-5">{item.explanation}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">No critical alerts found. Great job!</div>
                )}
              </div>
           </div>
           
           {/* Normal Items Summary */}
           {normalItems.length > 0 && (
             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-800">Within Range</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {normalItems.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                      {item.name}
                      <span className="ml-2 text-emerald-500/70 text-xs">{item.value}</span>
                    </span>
                  ))}
                </div>
             </div>
           )}
         </div>

         {/* Stats Column */}
         <div className="space-y-6">
           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-full min-h-[300px]">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 text-teal-500 mr-2" />
                Biomarker Status
              </h3>
              {/* Fixed height container for Recharts */}
              <div className="w-full h-[250px] relative">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                        itemStyle={{color: '#334155', fontWeight: 600}}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                        Not enough data for chart
                    </div>
                )}
                {/* Center text for Donut */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                  <span className="block text-3xl font-bold text-slate-800">{data.biomarkers.length}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total</span>
                </div>
              </div>
              <p className="text-xs text-center text-slate-400 mt-2 bg-slate-50 py-2 rounded-lg">Distribution of test results</p>
           </div>
           
           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20">
              <HeartPulse className="h-8 w-8 text-white/80 mb-4" />
              <h3 className="text-lg font-bold mb-2">Health Insight</h3>
              <p className="text-indigo-100 text-sm mb-4">
                 {highRiskItems.some(i => i.name.includes("Vitamin D")) 
                    ? "Your Vitamin D is low. We've added mushrooms and fortified foods to your plan."
                    : highRiskItems.some(i => i.name.includes("Hemoglobin"))
                        ? "Iron levels are low. We've prioritized iron-rich greens and Vitamin C."
                        : "Maintain your healthy lifestyle with our balanced maintenance plan."}
              </p>
              <div className="w-full bg-black/20 rounded-full h-1.5 mb-1">
                <div className="bg-white/90 h-1.5 rounded-full" style={{width: '75%'}}></div>
              </div>
              <span className="text-xs text-indigo-200">Plan Optimization Score</span>
           </div>
         </div>
      </div>
    </div>
  );
};