import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import { CircleCheck, ShoppingBag, Truck, ChevronRight, ChevronDown, Minus, Equal, Award, BookOpen, Smartphone, Copy, CopyCheck, ClipboardList, Receipt } from 'lucide-react';
import { BookCoverImage } from '../components/BookCoverImage';

export const OrderCompletePage: React.FC = () => {
  const { currentOrder, orders, setActivePage, setMyPageTab, openReceiptModal, subsidyLedger, showToast } = useShop();

  const order = currentOrder || orders[0];

  // 개선 항목 1: 주문번호 클립보드 복사
  const [copied, setCopied] = useState(false);
  const handleCopyOrderId = async () => {
    const orderId = order.orderId;
    try {
      await navigator.clipboard.writeText(orderId);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = orderId;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        showToast('복사에 실패했습니다. 직접 선택해주세요');
        return;
      }
    }
    setCopied(true);
    showToast('주문번호가 복사되었습니다');
    setTimeout(() => setCopied(false), 1500);
  };

  if (!order) {
    return (
      <div className='max-w-[1280px] mx-auto px-4 py-16 text-center space-y-4'>
        <h2 className='text-xl font-bold text-[#181718]'>주문 내역이 없습니다.</h2>
        <button onClick={() => setActivePage('explore')} className='px-6 py-2.5 bg-[#df0000] text-white rounded text-sm font-bold'>
          도서 둘러보기
        </button>
      </div>
    );
  }

  return (
    <div className='w-full bg-[#f6f6f6] py-10 min-h-screen text-[#3d3c3f]'>
      <div className='max-w-[840px] mx-auto px-4 space-y-6'>
        {/* Step Indicator */}
        <div className='flex justify-end'>
          <StepIndicator currentStep='complete' />
        </div>

        {/* Completion Hero Box */}
        <div className='bg-white rounded-xl border border-[#cbd2d4] p-8 text-center space-y-4 shadow-sm'>
          {/* 개선 항목 3: 주문완료 성공 아이콘 애니메이션 */}
          <div className='success-icon w-24 h-24 bg-[#e8f5ef] rounded-full flex items-center justify-center mx-auto shadow-xs'>
            <CircleCheck style={{ width: 72, height: 72, color: 'var(--color-success)' }} strokeWidth={1.5} />
          </div>

          <div className='space-y-1'>
            <span className='text-xs text-[#1f976b] font-bold bg-[#e8f5ef] px-3 py-1 rounded-full inline-block'>B2B 복합결제 정상 승인 완료</span>
            <h1 className='text-2xl sm:text-3xl font-bold text-[#181718] tracking-tight'>주문이 성공적으로 완료되었습니다!</h1>
            <p className='text-sm text-[#80888a]'>주문하신 상품의 배송 준비가 시작되며, 알림톡으로 배송 정보를 안내해 드립니다.</p>
          </div>

          <div className='bg-[#f6f6f6] rounded-lg p-4 max-w-md mx-auto space-y-1 text-xs'>
            <div className='flex justify-between items-center'>
              <span className='text-[#80888a]'>통합 주문번호</span>
              <span className='flex items-center gap-0.5'>
                <span className='font-bold text-sm text-[#181718]'>{order.orderId}</span>
                {/* 개선 항목 1: 주문번호 클립보드 복사 */}
                <button
                  type='button'
                  onClick={handleCopyOrderId}
                  aria-label='주문번호 복사'
                  className='inline-flex items-center justify-center rounded-sm hover:bg-[#edf0f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                  style={{ width: 'var(--btn-height-md)', height: 'var(--btn-height-md)' }}
                >
                  {copied ? <CopyCheck className='w-4 h-4' style={{ color: 'var(--color-success)' }} /> : <Copy className='w-4 h-4' style={{ color: 'var(--color-foreground-secondary)' }} />}
                </button>
                <span role='status' aria-live='polite' className='sr-only'>
                  {copied ? '주문번호가 복사되었습니다' : ''}
                </span>
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-[#80888a]'>주문일시</span>
              <span>{order.orderDate}</span>
            </div>
          </div>
        </div>

        {/* Complex B2B Settlement Summary (복합결제 분할 명세서) */}
        <div className='bg-white rounded-xl border border-[#cbd2d4] p-6 space-y-4 shadow-sm'>
          <h2 className='text-base font-bold text-[#181718] border-b border-[#dadada] pb-3 flex items-center justify-between'>
            <span>B2B 복합결제 정산 내역</span>
            <span className='text-xs font-normal text-[#80888a]'>단일 주문번호 기준 회사지원금 + 직원부담금 통합 승인</span>
          </h2>

          {/* 개선 항목 10: 결제 정산 시각화 — 데스크톱 가로 배치, 모바일 세로 스택 */}
          <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-3'>
            <div className='w-full sm:flex-1 bg-[#f6f6f6] p-4 rounded-lg text-center' aria-label={`총 주문금액 ${order.totalSellingPrice.toLocaleString()}원`}>
              <span className='text-xs text-[#80888a]'>총 도서 금액</span>
              <div className='text-lg font-bold text-[#181718] mt-1'>{order.totalSellingPrice.toLocaleString()}원</div>
            </div>

            <ChevronRight className='hidden sm:block w-5 h-5 flex-shrink-0' style={{ color: 'var(--color-foreground-secondary)' }} aria-hidden='true' />

            <div className='w-full sm:flex-1 bg-[#e8f5ef] p-4 rounded-lg border border-[#a3d9bc] text-center' aria-label={`회사 지원금 차감 ${order.totalCompanySubsidy.toLocaleString()}원`}>
              <span className='text-xs text-[#1f976b] font-semibold inline-flex items-center gap-1'>
                <Minus className='w-3.5 h-3.5' style={{ color: 'var(--color-primary)' }} />
                회사 지원금 (독서 지원금 차감)
              </span>
              <div className='text-lg font-bold text-[#1f976b] mt-1'>{order.totalCompanySubsidy.toLocaleString()}원</div>
            </div>

            <ChevronRight className='hidden sm:block w-5 h-5 flex-shrink-0' style={{ color: 'var(--color-foreground-secondary)' }} aria-hidden='true' />

            <div className='w-full sm:flex-1 bg-[#fffafa] p-4 rounded-lg border border-[#f9cdcd] text-center' aria-label={`실 결제금액 ${order.finalPaidAmount.toLocaleString()}원`}>
              <span className='text-xs text-[#df0000] font-semibold inline-flex items-center gap-1'>
                <Equal className='w-3.5 h-3.5' style={{ color: 'var(--color-foreground)' }} />
                직원 결제금액 (PG 승인)
              </span>
              <div className='text-lg font-black text-[#df0000] mt-1'>{order.finalPaidAmount.toLocaleString()}원</div>
            </div>
          </div>

          <div className='text-xs bg-[#f6f6f6] p-3 rounded space-y-1 text-[#555a5c]'>
            <div className='flex justify-between'>
              <span>직원 결제수단</span>
              <span className='font-semibold text-[#181718]'>{order.paymentMethod}</span>
            </div>
            <div className='flex justify-between'>
              <span>배송비</span>
              <span>{order.shippingFee.toLocaleString()}원</span>
            </div>
            <div className='flex justify-between'>
              <span>적립 예정 포인트</span>
              <span className='text-[#1f976b] font-medium'>+{(order.earnedPoints ?? Math.floor(order.totalSellingPrice * 0.05)).toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* Ordered Books Items */}
        <div className='bg-white rounded-xl border border-[#cbd2d4] overflow-hidden shadow-sm'>
          <div className='p-5 border-b border-[#dadada]'>
            <h2 className='text-base font-bold text-[#181718]'>주문 상품 정보 ({order.items.length}종)</h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-xs text-left'>
              <thead className='bg-[#f6f6f6] text-[#80888a] font-medium border-b border-[#edf0f1]'>
                <tr>
                  <th className='p-3 pl-5'>상품정보</th>
                  <th className='p-3 text-right'>판매가</th>
                  <th className='p-3 text-center'>수량</th>
                  <th className='p-3 text-right'>회사 지원금</th>
                  <th className='p-3 text-right pr-5'>직원 결제액</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#edf0f1]'>
                {order.items.map((item, idx) => {
                  const unitPrice = item.quantity > 0 ? Math.round(item.sellingPrice / item.quantity) : item.sellingPrice;
                  const unitListPrice = item.listPrice > 0 ? item.listPrice : Math.round(unitPrice / 0.9);
                  const discountRate = unitListPrice > 0 ? Math.round((1 - unitPrice / unitListPrice) * 100) : 10;
                  const isSubsidyApplied = item.isSubsidyApplied || item.companySubsidy > 0;

                  return (
                    <tr key={idx} className='hover:bg-[#fafafa]'>
                      <td className='p-3 pl-5 flex items-center gap-3'>
                        <BookCoverImage title={item.title} coverImage={item.coverImage} coverBackground={item.coverBackground} className='w-14 h-20 rounded border border-[#edf0f1] flex-shrink-0' titleClassName='text-[8px]' />
                        <div className='space-y-1'>
                          <div className='flex items-center gap-1.5 flex-wrap'>
                            {item.bookType === 'recommended' && (
                              <span className='text-[10px] px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5 bg-[#ffebeb] text-[#df0000] border border-[#fca5a5]'>
                                <Award className='w-2.5 h-2.5' />
                                추천도서
                              </span>
                            )}

                            <span className='text-[10px] bg-[#181718] text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5'>
                              {item.format === 'ebook' ? (
                                <>
                                  <Smartphone className='w-2.5 h-2.5' /> 전자책
                                </>
                              ) : (
                                <>
                                  <BookOpen className='w-2.5 h-2.5' /> 종이책
                                </>
                              )}
                            </span>
                          </div>

                          <div className='font-bold text-sm text-[#181718]'>{item.title}</div>
                        </div>
                      </td>
                      <td className='p-3 text-right align-top'>
                        <div>
                          {discountRate > 0 && <span className='text-[#df0000] font-bold mr-1'>{discountRate}%</span>}
                          <span className='font-bold text-[#181718]'>{item.sellingPrice.toLocaleString()}원</span>
                        </div>
                        {item.quantity >= 2 && <div className='text-[12px] text-[#80888a] font-normal mt-0.5'>(1권당 {unitPrice.toLocaleString()}원)</div>}
                      </td>
                      <td className='p-3 text-center font-medium'>{item.quantity}</td>
                      <td className='p-3 text-right font-semibold align-top space-y-1'>{isSubsidyApplied && item.companySubsidy > 0 ? <span className={`font-bold ${item.bookType === 'recommended' ? 'text-[#df0000]' : 'text-[#1f976b]'}`}>-{item.companySubsidy.toLocaleString()}원</span> : null}</td>
                      <td className='p-3 text-right pr-5 font-bold align-top text-[#181718]'>{item.employeePayment.toLocaleString()}원</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Destination */}
        <div className='bg-white rounded-xl border border-[#cbd2d4] p-6 space-y-2 shadow-sm text-xs sm:text-sm'>
          <h2 className='text-base font-bold text-[#181718] border-b border-[#dadada] pb-3 flex items-center gap-2'>
            <Truck className='w-4 h-4 text-[#df0000]' />
            배송지 정보
          </h2>
          <div className='grid grid-cols-[100px_1fr] gap-2 pt-1 text-xs'>
            <span className='text-[#80888a]'>수령인</span>
            <span className='font-semibold text-[#181718]'>
              {order.deliveryAddress.recipient} ({order.deliveryAddress.phone1})
            </span>
          </div>
          <div className='grid grid-cols-[100px_1fr] gap-2 text-xs'>
            <span className='text-[#80888a]'>배송 주소</span>
            <span className='text-[#181718]'>
              ({order.deliveryAddress.postalCode}) {order.deliveryAddress.roadAddress} {order.deliveryAddress.detailAddress}
            </span>
          </div>
          <div className='grid grid-cols-[100px_1fr] gap-2 text-xs'>
            <span className='text-[#80888a]'>배송 메모</span>
            <span className='text-[#595959]'>{order.deliveryMemo || '문 앞에 놓아주세요.'}</span>
          </div>
        </div>

        {/* Current Month Ledger Status Banner */}
        <div className='bg-[#181718] text-white rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <div className='text-xs text-[#a3e635] font-bold'>B2B 지원금 잔여 현황 갱신 완료</div>
            <div className='text-sm font-semibold mt-0.5'>
              이번 달 남은 회사 지원금 한도: <span className='text-lg font-bold text-[#a3e635]'>{subsidyLedger.remainingSubsidy.toLocaleString()}원</span>
            </div>
          </div>
          <button
            onClick={() => {
              setActivePage('mypage');
              setMyPageTab('subsidy');
            }}
            className='text-xs bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-lg font-medium flex items-center gap-1 transition-colors'
          >
            지원금 장부 상세조회 <ChevronRight className='w-3.5 h-3.5' />
          </button>
        </div>

        {/* Footer Actions — 개선 항목 2 버튼 위계 적용 (이 페이지에는 결제하기 Primary가 없으므로 전부 Secondary/Tertiary) */}
        <div className='flex flex-wrap items-center justify-center gap-3 pt-4'>
          <button onClick={() => openReceiptModal(order)} className='btn btn--tertiary gap-1.5'>
            <Receipt className='w-4 h-4' style={{ color: 'var(--color-primary)' }} />
            전자영수증 확인 / 인쇄
          </button>
          <button
            onClick={() => {
              setActivePage('mypage');
              setMyPageTab('orders');
            }}
            className='btn btn--secondary gap-2'
          >
            <ClipboardList className='w-4 h-4' style={{ color: 'var(--color-foreground)' }} />
            주문 / 배송내역 조회
          </button>
          <button onClick={() => setActivePage('explore')} className='btn btn--secondary gap-2'>
            <ShoppingBag className='w-4 h-4' style={{ color: 'var(--color-foreground)' }} />
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};
