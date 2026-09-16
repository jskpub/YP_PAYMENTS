import React from 'react';
import { Building2, KeyRound, BookOpen, RotateCcw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AppViewMode } from '../types';

interface NavigationControlBarProps {
  currentView?: AppViewMode;
  onNavigate?: (view: AppViewMode) => void;
}

export const NavigationControlBar: React.FC<NavigationControlBarProps> = ({
  currentView,
  onNavigate,
}) => {
  const { activePage, setActivePage, resetSubsidyLedger } = useShop();

  // Determine active view mode based on props or ShopContext activePage
  const activeMode: AppViewMode = currentView || (activePage === 'intranet' ? 'INTRANET_PORTAL' : 'BIZ_MALL');

  const handleNav = (view: AppViewMode) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      if (view === 'INTRANET_PORTAL' || view === 'DIRECT_LOGIN') {
        setActivePage('intranet');
      } else {
        setActivePage('home');
      }
    }
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur text-white py-1.5 px-4 sticky top-0 z-50 border-b border-slate-800 text-xs shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Title */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleNav('BIZ_MALL')}
        >
          <span className="bg-yp-red text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">
            영풍문고 B2B
          </span>
          <span className="text-slate-300 font-medium text-[11px] hidden sm:inline">
            도서 지원금 연동 시스템
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Switcher: Intranet vs Direct Login vs Store */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => handleNav('INTRANET_PORTAL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-[11px] cursor-pointer ${activeMode === 'INTRANET_PORTAL'
                ? 'bg-sec-blue text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>삼성전자 인트라넷</span>
            </button>

            <button
              onClick={() => handleNav('DIRECT_LOGIN')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-[11px] cursor-pointer ${activeMode === 'DIRECT_LOGIN'
                ? 'bg-yp-red text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>B2B 사번 로그인</span>
            </button>

            <button
              onClick={() => handleNav('BIZ_MALL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-[11px] cursor-pointer ${activeMode === 'BIZ_MALL'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>영풍문고 비즈몰</span>
            </button>
          </div>

          {/* Reset Subsidy Limit (Test) Button */}
          <button
            onClick={resetSubsidyLedger}
            title="테스트용 도서 지원금 및 이달의 추천도서 한도 초기화"
            className="px-2.5 py-1 bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 text-rose-200 hover:text-white rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>🔄 한도 초기화 (테스트용)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
