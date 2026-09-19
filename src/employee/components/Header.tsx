import React from 'react';
import { Search, ShoppingCart, Truck, HelpCircle, ChevronDown, BookOpen, Sparkles, UserCheck } from 'lucide-react';
import { ActiveTab, BenefitState } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  benefitState: BenefitState;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, benefitState, cartCount }) => {
  return (
    <header className='w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs'>
      {/* 최상단 이벤트 띠배너 */}
      <div className='w-full bg-[#B91C1C] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between'>
        <div className='max-w-7xl mx-auto w-full flex items-center justify-between'>
          <div className='flex items-center gap-2 mx-auto sm:mx-0'>
            <span className='bg-white/20 text-white px-2 py-0.5 rounded text-[12px] font-semibold'>이벤트</span>
            <span>영풍문고 9월 독서의 달 특별 페스티벌 & 북캉스 쿠폰팩 증정!</span>
          </div>
          <button type='button' aria-label='배너 닫기' className='text-white/80 hover:text-white text-sm hidden sm:block cursor-pointer'>
            ✕
          </button>
        </div>
      </div>

      {/* 서브 유틸 네비게이션 */}
      <div className='border-b border-gray-100 bg-[#FAFAFA]'>
        <div className='max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-gray-600'>
          <div className='flex items-center gap-4 text-gray-400 select-none'>
            <span>매장안내</span>
            <span className='text-gray-200'>|</span>
            <span>혜택안내</span>
            <span className='text-gray-200'>|</span>
            <span className='text-emerald-700/60'>나우드림</span>
          </div>
          <div className='flex items-center gap-3'>
            <button type='button' onClick={() => setActiveTab('member-info')} className='flex items-center gap-1.5 text-gray-800 font-medium hover:text-[#D7001E] cursor-pointer'>
              <span className='w-2 h-2 rounded-full bg-emerald-500 inline-block'></span>
              <span>{benefitState.user.name} 님</span>
              <span className='bg-red-50 text-[#D7001E] text-[10px] px-1.5 py-0.2 rounded border border-red-200 font-semibold'>임직원 승인</span>
              <ChevronDown size={13} className='text-gray-400' />
            </button>
            <span className='text-gray-300'>|</span>
            <button type='button' onClick={() => setActiveTab('cart')} className='hover:text-[#D7001E] cursor-pointer flex items-center gap-1'>
              <span>장바구니</span>
              <span className='text-[#D7001E] font-bold'>({cartCount})</span>
            </button>
            <span className='text-gray-300'>|</span>
            <button type='button' onClick={() => setActiveTab('orders')} className='hover:text-[#D7001E] cursor-pointer'>
              주문
            </button>
            <span className='text-gray-300'>|</span>
            <span className='text-gray-400 select-none'>고객센터</span>
          </div>
        </div>
      </div>

      {/* 메인 헤더 영역 */}
      <div className='max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        {/* 로고 */}
        <div className='flex items-center gap-3'>
          <button type='button' onClick={() => setActiveTab('dashboard')} className='flex items-center gap-2 group text-left cursor-pointer'>
            <div className='w-9 h-9 rounded-full bg-[#D7001E] text-white font-black flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform'>YP</div>
            <div>
              <span className='text-2xl font-black tracking-tight text-gray-900 group-hover:text-[#D7001E] transition-colors'>영풍문고</span>
              <span className='ml-2 text-xs font-semibold text-gray-500 tracking-wider'>임직원 복지몰</span>
            </div>
          </button>
        </div>

        {/* 검색창 & 인기 키워드 */}
        <div className='flex-1 max-w-xl mx-0 md:mx-4'>
          <div className='relative flex items-center'>
            <input type='text' defaultValue='언설리 클래식 9월의 책 『백야』' placeholder='도서명, 저자, 출판사 검색' className='w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-[#D7001E] text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D7001E]/20' />
            <button type='button' aria-label='도서 검색' className='absolute right-3 p-1.5 text-[#D7001E] hover:bg-red-50 rounded-full cursor-pointer'>
              <Search size={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className='flex items-center gap-2 mt-1.5 text-[12px] text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-none'>
            <span className='text-gray-400'>인기:</span>
            <span className='hover:text-[#D7001E] cursor-pointer'>창비브랜드전</span>
            <span>·</span>
            <span className='hover:text-[#D7001E] cursor-pointer'>하루키 신간</span>
            <span>·</span>
            <span className='hover:text-[#D7001E] cursor-pointer text-[#D7001E] font-medium'>트렌드코리아</span>
            <span>·</span>
            <span className='hover:text-[#D7001E] cursor-pointer'>흔한남매 23</span>
            <span>·</span>
            <span className='hover:text-[#D7001E] cursor-pointer'>그리스인조르바</span>
          </div>
        </div>

        {/* 우측 상단 배너 카드 */}
        <div className='hidden lg:flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-md p-2 text-xs text-gray-700 max-w-xs'>
          <span className='bg-gray-200 text-gray-600 text-[10px] font-bold px-1 py-0.5 rounded'>AD</span>
          <div className='truncate'>
            <p className='font-semibold text-gray-800 truncate'>그랬다고 적었다</p>
            <p className='text-gray-500 text-[12px] truncate'>우리의 오늘을 담은 문장</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 탭바 (영풍문고 GNB) */}
      <div className='border-t border-gray-200 bg-white'>
        <div className='max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto scrollbar-none'>
          <div className='flex items-center text-sm font-medium text-gray-700 whitespace-nowrap'>
            <button type='button' onClick={() => setActiveTab('dashboard')} className='py-3 px-3 hover:text-[#D7001E] flex items-center gap-1.5 border-r border-gray-200 mr-2 font-bold cursor-pointer'>
              <span className='text-lg leading-none'>☰</span>
              <span>전체 카테고리</span>
            </button>
            <button type='button' onClick={() => setActiveTab('member-info')} className={`py-3 px-3 transition-colors cursor-pointer ${activeTab === 'member-info' ? 'text-[#D7001E] font-bold border-b-2 border-[#D7001E]' : 'hover:text-[#D7001E]'}`}>
              개인정보(계정 및 인적사항)
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('benefit')}
              className={`py-3 px-3 relative transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'benefit' ? 'text-[#D7001E] font-bold border-b-2 border-[#D7001E]' : 'text-[#D7001E] font-semibold hover:bg-red-50/50'}`}
            >
              <span>나의 지원금</span>
              <span className='inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#D7001E] text-white'>50% 지원</span>
            </button>
            <button type='button' onClick={() => setActiveTab('cart')} className={`py-3 px-3 transition-colors cursor-pointer flex items-center gap-1 ${activeTab === 'cart' ? 'text-[#D7001E] font-bold border-b-2 border-[#D7001E]' : 'hover:text-[#D7001E]'}`}>
              <span>장바구니</span>
              {cartCount > 0 && <span className='bg-[#D7001E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold'>{cartCount}</span>}
            </button>
            <button type='button' onClick={() => setActiveTab('orders')} className={`py-3 px-3 transition-colors cursor-pointer ${activeTab === 'orders' ? 'text-[#D7001E] font-bold border-b-2 border-[#D7001E]' : 'hover:text-[#D7001E]'}`}>
              주문
            </button>
            <button type='button' onClick={() => setActiveTab('wishlist')} className={`py-3 px-3 transition-colors cursor-pointer ${activeTab === 'wishlist' ? 'text-[#D7001E] font-bold border-b-2 border-[#D7001E]' : 'hover:text-[#D7001E]'}`}>
              위시리스트
            </button>
            <button type='button' onClick={() => setActiveTab('refund')} className={`py-3 px-3 transition-colors cursor-pointer ${activeTab === 'refund' ? 'text-[#D7001E] font-bold border-b-2 border-[#D7001E]' : 'hover:text-[#D7001E]'}`}>
              환불
            </button>
            <span className='py-3 px-3 text-gray-400 cursor-not-allowed'>eBook</span>
          </div>
          <div className='hidden md:flex items-center text-xs text-gray-500 gap-2'>
            <span className='text-emerald-700 font-semibold'>2026 상반기 도서 지원 기간 중</span>
          </div>
        </div>
      </div>
    </header>
  );
};
