import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search, User, Wallet } from 'lucide-react';
import { BenefitState, GnbMenu } from '../types';
import { POPULAR_KEYWORDS } from '../data/mockData';
import { BizMallBrandLogo } from './BizMallBrandLogo';

interface BizMallHeaderProps {
  employeeName: string;
  benefit: BenefitState;
  activeMenu: GnbMenu;
  onMenuChange: (menu: GnbMenu) => void;
  cartCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  /** 통합 도서 검색 페이지로 이동 — 원본 프로토타입에는 없던 제출 동작을 yp_payments 통합 시 추가함 */
  onSearchSubmit?: () => void;
  onPendingNav: (label: string) => void;
  onLogout: () => void;
}

const GNB_ITEMS: { id: GnbMenu; label: string }[] = [
  { id: 'RECOMMENDED', label: '추천 도서' },
  { id: 'BEST', label: '베스트' },
  { id: 'NEW', label: '신상품' },
];

export const BizMallHeader: React.FC<BizMallHeaderProps> = ({ employeeName, benefit, activeMenu, onMenuChange, cartCount, searchQuery, onSearchChange, onSearchSubmit, onPendingNav, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const openUserMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsUserMenuOpen(true);
  };

  const scheduleCloseUserMenu = () => {
    closeTimer.current = setTimeout(() => setIsUserMenuOpen(false), 250);
  };

  const goPending = (label: string) => {
    onPendingNav(label);
    setIsUserMenuOpen(false);
  };

  return (
    <header className='sticky z-30 w-full border-b border-yp-gray-200 bg-white' style={{ top: 'var(--nav-bar-height, 0px)' }}>
      {/* 1. 상단 유틸 영역 — 내 이름 / 장바구니 / 주문·배송 / 고객센터 */}
      <div className='border-b border-yp-gray-100'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs text-yp-gray-500'>
          <div className='flex items-center gap-3'>
            <span className='cursor-pointer hover:text-yp-red'>매장안내</span>
            <span className='text-yp-gray-200'>|</span>
            <span className='cursor-pointer hover:text-yp-red'>혜택안내</span>
          </div>

          <div className='relative flex items-center gap-3'>
            <div className='relative py-1' onMouseEnter={openUserMenu} onMouseLeave={scheduleCloseUserMenu}>
              <button type='button' onClick={() => setIsUserMenuOpen((prev) => !prev)} className='flex cursor-pointer items-center gap-1.5 font-medium text-yp-ink hover:text-yp-red'>
                <span className='flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold leading-none text-white'>{employeeName.charAt(0)}</span>
                <span className='font-semibold'>{employeeName}</span>
                <ChevronDown size={12} className={`text-yp-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className='absolute right-0 top-full z-50 w-72 pt-1'>
                  <div className='overflow-hidden rounded-lg border border-yp-gray-200 bg-white text-xs shadow-xl'>
                    <div className='flex items-center gap-3 p-4'>
                      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yp-gray-100 text-yp-gray-400'>
                        <User size={26} />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-1.5'>
                          <span className='text-sm font-bold text-yp-ink'>{employeeName} 님</span>
                          <span className='rounded border border-emerald-600 px-1.5 text-[10px] font-bold leading-tight text-emerald-600'>임직원</span>
                        </div>
                        <div className='flex items-center gap-1 text-[12px] text-yp-gray-500'>
                          <button type='button' onClick={() => goPending('마이페이지')} className='cursor-pointer font-medium hover:text-yp-red hover:underline'>
                            마이페이지
                          </button>
                          <span>|</span>
                          <button type='button' onClick={() => goPending('회원정보 관리')} className='cursor-pointer hover:text-yp-red hover:underline'>
                            내 정보
                          </button>
                          <span>|</span>
                          <button type='button' onClick={onLogout} className='cursor-pointer hover:text-yp-ink hover:underline'>
                            로그아웃
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-between border-y border-yp-red-soft bg-yp-red-soft px-4 py-2 text-[12px]'>
                      <span className='font-bold text-yp-red'>이번 달 남은 지원금</span>
                      <button type='button' onClick={() => goPending('나의 지원금')} className='cursor-pointer font-bold text-yp-red hover:underline'>
                        개인도서 {benefit.personalBook.remainingAmount.toLocaleString()}원 ➔
                      </button>
                    </div>

                    <div className='grid grid-cols-2 divide-x divide-yp-gray-200 bg-white text-center text-[12px] font-medium text-yp-gray-700'>
                      <button
                        type='button'
                        //   onClick={() => goPending('주문/배송 조회')}
                        className='cursor-pointer py-2.5 transition-colors hover:bg-yp-gray-50 hover:text-yp-red'
                      >
                        주문/배송
                      </button>
                      <button
                        type='button'
                        //  onClick={() => goPending('취소/반품/교환')}
                        className='cursor-pointer py-2.5 transition-colors hover:bg-yp-gray-50 hover:text-yp-red disabled:cursor-not-allowed'
                      >
                        취소/반품/교환
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <span className='text-yp-gray-200'>|</span>
            <button type='button' onClick={() => onPendingNav('장바구니')} className='flex cursor-pointer items-center gap-1 hover:text-yp-red'>
              <span>장바구니</span>
              {cartCount > 0 && <span className='font-bold text-yp-red'>({cartCount})</span>}
            </button>

            <span className='text-yp-gray-200'>|</span>
            <button
              type='button'
              // onClick={() => onPendingNav('주문/배송 조회')}
              className='cursor-pointer hover:text-yp-red disabled:cursor-not-allowed'
            >
              주문/배송
            </button>

            <span className='text-yp-gray-200'>|</span>
            <span className='cursor-pointer hover:text-yp-red'>고객센터</span>
          </div>
        </div>
      </div>

      {/* 2. 로고 + 검색창 + 지원금 잔여 */}
      <div className='mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-4 md:flex-row md:items-center'>
        <button type='button' onClick={() => onMenuChange('ALL')} className='cursor-pointer text-left'>
          <BizMallBrandLogo />
        </button>

        <div className='mx-0 max-w-xl flex-1 md:mx-4'>
          <form
            className='relative flex items-center'
            onSubmit={(event) => {
              event.preventDefault();
              onSearchSubmit?.();
            }}
          >
            <input
              type='text'
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder='도서명, 저자명, 키워드를 검색해 보세요'
              className='w-full rounded-full border border-yp-gray-300 py-2.5 pl-5 pr-12 text-sm text-yp-ink placeholder-yp-gray-400 focus:border-yp-red focus:outline-none focus:ring-1 focus:ring-yp-red'
            />
            <button type='submit' aria-label='도서 검색' className='absolute right-3.5 cursor-pointer rounded-full p-1 text-yp-gray-500 hover:text-yp-red'>
              <Search size={20} />
            </button>
          </form>
          <div className='scrollbar-none mt-1.5 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[12px] text-yp-gray-500'>
            {POPULAR_KEYWORDS.map((keyword, index) => (
              <React.Fragment key={keyword}>
                {index > 0 && <span className='text-yp-gray-200'>·</span>}
                <button
                  type='button'
                  onClick={() => {
                    onSearchChange(keyword);
                    onSearchSubmit?.();
                  }}
                  className='cursor-pointer hover:text-yp-red'
                >
                  {keyword}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* B2B 전용 요소는 지원금 잔여 현황만 유지 */}
        <button type='button' onClick={() => onPendingNav('나의 지원금')} className='flex shrink-0 cursor-pointer items-center gap-3 rounded-xl border border-yp-gray-200 bg-yp-red-soft px-3.5 py-2 text-left transition-colors hover:border-yp-red'>
          <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yp-red text-white'>
            <Wallet className='h-4 w-4' />
          </span>
          <span>
            <span className='block text-[10px] font-bold text-yp-gray-500'>{benefit.cycleLabel} 남은 지원금</span>
            <span className='mt-0.5 block text-sm font-extrabold leading-none text-yp-red'>
              개인 {benefit.personalBook.remainingAmount.toLocaleString()}원 · 추천 {benefit.recommendedBook.limitCount - benefit.recommendedBook.usedCount}권
            </span>
          </span>
        </button>
      </div>

      {/* 3. 대메뉴 — 전체 카테고리 / 추천 도서 / 베스트 / 신상품 */}
      <div className='border-t border-yp-gray-200'>
        <div className='scrollbar-none mx-auto flex max-w-7xl items-center justify-between overflow-x-auto px-4 text-sm font-medium text-yp-ink'>
          <div className='flex items-center whitespace-nowrap'>
            <button type='button' onClick={() => onPendingNav('전체 카테고리')} className='mr-3 flex cursor-pointer items-center gap-1.5 border-r border-yp-gray-200 px-3 py-3 font-bold hover:text-yp-red'>
              <span className='text-lg leading-none'>☰</span>
              <span>전체 카테고리</span>
            </button>

            {GNB_ITEMS.map((item) => (
              <button key={item.id} type='button' onClick={() => onMenuChange(item.id)} className={`cursor-pointer px-3 py-3 transition-colors ${activeMenu === item.id ? 'border-b-2 border-yp-red font-bold text-yp-red' : 'hover:text-yp-red'}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-3 whitespace-nowrap pl-4 text-xs text-yp-gray-500'>
            <span className='cursor-pointer hover:text-yp-ink'>사은품</span>
            <span className='cursor-pointer hover:text-yp-ink'>이벤트</span>
            <span className='cursor-pointer font-bold text-yp-ink hover:text-yp-red'>트렌드 코리아 2027</span>
          </div>
        </div>
      </div>
    </header>
  );
};
