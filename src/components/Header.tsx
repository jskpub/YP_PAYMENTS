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
            {/* Employee User Info with B2B status */}
            <div
              onClick={() => {
                setActivePage('mypage');
                setMyPageTab('subsidy');
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-[#181718]"
            >
              <span className="w-4 h-4 rounded-full bg-[#1f976b] text-white flex items-center justify-center text-[10px] font-bold">
                G
              </span>
              <span className="font-semibold text-[#181718]">김지선</span>
              <span className="text-[11px] text-[#1f976b] bg-[#e8f5ef] px-1.5 py-0.5 rounded font-medium">
                B2B 임직원
              </span>
              <ChevronDown className="w-3 h-3 text-[#9c9c9c]" />
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
          <div className="w-10 h-10 rounded-full bg-[#df0000] flex items-center justify-center shadow-sm">
            <span className="text-white font-extrabold text-base tracking-tighter">YP</span>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-[#181718]">영풍문고</span>
            <span className="ml-2 text-[11px] font-bold text-[#1f976b] border border-[#1f976b] px-1.5 py-0.5 rounded">
              B2B 독서지원
            </span>
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
            <span
              onClick={() => setActivePage('explore')}
              className="cursor-pointer hover:text-[#df0000]"
            >
              창비브랜드전
            </span>
            <span className="text-[#dadada]">·</span>
            <span
              onClick={() => setActivePage('explore')}
              className="cursor-pointer hover:text-[#df0000]"
            >
              하루키 신간
            </span>
            <span className="text-[#dadada]">·</span>
            <span
              onClick={() => setActivePage('explore')}
              className="cursor-pointer hover:text-[#df0000]"
            >
              트렌드코리아
            </span>
            <span className="text-[#dadada]">·</span>
            <span
              onClick={() => setActivePage('explore')}
              className="cursor-pointer hover:text-[#df0000]"
            >
              흔한남매 23
            </span>
            <span className="text-[#dadada]">·</span>
            <span
              onClick={() => setActivePage('explore')}
              className="cursor-pointer hover:text-[#df0000]"
            >
              그리스인조르바
            </span>
          </div>
        </div>

        {/* Right Ad banner matching payment.png / cart.png */}
        <div
          onClick={() => setActivePage('explore')}
          className="hidden lg:flex items-center gap-3 bg-[#f6f6f6] p-2 rounded-lg border border-[#edf0f1] cursor-pointer hover:border-[#cbd2d4] transition-all max-w-[240px]"
        >
          <div className="w-12 h-16 bg-[#e1251b] rounded flex items-center justify-center text-white text-[10px] font-bold text-center px-1 shadow-sm flex-shrink-0">
            찌니주의보
          </div>
          <div className="text-left">
            <span className="text-[10px] text-[#80888a] font-medium bg-white px-1.5 py-0.5 rounded border border-[#edf0f1]">
              AD
            </span>
            <p className="text-xs font-semibold text-[#181718] mt-1 leading-tight line-clamp-2">
              다름을 품는 따뜻한 마음의 이야기
            </p>
          </div>
        </div>
      </div>

      {/* 4. Global Navigation Bar (GNB) with Red Accent Border */}
      <nav className="border-t border-[#dadada] border-b-[2.5px] border-[#df0000] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-4 h-full">
            {/* Category Dropdown Trigger */}
            <div className="relative h-full flex items-center">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 h-full px-3 text-[#181718] font-bold text-sm sm:text-base hover:bg-[#f6f6f6] transition-colors"
              >
                <Menu className="w-5 h-5 text-[#df0000]" />
                <span>전체 카테고리</span>
              </button>

              {/* Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute top-12 left-0 w-64 bg-white border border-[#cbd2d4] shadow-lg rounded-b-lg py-2 z-50">
                  <div className="px-4 py-2 text-xs font-bold text-[#80888a] border-b border-[#f6f6f6]">
                    B2B 독서지원 분야
                  </div>
                  <button
                    onClick={() => {
                      setActivePage('explore');
                      setIsCategoryOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#f6f6f6] flex items-center justify-between text-[#181718]"
                  >
                    <span>추천도서 (회사 100% 지원)</span>
                    <span className="text-[11px] bg-[#ffebeb] text-[#df0000] px-1.5 py-0.5 rounded font-semibold">
                      전액지원
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('explore');
                      setIsCategoryOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#f6f6f6] flex items-center justify-between text-[#181718]"
                  >
                    <span>개인도서 (50% 지원, 최대 1만원)</span>
                    <span className="text-[11px] bg-[#edf0f1] text-[#555a5c] px-1.5 py-0.5 rounded font-semibold">
                      복합결제
                    </span>
                  </button>
                  <div className="border-t border-[#edf0f1] my-1"></div>
                  {['소설/시/희곡', '경영/경제', '인문/교양', '자기계발', '어린이/청소년', 'eBook/전자책'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActivePage('explore');
                          setIsCategoryOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#595959] hover:bg-[#f6f6f6] hover:text-[#181718]"
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Nav links */}
            <button
              onClick={() => setActivePage('explore')}
              className={`h-full px-2 sm:px-3 text-sm sm:text-base font-semibold transition-colors ${
                activePage === 'explore'
                  ? 'text-[#df0000] border-b-2 border-[#df0000]'
                  : 'text-[#3d3c3f] hover:text-[#181718]'
              }`}
            >
              베스트
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-medium text-[#3d3c3f] hover:text-[#181718] hidden sm:block"
            >
              신상품
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-bold text-[#df0000] hover:text-[#ea2e2e] flex items-center gap-1"
            >
              <span>추천도서</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#df0000]"></span>
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-medium text-[#3d3c3f] hover:text-[#181718]"
            >
              개인도서
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-medium text-[#3d3c3f] hover:text-[#181718] hidden md:block"
            >
              기프티콘
            </button>
            <button
              onClick={() => setActivePage('explore')}
              className="h-full px-2 sm:px-3 text-sm sm:text-base font-medium text-[#3d3c3f] hover:text-[#181718] hidden lg:block text-[#df0000]"
            >
              컬처페이지
            </button>
          </div>

          {/* Right GNB status & Subsidies quick preview */}
          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => {
                setActivePage('mypage');
                setMyPageTab('subsidy');
              }}
              className="hidden sm:flex items-center gap-2 bg-[#f6f6f6] hover:bg-[#edf0f1] px-3 py-1.5 rounded-full border border-[#cbd2d4] text-[#181718]"
            >
              <span className="text-[#df0000] font-bold">9월 지원금</span>
              <span className="text-[#595959]">
                {subsidyLedger.recommendedUsed ? '추천: 완료' : '추천: 1권 잔여'} ·{' '}
                {subsidyLedger.personalUsed ? '개인: 완료' : '개인: 10,000원'}
              </span>
            </button>

            <button
              onClick={() => setActivePage('cart')}
              className={`hidden md:block text-xs font-semibold px-2 py-1 rounded transition-colors ${
                activePage === 'cart' ? 'bg-[#df0000] text-white' : 'text-[#595959] hover:text-[#df0000]'
              }`}
            >
              장바구니 바로가기
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
