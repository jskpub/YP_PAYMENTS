import React, { useState } from 'react';
import { ChevronDown, Menu, Search, User, Wallet, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const categories = ['추천도서 (100% 전액지원)', '개인도서 (50% 복합지원)', '소설/문학', '경영/경제/재테크', '자기계발/리더십', '인문/교양/역사', '어린이/가족도서'];

export const Header: React.FC = () => {
  const { activePage, setActivePage, cart, subsidyLedger, setMyPageTab } = useShop();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const goMyPage = () => {
    setActivePage('mypage');
    setMyPageTab('subsidy');
    setIsUserMenuOpen(false);
  };
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setActivePage('explore');
  };

  return (
    <header className='w-full border-b border-[#dadada] bg-white text-[#181718]'>
      <div className='mx-auto flex min-h-[92px] max-w-[1280px] items-center gap-8 px-4 py-4'>
        <button type='button' onClick={() => setActivePage('home')} className='flex shrink-0 items-center gap-2.5 text-left'>
          <span className='flex h-10 w-10 items-center justify-center rounded-full bg-[#9f2c20] text-[9px] font-black leading-none text-white'>
            YP
            <br />
            BOOKS
          </span>
          <span className='flex items-center gap-2 text-xl font-black tracking-tight'>
            영풍문고 <b className='rounded bg-[#9f2c20] px-1.5 py-0.5 text-[10px] text-white'>비즈몰</b>
          </span>
        </button>
        <div className='min-w-0 flex-1'>
          <form onSubmit={submitSearch} className='relative mx-auto max-w-[540px]'>
            <input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder='도서명, 저자명, 키워드를 검색해 보세요' className='h-10 w-full rounded-full border border-[#b5bec0] px-5 pr-12 text-sm outline-none focus:border-[#9f2c20]' />
            <button type='submit' aria-label='도서 검색' className='absolute right-3 top-1/2 -translate-y-1/2 text-[#686e70] hover:text-[#9f2c20]'>
              <Search className='h-5 w-5' />
            </button>
          </form>
          <div className='mx-auto mt-1 flex max-w-[540px] gap-3 overflow-hidden whitespace-nowrap text-[10px] text-[#80888a]'>
            {['트렌드코리아 2027', '생성형 AI', '함께 자라기', '소년이 온다', '직무역량'].map((keyword) => (
              <button
                key={keyword}
                type='button'
                onClick={() => {
                  setSearchKeyword(keyword);
                  setActivePage('explore');
                }}
                className='hover:text-[#9f2c20]'
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
        <div className='hidden shrink-0 items-center gap-2 rounded-xl border border-[#dadada] bg-[#fffafa] px-3 py-2 md:flex'>
          <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#9f2c20] text-white'>
            <Wallet className='h-4 w-4' />
          </span>
          <button type='button' onClick={goMyPage} className='text-left'>
            <span className='block text-[10px] font-bold text-[#80888a]'>2026년 9월 남은 지원금</span>
            <span className='block text-sm font-extrabold leading-tight text-[#9f2c20]'>
              개인 {subsidyLedger.remainingSubsidy.toLocaleString()}원 · 추천 {subsidyLedger.recommendedUsed ? 0 : 1}권
            </span>
          </button>
        </div>
      </div>
      <nav className='border-t border-[#edf0f1]'>
        <div className='mx-auto flex h-12 max-w-[1280px] items-center justify-between px-4'>
          <div className='flex h-full items-center whitespace-nowrap text-sm font-medium'>
            <div className='relative flex h-full items-center'>
              <button type='button' onClick={() => setIsCategoryOpen((open) => !open)} className='mr-3 flex h-9 items-center gap-1.5 border-r border-[#dadada] pr-5 font-bold hover:text-[#9f2c20]'>
                <Menu className='h-4 w-4' />
                전체 카테고리
              </button>
              {isCategoryOpen && (
                <div className='absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-[#cbd2d4] bg-white py-2 text-xs shadow-xl'>
                  <div className='flex items-center justify-between border-b border-[#edf0f1] px-4 py-2 font-bold text-[#80888a]'>
                    B2B 독서 지원 분야{' '}
                    <button type='button' onClick={() => setIsCategoryOpen(false)} aria-label='카테고리 닫기'>
                      <X className='h-3.5 w-3.5' />
                    </button>
                  </div>
                  {categories.map((category, index) => (
                    <button
                      key={category}
                      type='button'
                      onClick={() => {
                        setIsCategoryOpen(false);
                        setActivePage(index === 0 ? 'recommended' : 'explore');
                      }}
                      className='flex w-full items-center justify-between px-4 py-2.5 text-left font-medium hover:bg-[#ffebeb] hover:text-[#df0000]'
                    >
                      <span>{category}</span>
                      <ChevronDown className='h-3 w-3 -rotate-90 text-[#c3c2c2]' />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type='button' onClick={() => setActivePage('recommended')} className={`h-full border-b-2 px-4 font-bold ${activePage === 'recommended' ? 'border-[#df0000] text-[#df0000]' : 'border-transparent hover:text-[#df0000]'}`}>
              추천 도서
            </button>
            <button type='button' className='h-full border-b-2 border-transparent px-4 hover:text-[#df0000]'>
              베스트
            </button>
            <button type='button' onClick={() => setActivePage('explore')} className='h-full border-b-2 border-transparent px-4 hover:text-[#df0000]'>
              신상품
            </button>
          </div>
          <div className='hidden items-center gap-4 whitespace-nowrap text-xs text-[#686e70] sm:flex'>
            <button type='button' onClick={() => setActivePage('explore')} className='hover:text-[#181718]'>
              사은품
            </button>
            <button type='button' onClick={() => setActivePage('explore')} className='hover:text-[#181718]'>
              이벤트
            </button>
            <button type='button' onClick={() => setActivePage('explore')} className='font-bold text-[#181718] hover:text-[#df0000]'>
              트렌드 코리아 2027
            </button>
            <span className='text-[#dadada]'>|</span>
            <div className='relative'>
              <button type='button' onClick={() => setIsUserMenuOpen((open) => !open)} className='flex items-center gap-1 hover:text-[#df0000]'>
                <User className='h-3.5 w-3.5' />
                마이페이지 <ChevronDown className='h-3 w-3' />
              </button>
              {isUserMenuOpen && (
                <div className='absolute right-0 top-full z-50 mt-2 w-36 rounded-lg border border-[#cbd2d4] bg-white p-1.5 text-xs shadow-xl'>
                  <button type='button' onClick={goMyPage} className='w-full rounded px-2.5 py-2 text-left hover:bg-[#ffebeb]'>
                    마이페이지 홈
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setActivePage('cart');
                      setIsUserMenuOpen(false);
                    }}
                    className='flex w-full items-center justify-between rounded px-2.5 py-2 text-left hover:bg-[#ffebeb]'
                  >
                    장바구니 <b className='text-[#df0000]'>{cartTotalItems}</b>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
