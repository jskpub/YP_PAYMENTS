import React, { useState } from 'react';
import { ArrowUpRight, Bell, Calendar, Car, Clock, FileText, GraduationCap, Plane, RefreshCw, Search, Settings, Users } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const portalMenus = [
  { id: 'leave', label: '휴가 관리', icon: Calendar },
  { id: 'trip', label: '출장 관리', icon: Plane },
  { id: 'overtime', label: '시간 외 관리', icon: Clock },
  { id: 'attendance', label: '근태 관리', icon: FileText },
  { id: 'car', label: '차량 관리', icon: Car },
  { id: 'education', label: '교육 관리', icon: GraduationCap },
  { id: 'duty', label: '당직 관리', icon: RefreshCw },
  { id: 'hr', label: '인사 관리', icon: Users },
];

export const IntranetPortalPage: React.FC = () => {
  const { setActivePage } = useShop();
  const [activeMenu, setActiveMenu] = useState('leave');
  const [calendarView, setCalendarView] = useState<'일' | '주' | '월'>('주');

  return (
    <div className='min-h-screen bg-[#f4f6fa] text-slate-700 flex font-sans antialiased'>
      <aside className='hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white shadow-sm lg:flex'>
        <div>
          <div className='flex items-center justify-between border-b border-slate-100 p-6 pb-4'>
            <div className='flex items-center gap-2.5'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#1428a0] text-xs font-black tracking-wider text-white'>SEC</div>
              <div className='leading-tight'>
                <span className='text-sm font-extrabold tracking-tight text-[#1428a0]'>SAMSUNG</span>
                <span className='block text-[10px] font-semibold tracking-wide text-slate-500'>삼성전자 임직원 포털</span>
              </div>
            </div>
            <div className='grid grid-cols-3 gap-0.5 opacity-30'>
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} className='h-1 w-1 rounded-full bg-slate-700' />
              ))}
            </div>
          </div>

          <nav className='space-y-1.5 p-4 text-xs'>
            {portalMenus.map(({ id, label, icon: Icon }) => (
              <button key={id} type='button' onClick={() => setActiveMenu(id)} className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-medium transition-colors ${activeMenu === id ? 'bg-[#1428a0] font-semibold text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon className='h-4 w-4 shrink-0' />
                <span>{label}</span>
              </button>
            ))}

            <div className='pb-2 pt-4'>
              <div className='px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400'>사내 복지 서비스</div>
              <button type='button' onClick={() => setActivePage('recommended')} className='group flex w-full items-center justify-between rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50/60 p-3 text-left transition-all hover:border-[#df0000] hover:shadow-sm'>
                <span className='flex items-center gap-2.5'>
                  <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#df0000] text-xs font-bold text-white'>B2B</span>
                  <span>
                    <span className='flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-[#df0000]'>
                      영풍문고 비즈몰 <b className='rounded bg-[#df0000] px-1 text-[9px] text-white'>B2B</b>
                    </span>
                    <span className='text-[10px] text-slate-500'>도서지원금 자동연동 ↗</span>
                  </span>
                </span>
                <ArrowUpRight className='h-4 w-4 text-[#df0000] opacity-70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
              </button>
            </div>
          </nav>
        </div>

        <div className='border-t border-slate-100 p-4'>
          <button type='button' className='flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800'>
            <Settings className='h-4 w-4' />
            <span>운영 설정</span>
          </button>
        </div>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='p-4 pb-0'>
          <div className='flex items-center justify-between rounded-2xl bg-[#1428a0] px-5 py-3.5 text-white shadow-sm sm:px-6'>
            <button type='button' className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20' aria-label='통합 검색'>
              <Search className='h-4 w-4' />
            </button>
            <div className='flex items-center gap-4'>
              <Calendar className='h-4 w-4 text-white/90' />
              <span className='relative'>
                <Bell className='h-4 w-4 text-white/90' />
                <span className='absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#1428a0] bg-[#df0000] text-[9px] font-bold'>5</span>
              </span>
              <div className='hidden items-center gap-3 border-l border-white/20 pl-3 sm:flex'>
                <div className='text-right leading-tight'>
                  <div className='text-xs font-bold'>김지선 선임</div>
                  <div className='text-[10px] text-blue-100'>삼성전자 디지털솔루션팀</div>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20'>
                  <Users className='h-4 w-4' />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 space-y-4 overflow-y-auto p-4'>
          <section className='space-y-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h1 className='text-base font-bold tracking-tight text-slate-900'>근태 관리</h1>
              <div className='flex items-center gap-4'>
                <div className='flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600'>
                  {(['일', '주', '월'] as const).map((view) => (
                    <button key={view} type='button' onClick={() => setCalendarView(view)} className={`rounded-md px-3 py-1 ${calendarView === view ? 'bg-slate-800 font-semibold text-white shadow-sm' : 'hover:text-slate-900'}`}>
                      {view}
                    </button>
                  ))}
                </div>
                <div className='hidden items-center gap-3 text-xs font-medium text-slate-600 md:flex'>
                  <span className='flex items-center gap-1.5'>
                    <i className='h-2 w-2 rounded-full bg-[#1428a0]' />
                    정상근무
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <i className='h-2 w-2 rounded-full bg-emerald-500' />
                    조퇴
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <i className='h-2 w-2 rounded-full bg-amber-400' />
                    연차
                  </span>
                </div>
              </div>
            </div>
            <div className='overflow-hidden rounded-xl border border-slate-200'>
              <div className='flex items-center gap-2 border-b border-slate-200 bg-slate-50/70 p-2.5 text-xs font-medium text-slate-600'>
                <button type='button' className='rounded p-1 text-slate-500 hover:bg-slate-200' aria-label='이전 주'>
                  ‹
                </button>
                <span>2026.09.14 ~ 2026.09.20</span>
                <button type='button' className='rounded p-1 text-slate-500 hover:bg-slate-200' aria-label='다음 주'>
                  ›
                </button>
              </div>
              <div className='grid grid-cols-7 divide-x divide-slate-100'>
                {['월 14', '화 15', '수 16', '목 17', '금 18', '토 19', '일 20'].map((day, index) => (
                  <div key={day} className={`min-h-32 p-2.5 text-xs ${index > 4 ? 'bg-slate-50/60' : ''}`}>
                    <div className='font-bold text-slate-700'>{day}</div>
                    <div className='mt-8 rounded-lg bg-[#e8edff] p-2 text-center text-[10px] font-semibold text-[#1428a0]'>{index > 4 ? '휴일' : '정상근무'}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
            <div className='rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm xl:col-span-2'>
              <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
                <h2 className='font-bold text-slate-900'>오늘의 할 일</h2>
                <span className='text-xs text-slate-400'>2026.09.16</span>
              </div>
              <div className='grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4'>
                {['결재 대기', '공지사항', '교육 현황', '인사 알림'].map((label, index) => (
                  <div key={label} className='rounded-xl bg-slate-50 p-4'>
                    <span className='text-xs text-slate-500'>{label}</span>
                    <strong className='mt-2 block text-xl text-slate-900'>{index === 0 ? '3' : index === 1 ? '2' : '0'}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className='rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm'>
              <p className='text-xs font-bold text-[#df0000]'>임직원 복지 서비스</p>
              <h2 className='mt-2 text-lg font-black text-slate-900'>영풍문고 B2B</h2>
              <p className='mt-1 text-xs leading-relaxed text-slate-500'>도서 지원금이 자동으로 연동되는 임직원 전용 비즈몰입니다.</p>
              <button type='button' onClick={() => setActivePage('recommended')} className='mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#df0000] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#c90000]'>
                비즈몰 바로가기 <ArrowUpRight className='h-3.5 w-3.5' />
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
