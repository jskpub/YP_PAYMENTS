import React from 'react';
import { Award, BookOpen, Calendar, ChevronRight, Gift, MapPin, ShoppingCart, Tag, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BizMallGridPage } from './BizMallGridPage';

const quickMenus = [
  { label: '추천도서', icon: Award, page: 'recommended' as const },
  { label: '도서 전체보기', icon: BookOpen, page: 'explore' as const },
  { label: '이벤트', icon: Gift, page: 'explore' as const },
  { label: '혜택안내', icon: Tag, page: 'mypage' as const },
  { label: '매장안내', icon: MapPin, page: 'explore' as const },
  { label: '마이페이지', icon: User, page: 'mypage' as const },
];

export const HomePage: React.FC = () => {
  const { setActivePage, setMyPageTab, subsidyLedger, cart } = useShop();

  const openMenu = (page: 'explore' | 'recommended' | 'mypage') => {
    setActivePage(page);
    if (page === 'mypage') setMyPageTab('subsidy');
  };

  return (
    <div className='w-full bg-[#f6f6f6] text-[#181718]'>
      <section className='bg-[#181718] text-white'>
        <div className='max-w-[1280px] mx-auto px-4 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8'>
          <div className='max-w-2xl space-y-3'>
            <span className='inline-flex items-center gap-2 bg-[#df0000] rounded-full px-3 py-1 text-[11px] font-bold'>임직원 도서 복지 프로그램</span>
            <h1 className='text-2xl sm:text-3xl font-black leading-tight'>읽고 싶은 책, 회사가 함께 삽니다</h1>
            <p className='text-sm leading-relaxed text-white/75'>
              추천도서는 회사가 전액 지원하고, 직접 고른 개인도서는 50%를 지원합니다.
              <br className='hidden sm:block' />
              영풍문고 B2B 통합몰에서 도서 탐색부터 결제, 주문 내역까지 한 번에 이용하세요.
            </p>
            <button type='button' onClick={() => openMenu('explore')} className='mt-2 inline-flex items-center gap-1.5 bg-white text-[#df0000] rounded px-4 py-2.5 text-xs font-bold hover:bg-[#ffebeb] transition-colors'>
              도서 둘러보기
              <ChevronRight size={14} />
            </button>
          </div>

          <div className='w-full md:w-80 shrink-0 rounded-xl border border-white/15 bg-white/10 p-5 space-y-3'>
            <div className='flex items-center justify-between border-b border-white/15 pb-3 text-xs text-white/70'>
              <span>{subsidyLedger.month} 지원 현황</span>
              <span className='font-bold text-white'>B2B 임직원</span>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-white/80'>이번 달 남은 지원금</span>
              <strong className='text-[#a3e635]'>{subsidyLedger.remainingSubsidy.toLocaleString()}원</strong>
            </div>
            <div className='h-1.5 w-full overflow-hidden rounded-full bg-white/20'>
              <div className='h-full rounded-full bg-[#1f976b] transition-all' style={{ width: `${Math.max(0, Math.min(100, (subsidyLedger.remainingSubsidy / subsidyLedger.monthlyLimit) * 100))}%` }} />
            </div>
            <button type='button' onClick={() => openMenu('mypage')} className='text-xs font-semibold text-white/80 hover:text-white hover:underline'>
              나의 지원금 상세 확인 &gt;
            </button>
          </div>
        </div>
      </section>

      <section className='border-b border-[#cbd2d4] bg-white py-6'>
        <div className='max-w-[1280px] mx-auto px-4 grid grid-cols-3 sm:grid-cols-6 gap-3 text-center'>
          {quickMenus.map(({ label, icon: Icon, page }) => (
            <button key={label} type='button' onClick={() => openMenu(page)} className='group flex flex-col items-center gap-2 rounded-lg py-2 hover:bg-[#f6f6f6] transition-colors'>
              <span className='flex h-11 w-11 items-center justify-center rounded-full border border-[#cbd2d4] bg-white group-hover:border-[#df0000]'>
                <Icon className='h-5 w-5 text-[#80888a] group-hover:text-[#df0000]' />
              </span>
              <span className='text-[11px] font-semibold text-[#595959] group-hover:text-[#df0000]'>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className='max-w-[1280px] mx-auto px-4 pt-7 pb-2'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs font-bold text-[#df0000]'>영풍문고 B2B PICK</p>
            <h2 className='mt-1 text-xl font-black'>이달의 도서</h2>
          </div>
          <div className='flex items-center gap-2 text-xs text-[#80888a]'>
            <span>장바구니 {cart.reduce((total, item) => total + item.quantity, 0)}권</span>
            <button type='button' onClick={() => setActivePage('cart')} className='inline-flex items-center gap-1 text-[#df0000] font-bold hover:underline'>
              <ShoppingCart size={14} />
              바로가기
            </button>
          </div>
        </div>
      </section>

      <BizMallGridPage menu='ALL' />
    </div>
  );
};
