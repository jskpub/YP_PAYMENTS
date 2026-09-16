import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  Plane,
  Car,
  GraduationCap,
  RefreshCw,
  Users,
  Settings,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { EmployeeProfile } from '../types';

interface SamsungIntranetPortalProps {
  employee: EmployeeProfile;
  onLaunchSSO: () => void;
}

export const SamsungIntranetPortal: React.FC<SamsungIntranetPortalProps> = ({
  employee,
  onLaunchSSO,
}) => {
  const [activeTab, setActiveTab] = useState<'Days' | 'Weeks' | 'Months'>('Weeks');
  const [activeMenu, setActiveMenu] = useState<string>('LEAVE');

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-700 flex font-sans antialiased select-none">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          {/* Company Brand Logo Area */}
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              {/* Samsung Blue Ellipse Logo Icon */}
              <div className="w-8 h-8 rounded-lg bg-sec-blue flex items-center justify-center text-white font-black text-xs tracking-wider shadow-xs">
                SEC
              </div>
              <div className="leading-tight">
                <span className="text-sm font-extrabold tracking-tight text-sec-blue">
                  SAMSUNG
                </span>
                <span className="block text-[10px] font-semibold text-slate-500 tracking-wide">
                  삼성전자 임직원 포털
                </span>
              </div>
            </div>

            {/* 6-dot matrix icon */}
            <div className="grid grid-cols-3 gap-0.5 opacity-30">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-slate-700" />
              ))}
            </div>
          </div>

          {/* Navigation Menus */}
          <nav className="p-4 space-y-1.5 text-xs">
            {/* 1. 휴가 관리 (Active Pill) */}
            <div>
              <button
                onClick={() => setActiveMenu('LEAVE')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium transition-all ${activeMenu === 'LEAVE'
                  ? 'bg-sec-blue text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>휴가 관리</span>
              </button>

              {/* Sub-menu tree if active */}
              {activeMenu === 'LEAVE' && (
                <div className="pl-9 pr-2 py-2 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 text-sec-blue font-semibold cursor-pointer">
                    <span className="text-[9px]">▸</span>
                    <span>휴가/휴직 현황</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer">
                    <span className="text-[9px]">▸</span>
                    <span>휴가/휴직 신청 현황</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. 출장 관리 */}
            <button
              onClick={() => setActiveMenu('TRIP')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${activeMenu === 'TRIP'
                ? 'bg-sec-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Plane className="w-4 h-4 shrink-0" />
              <span>출장 관리</span>
            </button>

            {/* 3. 시간 외 관리 */}
            <button
              onClick={() => setActiveMenu('OVERTIME')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${activeMenu === 'OVERTIME'
                ? 'bg-sec-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>시간 외 관리</span>
            </button>

            {/* 4. 근태 관리 */}
            <button
              onClick={() => setActiveMenu('ATTENDANCE')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${activeMenu === 'ATTENDANCE'
                ? 'bg-sec-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>근태 관리</span>
            </button>

            {/* 5. 차량 관리 */}
            <button
              onClick={() => setActiveMenu('CAR')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Car className="w-4 h-4 shrink-0" />
              <span>차량 관리</span>
            </button>

            {/* 6. 교육 관리 */}
            <button
              onClick={() => setActiveMenu('EDU')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>교육 관리</span>
            </button>

            {/* 7. 당직 관리 */}
            <button
              onClick={() => setActiveMenu('DUTY')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>당직 관리</span>
            </button>

            {/* 8. 인사 관리 */}
            <button
              onClick={() => setActiveMenu('HR')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>인사 관리</span>
            </button>

            {/* --- B2B YOUNGPOONG BOOKSTORE SSO CONNECTOR (REQUESTED) --- */}
            <div className="pt-4 pb-2">
              <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                사내 복지 서비스
              </div>
              <button
                onClick={onLaunchSSO}
                className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50/60 border border-red-200/90 hover:border-yp-red hover:shadow-xs transition-all group flex items-center justify-between cursor-pointer !rounded-md"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-yp-red text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    B2B
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-yp-red transition-colors flex items-center gap-1">
                      <span>영풍문고 비즈몰</span>
                      <span className="text-[9px] bg-yp-red text-white px-1 rounded font-bold">B2B</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      도서지원금 자동연동 ↗
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-yp-red opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
            <Settings className="w-4 h-4" />
            <span>운영 설정</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Blue Bar */}
        <header className="p-4 pb-0">
          <div className="bg-sec-blue text-white rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-xs">
            {/* Search Icon */}
            <div className="flex items-center">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                aria-label="통합 검색"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Calendar, Bell (5), Profile */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="사내 일정"
              >
                <Calendar className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  className="text-white/90 hover:text-white transition-colors"
                  aria-label="알림 (5개 미확인)"
                >
                  <Bell className="w-4 h-4" />
                </button>
                <span className="absolute -top-1.5 -right-1.5 bg-yp-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-sec-blue">
                  5
                </span>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-2 border-l border-white/20">
                <div className="text-right leading-tight">
                  <div className="text-xs font-bold text-white">
                    {employee.name} {employee.role}
                  </div>
                  <div className="text-[10px] text-blue-100 font-normal">
                    {employee.company} {employee.division}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-xs">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Body */}
        <main className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Section 1: 근태 관리 Schedule Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                근태 관리
              </h2>

              <div className="flex items-center gap-5">
                {/* View Period Selector: Days / Weeks / Months */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
                  {(['Days', 'Weeks', 'Months'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-md transition-all ${activeTab === tab
                        ? 'bg-[#1E293B] text-white font-semibold shadow-xs'
                        : 'hover:text-slate-900'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Status Legend Dots */}
                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sec-blue" />
                    <span>정상근무</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>조퇴</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>연차</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Calendar Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Date Header: < 2021.08.01 ~ 2021.08.07 > */}
              <div className="p-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-medium">
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 rounded text-slate-500"
                  aria-label="이전 주"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>2021.08.01 ~ 2021.08.07</span>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 rounded text-slate-500"
                  aria-label="다음 주"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 7 Days Grid Header & Schedule Cards */}
              <div className="grid grid-cols-7 divide-x divide-slate-200 text-center text-xs min-h-[260px]">
                {/* SUN 08.01 */}
                <div className="flex flex-col">
                  <div className="py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-red-500">
                    SUN 08.01
                  </div>
                  <div className="p-2 flex-1 space-y-1.5 bg-slate-50/20" />
                </div>

                {/* MON 08.02 */}
                <div className="flex flex-col">
                  <div className="py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                    MON 08.02
                  </div>
                  <div className="p-2 flex-1 space-y-1.5 text-left text-[11px]">
                    <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-blue-900 leading-tight">
                      <div className="font-bold flex justify-between">
                        <span>이승환</span>
                        <span className="text-[10px] text-blue-600 font-normal">정상</span>
                      </div>
                      <div className="text-[10px] text-blue-700">IN 08:52 OUT 18:22</div>
                    </div>

                    <div className="p-1.5 rounded bg-emerald-50/80 border border-emerald-100 text-emerald-900 leading-tight">
                      <div className="font-bold flex justify-between">
                        <span>김하나</span>
                        <span className="text-[10px] text-emerald-700 font-bold">연차</span>
                      </div>
                      <div className="text-[10px] text-emerald-600">IN --:-- OUT --:--</div>
                    </div>

                    <div className="p-1.5 rounded bg-sky-50/80 border border-sky-100 text-sky-900 leading-tight">
                      <div className="font-bold">이기주</div>
                      <div className="text-[10px] text-sky-700">IN 09:01 OUT --:--</div>
                    </div>

                    <div className="p-1.5 rounded bg-amber-50/80 border border-amber-100 text-amber-900 leading-tight">
                      <div className="font-bold flex justify-between">
                        <span>박창원</span>
                        <span className="text-[10px] text-amber-700 font-bold">조퇴</span>
                      </div>
                      <div className="text-[10px] text-amber-600">IN 09:42 OUT 13:10</div>
                    </div>
                  </div>
                </div>

                {/* TUE 08.03 */}
                <div className="flex flex-col">
                  <div className="py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                    TUE 08.03
                  </div>
                  <div className="p-2 flex-1 space-y-1.5 text-left text-[11px]">
                    <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-blue-900 leading-tight">
                      <div className="font-bold">이승환</div>
                      <div className="text-[10px] text-blue-700">IN 08:52 OUT 18:22</div>
                    </div>
                  </div>
                </div>

                {/* WED 08.04 */}
                <div className="flex flex-col">
                  <div className="py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                    WED 08.04
                  </div>
                  <div className="p-2 flex-1 space-y-1.5 text-left text-[11px]">
                    <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-blue-900 leading-tight">
                      <div className="font-bold">이승환</div>
                      <div className="text-[10px] text-blue-700">IN 08:52 OUT 18:22</div>
                    </div>
                  </div>
                </div>

                {/* THU 08.05 */}
                <div className="flex flex-col">
                  <div className="py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                    THU 08.05
                  </div>
                  <div className="p-2 flex-1 space-y-1.5 text-left text-[11px]">
                    <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-blue-900 leading-tight">
                      <div className="font-bold">이승환</div>
                      <div className="text-[10px] text-blue-700">IN 08:52 OUT 18:22</div>
                    </div>
                  </div>
                </div>

                {/* FRI 08.06 */}
                <div className="flex flex-col">
                  <div className="py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                    FRI 08.06
                  </div>
                  <div className="p-2 flex-1 space-y-1.5 text-left text-[11px]">
                    <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-blue-900 leading-tight">
                      <div className="font-bold">이승환</div>
                      <div className="text-[10px] text-blue-700">IN 08:52 OUT 18:22</div>
                    </div>
                  </div>
                </div>

                {/* SAT 08.07 */}
                <div className="flex flex-col">
                  <div className="py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-blue-600">
                    SAT 08.07
                  </div>
                  <div className="p-2 flex-1 space-y-1.5 text-left text-[11px]">
                    <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-blue-900 leading-tight">
                      <div className="font-bold">이승환</div>
                      <div className="text-[10px] text-blue-700">IN 08:52 OUT 18:22</div>
                    </div>
                    <div className="p-1.5 rounded bg-sky-50/80 border border-sky-100 text-sky-900 leading-tight">
                      <div className="font-bold">이기주</div>
                      <div className="text-[10px] text-sky-700">IN 09:01 OUT --:--</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Bottom 3 Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Widget 1: 연차 현황 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h3 className="font-bold text-slate-900">연차 현황</h3>
                <span className="text-[11px] text-slate-400 font-normal">2021.01.01 ~ 2021.12.31</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                {/* Stats Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-slate-400 pl-2 border-l-2 border-sec-blue">
                      잔여 연차
                    </div>
                    <div className="text-sm font-bold text-slate-800 pl-2">
                      14일 6시간 0분
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[11px] text-slate-400 pl-2 border-l-2 border-emerald-500">
                      사용한 연차
                    </div>
                    <div className="text-sm font-bold text-slate-800 pl-2">
                      8일 0시간 0분
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[11px] text-slate-400 pl-2 border-l-2 border-amber-400">
                      조퇴
                    </div>
                    <div className="text-sm font-bold text-slate-800 pl-2">
                      1일 2시간 0분
                    </div>
                  </div>
                </div>

                {/* Donut Gauge (61.3%) */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-slate-100"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Active Arc (61.3%) */}
                    <path
                      className="text-sec-blue"
                      strokeDasharray="61.3, 100"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-slate-400">잔여 연차</span>
                    <span className="text-base font-extrabold text-sec-blue leading-none mt-0.5">
                      61.3%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: 시간 외 현황 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h3 className="font-bold text-slate-900">시간 외 현황</h3>
                <span className="text-[11px] text-slate-400 font-normal">2021.01.01 ~ 2021.12.31</span>
              </div>

              <div className="flex items-end justify-between pt-2">
                {/* Bar Chart Visualization */}
                <div className="w-40 h-28 flex items-end justify-between gap-2 border-b border-slate-200 pb-1 px-1">
                  {/* 한도 70h (Grey) */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3.5 bg-slate-400 rounded-t-xs" style={{ height: '70px' }} />
                    <span className="text-[9px] text-slate-400">한도</span>
                  </div>
                  {/* 인정 25h (Green) */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3.5 bg-emerald-500 rounded-t-xs" style={{ height: '30px' }} />
                    <span className="text-[9px] text-slate-400">인정</span>
                  </div>
                  {/* 잔여 10h/45h (Blue) */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3.5 bg-sec-blue rounded-t-xs" style={{ height: '48px' }} />
                    <span className="text-[9px] text-slate-400">잔여</span>
                  </div>
                  {/* 초과 5h (Yellow) */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3.5 bg-amber-400 rounded-t-xs" style={{ height: '14px' }} />
                    <span className="text-[9px] text-slate-400">초과</span>
                  </div>
                </div>

                {/* Legend Values */}
                <div className="space-y-1.5 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      한도 시간
                    </span>
                    <span className="font-bold text-slate-700">70h</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      인정 시간
                    </span>
                    <span className="font-bold text-slate-700">25h</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-sec-blue" />
                      잔여 시간
                    </span>
                    <span className="font-bold text-slate-700">10h</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      초과 시간
                    </span>
                    <span className="font-bold text-slate-700">5h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 3: 8월 교육 일정 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h3 className="font-bold text-slate-900">8월 교육 일정</h3>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { title: '직장 내 장애인 인식개선 교육', date: '2021.08.04' },
                  { title: '정보보안 및 개인정보보호 교육', date: '2021.08.11' },
                  { title: '직장 내 괴롭힘 예방 교육', date: '2021.08.18' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {item.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <footer className="pt-2 text-[11px] text-slate-400 text-left">
            COPYRIGHT © 2026 <span className="font-semibold text-slate-500">Samsung Electronics Co., Ltd.</span> All Rights Reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};
