import React from 'react';
import { User, ChevronRight, ShieldCheck, Home, Heart, UserCog, Coins } from 'lucide-react';
import { ActiveTab, BenefitState } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  benefitState: BenefitState;
  cartCount: number;
  wishlistCount: number;
  orderCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, benefitState, cartCount, wishlistCount, orderCount }) => {
  return (
    <aside className='w-full md:w-56 shrink-0 space-y-4'>
      {/* 사용자 프로필 카드 */}
      <div className='bg-[#4A5568] text-white rounded-t-lg p-4 shadow-xs'>
        <div className='flex flex-col items-center text-center'>
          <div className='relative'>
            <div className='w-16 h-16 rounded-full bg-slate-300 border-2 border-white/40 flex items-center justify-center text-slate-600 mb-2 overflow-hidden shadow-inner'>
              <User size={36} className='text-slate-500' />
            </div>
            <span className='absolute bottom-1 right-0 bg-emerald-500 text-[10px] text-white p-0.5 rounded-full ring-2 ring-[#4A5568]' title='인증된 임직원'>
              <ShieldCheck size={12} />
            </span>
          </div>

          <button type='button' onClick={() => setActiveTab('member-info')} className='group flex items-center gap-1 font-bold text-base hover:text-red-200 transition-colors cursor-pointer'>
            <span>{benefitState.user.name}</span>
            <span className='text-xs text-slate-300 font-normal'>({benefitState.user.grade})</span>
            <ChevronRight size={14} className='text-slate-400 group-hover:translate-x-0.5 transition-transform' />
          </button>
          <span className='text-[11px] text-red-200 bg-red-900/40 px-2 py-0.5 rounded-full mt-1 border border-red-400/30'>사번 {benefitState.user.employeeId}</span>

          <div className='grid grid-cols-2 gap-1.5 w-full mt-3 pt-3 border-t border-slate-600/60'>
            <button type='button' onClick={() => setActiveTab('member-info')} className='py-1 px-2 text-xs bg-slate-700/80 hover:bg-slate-700 rounded text-slate-200 text-center cursor-pointer transition-colors'>
              프로필 관리
            </button>
            <span className='py-1 px-2 text-xs bg-slate-700/40 rounded text-slate-400 text-center cursor-not-allowed select-none'>로그아웃</span>
          </div>
        </div>

        {/* 미니 대시보드 통계 그리드 (구현된 메뉴는 클릭 시 탭 이동, 미구현 메뉴는 비활성화) */}
        <div className='grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-600/70 text-xs'>
          <button type='button' onClick={() => setActiveTab('orders')} className='bg-slate-800/60 p-2 rounded cursor-pointer hover:bg-slate-800 transition-colors text-left'>
            <p className='text-[11px] text-slate-300'>진행중인 주문</p>
            <p className='text-sm font-bold text-red-300'>{orderCount}건</p>
          </button>
          <div className='bg-slate-800/40 p-2 rounded select-none cursor-not-allowed opacity-75'>
            <p className='text-[11px] text-slate-400'>계좌 잔액</p>
            <p className='text-sm font-bold text-slate-300'>1,000원</p>
          </div>
          <div className='bg-slate-800/40 p-2 rounded select-none cursor-not-allowed opacity-75'>
            <p className='text-[11px] text-slate-400'>보유 쿠폰</p>
            <p className='text-sm font-bold text-slate-300'>0장</p>
          </div>
          <button type='button' onClick={() => setActiveTab('cart')} className='bg-slate-800/60 p-2 rounded cursor-pointer hover:bg-slate-800 transition-colors text-left'>
            <p className='text-[11px] text-slate-300'>장바구니</p>
            <p className='text-sm font-bold text-red-300'>{cartCount}개</p>
          </button>
        </div>
      </div>

      {/* LNB 메뉴 트리 */}
      <nav aria-label='마이페이지 사이드 메뉴' className='bg-white border border-gray-200 rounded-b-lg p-3 text-xs divide-y divide-gray-100 shadow-xs'>
        {/* 마이페이지 홈 바로가기 */}
        <div className='pb-2.5'>
          <button
            type='button'
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${activeTab === 'dashboard' ? 'bg-slate-900 text-white font-bold shadow-xs' : 'bg-gray-50 text-gray-800 hover:bg-gray-100 font-semibold'}`}
          >
            <span className='flex items-center gap-1.5'>
              <Home size={14} />
              <span>마이페이지 홈</span>
            </span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* 내 계좌 (임직원 지원금 핵심) */}
        <div className='py-2.5'>
          <h2 className='font-bold text-gray-900 text-xs mb-1.5 px-2'>내 계좌</h2>
          <ul className='space-y-1'>
            <li>
              <button
                type='button'
                onClick={() => setActiveTab('benefit')}
                className={`w-full text-left px-2 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer border ${
                  activeTab === 'benefit' ? 'text-[#D7001E] font-bold bg-red-50 border-red-200 shadow-xs' : 'text-[#D7001E] font-medium bg-red-50/50 border-red-100 hover:bg-red-50'
                }`}
              >
                <div>
                  <div className='flex items-center gap-1.5'>
                    <Coins size={14} className='text-[#D7001E]' />
                    <span className='font-bold'>나의 지원금</span>
                  </div>
                  <span className='text-[10px] text-gray-500 block pl-5'>+추천도서 100% 지원</span>
                </div>
                <span className='text-xs font-black text-[#D7001E]'>{benefitState.personalBook.remainingAmount.toLocaleString()}원</span>
              </button>
            </li>
            {/* 미구현 페이지: 링크 이동 비활성화 */}
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 flex justify-between items-center text-[11px]' title='준비 중인 서비스입니다.'>
              <span>적립금</span>
              <span>1,000원</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 flex justify-between items-center text-[11px]' title='준비 중인 서비스입니다.'>
              <span>예치금</span>
              <span>0원</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 flex justify-between items-center text-[11px]' title='준비 중인 서비스입니다.'>
              <span>e머니 / e캐시</span>
              <span>0원</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 flex justify-between items-center text-[11px]' title='준비 중인 서비스입니다.'>
              <span>교환권/쿠폰</span>
              <span>0장</span>
            </li>
          </ul>
        </div>

        {/* 쇼핑 관리 */}
        <div className='py-2.5'>
          <h2 className='font-bold text-gray-900 text-xs mb-1.5 px-2'>쇼핑 관리</h2>
          <ul className='space-y-1'>
            {/* 미구현 페이지: 링크 이동 비활성화 */}
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>배송지 관리</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>기본 수령매장 관리</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>환불계좌 관리</span>
            </li>
          </ul>
        </div>

        {/* 내 서재 */}
        <div className='py-2.5'>
          <h2 className='font-bold text-gray-900 text-xs mb-1.5 px-2'>내 서재</h2>
          <ul className='space-y-1'>
            <li>
              <button
                type='button'
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left px-2 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${activeTab === 'wishlist' ? 'text-[#D7001E] font-bold bg-red-50' : 'text-gray-700 hover:text-[#D7001E] hover:bg-gray-50'}`}
              >
                <span className='flex items-center gap-1.5'>
                  <Heart size={13} className={activeTab === 'wishlist' ? 'text-[#D7001E]' : 'text-gray-500'} />
                  <span>위시리스트 (찜한 도서)</span>
                </span>
                <span className='text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded-full border border-red-200'>{wishlistCount}</span>
              </button>
            </li>
            {/* 미구현 페이지: 링크 이동 비활성화 */}
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>내 서재 관리</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>최근 본 상품</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>내 관심분야</span>
            </li>
          </ul>
        </div>

        {/* 내 정보 관리 */}
        <div className='py-2.5'>
          <h2 className='font-bold text-gray-900 text-xs mb-1.5 px-2'>내 정보 관리</h2>
          <ul className='space-y-1'>
            <li>
              <button
                type='button'
                onClick={() => setActiveTab('member-info')}
                className={`w-full text-left px-2 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${activeTab === 'member-info' ? 'text-[#D7001E] font-bold bg-red-50' : 'text-gray-700 hover:text-[#D7001E] hover:bg-gray-50'}`}
              >
                <span className='flex items-center gap-1.5'>
                  <UserCog size={13} className={activeTab === 'member-info' ? 'text-[#D7001E]' : 'text-gray-500'} />
                  <span>회원정보 관리</span>
                </span>
              </button>
            </li>
            {/* 미구현 페이지: 링크 이동 비활성화 */}
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>영풍빠른결제 설정</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>비밀번호 변경</span>
            </li>
            <li className='px-2 py-1.5 text-gray-400 select-none cursor-not-allowed opacity-60 text-[11px]' title='준비 중인 서비스입니다.'>
              <span>회원탈퇴</span>
            </li>
          </ul>
        </div>

        {/* 고객센터 안내 (비활성화) */}
        <div className='py-2.5'>
          <p className='font-semibold text-gray-400 text-[11px] px-2 mb-1'>고객센터 안내</p>
          <div className='px-2 text-[11px] text-gray-400'>
            <span>영풍문고 임직원 복지지원</span>
            <span className='block font-mono text-gray-500'>1544-9020</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};
