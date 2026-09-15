import React from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import { CheckCircle2, Printer, ShoppingBag, ArrowRight, Truck, FileText, ChevronRight, Award, BookOpen, Smartphone, Check } from 'lucide-react';

export const OrderCompletePage: React.FC = () => {
  const {
    currentOrder,
    orders,
    setActivePage,
    setMyPageTab,
    openReceiptModal,
    subsidyLedger
  } = useShop();

  const order = currentOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#181718]">주문 내역이 없습니다.</h2>
        <button
          onClick={() => setActivePage('explore')}
          className="px-6 py-2.5 bg-[#df0000] text-white rounded text-sm font-bold"
        >
          도서 둘러보기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f6f6f6] py-10 min-h-screen text-[#3d3c3f]">
      <div className="max-w-[840px] mx-auto px-4 space-y-6">

        {/* Step Indicator */}
        <div className="flex justify-end">
          <StepIndicator currentStep="complete" />
        </div>

        {/* Completion Hero Box */}
        <div className="bg-white rounded-xl border border-[#cbd2d4] p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-[#e8f5ef] text-[#1f976b] rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs text-[#1f976b] font-bold bg-[#e8f5ef] px-3 py-1 rounded-full inline-block">
              B2B 복합결제 정상 승인 완료
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#181718] tracking-tight">
              주문이 성공적으로 완료되었습니다!
            </h1>
            <p className="text-sm text-[#80888a]">
              주문하신 상품의 배송 준비가 시작되며, 알림톡으로 배송 정보를 안내해 드립니다.
            </p>
          </div>

          <div className="bg-[#f6f6f6] rounded-lg p-4 max-w-md mx-auto space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#80888a]">통합 주문번호</span>
              <span className="font-bold text-sm text-[#181718]">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#80888a]">주문일시</span>
              <span>{order.orderDate}</span>
            </div>
          </div>
        </div>

        {/* Complex B2B Settlement Summary (복합결제 분할 명세서) */}
        <div className="bg-white rounded-xl border border-[#cbd2d4] p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-[#181718] border-b border-[#dadada] pb-3 flex items-center justify-between">
            <span>B2B 복합결제 정산 내역</span>
            <span className="text-xs font-normal text-[#80888a]">
              단일 주문번호 기준 회사지원금 + 직원부담금 통합 승인
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-[#f6f6f6] p-4 rounded-lg">
              <span className="text-xs text-[#80888a]">총 도서 금액</span>
              <div className="text-lg font-bold text-[#181718] mt-1">
                {order.totalSellingPrice.toLocaleString()}원
              </div>
            </div>
            <div className="bg-[#e8f5ef] p-4 rounded-lg border border-[#a3d9bc]">
              <span className="text-xs text-[#1f976b] font-semibold">회사 지원금 (B2B 예산 차감)</span>
              <div className="text-lg font-bold text-[#1f976b] mt-1">
                {order.totalCompanySubsidy.toLocaleString()}원
              </div>
            </div>
            <div className="bg-[#fffafa] p-4 rounded-lg border border-[#f9cdcd]">
              <span className="text-xs text-[#df0000] font-semibold">직원 실결제금액 (PG 승인)</span>
              <div className="text-lg font-black text-[#df0000] mt-1">
                {order.finalPaidAmount.toLocaleString()}원
              </div>
            </div>
          </div>

          <div className="text-xs bg-[#f6f6f6] p-3 rounded space-y-1 text-[#555a5c]">
            <div className="flex justify-between">
              <span>직원 결제수단:</span>
              <span className="font-semibold text-[#181718]">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>배송비:</span>
              <span>{order.shippingFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span>적립 예정 포인트:</span>
              <span className="text-[#1f976b] font-medium">+{(order.earnedPoints ?? Math.floor(order.totalSellingPrice * 0.05)).toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* Ordered Books Items */}
        <div className="bg-white rounded-xl border border-[#cbd2d4] p-6 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-[#181718] border-b border-[#dadada] pb-3">
            주문 상품 정보 ({order.items.length}종)
          </h2>

          <div className="divide-y divide-[#edf0f1]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-14 h-20 object-contain rounded border border-[#edf0f1] flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5 ${item.bookType === 'recommended'
                          ? 'bg-[#ffebeb] text-[#df0000] border border-[#fca5a5]'
                          : item.bookType === 'personal'
                            ? 'bg-[#e8f5ef] text-[#1f976b] border border-[#a3d9bc]'
                            : 'bg-[#f6f6f6] text-[#555a5c] border border-[#cbd2d4]'
                          }`}
                      >
                        <Award className="w-2.5 h-2.5" />
                        {item.bookType === 'recommended'
                          ? '추천도서 (100% 지원)'
                          : item.bookType === 'personal'
                            ? '개인도서 (50% 지원)'
                            : '일반도서 (지원금 미적용)'}
                      </span>
                      <span className="text-[10px] bg-[#181718] text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                        {item.format === 'ebook' ? (
                          <>
                            <Smartphone className="w-2.5 h-2.5" /> 전자책
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-2.5 h-2.5" /> 종이책
                          </>
                        )}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[#181718]">{item.title}</div>

                    <div className="text-[11px] text-[#80888a]">
                      수량: {item.quantity}권
                      {item.isSubsidyApplied && (
                        <span className="text-[#1f976b] font-medium ml-2">
                          ✓ {item.subsidyNote}
                        </span>
                      )}
                      {!item.isSubsidyApplied && (
                        <span className="text-[#80888a] ml-2">
                          (지원금 미적용 주문)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs space-y-0.5">
                  <div className="font-bold text-[#181718] text-sm">{item.sellingPrice.toLocaleString()}원</div>
                  <div className="text-[#1f976b] font-semibold">회사지원: -{item.companySubsidy.toLocaleString()}원</div>
                  <div className="text-[#df0000] font-bold">직원실결제: {item.employeePayment.toLocaleString()}원</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Destination */}
        <div className="bg-white rounded-xl border border-[#cbd2d4] p-6 space-y-2 shadow-sm text-xs sm:text-sm">
          <h2 className="text-base font-bold text-[#181718] border-b border-[#dadada] pb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#df0000]" />
            배송지 정보
          </h2>
          <div className="grid grid-cols-[100px_1fr] gap-2 pt-1 text-xs">
            <span className="text-[#80888a]">수령인</span>
            <span className="font-semibold text-[#181718]">{order.deliveryAddress.recipient} ({order.deliveryAddress.phone1})</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
            <span className="text-[#80888a]">배송 주소</span>
            <span className="text-[#181718]">
              ({order.deliveryAddress.postalCode}) {order.deliveryAddress.roadAddress}{' '}
              {order.deliveryAddress.detailAddress}
            </span>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
            <span className="text-[#80888a]">배송 메모</span>
            <span className="text-[#595959]">{order.deliveryMemo || '문 앞에 놓아주세요.'}</span>
          </div>
        </div>

        {/* Current Month Ledger Status Banner */}
        <div className="bg-[#181718] text-white rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#a3e635] font-bold">B2B 지원금 잔여 현황 갱신 완료</div>
            <div className="text-sm font-semibold mt-0.5">
              이번 달 남은 회사 지원금 한도:{' '}
              <span className="text-lg font-bold text-[#a3e635]">
                {subsidyLedger.remainingSubsidy.toLocaleString()}원
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setActivePage('mypage');
              setMyPageTab('subsidy');
            }}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-lg font-medium flex items-center gap-1 transition-colors"
          >
            지원금 장부 상세조회 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => openReceiptModal(order)}
            className="px-6 py-3 rounded-lg border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] text-sm font-bold text-[#181718] flex items-center gap-2 transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-[#df0000]" />
            전자영수증 확인 / 인쇄
          </button>
          <button
            onClick={() => {
              setActivePage('mypage');
              setMyPageTab('orders');
            }}
            className="px-6 py-3 rounded-lg border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] text-sm font-bold text-[#181718] flex items-center gap-2 transition-colors shadow-xs"
          >
            주문 / 배송내역 조회
          </button>
          <button
            onClick={() => setActivePage('explore')}
            className="px-8 py-3 rounded-lg bg-[#df0000] hover:bg-[#ea2e2e] text-sm font-bold text-white flex items-center gap-2 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            쇼핑 계속하기
          </button>
        </div>

      </div>
    </div>
  );
};
