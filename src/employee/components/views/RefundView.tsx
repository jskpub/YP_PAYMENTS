import React, { useState } from 'react';
import { ChevronRight, RotateCcw, AlertCircle, CheckCircle2, FileText, Info, Truck } from 'lucide-react';
import { RefundHistoryItem, ActiveTab, BenefitState } from '../../types';

interface RefundViewProps {
  refundHistories: RefundHistoryItem[];
  benefitState: BenefitState;
  setBenefitState: React.Dispatch<React.SetStateAction<BenefitState>>;
  setActiveTab: (tab: ActiveTab) => void;
}

export const RefundView: React.FC<RefundViewProps> = ({ refundHistories, benefitState, setBenefitState, setActiveTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'request' | 'history'>('request');
  const [reason, setReason] = useState<'change_mind' | 'defect'>('change_mind');
  const [pickupMethod, setPickupMethod] = useState<'courier' | 'self'>('courier');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 계산
  const originalPaidAmount = 19000;
  const benefitRestoreAmount = 5000;
  const shippingFee = reason === 'change_mind' ? 2500 : 0;
  const estimatedRefundAmount = originalPaidAmount - shippingFee;

  const handleSubmitRefund = () => {
    if (confirm('위 명세대로 반품/환불을 신청하시겠습니까?\n임직원 도서 지원금 5,000원은 잔여 한도로 즉시 복원됩니다.')) {
      setBenefitState((prev) => ({
        ...prev,
        personalBook: {
          ...prev.personalBook,
          remainingAmount: Math.min(prev.personalBook.totalLimit, prev.personalBook.remainingAmount + 5000),
          usedAmount: Math.max(0, prev.personalBook.usedAmount - 5000),
        },
      }));
      setIsSubmitted(true);
      alert('반품 신청이 완료되었습니다.\n지원금 한도 5,000원이 즉시 복원되었습니다.');
    }
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
        <span className='text-[#D7001E] font-bold'>환불/반품</span>
      </div>

      {/* 헤더 */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3'>
        <div>
          <h1 className='text-2xl font-black text-gray-900 tracking-tight'>환불/반품 관리</h1>
          <p className='text-xs text-gray-500 mt-1'>주문하신 상품의 취소/반품/환불 신청 및 처리 현황을 확인하실 수 있습니다.</p>
        </div>
        <span className='text-xs text-gray-500'>
          반품/환불 가능 주문 <strong className='text-[#D7001E]'>1</strong>건
        </span>
      </div>

      {/* 탭 네비게이션 */}
      <div className='flex items-center gap-2 border-b border-gray-200 text-xs font-semibold'>
        <button type='button' onClick={() => setActiveSubTab('request')} className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${activeSubTab === 'request' ? 'border-[#D7001E] text-[#D7001E] font-bold' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
          환불/반품 신청 가능 ({isSubmitted ? 0 : 1}건)
        </button>
        <button type='button' onClick={() => setActiveSubTab('history')} className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${activeSubTab === 'history' ? 'border-[#D7001E] text-[#D7001E] font-bold' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
          환불/반품 처리 내역 ({refundHistories.length + (isSubmitted ? 1 : 0)}건)
        </button>
      </div>

      {/* 신청 가능 주문 및 실시간 계산 섹션 */}
      {activeSubTab === 'request' && (
        <div className='space-y-5'>
          {!isSubmitted ? (
            <>
              {/* 신청 가능 주문 카드 */}
              <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs'>
                <div className='bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-bold text-gray-800'>주문일자 2026.09.04</span>
                    <span className='text-gray-300'>|</span>
                    <span className=' text-gray-600'>주문번호 YP20260904-0193</span>
                  </div>
                  <span className='text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto'>✓ 배송완료 (반품 가능 기한: 2026.09.11까지)</span>
                </div>

                <div className='p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                  <div className='flex items-start gap-3.5 flex-1'>
                    {/* 커버 */}
                    <div className='w-13 h-18 rounded shrink-0 bg-slate-800 shadow-xs flex flex-col justify-between p-1 text-white font-bold text-center select-none'>
                      <span className='text-[7px] uppercase opacity-70'>YP</span>
                      <span className='text-[8px] leading-tight whitespace-pre-line my-auto'>
                        경제/경영
                        {'\n'}프로덕트
                        {'\n'}매니지먼트
                      </span>
                      <span className='text-[6px] opacity-70 truncate'>인사이트</span>
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center gap-1.5 flex-wrap'>
                        <span className='text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700'>경제/경영</span>
                        <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-[#D7001E] border border-red-200'>개인도서 지원 5,000원 적용</span>
                        <span className='text-[10px] text-gray-500 '>CJ대한통운 6849-2910-4491</span>
                      </div>

                      <h4 className='font-bold text-gray-900 text-sm'>『프로덕트 매니지먼트의 모든 것』</h4>
                      <p className='text-xs text-gray-500'>인사이트 | 맷 르메이 저</p>

                      <div className='text-xs text-gray-700 pt-0.5'>
                        <span>수량: 1권</span>
                        <span className='mx-1.5 text-gray-300'>|</span>
                        <span>정가: 24,000원</span>
                        <span className='mx-1.5 text-gray-300'>|</span>
                        <span>
                          실 결제금액: <strong className='text-gray-900'>19,000원</strong> <span className='text-[#D7001E] font-medium'>(임직원 개인 지원금 5,000원 공제 완료)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={() => {
                      document.getElementById('refund-calc-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className='w-full md:w-auto px-4 py-2 bg-[#D7001E] text-white font-bold text-xs rounded hover:bg-red-700 transition-colors shrink-0 cursor-pointer shadow-xs'
                  >
                    환불/반품 신청하기 ➔
                  </button>
                </div>
              </div>

              {/* 환불/반품 예상 금액 산정 및 지원금 복원 명세 카드 (시안 7의 명세서) */}
              <div id='refund-calc-section' className='bg-[#FAFBFD] border border-gray-300 rounded-xl p-5 shadow-xs space-y-4'>
                <div className='border-b border-gray-200 pb-2'>
                  <h3 className='font-bold text-gray-900 text-sm flex items-center gap-1.5'>
                    <RotateCcw size={15} className='text-[#D7001E]' />
                    <span>환불/반품 예상 금액 산정 및 지원금 복원 명세</span>
                  </h3>
                  <p className='text-xs text-gray-500 mt-0.5'>반품 사유를 선택하시면 지원금 환원 및 공제 배송비가 자동 산출됩니다.</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-xs'>
                  {/* 옵션 선택 */}
                  <div className='space-y-3.5'>
                    <div>
                      <label className='font-bold text-gray-800 block mb-1.5'>반품/환불 사유 선택</label>
                      <select value={reason} onChange={(e) => setReason(e.target.value as any)} className='w-full p-2 border border-gray-300 rounded bg-white font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#D7001E]'>
                        <option value='change_mind'>단순 변심 (도서 미개봉/상태 양호) - 고객 부담 배송비 2,500원</option>
                        <option value='defect'>도서 파본 / 오배송 / 파손 - 영풍문고 부담 무료 반품 (배송비 0원)</option>
                      </select>
                    </div>

                    <div>
                      <label className='font-bold text-gray-800 block mb-1.5'>수거 방식 선택</label>
                      <div className='space-y-2'>
                        <label className='flex items-center gap-2 p-2 bg-white border border-gray-200 rounded cursor-pointer hover:border-gray-300'>
                          <input type='radio' name='pickup' checked={pickupMethod === 'courier'} onChange={() => setPickupMethod('courier')} className='accent-[#D7001E]' />
                          <span className='font-medium text-gray-800'>CJ대한통운 회수 신청 (기본 배송지로 기사 방문)</span>
                        </label>
                        <label className='flex items-center gap-2 p-2 bg-white border border-gray-200 rounded cursor-pointer hover:border-gray-300'>
                          <input type='radio' name='pickup' checked={pickupMethod === 'self'} onChange={() => setPickupMethod('self')} className='accent-[#D7001E]' />
                          <span className='font-medium text-gray-800'>직접 택배 발송 (선불)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 금액 산정 영수증 (시안 7 우측 명세) */}
                  <div className='bg-white border border-gray-200 rounded-lg p-4 space-y-2.5'>
                    <div className='flex justify-between text-gray-500 text-[12px] pb-1 border-b border-gray-100'>
                      <span>결제 수단: 카카오페이 간편결제</span>
                    </div>

                    <div className='flex justify-between text-gray-700'>
                      <span>반품 상품 원 결제금액</span>
                      <span className='font-semibold text-gray-900'>{originalPaidAmount.toLocaleString()}원</span>
                    </div>

                    {/* 임직원 지원금 복원 강조 */}
                    <div className='flex justify-between items-center bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200'>
                      <span className='font-bold text-emerald-900'>임직원 개인 지원금 복원</span>
                      <span className='font-black text-emerald-700'>+{benefitRestoreAmount.toLocaleString()}원 (한도로 즉시 반환!)</span>
                    </div>

                    <div className='flex justify-between text-gray-600'>
                      <span>반품 배송비 (편도)</span>
                      <span className='font-semibold text-red-600'>{shippingFee === 0 ? '0원 (무료)' : `-${shippingFee.toLocaleString()}원`}</span>
                    </div>

                    <div className='pt-2 border-t border-gray-200 flex justify-between items-baseline'>
                      <div>
                        <span className='font-bold text-gray-900'>최종 환불 예정액</span>
                        <span className='block text-[10px] text-gray-400'>(카카오페이 원결제 취소)</span>
                      </div>
                      <span className='text-xl font-black text-[#D7001E]'>{estimatedRefundAmount.toLocaleString()}원</span>
                    </div>

                    <button type='button' onClick={handleSubmitRefund} className='w-full mt-3 py-2.5 bg-[#D7001E] text-white font-bold rounded-md hover:bg-red-700 transition-colors shadow-xs cursor-pointer text-xs'>
                      반품 및 지원금 복원 신청 확정
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='bg-white border border-emerald-200 rounded-xl p-8 text-center space-y-3'>
              <CheckCircle2 size={40} className='text-emerald-600 mx-auto' />
              <h3 className='text-lg font-bold text-gray-900'>반품 신청이 정상 접수되었습니다!</h3>
              <p className='text-xs text-gray-600 max-w-md mx-auto'>
                임직원 도서 지원금 <strong className='text-emerald-700'>5,000원이 잔여 한도로 즉시 복원</strong>되었으며, 택배 기사님이 1~2일 내 방문하여 회수할 예정입니다.
              </p>
              <div className='pt-2'>
                <button type='button' onClick={() => setActiveTab('benefit')} className='px-4 py-2 bg-[#D7001E] text-white text-xs font-bold rounded hover:bg-red-700 cursor-pointer'>
                  나의 지원금 잔여 현황 확인하기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 처리 내역 테이블 섹션 */}
      {activeSubTab === 'history' && (
        <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3'>
          <div className='flex items-center justify-between pb-2 border-b border-gray-100'>
            <h3 className='font-bold text-gray-900 text-sm'>최근 환불/반품 처리 내역</h3>
            <span className='text-xs text-gray-500'>최근 3개월 기준</span>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-xs text-left text-gray-700'>
              <thead className='bg-gray-50 text-gray-600 font-semibold border-y border-gray-200 text-center'>
                <tr>
                  <th className='py-2.5 px-3'>접수일자 / 번호</th>
                  <th className='py-2.5 px-2'>구분</th>
                  <th className='py-2.5 px-4 text-left'>상품명 및 주문정보</th>
                  <th className='py-2.5 px-3'>환불 사유</th>
                  <th className='py-2.5 px-3 text-right'>환불 금액 / 혜택</th>
                  <th className='py-2.5 px-3'>처리 상태</th>
                  <th className='py-2.5 px-2'>관리</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {isSubmitted && (
                  <tr className='bg-red-50/30 text-center'>
                    <td className='py-3 px-3 whitespace-nowrap'>
                      <p className='font-bold text-gray-800'>2026.09.15</p>
                      <p className=' text-[10px] text-gray-400'>RF20260915-0921</p>
                    </td>
                    <td className='py-3 px-2'>
                      <span className='bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px]'>반품접수</span>
                    </td>
                    <td className='py-3 px-4 text-left'>
                      <p className='font-bold text-gray-900'>『프로덕트 매니지먼트의 모든 것』</p>
                      <p className='text-[12px] text-gray-500'>인사이트 | 1권 (주문번호: YP20260904-0193)</p>
                    </td>
                    <td className='py-3 px-3 text-gray-600'>{reason === 'change_mind' ? '단순 변심' : '도서 하자/파본'}</td>
                    <td className='py-3 px-3 text-right font-bold text-gray-900'>
                      {estimatedRefundAmount.toLocaleString()}원<span className='block text-[10px] text-emerald-700 font-normal'>지원금 +5,000원 복원 완료</span>
                    </td>
                    <td className='py-3 px-3 whitespace-nowrap text-amber-700 font-semibold text-[12px]'>수거 진행중</td>
                    <td className='py-3 px-2'>
                      <button type='button' className='px-2 py-1 text-[10px] border border-gray-300 rounded hover:bg-gray-50'>
                        상세
                      </button>
                    </td>
                  </tr>
                )}

                {refundHistories.map((item) => (
                  <tr key={item.id} className='hover:bg-gray-50 text-center'>
                    <td className='py-3 px-3 whitespace-nowrap'>
                      <p className='font-bold text-gray-800'>{item.date}</p>
                      <p className=' text-[10px] text-gray-400'>{item.receiptNumber}</p>
                    </td>
                    <td className='py-3 px-2 whitespace-nowrap'>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${item.type === '반품환불' ? 'bg-red-100 text-[#D7001E]' : 'bg-gray-100 text-gray-700'}`}>{item.type}</span>
                    </td>
                    <td className='py-3 px-4 text-left'>
                      <p className='font-bold text-gray-900'>{item.bookTitle}</p>
                      <p className='text-[12px] text-gray-500'>{item.authorAndPublisher}</p>
                    </td>
                    <td className='py-3 px-3 text-gray-600 text-[12px] max-w-xs'>{item.reason}</td>
                    <td className='py-3 px-3 text-right whitespace-nowrap'>
                      <p className='font-bold text-gray-900 text-sm'>{item.refundAmount.toLocaleString()}원</p>
                      <p className='text-[10px] text-emerald-700 font-medium'>{item.benefitRestored}</p>
                    </td>
                    <td className='py-3 px-3 whitespace-nowrap'>
                      <span className='font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[12px]'>{item.status}</span>
                      <p className='text-[10px] text-gray-400 mt-0.5'>{item.processedDate}</p>
                    </td>
                    <td className='py-3 px-2 whitespace-nowrap'>
                      <button type='button' onClick={() => alert(`[${item.receiptNumber}] ${item.type} 영수증/전표 출력 화면입니다.`)} className='px-2 py-1 text-[12px] border border-gray-300 rounded hover:bg-gray-100 text-gray-700 cursor-pointer'>
                        {item.type === '반품환불' ? '환불 영수증' : '취소 전표'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 환불/반품 정책 및 유의사항 안내 (시안 7과 100% 일치) */}
      <div className='bg-[#FBFBFB] border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 text-xs text-gray-700'>
        <h4 className='font-bold text-gray-900 text-sm flex items-center gap-1.5 border-b border-gray-200 pb-2.5'>
          <Info size={16} className='text-[#D7001E]' />
          <span>환불/반품 정책 및 유의사항 안내</span>
        </h4>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed'>
          <div className='space-y-3'>
            <div>
              <h5 className='font-bold text-gray-900'>1. 반품 및 환불 신청 가능 기간</h5>
              <ul className='text-gray-600 pl-3 list-disc space-y-1 mt-1 text-[12px]'>
                <li>
                  <strong>출고 전/배송 준비 중:</strong> 고객센터 문의 없이 마이페이지에서 즉시 [주문취소] 가능하며 결제금액이 100% 즉시 환불됩니다.
                </li>
                <li>
                  <strong>배송 완료 후:</strong> 상품 수령일로부터 7일 이내에 반품/환불 신청이 가능합니다.
                </li>
                <li>
                  <strong>파손, 파본, 오배송의 경우:</strong> 수령 후 30일 이내 무상 반품/교환이 보장됩니다.
                </li>
              </ul>
            </div>

            <div>
              <h5 className='font-bold text-gray-900'>3. 반품 배송비 기준 안내</h5>
              <ul className='text-gray-600 pl-3 list-disc space-y-1 mt-1 text-[12px]'>
                <li>
                  <strong>고객 단순 변심 및 주문 착오:</strong> 왕복 배송비 5,000원(편도 2,500원)이 최종 환불금에서 차감됩니다.
                </li>
                <li>
                  <strong>도서 하자, 파본, 오배송:</strong> 반품 및 교환 배송비 전액 영풍문고 부담.
                </li>
                <li>
                  <strong>매장 직접 반품:</strong> 사전 접수 후 가까운 영풍문고 데스크에서 무상 반품 가능합니다.
                </li>
              </ul>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='bg-red-50/50 p-3 rounded-lg border border-red-100'>
              <h5 className='font-bold text-[#D7001E]'>2. ★ 임직원 도서 지원금 및 혜택 반환 정책</h5>
              <ul className='text-gray-700 pl-3 list-disc space-y-1 mt-1 text-[12px]'>
                <li>
                  <strong>추천도서 (100% 지원):</strong> 반품 승인 완료 즉시 당월 지원 횟수(권수) 및 한도가 100% 원상 복구됩니다.
                </li>
                <li>
                  <strong>개인도서 지원금:</strong> 결제 시 차감되었던 지원금 금액(최대 5,000원)이 <strong className='text-[#D7001E]'>'나의 지원금' 잔여 한도로 즉시 재적립</strong>됩니다.
                </li>
                <li>도서 구매로 지급된 적립금(Point)은 환불 시 자동 회수됩니다.</li>
              </ul>
            </div>

            <div>
              <h5 className='font-bold text-gray-900'>4. 결제 수단별 환불 소요 기간</h5>
              <p className='text-gray-600 text-[12px] mt-1'>신용/체크카드: 3~5 영업일 / 간편결제(카카오/네이버페이): 당일 또는 익영업일 즉시 복원 / 무통장: 1영업일 이내 계좌 입금</p>
            </div>
          </div>
        </div>

        {/* 불가 사유 */}
        <div className='bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-950 space-y-1'>
          <p className='font-bold flex items-center gap-1 text-amber-900'>
            <AlertCircle size={13} />
            <span>⚠️ 반품 / 환불이 불가능한 경우 (유의사항)</span>
          </p>
          <ul className='list-disc pl-4 space-y-0.5 text-amber-900'>
            <li>비닐 래핑이 뜯겨진 도서, 부록(CD, DVD, 수험서 별책부록)이 분실 또는 훼손된 경우</li>
            <li>소비자에게 책임 있는 사유로 도서가 오염되거나 훼손되어 재판매가 현저히 곤란한 경우</li>
            <li>디지털 다운로드 콘텐츠(eBook, 오디오북)를 1회 이상 열람하거나 다운로드 받은 경우</li>
            <li>배송 완료 후 7일이 경과하여 단순 변심에 의해 반품을 요청하는 경우</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
