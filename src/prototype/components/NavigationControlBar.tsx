import React from 'react';
import { Building2, KeyRound, BookOpen } from 'lucide-react';
import { AppViewMode } from '../types';

interface NavigationControlBarProps {
  currentView: AppViewMode;
  onNavigate: (view: AppViewMode) => void;
}

export const NavigationControlBar: React.FC<NavigationControlBarProps> = ({
  currentView,
  onNavigate,
}) => {
  return (
    <div className="bg-slate-900/95 backdrop-blur text-white py-1.5 px-4 sticky top-0 z-40 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="bg-yp-red text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">
            영풍문고 B2B
          </span>
          <span className="text-slate-300 font-medium text-[11px] hidden sm:inline">
            도서 지원금 연동 시스템
          </span>
        </div>

        {/* View Switcher: Intranet vs Direct Login vs Store */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => onNavigate('INTRANET_PORTAL')}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-[11px] ${
              currentView === 'INTRANET_PORTAL'
                ? 'bg-sec-blue text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>삼성전자 인트라넷</span>
          </button>

          <button
            onClick={() => onNavigate('DIRECT_LOGIN')}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-[11px] ${
              currentView === 'DIRECT_LOGIN'
                ? 'bg-yp-red text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>B2B 사번 로그인</span>
          </button>

          <button
            onClick={() => onNavigate('BIZ_MALL')}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-[11px] ${
              currentView === 'BIZ_MALL'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>영풍문고 비즈몰</span>
          </button>
        </div>
      </div>
    </div>
  );
};
