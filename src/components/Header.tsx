import React, { useState, useEffect } from 'react';
import { Activity, Menu, Bell, X, ChevronRight } from 'lucide-react';
import { AppState } from '../types';

interface HeaderProps {
  onReset: () => void;
  onNavigate: (view: AppState) => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (view: AppState) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer group" onClick={onReset}>
            <div className="bg-gradient-to-tr from-teal-600 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className={`ml-3 text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
              NutriLab<span className="text-teal-600">AI</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {['how-it-works', 'for-clinics', 'pricing'].map((item) => (
               <button 
                 key={item}
                 onClick={() => onNavigate(item as AppState)} 
                 className="px-4 py-2 text-slate-600 hover:text-teal-600 font-medium transition-all hover:bg-teal-50 rounded-lg capitalize"
               >
                 {item.replace(/-/g, ' ')}
               </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button 
              onClick={() => onNavigate('pricing')}
              className="hidden md:flex items-center bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transform hover:-translate-y-0.5"
            >
              Pro Access <ChevronRight className="ml-1 h-4 w-4" />
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl animate-fade-in-down">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <button onClick={() => handleNavigation('how-it-works')} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50 transition-colors">How it Works</button>
            <button onClick={() => handleNavigation('for-clinics')} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50 transition-colors">For Clinics</button>
            <button onClick={() => handleNavigation('pricing')} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50 transition-colors">Pricing</button>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <button onClick={() => handleNavigation('pricing')} className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/20">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};