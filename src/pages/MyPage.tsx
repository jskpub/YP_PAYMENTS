import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  RotateCcw,
  Sparkles,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const MyPage: React.FC = () => {
  const {
    myPageTab,
    setMyPageTab,
    subsidyLedger,
    orders,
    cancelOrder,
    openReceiptModal,
    setActivePage
  } = useShop();

  return (
    <div className="w-full bg-[#f6f6f6] py-8 min-h-screen text-[#3d3c3f]">
      <div className="max-w-[1280px] mx-auto px-4 space-y-6">

        {/* Top Profile & Header */}
        <div className="bg-white rounded-xl border border-[#cbd2d4] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#df0000] text-white flex items-center justify-center font-black text-xl shadow-xs">
              김
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#181718]">김지선 임직원님</h1>
                <span className="bg-[#e8f5ef] text-[#1f976b] text-xs font-bold px-2.5 py-0.5 rounded border border-[#a3d9bc]">
                  B2B 독서지원 대상자
                </span>
              </div>
              <p className="text-xs text-[#80888a] mt-0.5">
                소속: (주)파트너스 B2B | 사번: EMP-2026-9243 | 회원등급: 골드회원
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#edf0f1] pt-3 md:pt-0 md:pl-6 w-full md:w-auto">
            <div className="text-center px-3">
              <span className="text-[11px] text-[#80888a] block">잔여 독서지원금</span>
              <span className="text-lg font-bold text-[#1f976b]">
                {subsidyLedger.remainingSubsidy.toLocaleString()}원
              </span>
            </div>
            <div className="text-center px-3 border-l border-[#edf0f1]">
              <span className="text-[11px] text-[#80888a] block">누적 주문수</span>
              <span className="text-lg font-bold text-[#181718]">
                {orders.length}건
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#dadada] bg-white rounded-t-lg px-4 pt-2 text-sm font-semibold gap-2">
          <button
            onClick={() => setMyPageTab('subsidy')}
            className={`py-3 px-5 transition-colors border-b-2 ${myPageTab === 'subsidy'
              ? 'border-[#df0000] text-[#df0000] font-bold'
              : 'border-transparent text-[#80888a] hover:text-[#181718]'
              }`}
          >
            나의 B2B 독서지원금 (Rule & Ledger)
          </button>
          <button
            onClick={() => setMyPageTab('orders')}
            className={`py-3 px-5 transition-colors border-b-2 ${myPageTab === 'orders'
              ? 'border-[#df0000] text-[#df0000] font-bold'
              : 'border-transparent text-[#80888a] hover:text-[#181718]'
              }`}
          >
            주문 / 배송 내역 ({orders.length})
          </button>
          <button
            onClick={() => setMyPageTab('refund')}
            className={`py-3 px-5 transition-colors border-b-2 ${myPageTab === 'refund'
              ? 'border-[#df0000] text-[#df0000] font-bold'
              : 'border-transparent text-[#80888a] hover:text-[#181718]'
              }`}
          >
            취소 / 환불 정책 안내
          </button>
        </div>

        {/* TAB 1: B2B 지원금 현황 & 장부 (Rule Engine & Ledger) */}
        {myPageTab === 'subsidy' && (
          <div className="space-y-6">

            {/* Monthly Budget Quota Card */}
            <div className="bg-white rounded-xl border border-[#cbd2d4] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#edf0f1] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#181718] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#df0000]" />
                    2026년 9월 B2B 독서지원 현황
                  </h2>
                  <p className="text-xs text-[#80888a] mt-0.5">
                    회사에서 임직원 역량 개발을 위해 제공하는 복지 지원 프로그램입니다.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#80888a]">월 한도: </span>
                  <span className="text-sm font-bold text-[#181718]">
                    {subsidyLedger.monthlyLimit.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#1f976b]">
                    총 사용 지원금: {subsidyLedger.totalUsedSubsidy.toLocaleString()}원
                  </span>
                  <span className="text-[#df0000]">
                    잔여 한도: {subsidyLedger.remainingSubsidy.toLocaleString()}원
                  </span>
                </div>
                <div className="w-full bg-[#f6f6f6] h-3.5 rounded-full overflow-hidden border border-[#edf0f1]">
                  <div
                    className="bg-gradient-to-r from-[#1f976b] to-[#a3e635] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((subsidyLedger.totalUsedSubsidy / subsidyLedger.monthlyLimit) * 100)
                      )}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Rule Card 1 & 2 Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">

                {/* 추천도서 Rule Card */}
                <div className={`p-4 rounded-lg border transition-all ${subsidyLedger.recommendedUsed
                  ? 'border-[#a3d9bc] bg-[#e8f5ef]/40'
                  : 'border-[#cbd2d4] bg-white'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#df0000] bg-[#ffebeb] px-2 py-0.5 rounded">
                      추천도서 Rule
                    </span>
                    <span className={`text-xs font-semibold ${subsidyLedger.recommendedUsed ? 'text-[#1f976b]' : 'text-[#80888a]'
                      }`}>
                      {subsidyLedger.recommendedUsed ? '✓ 이달 사용 완료' : '● 신청 가능 (잔여 1권)'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#181718] mt-2">회사 지원 100% 전액 지원</h3>
                  <p className="text-xs text-[#595959] mt-1 leading-relaxed">
                    월 1권에 한해 도서 금액 전액을 회사에서 지원합니다. (직원 실결제 0원)
                  </p>
                  {!subsidyLedger.recommendedUsed && (
                    <button
                      onClick={() => setActivePage('explore')}
                      className="mt-3 text-xs font-bold text-[#df0000] hover:underline"
                    >
                      추천도서 목록 보러가기 &gt;
                    </button>
                  )}
                </div>

                {/* 개인도서 Rule Card */}
                <div className={`p-4 rounded-lg border transition-all ${subsidyLedger.personalUsed
                  ? 'border-[#a3d9bc] bg-[#e8f5ef]/40'
                  : 'border-[#cbd2d4] bg-white'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1f976b] bg-[#e8f5ef] px-2 py-0.5 rounded">
                      개인도서 Rule
                    </span>
                    <span className={`text-xs font-semibold ${subsidyLedger.personalUsed ? 'text-[#1f976b]' : 'text-[#80888a]'
                      }`}>
                      {subsidyLedger.personalUsed ? '✓ 이달 사용 완료' : '● 신청 가능 (잔여 1권)'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#181718] mt-2">50% 지원 (최대 10,000원)</h3>
                  <p className="text-xs text-[#595959] mt-1 leading-relaxed">
                    월 1권에 한해 도서가격의 50%(최대 1만원)를 지원하며, 초과분은 직원이 결제합니다.
                  </p>
                  {!subsidyLedger.personalUsed && (
                    <button
                      onClick={() => setActivePage('explore')}
                      className="mt-3 text-xs font-bold text-[#1f976b] hover:underline"
                    >
                      개인도서 목록 보러가기 &gt;
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* B2B Subsidy Ledger Table (지원금 사용 장부) */}
            <div className="bg-white rounded-xl border border-[#cbd2d4] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#dadada] pb-3">
                <h3 className="font-bold text-base text-[#181718]">B2B 지원금 차감 및 복원 이력 장부 (Ledger)</h3>
                <span className="text-xs text-[#80888a]">총 {subsidyLedger.history.length}건</span>
              </div>

              {subsidyLedger.history.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#80888a]">
                  아직 지원금 사용 내역이 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f6f6f6] text-[#80888a] font-medium border-b border-[#edf0f1]">
                      <tr>
                        <th className="p-3">일시</th>
                        <th className="p-3">주문번호</th>
                        <th className="p-3">도서명</th>
                        <th className="p-3 text-center">지원 구분</th>
                        <th className="p-3 text-right">도서 정가</th>
                        <th className="p-3 text-right">회사 지원금</th>
                        <th className="p-3 text-right">직원 부담금</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf0f1]">
                      {subsidyLedger.history.map((record, idx) => (
                        <tr key={idx} className="hover:bg-[#fafafa]">
                          <td className="p-3 text-[#595959]">{record.date}</td>
                          <td className="p-3 font-semibold text-[#181718]">{record.orderId}</td>
                          <td className="p-3 font-medium text-[#181718]">{record.bookTitle}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded font-bold ${record.bookType === 'recommended'
                                ? 'bg-[#ffebeb] text-[#df0000]'
                                : 'bg-[#e8f5ef] text-[#1f976b]'
                                }`}
                            >
                              {record.bookType === 'recommended' ? '추천 100%' : '개인 50%'}
                            </span>
                          </td>
                          <td className="p-3 text-right">{record.sellingPrice.toLocaleString()}원</td>
                          <td className="p-3 text-right font-bold text-[#1f976b]">
                            - {record.companySubsidy.toLocaleString()}원
                          </td>
                          <td className="p-3 text-right font-bold text-[#df0000]">
                            {record.employeePayment.toLocaleString()}원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: 주문 / 배송 내역 */}
        {myPageTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#cbd2d4] p-16 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-[#9da6a8] mx-auto" />
                <p className="text-base font-semibold text-[#80888a]">주문 내역이 없습니다.</p>
                <button
                  onClick={() => setActivePage('explore')}
                  className="px-6 py-2.5 bg-[#df0000] text-white rounded text-xs font-bold hover:bg-[#ea2e2e]"
                >
                  도서 둘러보기
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const isCancelled = order.orderStatus === 'cancelled';

                return (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-xl border border-[#cbd2d4] p-5 space-y-4 shadow-sm"
                  >
                    {/* Order header row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#edf0f1] pb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-[#181718]">{order.orderId}</span>
                        <span className="text-xs text-[#80888a]">{order.orderDate}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded font-bold ${isCancelled
                            ? 'bg-[#edf0f1] text-[#9c9c9c] line-through'
                            : 'bg-[#e8f5ef] text-[#1f976b]'
                            }`}
                        >
                          {order.orderStatus === 'completed'
                            ? '결제완료'
                            : order.orderStatus === 'preparing'
                              ? '배송준비중'
                              : '주문취소/환불완료'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openReceiptModal(order)}
                          className="px-3 py-1.5 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] text-xs font-semibold text-[#181718] flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#df0000]" />
                          전자영수증
                        </button>
                        {!isCancelled && (
                          <button
                            onClick={() => cancelOrder(order.orderId)}
                            className="px-3 py-1.5 rounded border border-[#f9cdcd] bg-[#fffafa] hover:bg-[#ffebeb] text-xs font-semibold text-[#df0000] flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            주문취소 / 지원금 복원
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="divide-y divide-[#edf0f1]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-12 h-16 object-contain rounded border border-[#edf0f1]"
                            />
                            <div>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.bookType === 'recommended'
                                  ? 'bg-[#ffebeb] text-[#df0000]'
                                  : 'bg-[#e8f5ef] text-[#1f976b]'
                                  }`}
                              >
                                {item.bookType === 'recommended' ? '추천 100% 지원' : '개인 50% 지원'}
                              </span>
                              <div className="font-bold text-sm text-[#181718] mt-0.5">{item.title}</div>
                              <div className="text-xs text-[#80888a]">
                                수량: {item.quantity} | {item.format === 'paper' ? '종이책' : 'eBook'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right text-xs space-y-0.5">
                            <div className="text-sm font-bold text-[#181718]">{item.sellingPrice.toLocaleString()}원</div>
                            <div className="text-[#1f976b]">지원금: -{item.companySubsidy.toLocaleString()}원</div>
                            <div className="text-[#df0000] font-semibold">실결제: {item.employeePayment.toLocaleString()}원</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Settlement Summary Footer */}
                    <div className="bg-[#f6f6f6] rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[#80888a]">배송지:</span>{' '}
                        <span className="text-[#181718] font-medium">
                          ({order.deliveryAddress.postalCode}) {order.deliveryAddress.roadAddress}{' '}
                          {order.deliveryAddress.detailAddress}
                        </span>
                        <div className="text-[#80888a]">
                          결제수단: {order.paymentMethod}
                        </div>
                      </div>

                      <div className="text-right sm:text-right text-xs">
                        <div className="text-[#595959]">
                          회사 지원금: <strong className="text-[#1f976b]">{order.totalCompanySubsidy.toLocaleString()}원</strong>
                        </div>
                        <div className="text-sm font-black text-[#df0000] mt-0.5">
                          직원 실결제: {order.finalPaidAmount.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: 취소 / 환불 정책 안내 (복합결제 환불 정책) */}
        {myPageTab === 'refund' && (
          <div className="bg-white rounded-xl border border-[#cbd2d4] p-6 space-y-6 shadow-sm text-sm text-[#3d3c3f]">
            <div>
              <h2 className="text-lg font-bold text-[#181718] mb-1">
                B2B 복합결제 취소 및 환불 프로세스 안내
              </h2>
              <p className="text-xs text-[#80888a]">
                영풍문고 B2B 독서지원 프로그램에 따른 주문 취소 및 환불 기준입니다.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#fffafa] border border-[#f9cdcd] space-y-2">
                <h3 className="font-bold text-[#df0000] text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  복합결제 취소 시 회사 지원금 및 개인 결제액 환불 원칙
                </h3>
                <ul className="list-disc list-inside text-xs space-y-1.5 text-[#555a5c] leading-relaxed">
                  <li>
                    <strong>회사 지원금 복원:</strong> 주문 취소 완료 즉시, 해당 월(当月)의 임직원 독서지원 한도 및 추천/개인도서 신청 자격이 원상 복구됩니다.
                  </li>
                  <li>
                    <strong>직원 결제금액 환불:</strong> 직원이 신용카드 또는 간편결제(네이버페이, 토스 등)로 결제한 금액은 카드사/결제대행사를 통해 자동 승인 취소됩니다.
                  </li>
                  <li>
                    <strong>단일 주문 일괄 취소:</strong> B2B 복합결제 특성상 회사 지원금과 직원 결제액은 동일한 주문번호로 묶여 있어 부분 취소가 불가하며, 주문 전체 취소 후 재주문하셔야 합니다.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#f6f6f6] border border-[#edf0f1] space-y-2">
                <h3 className="font-bold text-[#181718] text-sm">배송 상태별 취소 가능 여부</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white rounded border border-[#cbd2d4]">
                    <span className="font-bold text-[#1f976b] block mb-1">1. 결제완료</span>
                    <p className="text-[#595959]">마이페이지에서 즉시 주문 취소 및 지원금 자동 복원 가능</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-[#cbd2d4]">
                    <span className="font-bold text-[#f59e0b] block mb-1">2. 상품준비중</span>
                    <p className="text-[#595959]">출고 작업 전 고객센터(1544-9020)를 통해 취소 요청 가능</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-[#cbd2d4]">
                    <span className="font-bold text-[#80888a] block mb-1">3. 배송중 / 배송완료</span>
                    <p className="text-[#595959]">도서 수령 후 7일 이내 반품/환불 신청 가능 (반품 배송비 부과 가능)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
