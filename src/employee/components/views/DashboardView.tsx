import React from 'react';
import { Truck, Wallet, Ticket, ShoppingCart, ChevronRight, Store, BookOpen, Heart, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { ActiveTab, BenefitState } from '../../types';

interface DashboardViewProps {
  benefitState: BenefitState;
  cartCount: number;
  wishlistCount: number;
  orderCount: number;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenRecommendedModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ benefitState, cartCount, wishlistCount, orderCount, setActiveTab, onOpenRecommendedModal }) => {
  return (
    <div className='space-y-6'>
      {/* 상단 브레드크럼 */}
      <div className='flex items-center gap-1.5 text-xs text-gray-500'>
        <span className='text-[#D7001E] font-bold'>마이페이지 홈</span>
      </div>

      {/* 임직원 지원금 바로가기 하이라이트 배너 */}
      <div className='bg-gradient-to-r from-red-600 to-[#D7001E] text-white rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <span className='bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block'>2026년 상반기 임직원 복지혜택</span>
          <h2 className='text-xl font-black tracking-tight'>도서 지원금 잔여 {benefitState.personalBook.remainingAmount.toLocaleString()}원 + 추천도서 100% 지원</h2>
          <p className='text-xs text-red-100 mt-1'>사내 권장도서 100선 1권 무료 지원 및 개인 자유도서 50% 차감 혜택을 이용해보세요.</p>
        </div>
        <button type='button' onClick={() => setActiveTab('benefit')} className='px-5 py-2.5 bg-white text-[#D7001E] font-bold text-xs rounded-lg hover:bg-red-50 transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5'>
          <span>나의 지원금 확인</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 4대 요약 카드 (시안 2 상단) */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        <div onClick={() => setActiveTab('orders')} className='bg-white border border-gray-200 rounded-xl p-4 text-center shadow-xs cursor-pointer hover:border-red-300 transition-colors'>
          <div className='w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2'>
            <Truck size={20} />
          </div>
          <p className='text-xs text-gray-500'>진행중인 주문</p>
          <p className='text-xl font-bold text-gray-900 mt-0.5'>{orderCount}</p>
        </div>

        <div className='bg-white border border-gray-200 rounded-xl p-4 text-center shadow-xs'>
          <div className='w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2'>
            <Wallet size={20} />
          </div>
          <p className='text-xs text-gray-500'>계좌 잔액</p>
          <p className='text-xl font-bold text-gray-900 mt-0.5'>1,000</p>
        </div>

        <div className='bg-white border border-gray-200 rounded-xl p-4 text-center shadow-xs'>
          <div className='w-10 h-10 mx-auto rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2'>
            <Ticket size={20} />
          </div>
          <p className='text-xs text-gray-500'>보유 쿠폰</p>
          <p className='text-xl font-bold text-gray-900 mt-0.5'>0</p>
        </div>

        <div onClick={() => setActiveTab('cart')} className='bg-white border border-gray-200 rounded-xl p-4 text-center shadow-xs cursor-pointer hover:border-red-300 transition-colors'>
          <div className='w-10 h-10 mx-auto rounded-full bg-red-50 text-[#D7001E] flex items-center justify-center mb-2'>
            <ShoppingCart size={20} />
          </div>
          <p className='text-xs text-gray-500'>장바구니</p>
          <p className='text-xl font-bold text-[#D7001E] mt-0.5'>{cartCount}</p>
        </div>
      </div>

      {/* 최근 주문 내역 및 바로가기 */}
      <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4'>
        <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
          <div className='flex items-center gap-2'>
            <h3 className='font-bold text-gray-900 text-sm'>도서 주문내역</h3>
            <span className='text-xs text-gray-400'>최근 주문하신 도서</span>
          </div>
        </div>

        <div className='py-5 text-center text-xs text-gray-500'>{orderCount === 0 ? '최근에 주문한 도서가 없습니다.' : `최근 주문 ${orderCount}건이 있습니다.`}</div>

        <div className='flex justify-center gap-2 border-t border-gray-100 pt-4'>
          <button type='button' onClick={onOpenRecommendedModal} className='px-4 py-2 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors'>
            추천도서 보기
          </button>
          <button type='button' onClick={() => setActiveTab('cart')} className='px-4 py-2 bg-white border border-[#D7001E] rounded text-xs font-semibold text-[#D7001E] hover:bg-red-50 transition-colors'>
            장바구니 바로가기
          </button>
        </div>
      </div>

      {/* 나우드림 기본 수령매장 카드 (시안 2) */}
      <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-2 text-xs'>
        <div className='flex items-center justify-between'>
          <h3 className='font-bold text-gray-900 text-sm flex items-center gap-1.5'>
            <Store size={16} className='text-[#D7001E]' />
            <span>나우드림 기본 수령매장</span>
          </h3>
          <button type='button' onClick={() => alert('매장 등록 화면으로 이동합니다.')} className='text-xs text-[#D7001E] font-semibold hover:underline cursor-pointer flex items-center gap-0.5'>
            <span>매장 등록하기</span>
            <ChevronRight size={13} />
          </button>
        </div>
        <div className='p-3 bg-gray-50 rounded-lg flex items-center justify-between'>
          <span className='text-gray-600'>기본 수령매장:</span>
          <span className='font-bold text-gray-900'>영풍문고 강남역점 (지하 1층)</span>
        </div>
        <p className='text-[11px] text-gray-400'>• 기본 수령매장을 설정하시면 온라인에서 결제하고 매장에서 바로 책을 수령하는 빠른 나우드림 주문이 가능합니다.</p>
      </div>

      {/* 내 서재 & 위시리스트 요약 (시안 2) */}
      <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4'>
        <div className='flex items-center justify-between border-b border-gray-100 pb-2'>
          <h3 className='font-bold text-gray-900 text-sm'>내 서재 (위시리스트 {wishlistCount}권)</h3>
          <button type='button' onClick={() => setActiveTab('wishlist')} className='text-xs text-gray-500 hover:text-[#D7001E] flex items-center gap-0.5 cursor-pointer'>
            <span>서재 전체보기</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
          <div className='border border-gray-200 rounded-lg p-3.5 space-y-2'>
            <div className='flex justify-between items-center font-bold text-gray-800'>
              <span>기본 서재 (찜한 도서)</span>
              <span className='text-[#D7001E]'>{wishlistCount}권 보관중</span>
            </div>
            <p className='text-gray-500 text-[11px]'>임직원 추천 도서 및 개인 지원금 적용 도서가 위시리스트에 저장되어 있습니다.</p>
            <button type='button' onClick={() => setActiveTab('wishlist')} className='text-[#D7001E] font-semibold hover:underline flex items-center gap-1 pt-1'>
              <span>위시리스트 바로가기</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className='border border-gray-200 rounded-lg p-3.5 space-y-2'>
            <div className='flex justify-between items-center font-bold text-gray-800'>
              <span>사내 권장도서 100선</span>
              <span className='text-emerald-700'>100% 무료 지원</span>
            </div>
            <p className='text-gray-500 text-[11px]'>올해 상반기 지정된 사내 추천도서 목록을 둘러보고 무료로 신청하세요.</p>
            <button type='button' onClick={onOpenRecommendedModal} className='text-emerald-700 font-semibold hover:underline flex items-center gap-1 pt-1'>
              <span>권장도서 목록 보기</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 1:1 상담내역 (시안 2) */}
      <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3'>
        <div className='flex items-center justify-between border-b border-gray-100 pb-2'>
          <h3 className='font-bold text-gray-900 text-sm'>1:1 상담내역</h3>
          <button type='button' onClick={() => alert('상담내역 전체보기 창입니다.')} className='text-xs text-gray-500 hover:text-gray-800 flex items-center gap-0.5 cursor-pointer'>
            <span>상담내역 전체보기</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className='p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2'>
          <div>
            <span className='text-gray-400 text-[10px] block'>기타 | 2026.09.02</span>
            <p className='font-bold text-gray-800 mt-0.5'>[협업 제안] [새싹 청년 취업 사관학교 강동 캠퍼스 AI PM 교육]</p>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            <span className='bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]'>답변완료</span>
            <button type='button' onClick={() => alert('추가 문의하기 입력 창입니다.')} className='px-2 py-1 bg-white border border-gray-300 rounded text-[11px] text-gray-700 hover:bg-gray-100'>
              추가 문의하기
            </button>
          </div>
        </div>
      </div>

      {/* 이달의 혜택 배너 (시안 2) */}
      <div className='bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-5 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <span className='text-xs font-bold text-emerald-200'>🍀 이달의 혜택</span>
          <h4 className='text-lg font-black mt-0.5'>영풍문고 이달의 리뷰왕을 찾아라!</h4>
          <p className='text-xs text-emerald-100 mt-0.5'>도서 구매 후 소중한 리뷰를 남겨주시면 최대 적립금 쿠폰을 지급해드립니다.</p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='bg-red-500/90 text-white px-3 py-1.5 rounded-lg text-center font-bold text-xs'>
            <span className='text-sm block font-black'>5,000원</span>
            <span className='text-[10px] opacity-80'>적립금</span>
          </div>
          <div className='bg-emerald-800/80 text-white px-3 py-1.5 rounded-lg text-center font-bold text-xs'>
            <span className='text-sm block font-black'>3,000원</span>
            <span className='text-[10px] opacity-80'>적립금</span>
          </div>
          <div className='bg-emerald-800/80 text-white px-3 py-1.5 rounded-lg text-center font-bold text-xs'>
            <span className='text-sm block font-black'>2,000원</span>
            <span className='text-[10px] opacity-80'>적립금</span>
          </div>
        </div>
      </div>
    </div>
  );
};
