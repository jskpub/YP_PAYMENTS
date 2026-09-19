import React, { useState } from 'react';
import { ChevronRight, Info, BookCheck, Wallet, ArrowUpRight, Search, CheckCircle2, Clock, Calculator, ShieldCheck, AlertCircle } from 'lucide-react';
import { BenefitState, BenefitHistoryItem, ActiveTab } from '../../types';

interface BenefitViewProps {
  benefitState: BenefitState;
  history: BenefitHistoryItem[];
  onOpenRecommendedModal: () => void;
  onOpenOrderDetail: (orderNumber: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BenefitView: React.FC<BenefitViewProps> = ({ benefitState, history, onOpenRecommendedModal, onOpenOrderDetail, setActiveTab }) => {
  const [filterType, setFilterType] = useState<'all' | '추천도서' | '개인도서'>('all');
  const [period, setPeriod] = useState<string>('3개월');
  const [simulatedPrice, setSimulatedPrice] = useState<number>(20000);

  const filteredHistory = history.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  // 지원금 계산 시뮬레이션
  const simulatedSupport = Math.min(Math.floor(simulatedPrice * 0.5), benefitState.personalBook.remainingAmount);
  const simulatedSelfPay = simulatedPrice - simulatedSupport;

  return (
    <div className='space-y-6'>
      {/* 브레드크럼 */}
      <div className='flex items-center gap-1.5 text-xs text-gray-500'>
        <span className='hover:text-gray-800 cursor-pointer' onClick={() => setActiveTab('dashboard')}>
          홈
        </span>
        <ChevronRight size={12} />
        <span className='hover:text-gray-800 cursor-pointer' onClick={() => setActiveTab('dashboard')}>
          마이페이지
        </span>
        <ChevronRight size={12} />
        <span className='text-gray-600 font-medium'>내 계좌</span>
        <ChevronRight size={12} />
        <span className='text-[#D7001E] font-bold'>나의 지원금</span>
      </div>

      {/* 페이지 타이틀 헤더 */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-200 pb-4'>
        <div>
          <h1 className='text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2'>
            <span>나의 지원금</span>
            <span className='text-xs font-semibold bg-red-100 text-[#D7001E] px-2 py-0.5 rounded-full'>임직원 전용</span>
          </h1>
          <p className='text-xs text-gray-500 mt-1'>임직원 도서 구입 지원금 잔여 현황 및 사용 내역을 확인하실 수 있습니다.</p>
        </div>
        <div className='inline-flex items-center gap-1.5 text-xs font-semibold text-[#D7001E] bg-red-50 border border-red-200 rounded-full px-3 py-1 self-start md:self-auto'>
          <Clock size={13} />
          <span>2026년도 상반기 지원금 (사용기한: 2026.06.30까지)</span>
        </div>
      </div>

      {/* 지원금 정책 안내 공지 배너 */}
      <div className='bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-emerald-900 shadow-xs'>
        <Info size={16} className='text-emerald-600 shrink-0 mt-0.5' />
        <div className='leading-relaxed'>
          <span className='font-bold text-emerald-800'>지원금 정책 안내:</span> <span className='font-semibold text-emerald-950'>[추천 도서]</span> 사내 권장도서 목록은 금액 차감 없이 100% 전액 지원됩니다. <span className='font-semibold text-emerald-950'>[개인 도서]</span> 자유 도서 구입 시 반기
          누적 총 한도 10,000원 내에서 결제금액의 50%가 지원금으로 차감 지원됩니다.
        </div>
      </div>

      {/* 2026년 상반기 지원금 현황 종합 바 */}
      <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
          <div>
            <span className='text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1'>2026년 상반기 지원금 현황 종합</span>
            <div className='flex items-baseline gap-3 flex-wrap'>
              <span className='text-xs text-gray-600 font-medium'>개인 도서 잔여:</span>
              <span className='text-3xl font-black text-[#D7001E]'>{benefitState.personalBook.remainingAmount.toLocaleString()} 원</span>
              <span className='bg-red-50 text-[#D7001E] text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200'>50.0% 보유</span>
              <span className='text-gray-300 hidden sm:inline'>|</span>
              <div className='text-xs text-gray-600 flex items-center gap-1.5 font-medium'>
                <span>추천 도서:</span>
                <span className='font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200'>100% 전액 지원 ({benefitState.recommendedBook.usedCount}권 사용완료)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2분할 상세 카드 (추천 도서 vs 개인 도서) */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {/* 카드 1: 추천 도서 지원금 */}
        <div className='bg-white border border-emerald-200 rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-60 pointer-events-none'></div>
          <div>
            <div className='flex items-center justify-between gap-2 mb-2'>
              <div className='flex items-center gap-2'>
                <span className='w-2.5 h-2.5 rounded-full bg-emerald-500'></span>
                <h3 className='font-bold text-gray-900 text-sm'>추천 도서 지원금</h3>
              </div>
              {/* <span className='bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full'>100% 전액 무료 지원</span> */}
            </div>
            <p className='text-xs text-gray-500 mb-4'>사내 권장도서 목록 전용 (금액 차감 없는 전액 무료 지원)</p>

            <div className='space-y-2 bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 text-xs mb-4'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>2026 상반기 사용 상태</span>
                <span className='font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200'>사용 완료 (1권 전액 지원 적용)</span>
              </div>
              <div className='flex justify-between items-center pt-1 border-t border-emerald-100 text-[12px]'>
                <span className='text-gray-500'>최근 지원 도서</span>
                <span className='font-semibold text-gray-800 truncate max-w-[200px]'>{benefitState.recommendedBook.recentBookTitle}</span>
              </div>
            </div>
          </div>

          <div className='pt-3 border-t border-gray-100 flex items-center justify-between text-xs'>
            <span className='text-gray-500 font-medium'>사내 지정 도서 전액 무료</span>
            <button type='button' onClick={onOpenRecommendedModal} className='inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer'>
              <span>권장도서 목록 바로가기</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* 카드 2: 개인 도서 지원금 */}
        <div className='bg-white border border-red-200 rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 opacity-60 pointer-events-none'></div>
          <div>
            <div className='flex items-center justify-between gap-2 mb-2'>
              <div className='flex items-center gap-2'>
                <span className='w-2.5 h-2.5 rounded-full bg-[#D7001E]'></span>
                <h3 className='font-bold text-gray-900 text-sm'>개인 도서 지원금</h3>
              </div>
              {/* <span className='bg-red-100 text-[#D7001E] text-xs font-bold px-2 py-0.5 rounded-full'>50% 지원 (누적 총 1만원 한도)</span> */}
            </div>
            <p className='text-xs text-gray-500 mb-4'>자유 도서 구매 시 50% 지원 (반기 총 한도 10,000원까지 차감)</p>

            <div className='space-y-2 bg-red-50/40 border border-red-100 rounded-lg p-3 text-xs mb-4'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>잔여 지원금</span>
                <span className='text-base font-black text-[#D7001E]'>{benefitState.personalBook.remainingAmount.toLocaleString()}원</span>
              </div>
              {/* 프로그레스 바 */}
              <div className='w-full bg-gray-200 h-2 rounded-full overflow-hidden'>
                <div className='bg-[#D7001E] h-full rounded-full transition-all' style={{ width: `${(benefitState.personalBook.usedAmount / benefitState.personalBook.totalLimit) * 100}%` }}></div>
              </div>
              <div className='flex justify-between items-center text-[12px] text-gray-500 pt-1'>
                <span>누적 사용: {benefitState.personalBook.usedAmount.toLocaleString()}원 (1건 완료)</span>
                <span>반기 총 한도: 10,000원</span>
              </div>
            </div>
          </div>

          <div className='pt-3 border-t border-gray-100 flex items-center justify-between text-xs'>
            <span className='text-gray-500 font-medium'>국내/외국도서 및 eBook 50%</span>
            <button type='button' onClick={() => setActiveTab('wishlist')} className='inline-flex items-center gap-1 font-bold text-[#D7001E] hover:text-red-800 hover:underline cursor-pointer'>
              <span>도서 검색 및 50% 구매하기</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 최근 지원금 사용 내역 테이블 */}
      <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100'>
          <div className='flex items-center gap-3'>
            <h3 className='font-bold text-gray-900 text-sm'>최근 지원금 사용 내역</h3>
            <div className='flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs'>
              <button type='button' onClick={() => setFilterType('all')} className={`px-2.5 py-1 rounded cursor-pointer font-medium ${filterType === 'all' ? 'bg-white text-[#D7001E] font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>
                전체 {history.length}건
              </button>
              <button type='button' onClick={() => setFilterType('추천도서')} className={`px-2.5 py-1 rounded cursor-pointer font-medium ${filterType === '추천도서' ? 'bg-white text-emerald-700 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>
                추천 도서 1건
              </button>
              <button type='button' onClick={() => setFilterType('개인도서')} className={`px-2.5 py-1 rounded cursor-pointer font-medium ${filterType === '개인도서' ? 'bg-white text-[#D7001E] font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}>
                개인 도서 1건
              </button>
            </div>
          </div>

          <div className='flex items-center gap-1 text-xs text-gray-500'>
            <span>조회 기간:</span>
            {['1개월', '3개월', '6개월'].map((p) => (
              <button key={p} type='button' onClick={() => setPeriod(p)} className={`px-2 py-1 rounded border text-xs cursor-pointer ${period === p ? 'bg-gray-800 text-white border-gray-800 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 내역 테이블 */}
        <div className='overflow-x-auto'>
          <table className='w-full text-xs text-left text-gray-700'>
            <thead className='bg-gray-50 text-gray-600 font-semibold border-y border-gray-200 text-center'>
              <tr>
                <th className='py-2.5 px-3'>사용일자</th>
                <th className='py-2.5 px-3'>구분</th>
                <th className='py-2.5 px-4 text-left'>도서명 / 정가</th>
                <th className='py-2.5 px-3'>지원 정책</th>
                <th className='py-2.5 px-3 text-right'>지원금 적용액</th>
                <th className='py-2.5 px-3 text-right'>본인 부담금</th>
                <th className='py-2.5 px-3'>주문번호</th>
                <th className='py-2.5 px-3'>상세</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {filteredHistory.map((item) => (
                <tr key={item.id} className='hover:bg-gray-50/80 transition-colors text-center'>
                  <td className='py-3 px-3 text-gray-500 whitespace-nowrap'>{item.date}</td>
                  <td className='py-3 px-3 whitespace-nowrap'>
                    <span className={`inline-block px-2 py-0.5 rounded text-[12px] font-bold ${item.type === '추천도서' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-[#D7001E]'}`}>{item.type}</span>
                  </td>
                  <td className='py-3 px-4 text-left'>
                    <p className='font-bold text-gray-900'>{item.bookTitle}</p>
                    <div className='flex items-center gap-2 text-[12px] text-gray-500 mt-0.5'>
                      <span>정가 {item.originalPrice.toLocaleString()}원</span>
                      <span>·</span>
                      <span className='text-emerald-600 font-medium'>{item.status}</span>
                    </div>
                  </td>
                  <td className='py-3 px-3 whitespace-nowrap'>
                    <span className={`font-semibold text-xs ${item.type === '추천도서' ? 'text-emerald-700' : 'text-[#D7001E]'}`}>{item.policy}</span>
                  </td>
                  <td className='py-3 px-3 text-right whitespace-nowrap font-bold text-sm'>
                    <span className={item.type === '추천도서' ? 'text-emerald-600' : 'text-[#D7001E]'}>{item.benefitAmount.toLocaleString()}원</span>
                  </td>
                  <td className='py-3 px-3 text-right whitespace-nowrap font-bold text-gray-900'>{item.selfPayAmount.toLocaleString()}원</td>
                  <td className='py-3 px-3  text-[12px] text-gray-600 whitespace-nowrap'>{item.orderNumber}</td>
                  <td className='py-3 px-3 whitespace-nowrap'>
                    <button type='button' onClick={() => onOpenOrderDetail(item.orderNumber)} className='px-2.5 py-1 text-[12px] font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer'>
                      주문상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
