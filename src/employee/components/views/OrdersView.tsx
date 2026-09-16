import React, { useState } from 'react';
import { ChevronRight, Search, Package, RotateCcw, Truck, CheckCircle, Info, ExternalLink, RefreshCw } from 'lucide-react';
import { OrderItem, ActiveTab, BenefitState, BenefitHistoryItem } from '../../types';

interface OrdersViewProps {
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  benefitState: BenefitState;
  setBenefitState: React.Dispatch<React.SetStateAction<BenefitState>>;
  setHistory?: React.Dispatch<React.SetStateAction<BenefitHistoryItem[]>>;
  onOpenOrderDetail: (orderNumber: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, setOrders, benefitState, setBenefitState, setHistory, onOpenOrderDetail, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('3개월');

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const matchOrderNum = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBookTitle = order.items.some((i) => i.title.includes(searchQuery));
    return matchOrderNum || matchBookTitle;
  });

  // 주문 취소 처리 (지원금 자동 환원)
  const handleCancelOrder = (orderNumber: string) => {
    const targetOrder = orders.find((o) => o.orderNumber === orderNumber);
    if (!targetOrder) return;

    if (targetOrder.status === '주문취소') {
      alert('이미 취소된 주문입니다.');
      return;
    }

    const hasRecommended = targetOrder.items.some((i) => i.supportType === 'recommended');
    const personalItems = targetOrder.items.filter((i) => i.supportType !== 'recommended');
    const restoredPersonalAmount = personalItems.reduce((acc, i) => acc + (i.benefitAmount || 0), 0);

    const confirmMsg = `주문번호 [${orderNumber}]을(를) 취소하시겠습니까?\n\n[지원금 자동 복원 안내]\n${hasRecommended ? '• 사내 권장도서 100선 (100% 무료 지원): 지원 한도(1권) 즉시 복원\n' : ''}${
      restoredPersonalAmount > 0 ? `• 개인 도서 지원금: ${restoredPersonalAmount.toLocaleString()}원 잔여 한도로 즉시 환원\n` : ''
    }\n결제 승인 취소와 함께 임직원 지원금이 실시간으로 복원됩니다.`;

    if (!confirm(confirmMsg)) {
      return;
    }

    // 지원금 복원 상태 갱신
    setBenefitState((prev) => ({
      ...prev,
      personalBook: {
        ...prev.personalBook,
        remainingAmount: Math.min(prev.personalBook.totalLimit, prev.personalBook.remainingAmount + restoredPersonalAmount),
        usedAmount: Math.max(0, prev.personalBook.usedAmount - restoredPersonalAmount),
      },
      recommendedBook: {
        ...prev.recommendedBook,
        usedCount: hasRecommended ? Math.max(0, prev.recommendedBook.usedCount - 1) : prev.recommendedBook.usedCount,
        recentBookTitle: hasRecommended ? '미사용 (반기 1권 전액 지원 가능)' : prev.recommendedBook.recentBookTitle,
      },
    }));

    // 지원금 내역(히스토리)에도 복원 이력 추가
    if (setHistory) {
      const restoreHistoryItems: BenefitHistoryItem[] = [];
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.');

      if (hasRecommended) {
        restoreHistoryItems.push({
          id: `hist-restore-rec-${Date.now()}`,
          date: todayStr,
          type: '추천도서',
          bookTitle: `[주문취소 복원] ${targetOrder.items.find((i) => i.supportType === 'recommended')?.title || ''}`,
          originalPrice: targetOrder.items.find((i) => i.supportType === 'recommended')?.originalPrice || 0,
          policy: '100% 전액지원 (한도복구)',
          benefitAmount: +(targetOrder.items.find((i) => i.supportType === 'recommended')?.salePrice || 0),
          selfPayAmount: 0,
          orderNumber: targetOrder.orderNumber,
          status: '취소완료(복원)',
        });
      }

      if (restoredPersonalAmount > 0) {
        restoreHistoryItems.push({
          id: `hist-restore-per-${Date.now()}`,
          date: todayStr,
          type: '개인도서',
          bookTitle: `[주문취소 복원] 개인도서 지원금 반환`,
          originalPrice: restoredPersonalAmount * 2,
          policy: '50% 차감지원 (한도복구)',
          benefitAmount: +restoredPersonalAmount,
          selfPayAmount: 0,
          orderNumber: targetOrder.orderNumber,
          status: '취소완료(복원)',
        });
      }

      setHistory((prev) => [...restoreHistoryItems, ...prev]);
    }

    // 주문 상태를 '주문취소'로 변경
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNumber
          ? {
              ...o,
              status: '주문취소',
              statusDescription: '주문취소 및 지원금 복원 완료',
            }
          : o,
      ),
    );

    alert(`주문이 정상적으로 취소되었습니다.\n임직원 도서 지원금(추천도서 1권 / 개인도서 ${restoredPersonalAmount.toLocaleString()}원)이 잔여 한도로 실시간 복원되었습니다.`);
  };

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
        <span className='text-gray-600'>내 주문 관리</span>
        <ChevronRight size={12} />
        <span className='text-[#D7001E] font-bold'>주문/배송 조회</span>
      </div>

      {/* 헤더 */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3'>
        <div>
          <h1 className='text-2xl font-black text-gray-900 tracking-tight'>주문/배송 조회</h1>
          <p className='text-xs text-gray-500 mt-1'>최근 주문하신 상품의 배송 상태 및 복합 지원금 결제 내역을 확인하실 수 있습니다.</p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-500'>
            진행중인 주문 <strong className='text-[#D7001E]'>{orders.filter((o) => o.status !== '배송완료' && o.status !== '주문취소').length}</strong>건
          </span>
          <button type='button' onClick={() => setActiveTab('benefit')} className='text-xs text-[#D7001E] bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded border border-red-200 font-bold flex items-center gap-1 cursor-pointer'>
            <span>나의 지원금 현황 확인</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* 배송 단계 파이프라인 카드 */}
      <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3'>
        <div className='grid grid-cols-5 gap-2 text-center text-xs'>
          <div className='p-2 rounded bg-gray-50'>
            <p className='text-gray-500 mb-1'>주문접수</p>
            <p className='text-xl font-bold text-gray-800'>0</p>
          </div>
          <div className='p-2 rounded bg-red-50/70 border border-red-100'>
            <p className='text-[#D7001E] font-semibold mb-1'>결제완료</p>
            <p className='text-xl font-black text-[#D7001E]'>{orders.filter((o) => o.status === '결제완료').length}</p>
          </div>
          <div className='p-2 rounded bg-red-50/70 border border-red-100'>
            <p className='text-[#D7001E] font-semibold mb-1'>상품준비중</p>
            <p className='text-xl font-black text-[#D7001E]'>{orders.filter((o) => o.status === '상품준비중').length}</p>
          </div>
          <div className='p-2 rounded bg-gray-50'>
            <p className='text-gray-500 mb-1'>배송중</p>
            <p className='text-xl font-bold text-gray-800'>{orders.filter((o) => o.status === '배송중').length}</p>
          </div>
          <div className='p-2 rounded bg-gray-50'>
            <p className='text-gray-500 mb-1'>배송완료</p>
            <p className='text-xl font-bold text-gray-800'>{orders.filter((o) => o.status === '배송완료').length}</p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 gap-2'>
          <span>• 배송상태는 택배사 배송망 연동 시점에 따라 실제와 약간의 오차가 있을 수 있습니다.</span>
          <div className='flex items-center gap-3 text-gray-600'>
            <span>
              취소 <strong>{orders.filter((o) => o.status === '주문취소').length}</strong>
            </span>
            <span>|</span>
            <span>
              반품 <strong>0</strong>
            </span>
            <span>|</span>
            <span>
              교환 <strong>0</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 기간 필터 및 검색창 바 */}
      <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-gray-600 font-medium'>조회기간:</span>
          {['1주일', '1개월', '3개월', '6개월'].map((p) => (
            <button key={p} type='button' onClick={() => setSelectedPeriod(p)} className={`px-2.5 py-1 rounded border text-xs cursor-pointer ${selectedPeriod === p ? 'bg-gray-800 text-white border-gray-800 font-bold' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
              {p}
            </button>
          ))}
          <span className='text-gray-300 mx-1'>|</span>
          <span className='text-gray-600'>2026.06.15 ~ 2026.09.15</span>
        </div>

        <div className='relative w-full md:w-64'>
          <input type='text' placeholder='도서명 또는 주문번호 검색' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#D7001E]' />
          <Search size={14} className='absolute right-2.5 top-2 text-gray-400' />
        </div>
      </div>

      {/* 주문 목록 카드들 */}
      <div className='space-y-5'>
        {filteredOrders.length === 0 ? (
          <div className='bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 text-xs'>조회된 주문 내역이 없습니다.</div>
        ) : (
          filteredOrders.map((order) => {
            const isCancelled = order.status === '주문취소';

            return (
              <div key={order.orderNumber} className={`bg-white border rounded-xl overflow-hidden shadow-xs transition-all ${isCancelled ? 'border-gray-300 opacity-80' : 'border-gray-200'}`}>
                {/* 주문 헤더 */}
                <div className='bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2'>
                  <div className='flex items-center gap-3'>
                    <span className='font-bold text-gray-900'>주문일자 {order.orderDate}</span>
                    <span className='text-gray-300'>|</span>
                    <span className=' text-gray-600'>주문번호 {order.orderNumber}</span>
                    {isCancelled && (
                      <span className='bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[10px] border border-red-200 flex items-center gap-1'>
                        <RotateCcw size={10} />
                        <span>주문취소완료 (지원금 한도 복원됨)</span>
                      </span>
                    )}
                  </div>
                  <button type='button' onClick={() => onOpenOrderDetail(order.orderNumber)} className='text-gray-600 hover:text-[#D7001E] font-medium flex items-center gap-0.5 cursor-pointer self-end sm:self-auto'>
                    <span>주문상세보기</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                {/* 주문된 도서 목록 (복합 결제 지원금 내역) */}
                <div className='divide-y divide-gray-100 p-4 space-y-4'>
                  {order.items.map((item) => (
                    <div key={item.bookId} className='pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                      <div className='flex items-start gap-3.5 flex-1'>
                        {/* 도서 표지 */}
                        <div className='w-13 h-18 rounded shrink-0 shadow-xs flex flex-col justify-between p-1 text-white font-bold text-center select-none' style={{ backgroundColor: item.coverColor }}>
                          <span className='text-[7px] uppercase tracking-tighter opacity-80 '>YP</span>
                          <span className='text-[8px] leading-tight whitespace-pre-line my-auto'>{item.coverLabel || item.title.replace(/[『』]/g, '')}</span>
                          <span className='text-[6px] opacity-70 font-light truncate'>{item.author}</span>
                        </div>

                        <div className='space-y-1'>
                          <div className='flex items-center gap-1.5 flex-wrap'>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.supportType === 'recommended' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-[#D7001E]'}`}>{item.category}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.supportType === 'recommended' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-[#D7001E] border-red-200'}`}>{item.supportLabel}</span>
                          </div>

                          <h4 className='font-bold text-gray-900 text-sm'>{item.title}</h4>
                          <p className='text-xs text-gray-500'>
                            {item.publisher} | {item.author} 저
                          </p>

                          <div className='text-xs text-gray-700 flex items-center gap-2 flex-wrap pt-0.5'>
                            <span>수량: {item.quantity}권</span>
                            <span>·</span>
                            {item.supportType === 'recommended' ? (
                              <span className='text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200'>🌟 추천도서 100% 전액지원: {item.salePrice.toLocaleString()}원 전액차감 (본인부담 0원)</span>
                            ) : (
                              <span>
                                판매가 {item.salePrice.toLocaleString()}원 → <strong className='text-[#D7001E]'>실결제 {item.selfPay.toLocaleString()}원</strong> (개인 지원금 {item.benefitAmount.toLocaleString()}원 차감 완료)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 우측 배송 상태 및 액션 버튼들 */}
                      <div className='w-full sm:w-36 shrink-0 flex flex-col items-start sm:items-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100'>
                        <div className='text-right'>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${
                              isCancelled
                                ? 'bg-gray-200 text-gray-700 line-through'
                                : item.status === '상품준비중'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.status === '결제완료'
                                    ? 'bg-blue-100 text-blue-800'
                                    : item.status === '배송완료'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {isCancelled ? '취소완료' : item.status}
                          </span>
                          {!isCancelled && order.statusDescription && item.status === '상품준비중' && <p className='text-[11px] text-emerald-600 font-medium mt-0.5'>✓ 내일 도착 예정</p>}
                          {!isCancelled && order.deliveryTracker && item.status === '배송완료' && (
                            <p className='text-[10px] text-gray-400  mt-0.5'>
                              {order.deliveryTracker.carrier} {order.deliveryTracker.trackingNumber}
                            </p>
                          )}
                        </div>

                        <div className='flex items-center gap-1.5 w-full sm:justify-end'>
                          {!isCancelled && (
                            <button type='button' onClick={() => alert(`배송조회: ${item.title}\n상태: ${item.status}\n배송지: ${order.shippingAddress}`)} className='py-1 px-2 text-[11px] border border-gray-300 rounded hover:bg-gray-50 text-gray-700 cursor-pointer'>
                              배송조회
                            </button>
                          )}

                          {isCancelled ? (
                            <span className='text-[11px] text-gray-400 font-medium py-1'>지원금 복원 완료</span>
                          ) : item.status === '배송완료' ? (
                            <button type='button' onClick={() => alert('리뷰 작성 시 300P 적립!')} className='py-1 px-2 text-[11px] font-bold text-white bg-[#D7001E] rounded hover:bg-red-700 cursor-pointer'>
                              리뷰작성 +300P
                            </button>
                          ) : (
                            <>
                              <button type='button' onClick={() => alert('배송지 변경 화면입니다.')} className='py-1 px-2 text-[11px] border border-gray-300 rounded hover:bg-gray-50 text-gray-700 cursor-pointer'>
                                배송지 변경
                              </button>
                              <button type='button' onClick={() => handleCancelOrder(order.orderNumber)} className='py-1 px-2 text-[11px] text-red-600 font-bold border border-red-200 bg-red-50/50 rounded hover:bg-red-100 cursor-pointer transition-colors'>
                                주문취소
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 복합 지원금 결제 내역 바 (추천도서 100% 지원 건과 개인도서 50% 지원 건의 복합 내역) */}
                <div className='bg-[#FAFBFD] px-4 py-3 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between text-xs text-gray-700 gap-2'>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <span>
                      결제수단: <strong>{order.paymentMethod}</strong>
                    </span>
                    <span className='text-gray-300'>|</span>
                    <span>
                      총 주문금액: <strong>{order.totalPrice.toLocaleString()}원</strong>
                    </span>
                    <span className='text-gray-300'>|</span>
                    <span className='text-[#D7001E] font-medium'>
                      임직원 도서 지원금: <strong>{order.totalBenefitAmount.toLocaleString()}원</strong>
                      {order.items.some((i) => i.supportType === 'recommended') && <span className='text-emerald-700 text-[10px] ml-1 font-bold'>(추천 100% + 개인 50% 복합적용)</span>}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-500 mr-2'>최종 실 결제금액:</span>
                    <span className='text-base font-black text-[#D7001E]'>{order.finalPaidAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 주문/배송 및 반품 안내 박스 */}
      <div className='bg-[#FBFBFB] border border-gray-200 rounded-xl p-4 text-xs text-gray-600 space-y-2'>
        <h4 className='font-bold text-gray-900 flex items-center gap-1.5'>
          <Info size={14} className='text-[#D7001E]' />
          <span>임직원 주문/배송 및 지원금 복원 정책 안내</span>
        </h4>
        <ul className='space-y-1 list-disc pl-4 text-[11px] text-gray-500 leading-relaxed'>
          <li>상품준비중 단계까지는 마이페이지에서 [주문취소]가 즉시 가능하며 결제금액 승인취소와 함께 지원금이 복원됩니다.</li>
          <li>
            <strong className='text-emerald-800'>★ 주문 취소 시 지원금 자동 환원:</strong> 임직원 도서 지원금이 적용된 주문을 취소할 경우, <strong>사내 권장도서 100% 지원 권수(1권)와 개인도서 지원금 잔여 한도가 실시간으로 즉시 복원</strong>되어 다음 주문에 바로 사용하실 수 있습니다.
          </li>
          <li>배송완료 단계 이후에는 7일 이내에 [취소/반품/환불 조회] 메뉴에서 반품 신청 시 동일하게 지원금 한도가 재적립됩니다.</li>
        </ul>
      </div>
    </div>
  );
};
