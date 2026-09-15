import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CreditCard,
  Check,
  Building2,
  Lock,
  ExternalLink,
  HelpCircle,
  Award,
  BookOpen,
  Smartphone,
  Sparkles
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const {
    cart,
    cartStats,
    selectedAddress,
    setIsAddressModalOpen,
    setAddressModalTab,
    processPayment,
    showToast
  } = useShop();

  const selectedItems = cart.filter((i) => i.selected);

  // Form states
  const [selectedMethod, setSelectedMethod] = useState<string>('credit_card');
  const [activeAccordion, setActiveAccordion] = useState<Record<string, boolean>>({
    shipping: true,
    items: true,
    discount: false,
    points: false,
    b2b: true,
    paymentMethod: true,
    cultural: false
  });

  const [deliveryMemo, setDeliveryMemo] = useState('문 앞에 놓아주세요.');
  const [culturalDeduction, setCulturalDeduction] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // YP points usage
  const [usedPoints, setUsedPoints] = useState(0);

  const toggleSection = (section: string) => {
    setActiveAccordion((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast('주문 내용 확인 및 약관에 동의해 주세요.');
      return;
    }
    if (selectedItems.length === 0) {
      showToast('결제할 상품이 없습니다.');
      return;
    }

    processPayment(selectedMethod, culturalDeduction, deliveryMemo);
  };

  return (
    <div className="w-full bg-white py-8 min-h-screen text-[#3d3c3f]">
      <div className="max-w-[1280px] mx-auto px-4 space-y-6">

        {/* Top Header: Title & Step Indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#dadada] pb-5 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#181718] tracking-tight">결제하기</h1>
          <StepIndicator currentStep="payment" />
        </div>

        {/* 2-Column Payment Layout matching payment.png */}
        <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-8 items-start">

          {/* LEFT COLUMN: Accordions / Sections */}
          <div className="space-y-4">

            {/* 1. 배송지 Accordion */}
            <div className="border border-[#cbd2d4] rounded-lg overflow-hidden bg-white">
              <div
                onClick={() => toggleSection('shipping')}
                className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]"
              >
                <h2 className="font-bold text-base text-[#181718]">배송지</h2>
                {activeAccordion.shipping ? (
                  <ChevronUp className="w-5 h-5 text-[#80888a]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#80888a]" />
                )}
              </div>

              {activeAccordion.shipping && (
                <div className="p-5 space-y-4 text-xs sm:text-sm">
                  {/* 배송지 선택 라디오 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <span className="font-medium text-[#555a5c]">배송지 선택*</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="addr_type"
                          checked={true}
                          readOnly
                          className="w-4 h-4 accent-[#df0000]"
                        />
                        <span className="text-[#181718] font-medium">기본 배송지 ({selectedAddress.title})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressModalTab('list');
                          setIsAddressModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded border border-[#cbd2d4] bg-[#f6f6f6] hover:bg-[#edf0f1] text-xs font-semibold text-[#181718] transition-colors"
                      >
                        배송지 목록
                      </button>
                    </div>
                  </div>

                  {/* 배송 방법 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <span className="font-medium text-[#555a5c]">배송 방법*</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="ship_method"
                          checked={true}
                          readOnly
                          className="w-4 h-4 accent-[#df0000]"
                        />
                        <span>국내 배송</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[#80888a]">
                        <input
                          type="radio"
                          name="ship_method"
                          checked={false}
                          readOnly
                          className="w-4 h-4"
                        />
                        <span>해외 배송(FedEx)</span>
                      </label>
                    </div>
                  </div>

                  {/* 수령인 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <span className="font-medium text-[#555a5c]">수령인*</span>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        readOnly
                        value={selectedAddress.recipient}
                        className="flex-1 max-w-sm h-9 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm text-[#181718]"
                      />
                      <span className="text-xs text-[#1f976b] font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 주문자와 동일
                      </span>
                    </div>
                  </div>

                  {/* 연락처1 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <span className="font-medium text-[#555a5c]">연락처1*</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={selectedAddress.phone1}
                        className="w-44 h-9 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm text-[#181718]"
                      />
                    </div>
                  </div>

                  {/* 배송지 주소 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                    <span className="font-medium text-[#555a5c] pt-2">배송지 주소*</span>
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={selectedAddress.postalCode}
                          className="w-24 h-9 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAddressModalTab('new');
                            setIsAddressModalOpen(true);
                          }}
                          className="px-3 h-9 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] text-xs font-semibold text-[#181718]"
                        >
                          주소 변경/등록
                        </button>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={selectedAddress.roadAddress}
                        className="w-full h-9 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm"
                      />
                      <input
                        type="text"
                        readOnly
                        value={selectedAddress.jibunAddress}
                        className="w-full h-9 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm text-[#595959]"
                      />
                      <input
                        type="text"
                        readOnly
                        value={selectedAddress.detailAddress}
                        className="w-full h-9 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm"
                      />
                    </div>
                  </div>

                  {/* 배송 메모 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-2 pt-1">
                    <span className="font-medium text-[#555a5c] pt-2">배송 메모</span>
                    <div className="space-y-1 max-w-lg">
                      <select
                        value={deliveryMemo}
                        onChange={(e) => setDeliveryMemo(e.target.value)}
                        className="w-full h-10 px-3 border border-[#cbd2d4] rounded text-sm bg-white focus:outline-none focus:border-[#df0000]"
                      >
                        <option value="문 앞에 놓아주세요.">문 앞에 놓아주세요.</option>
                        <option value="배송 전 미리 연락해 주세요.">배송 전 미리 연락해 주세요.</option>
                        <option value="경비실에 맡겨 주세요.">경비실에 맡겨 주세요.</option>
                        <option value="택배함에 보관해 주세요.">택배함에 보관해 주세요.</option>
                        <option value="직접 수령하겠습니다.">직접 수령하겠습니다.</option>
                      </select>
                      <p className="text-[11px] text-[#80888a]">• 택배사 송장에 표기되는 메시지입니다.</p>
                    </div>
                  </div>

                  {/* Notice Box matching payment.png */}
                  <div className="bg-[#fffafa] border border-[#f9cdcd] rounded p-3 text-xs space-y-1 text-[#555a5c] leading-relaxed">
                    <p className="text-[#df0000]">• 당일배송 주문시 반드시 주소를 재입력해주시기 바랍니다.</p>
                    <p>
                      • 사서함 주소지(<span className="text-[#df0000]">군부대, 교도소, 일부도서지역 등</span>)로 주문하실 경우 주문완료 후{' '}
                      <span className="text-[#df0000] font-semibold">고객센터(1544-9020)</span> 또는{' '}
                      <span className="text-[#df0000] font-semibold">1:1상담</span>으로 반드시 연락주시기 바랍니다.
                    </p>
                    <p>
                      • <span className="text-[#df0000]">학교</span>는 당일배송이 불가하며,{' '}
                      <span className="text-[#df0000]">직장</span>으로 배송받으시는 경우 토요일 배송 예정 시 수령이 불가능할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. 주문상품 Accordion */}
            <div className="border border-[#cbd2d4] rounded-lg overflow-hidden bg-white">
              <div
                onClick={() => toggleSection('items')}
                className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]"
              >
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base text-[#181718]">주문상품</h2>
                  <span className="text-xs bg-[#f6f6f6] text-[#555a5c] px-2 py-0.5 rounded font-semibold">
                    {selectedItems.length}건
                  </span>
                </div>
                {activeAccordion.items ? (
                  <ChevronUp className="w-5 h-5 text-[#80888a]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#80888a]" />
                )}
              </div>

              {activeAccordion.items && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f6f6f6] text-[#80888a] font-medium border-b border-[#edf0f1]">
                      <tr>
                        <th className="p-3 pl-5">상품정보</th>
                        <th className="p-3 text-right">판매가</th>
                        <th className="p-3 text-center">수량</th>
                        <th className="p-3 text-right">회사 지원금</th>
                        <th className="p-3 text-right pr-5">직원 결제액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf0f1]">
                      {selectedItems.map((item) => (
                        <tr key={item.id} className="hover:bg-[#fafafa]">
                          <td className="p-3 pl-5 flex items-center gap-3">
                            <img
                              src={item.book.coverImage}
                              alt={item.book.title}
                              className="w-14 h-20 object-contain rounded border border-[#edf0f1] flex-shrink-0"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5 ${item.book.bookType === 'recommended'
                                    ? 'bg-[#ffebeb] text-[#df0000] border border-[#fca5a5]'
                                    : item.book.bookType === 'personal'
                                      ? 'bg-[#e8f5ef] text-[#1f976b] border border-[#a3d9bc]'
                                      : 'bg-[#f6f6f6] text-[#555a5c] border border-[#cbd2d4]'
                                    }`}
                                >
                                  <Award className="w-2.5 h-2.5" />
                                  {item.book.bookType === 'recommended' ? 'B2B 추천도서 (100% 지원)' : 'B2B 개인도서 (50% 지원, 최대 1만원)'}
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

                                <span className="text-[10px] text-[#555a5c] bg-[#edf0f1] px-1.5 py-0.5 rounded">
                                  소득공제
                                </span>
                              </div>

                              <div className="font-bold text-sm text-[#181718]">{item.book.title}</div>

                              <div className="text-[11px]">
                                {item.isSubsidyApplied ? (
                                  <span className="text-[#1f976b] font-medium flex items-center gap-1">
                                    <Check className="w-3 h-3 text-[#1f976b]" />
                                    {item.subsidyNote || '지원금 적용됨'}
                                  </span>
                                ) : (
                                  <span className="text-[#80888a]">
                                    지원금 미적용 (전액 본인부담)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-[#df0000] font-bold mr-1">{item.book.discountRate}%</span>
                            <span className="font-bold text-[#181718]">{item.itemSellingPrice.toLocaleString()}원</span>
                          </td>
                          <td className="p-3 text-center font-medium">{item.quantity}</td>
                          <td className="p-3 text-right font-semibold text-[#1f976b]">
                            -{item.itemCompanySubsidy.toLocaleString()}원
                          </td>
                          <td className="p-3 text-right pr-5 font-bold text-[#df0000]">
                            {item.itemEmployeePayment.toLocaleString()}원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 3. 할인 Accordion */}
            <div className="border border-[#cbd2d4] rounded-lg overflow-hidden bg-white">
              <div
                onClick={() => toggleSection('discount')}
                className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]"
              >
                <h2 className="font-bold text-base text-[#181718]">할인</h2>
                {activeAccordion.discount ? (
                  <ChevronUp className="w-5 h-5 text-[#80888a]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#80888a]" />
                )}
              </div>

              {activeAccordion.discount && (
                <div className="p-5 text-xs text-[#80888a] flex items-center justify-between">
                  <span className="font-medium text-[#555a5c]">교환권/쿠폰</span>
                  <span>사용가능한 쿠폰이 없습니다.</span>
                </div>
              )}
            </div>

            {/* 4. YP 포인트 Accordion */}
            <div className="border border-[#cbd2d4] rounded-lg overflow-hidden bg-white">
              <div
                onClick={() => toggleSection('points')}
                className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]"
              >
                <h2 className="font-bold text-base text-[#181718]">YP 포인트</h2>
                {activeAccordion.points ? (
                  <ChevronUp className="w-5 h-5 text-[#80888a]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#80888a]" />
                )}
              </div>

              {activeAccordion.points && (
                <div className="p-5 space-y-3 text-xs">
                  {['예치금', '적립금', 'e머니', 'e캐시'].map((pt, idx) => (
                    <div key={pt} className="grid grid-cols-[80px_1fr] items-center gap-3">
                      <span className="text-[#555a5c] font-medium">{pt}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={0}
                          className="w-32 h-9 px-3 border border-[#cbd2d4] rounded text-right text-sm"
                        />
                        <button
                          type="button"
                          className="px-3 h-9 rounded border border-[#cbd2d4] bg-[#f6f6f6] text-xs font-medium text-[#555a5c]"
                        >
                          전액 사용
                        </button>
                        <span className="text-neutral-400">
                          (보유: {idx === 1 ? '1,000' : '0'}원)
                        </span>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-[#80888a] pt-2">
                    • 적립금 사용 시 예상 적립금이 변경될 수 있습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 5. B2B 기업 지원금 자동 차감 안내 (복합결제 핵심) */}
            <div className="border-2 border-[#1f976b] bg-[#e8f5ef]/40 rounded-lg p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#1f976b]" />
                  <h3 className="font-bold text-base text-[#181718]">
                    B2B 기업 독서지원금 자동 적용
                  </h3>
                </div>
                <span className="text-xs bg-[#1f976b] text-white px-2.5 py-0.5 rounded font-bold">
                  회사 지원금 승인 대기
                </span>
              </div>
              <p className="text-xs text-[#555a5c] leading-relaxed">
                시스템상 하나의 주문번호(Order ID)로 <strong>회사 지원금({cartStats.totalCompanySubsidy.toLocaleString()}원)</strong>과 <strong>직원 결제금액({cartStats.finalPaymentAmount.toLocaleString()}원)</strong>이 통합 처리됩니다.
              </p>
              <div className="text-xs font-semibold text-[#1f976b] pt-1">
                ✓ 추천도서(100% 지원) 및 개인도서(50% 지원, 최대 1만원) Rule 규정이 정확히 적용되었습니다.
              </div>
            </div>

            {/* 6. 결제수단 Accordion (직원 결제분 PG 선택) */}
            <div className="border border-[#cbd2d4] rounded-lg overflow-hidden bg-white">
              <div
                onClick={() => toggleSection('paymentMethod')}
                className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]"
              >
                <h2 className="font-bold text-base text-[#181718]">결제수단 (직원 부담금 결제)</h2>
                {activeAccordion.paymentMethod ? (
                  <ChevronUp className="w-5 h-5 text-[#80888a]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#80888a]" />
                )}
              </div>

              {activeAccordion.paymentMethod && (
                <div className="p-5 space-y-4 text-xs">

                  {/* Option 1: 퀵계좌이체 */}
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#f6f6f6]">
                    <input
                      type="radio"
                      name="mop"
                      checked={selectedMethod === 'quick_bank'}
                      onChange={() => setSelectedMethod('quick_bank')}
                      className="w-4 h-4 accent-[#df0000]"
                    />
                    <span className="font-bold text-sm text-[#181718]">퀵계좌이체</span>
                    <span className="text-[10px] bg-[#df0000] text-white px-1.5 py-0.2 rounded font-bold">
                      혜택
                    </span>
                    <span className="text-xs text-[#df0000] font-medium">1만원 이상 결제시 0.5% 할인</span>
                  </label>

                  {/* Option 2: 영풍빠른결제 */}
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#f6f6f6]">
                    <input
                      type="radio"
                      name="mop"
                      checked={selectedMethod === 'yp_quick_pay'}
                      onChange={() => setSelectedMethod('yp_quick_pay')}
                      className="w-4 h-4 accent-[#df0000]"
                    />
                    <span className="font-bold text-sm text-[#181718]">영풍빠른결제</span>
                    <span className="text-xs text-[#555a5c] bg-[#edf0f1] px-2 py-0.5 rounded">
                      이벤트 응모시 2천원 적립
                    </span>
                  </label>

                  {/* Option 3: 다른 결제수단 */}
                  <div className="pt-2 border-t border-[#edf0f1]">
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <input
                        type="radio"
                        name="mop"
                        checked={!['quick_bank', 'yp_quick_pay'].includes(selectedMethod)}
                        onChange={() => setSelectedMethod('credit_card')}
                        className="w-4 h-4 accent-[#df0000]"
                      />
                      <span className="font-bold text-sm text-[#181718]">다른 결제수단</span>
                    </label>

                    {/* Multi-payment Grid matching payment.png */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'credit_card', name: '신용카드', badge: '혜택', badgeColor: 'bg-[#df0000]' },
                        { id: 'toss_pay', name: 'toss pay', badge: '', badgeColor: '' },
                        { id: 'kakao_pay', name: 'kakao pay', badge: '', badgeColor: '' },
                        { id: 'naver_pay', name: 'naver pay', badge: '혜택', badgeColor: 'bg-[#df0000]' },
                        { id: 'payco', name: 'PAYCO', badge: '혜택', badgeColor: 'bg-[#df0000]' },
                        { id: 'l_pay', name: 'L.pay', badge: 'NEW', badgeColor: 'bg-[#007aff]' },
                        { id: 'ssg_pay', name: 'SSGPAY', badge: 'NEW', badgeColor: 'bg-[#007aff]' },
                        { id: 'bank_transfer', name: '무통장입금', badge: '', badgeColor: '' },
                        { id: 'phone_pay', name: '휴대폰 소액결제', badge: '', badgeColor: '' },
                        { id: 'global_card', name: '해외발급신용카드', badge: '', badgeColor: '' },
                        { id: 'book_gift', name: '도서문화상품권', badge: '', badgeColor: '' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedMethod(item.id)}
                          className={`relative h-12 rounded border text-xs font-semibold flex items-center justify-center transition-all ${selectedMethod === item.id
                            ? 'border-[#df0000] bg-[#ffebeb]/40 text-[#df0000] ring-1 ring-[#df0000]'
                            : 'border-[#cbd2d4] bg-white text-[#555a5c] hover:border-[#80888a]'
                            }`}
                        >
                          {item.badge && (
                            <span
                              className={`absolute top-1 right-1 text-[9px] text-white px-1 rounded font-bold ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Accordion Benefits Box matching screenshot */}
                    <div className="mt-4 space-y-1.5 text-xs text-[#555a5c]" style={{ display: 'none' }}>
                      {[
                        '퀵계좌이체 1만원 이상 결제시 0.5% 할인',
                        '영풍빠른결제 이벤트 응모시 2천원 적립',
                        'KB Pay 3만원 이상 결제시 2천원 즉시할인',
                        '네이버페이 3만원 이상 결제시 1천 포인트 적립',
                        'PAYCO 3만원 이상 결제시 1천원 즉시할인'
                      ].map((promo, idx) => (
                        <div
                          key={idx}
                          className="bg-[#f6f6f6] p-2.5 rounded flex items-center justify-between cursor-pointer hover:bg-[#edf0f1]"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="bg-[#df0000] text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                              혜택
                            </span>
                            <span>{promo}</span>
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 text-[#80888a]" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* 7. 문화비 소득공제 Accordion */}
            <div className="border border-[#cbd2d4] rounded-lg overflow-hidden bg-white">
              <div
                onClick={() => toggleSection('cultural')}
                className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]"
              >
                <h2 className="font-bold text-base text-[#181718]">문화비 소득공제</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#1f976b] font-semibold">신청 가능</span>
                  {activeAccordion.cultural ? (
                    <ChevronUp className="w-5 h-5 text-[#80888a]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#80888a]" />
                  )}
                </div>
              </div>

              {activeAccordion.cultural && (
                <div className="p-5 text-xs space-y-2">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="culture"
                        checked={culturalDeduction}
                        onChange={() => setCulturalDeduction(true)}
                        className="w-4 h-4 accent-[#df0000]"
                      />
                      <span>신청</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="culture"
                        checked={!culturalDeduction}
                        onChange={() => setCulturalDeduction(false)}
                        className="w-4 h-4 accent-[#df0000]"
                      />
                      <span>신청안함</span>
                    </label>
                  </div>
                  <p className="text-[#80888a] pt-1">
                    • 도서 구입비는 연말정산 시 문화비 소득공제 대상에 해당됩니다.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar (Buyer info & Payment summary) matching payment.png */}
          <div className="space-y-4 lg:sticky lg:top-24">

            {/* 주문자 정보 Box */}
            <div className="border border-[#cbd2d4] rounded-lg p-4 bg-white space-y-3 text-xs">
              <h3 className="font-bold text-sm text-[#181718] border-b border-[#edf0f1] pb-2">
                주문자 정보
              </h3>

              <div className="space-y-2">
                <div>
                  <span className="text-[#555a5c] block mb-0.5">이름*</span>
                  <div className="font-semibold text-sm text-[#181718]">김지선</div>
                </div>

                <div>
                  <span className="text-[#555a5c] block mb-0.5">연락처*</span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="px-2 py-1 bg-[#f6f6f6] rounded border border-[#cbd2d4]">010</span>
                    <span>-</span>
                    <span className="px-2 py-1 bg-[#f6f6f6] rounded border border-[#cbd2d4]">1357</span>
                    <span>-</span>
                    <span className="px-2 py-1 bg-[#f6f6f6] rounded border border-[#cbd2d4]">2468</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#555a5c] block mb-0.5">이메일</span>
                  <div className="p-1.5 bg-[#f6f6f6] rounded border border-[#cbd2d4] text-xs truncate">
                    clcclcu@naver.com
                  </div>
                </div>

                <div className="text-[11px] text-[#80888a] pt-1 leading-normal">
                  • 주문자 연락처로 주문 관련 알림톡이 발송되므로 정확한 주문자 정보를 입력해 주세요.
                </div>
              </div>
            </div>

            {/* 결제 정보 Box (Matching payment.png) */}
            <div className="border border-[#cbd2d4] rounded-lg p-5 bg-white space-y-3.5 shadow-sm">
              <h3 className="font-bold text-base text-[#181718] border-b border-[#edf0f1] pb-2.5">
                결제 정보
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#595959]">
                  <span>상품금액</span>
                  <span>{cartStats.totalListPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-[#df0000]">
                  <span>상품할인</span>
                  <span>- {cartStats.totalProductDiscount.toLocaleString()}원</span>
                </div>

                {/* B2B 기업 지원금 차감 표시 */}
                <div className="flex justify-between text-[#1f976b] font-semibold bg-[#e8f5ef] p-1.5 rounded">
                  <span>회사 지원금</span>
                  <span>- {cartStats.totalCompanySubsidy.toLocaleString()}원</span>
                </div>

                <div className="flex justify-between text-[#595959]">
                  <span>배송비</span>
                  <span>{cartStats.shippingFee === 0 ? '0원' : `${cartStats.shippingFee.toLocaleString()}원`}</span>
                </div>
              </div>

              {/* 총 결제금액 (직원 실결제액) */}
              <div className="border-t border-[#dadada] pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#181718]">총 결제금액</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#df0000]">
                      {cartStats.finalPaymentAmount.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-[#df0000] ml-1">원</span>
                    <div className="text-[11px] text-[#80888a] font-normal">(직원 결제분)</div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#595959] border-t border-[#edf0f1] pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>기본 적립</span>
                  <span className="text-[#181718] font-semibold">{cartStats.totalRewardPoints.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>추가 적립</span>
                  <span>0원</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>현금영수증</span>
                  <span className="text-[#80888a]">개인 소득공제 신청</span>
                </div>
                <div className="flex justify-between">
                  <span>문화비 소득공제</span>
                  <span className="text-[#1f976b] font-medium">신청</span>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="border-t border-[#dadada] pt-3">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#555a5c] leading-tight">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-[#df0000] mt-0.5 flex-shrink-0"
                  />
                  <span>
                    주문 내용을 확인하였으며, <strong className="underline">개인정보 수집 및 제3자 제공 등</strong>에 동의합니다.
                  </span>
                </label>
              </div>

              {/* Big Red Payment Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded bg-[#df0000] hover:bg-[#ea2e2e] text-white font-bold text-base shadow-md transition-colors"
              >
                결제하기
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
