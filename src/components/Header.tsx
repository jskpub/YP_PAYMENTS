import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  X,
  User,
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';

export const Header: React.FC = () => {
  const { activePage, setActivePage, cart, subsidyLedger, setMyPageTab } = useShop();
  const [topBannerClosed, setTopBannerClosed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage('explore');
  };

  return (
    <header className="w-full bg-white border-b border-[#dadada] text-[#3d3c3f] select-none">
      {/* 1. Top promotional banner */}
      {!topBannerClosed && (
        <div className="w-full bg-[#181718] text-white text-xs py-2 px-4 flex items-center justify-between border-b border-[#363636]">
          <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between px-2">
            <div className="flex items-center gap-4 text-xs font-normal">
              <span className="bg-[#df0000] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                EVENT
              </span>
              <span>2학기 대학교재 가장 싸게 사는 법!</span>
              <span className="hidden md:inline text-neutral-400">|</span>
              <span className="hidden md:inline font-medium text-[#ffd0d0]">
                서울국제정원박람회 × 영풍문고 영감이 필요한 순간
              </span>
            </div>
            <button
              onClick={() => setTopBannerClosed(true)}
              className="text-neutral-400 hover:text-white p-1"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Above Header Utility Bar */}
      <div className="border-b border-[#f6f6f6] bg-white text-[12px] text-[#80888a]">
        <div className="max-w-[1280px] mx-auto px-4 h-9 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActivePage('explore')}
              className="hover:text-[#181718] transition-colors"
            >
              매장안내
            </button>
            <span className="text-[#dadada]">|</span>
            <button
              onClick={() => {
                setActivePage('mypage');
                setMyPageTab('subsidy');
              }}
              className="hover:text-[#181718] flex items-center gap-1 font-medium text-[#1f976b]"
            >
              <Award className="w-3.5 h-3.5" />
              B2B 독서지원안내
            </button>
            <span className="text-[#dadada]">|</span>
            <button
              onClick={() => setActivePage('explore')}
              className="hover:text-[#181718] transition-colors"
            >
              나우드림
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Employee User Info with B2B status & Interactive Dropdown Menu */}
            <div className="relative">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 cursor-pointer hover:text-[#181718] py-1 select-none"
              >
                <span className="w-4 h-4 rounded-full bg-[#1f976b] text-white flex items-center justify-center text-[10px] font-bold">
                  G
                </span>
                <span className="font-semibold text-[#181718]">김지선</span>
                <span className="text-[11px] text-[#1f976b] bg-[#e8f5ef] px-1.5 py-0.5 rounded font-medium">
                  B2B 임직원
                </span>
                <ChevronDown className={`w-3 h-3 text-[#9c9c9c] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180 text-[#df0000]' : ''}`} />
              </div>

              {/* B2B User Profile Quick Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-[#cbd2d4] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#edf0f1]">
                    <div>
                      <div className="font-bold text-sm text-[#181718]">김지선 임직원님</div>
                      <div className="text-[11px] text-[#80888a] mt-0.5">(주)파트너스 B2B | EMP-2026-9243</div>
                    </div>
                    <span className="bg-[#e8f5ef] text-[#1f976b] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#a3d9bc]">
                      골드
                    </span>
                  </div>

                  <div className="my-2.5 bg-[#fffafa] border border-[#f9cdcd] rounded p-2.5 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-[#1f976b]">
                      <span>9월 잔여지원금:</span>
                      <span>{subsidyLedger.remainingSubsidy.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#555a5c] pt-1 border-t border-[#f5baba]">
                      <span>추천도서:</span>
                      <span className="font-medium text-[#df0000]">
                        {subsidyLedger.recommendedUsed ? '사용완료 (100% 지원)' : '1권 가능 (100% 지원)'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#555a5c]">
                      <span>개인도서:</span>
                      <span className="font-medium text-[#1f976b]">
                        {subsidyLedger.personalUsed ? '사용완료 (50% 지원)' : '10,000원 한도 가능'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePage('mypage');
                        setMyPageTab('subsidy');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded hover:bg-[#f6f6f6] font-medium text-[#181718] flex items-center justify-between transition-colors"
                    >
                      <span>💳 나의 B2B 독서지원 현황</span>
                      <span className="text-[#80888a] text-[10px]">&rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePage('mypage');
                        setMyPageTab('orders');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded hover:bg-[#f6f6f6] font-medium text-[#181718] flex items-center justify-between transition-colors"
                    >
                      <span>📦 주문 / 배송 내역</span>
                      <span className="text-[#80888a] text-[10px]">&rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePage('cart');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded hover:bg-[#ffebeb] font-bold text-[#df0000] flex items-center justify-between transition-colors"
                    >
                      <span>🛒 장바구니 이동</span>
                      <span className="text-[#df0000] text-[10px]">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span className="text-[#dadada]">|</span>

            {/* Cart with dynamic item badge */}
            <button
              onClick={() => setActivePage('cart')}
              className="flex items-center gap-1 hover:text-[#df0000] font-medium text-[#181718] relative"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#df0000]" />
              <span>장바구니</span>
              <span className="bg-[#df0000] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                {cartTotalItems}
              </span>
            </button>

            <span className="text-[#dadada]">|</span>

            <button
              onClick={() => {
                setActivePage('mypage');
                setMyPageTab('orders');
              }}
              className="hover:text-[#181718] transition-colors"
            >
              주문/배송
            </button>

            <span className="text-[#dadada]">|</span>

            <button
              onClick={() => {
                setActivePage('mypage');
                setMyPageTab('subsidy');
              }}
              className="hover:text-[#181718] transition-colors"
            >
              고객센터
            </button>
          </div>
        </div>
      </div>

      {/* 3. Center Header (Logo, Search, AD banner) */}
      <div className="max-w-[1280px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActivePage('explore')}
          className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
        >
          <div className="flex items-center justify-center">
            <img src="https://cdn.ypbooks.co.kr/image/logo/202512/bf6263dd-acbc-481a-bbe9-ee745440f5ac.png" alt="영풍문고" style={{ width: '160px', height: '40px' }} />
            <span className="pl-4 font-semibold text-[#555]">임직원 복지몰</span>
          </div>

        </div>

        {/* Search Bar */}
        <div className="w-full max-w-[560px] mx-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="생일책으로 뜻깊은 생일선물하기!"
              className="w-full h-11 pl-4 pr-12 rounded-lg border-[1.5px] border-[#b5bec0] focus:border-[#df0000] focus:outline-none text-sm text-[#181718] placeholder-[#9da6a8]"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center text-[#555a5c] hover:text-[#df0000]"
              aria-label="검색"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
          {/* Keyword tags under search */}
          <div className="hidden sm:flex items-center gap-3 mt-1.5 text-[12px] text-[#7e7e7e] overflow-hidden whitespace-nowrap">
            <span className="text-[#df0000] font-bold">인기검색어</span>
            <span className="cursor-pointer hover:text-[#df0000]" onClick={() => setActivePage('explore')}>1. 소설 보다</span>
            <span className="cursor-pointer hover:text-[#df0000]" onClick={() => setActivePage('explore')}>2. 82년생 김지영</span>
            <span className="cursor-pointer hover:text-[#df0000]" onClick={() => setActivePage('explore')}>3. 돈의 속성</span>
            <span className="cursor-pointer hover:text-[#df0000]" onClick={() => setActivePage('explore')}>4. 트렌드 코리아</span>
          </div>
        </div>

        {/* Right Promo Banner Card */}
        <div
          onClick={() => setActivePage('explore')}
          className="hidden xl:flex items-center gap-3 bg-[#f6f6f6] border border-[#dadada] rounded-lg p-2.5 cursor-pointer hover:border-[#80888a] transition-all"
        >
          <div className="w-10 h-14 bg-[#df0000] rounded text-white font-black text-xs flex items-center justify-center text-center leading-tight">
            찌니
            <br />
            주의보
          </div>
          <div className="space-y-0.5 pr-2">
            <span className="text-[10px] bg-white border border-[#cbd2d4] px-1.5 py-0.2 rounded text-[#80888a] font-medium">
              AD
            </span>
            <div className="text-xs font-bold text-[#181718] hover:text-[#df0000]">
              다름을 품는 따뜻한 마음의 이야기
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Main Navigation Bar (Red/Gray theme) */}
      <nav className="border-t border-[#dadada] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 h-full">

            {/* All Category Dropdown Trigger */}
            <div className="relative h-full flex items-center">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 bg-[#df0000] hover:bg-[#c90000] text-white px-4 h-9 rounded text-sm font-bold transition-colors mr-2"
              >
                <Menu className="w-4 h-4" />
                <span>전체 카테고리</span>
              </button>

              {/* Category Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#cbd2d4] rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-xs font-bold text-[#80888a] border-b border-[#edf0f1]">
                    B2B 독서 지원 분야
                  </div>
                  {[
                    '추천도서 (100% 전액지원)',
                    '개인도서 (50% 복합지원)',
                    '소설/문학',
                    '경영/경제/재테크',
                    '자기계발/리더십',
                    '인문/교양/역사',
                    '어린이/가족도서'
                  ].map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsCategoryOpen(false);
                        setActivePage('explore');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#181718] hover:bg-[#ffebeb] hover:text-[#df0000] font-medium flex items-center justify-between"
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Category Tabs */}
            <button
              onClick={() => setActivePage('explore')}
              className={`h-full px-2 sm:px-3 text-sm sm:text-base font-bold transition-colors ${activePage === 'explore'
                ? 'text-[#df0000] border-b-2 border-[#df0000]'
                : 'text-[#3d3c3f] hover:text-[#181718]'
                }`}
            >
              도서 전체보기
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-medium text-[#3d3c3f] hover:text-[#181718] cursor-pointer hidden sm:block"
            >
              베스트
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-medium text-[#3d3c3f] hover:text-[#181718] cursor-pointer hidden md:block curso"
            >
              신간도서
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-bold text-[#df0000] hover:text-[#c90000] cursor-pointer"
            >
              추천
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-medium text-[#3d3c3f] hover:text-[#181718] cursor-pointer"
            >
              개인도서
            </button>
          </div>

          {/* Right GNB status & Subsidies quick preview */}
          <div className="flex items-center space-x-3 text-xs">
            <button
              type="button"
              onClick={() => {
                setActivePage('mypage');
                setMyPageTab('subsidy');
              }}
              className="flex items-center gap-2 bg-[#f6f6f6] hover:bg-[#edf0f1] hover:border-[#df0000] px-3 py-1.5 rounded-full border border-[#cbd2d4] text-[#181718] cursor-pointer transition-all"
            >
              <span className="text-[#df0000] font-bold">9월 지원금</span>
              <span className="text-[#595959]">
                {subsidyLedger.recommendedUsed ? '추천: 완료' : '추천: 1권 잔여'} ·{' '}
                {subsidyLedger.personalUsed ? '개인: 완료' : '개인: 10,000원'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage('cart')}
              className="bg-[#df0000] hover:bg-[#c90000] text-white text-xs font-bold px-3.5 py-1.5 rounded transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>장바구니 바로가기</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
