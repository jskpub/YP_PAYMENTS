import React, { useLayoutEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import { ChevronDown, ChevronUp, AlertCircle, CreditCard, Building2, ExternalLink, HelpCircle, Award, BookOpen, Smartphone, CheckCircle2, Circle, ShieldCheck, Wallet, PenLine, Loader2 } from 'lucide-react';
import { BookCoverImage } from '../components/BookCoverImage';

const SUBSIDY_TYPES = ['recommended', 'personal'] as const;

const PAYMENT_METHODS = [
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
  { id: 'book_gift', name: '도서문화상품권', badge: '', badgeColor: '' },
];

// 주문완료 영수증 등에 표시할 사람이 읽을 수 있는 결제수단 이름 — selectedMethod(내부 id)를 그대로 저장하지 않기 위함.
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  quick_bank: '퀵계좌이체',
  yp_quick_pay: '영풍빠른결제',
  ...Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.name])),
};

export const PaymentPage: React.FC = () => {
  const { cart, cartStats, selectedAddress, setIsAddressModalOpen, setAddressModalTab, processPayment, showToast, subsidyLedger, resetSubsidyLedger, applyCartSubsidy, removeCartSubsidy } = useShop();

  const selectedItems = cart.filter((i) => i.selected);

  // 결제하기를 누르는 시점에 "지원 대상인데 아직 적용 안 한" 유형이 있는지 확인한다 (놓침 방지 안전장치).
  // 이미 이번 달 한도가 소진된 유형은 애초에 적용할 수 없으므로 대상에서 제외한다.
  const missedSubsidyTypes = SUBSIDY_TYPES.filter((type) => {
    const itemsOfType = selectedItems.filter((i) => i.book.bookType === type);
    if (itemsOfType.length === 0) return false;
    const used = type === 'recommended' ? subsidyLedger.recommendedUsed : subsidyLedger.personalUsed;
    if (used) return false;
    return !itemsOfType.some((i) => i.isSubsidyApplied);
  });
  const [showSubsidyConfirm, setShowSubsidyConfirm] = useState(false);
  const [showSubsidyPolicyDetail, setShowSubsidyPolicyDetail] = useState(false);

  // 결제 확인 → 진행중 팝업 플로우 (06_checkout.html 참고)
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Form states
  const [selectedMethod, setSelectedMethod] = useState<string>('신용카드');
  const [activeAccordion, setActiveAccordion] = useState<Record<string, boolean>>({
    shipping: true,
    items: true,
    discount: false,
    points: false,
    b2b: true,
    paymentMethod: true,
  });

  const [deliveryMemo, setDeliveryMemo] = useState('문 앞에 놓아주세요.');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // 배송 메모 "직접 입력" 슬라이드다운 (개선 항목 4)
  const [isCustomMemo, setIsCustomMemo] = useState(false);
  const [customMemoText, setCustomMemoText] = useState('');

  // 주문자 연락처/이메일 (수정 가능)
  const [ordererPhonePrefix, setOrdererPhonePrefix] = useState('010');
  const [ordererPhoneMid, setOrdererPhoneMid] = useState('1234');
  const [ordererPhoneEnd, setOrdererPhoneEnd] = useState('5678');
  const [ordererEmail, setOrdererEmail] = useState('junkyo.jung@ypbooks.co.kr');

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
    if (missedSubsidyTypes.length > 0) {
      setShowSubsidyConfirm(true);
      return;
    }

    setShowPaymentConfirm(true);
  };

  // 결제 확인 팝업에서 [결제] 클릭 → 진행중 팝업(약 1.2초) → 실제 주문 처리.
  // 문화비 소득공제 신청 여부 선택 UI는 제거되었지만 Order 데이터에는 계속 기록되므로 항상 신청으로 처리한다.
  const handleConfirmPayment = () => {
    setShowPaymentConfirm(false);
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      processPayment(PAYMENT_METHOD_LABELS[selectedMethod] ?? selectedMethod, true, deliveryMemo);
    }, 1200);
  };

  // 유형별로 지원 혜택이 가장 큰 도서 지원금을 적용한다 (직원 입장에서 가장 이득이 되는 기본 선택).
  const handleApplyMissedSubsidy = () => {
    missedSubsidyTypes.forEach((type) => {
      const itemsOfType = selectedItems.filter((i) => i.book.bookType === type);
      const mostExpensive = itemsOfType.reduce((best, cur) => (cur.itemSellingPrice > best.itemSellingPrice ? cur : best), itemsOfType[0]);
      if (mostExpensive) applyCartSubsidy(mostExpensive.id);
    });
    setShowSubsidyConfirm(false);
  };

  const handleProceedWithoutSubsidy = () => {
    setShowSubsidyConfirm(false);
    setShowPaymentConfirm(true);
  };

  // 회사 지원금 최대혜택 상태 판정 — 토글(ON/OFF) 대신 "지금 최대 혜택이 적용돼 있는가"를 그대로 보여주는 상태 배너로 대체.
  // 사용자가 주문상품 목록에서 다른(더 저렴한) 도서에 직접 적용해도 이 값이 즉시 false로 바뀌어 실제 상태와 어긋나지 않는다.
  const isTypeExhausted = (type: (typeof SUBSIDY_TYPES)[number]) => (type === 'recommended' ? subsidyLedger.recommendedUsed : subsidyLedger.personalUsed);
  const relevantSubsidyTypes = SUBSIDY_TYPES.filter((type) => selectedItems.some((i) => i.book.bookType === type) && !isTypeExhausted(type));
  const isMaxBenefitAppliedForType = (type: (typeof SUBSIDY_TYPES)[number]) => {
    const itemsOfType = selectedItems.filter((i) => i.book.bookType === type);
    const applied = itemsOfType.find((i) => i.isSubsidyApplied);
    if (!applied) return false;
    const mostExpensive = itemsOfType.reduce((best, cur) => (cur.itemSellingPrice > best.itemSellingPrice ? cur : best), itemsOfType[0]);
    return applied.id === mostExpensive.id;
  };
  const isMaxBenefitApplied = relevantSubsidyTypes.length > 0 && relevantSubsidyTypes.every(isMaxBenefitAppliedForType);
  const hasAnySubsidyApplied = cartStats.totalCompanySubsidy > 0;

  // 최대혜택 적용하기 — 유형별로 아직 가장 비싼 도서에 적용돼 있지 않은 경우에만(놓친 경우 + 다른 도서에 적용된 경우 모두) 다시 적용한다.
  const handleApplyMaxBenefit = () => {
    relevantSubsidyTypes.forEach((type) => {
      if (isMaxBenefitAppliedForType(type)) return;
      const itemsOfType = selectedItems.filter((i) => i.book.bookType === type);
      const mostExpensive = itemsOfType.reduce((best, cur) => (cur.itemSellingPrice > best.itemSellingPrice ? cur : best), itemsOfType[0]);
      if (mostExpensive) applyCartSubsidy(mostExpensive.id);
    });
  };

  // 결제 페이지 진입 시 1회, 지원 대상인데 미적용인 유형이 있으면 지원 혜택이 가장 큰 도서 자동으로 적용한다.
  // 이후 사용자가 주문상품 목록에서 직접 적용 도서를 바꾸면 그 선택을 그대로 존중한다(재적용하지 않음).
  const hasAutoAppliedRef = useRef(false);
  useLayoutEffect(() => {
    if (hasAutoAppliedRef.current) return;
    hasAutoAppliedRef.current = true;
    if (missedSubsidyTypes.length > 0) {
      handleApplyMissedSubsidy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='w-full bg-white py-8 min-h-screen text-[#3d3c3f]'>
      <div className='max-w-[1280px] mx-auto px-4 space-y-6'>
        {/* Top Header: Title & Step Indicator */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#dadada] pb-5 gap-4'>
          <h1 className='text-h2 sm:text-h1 font-bold text-[#181718] tracking-tight'>결제하기</h1>
          <StepIndicator currentStep='payment' />
        </div>

        {/* 상단 알림 배너 모음 */}
        {/* 케이스 C 배너: 이번 달 지원금 소진 안내 (1회 노출) */}
        {(subsidyLedger.recommendedUsed || subsidyLedger.personalUsed) && (
          <div className='border border-[#fca5a5] bg-[#ffebeb] rounded-lg p-3.5 flex items-center justify-between text-caption text-[#181718] shadow-xs'>
            <div className='flex items-center gap-2.5'>
              <AlertCircle className='w-4 h-4 text-[#df0000] flex-shrink-0' />
              <span className='font-semibold'>이번 달 {subsidyLedger.recommendedUsed && subsidyLedger.personalUsed ? '추천도서·개인도서' : subsidyLedger.recommendedUsed ? '추천도서' : '개인도서'} 지원금(1권)을 이미 사용하셨어요. 다음 달 1일에 초기화돼요.</span>
            </div>
          </div>
        )}

        {/* 2-Column Payment Layout matching payment.png */}
        <form onSubmit={handlePaymentSubmit} className='grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-8 items-start'>
          {/* LEFT COLUMN: Accordions / Sections */}
          <div className='space-y-4'>
            {/* 5. 기업 독서지원금 정책 안내 — 상세 내용은 접혀 있어도 혜택 요약은 상시 노출 */}
            <div className='border-2 border-[#1f976b] bg-[#f0faf5] rounded-xl p-5 space-y-4 shadow-2xs'>
              <div className='flex items-center gap-2 border-b border-[#c8e8d8] pb-3'>
                <Award className='w-5 h-5 text-[#181718]' />
                <h3 className='font-bold text-body-md text-[#181718]'>기업 독서지원금 정책 안내</h3>
              </div>

              {/* 지원 기준 카드 그리드 (상시 노출 — 혜택 각인용) */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-caption'>
                {/* 추천도서 */}
                <div className='bg-white p-3 rounded-lg border border-[#c8e8d8] space-y-1 shadow-2xs'>
                  <div className='flex items-center gap-1.5'>
                    <span className='bg-[#df0000] text-white text-caption font-extrabold px-1.5 py-0.5 rounded'>추천도서</span>
                    <span className='font-bold text-[#181718] text-body-xs'>회사 100% 전액 지원</span>
                  </div>
                  <p className='text-caption text-[#555a5c] leading-tight'>
                    • 직원 부담금 <strong>0원</strong> (월 1권 한도)
                  </p>
                </div>

                {/* 개인도서 */}
                <div className='bg-white p-3 rounded-lg border border-[#c8e8d8] space-y-1 shadow-2xs'>
                  <div className='flex items-center gap-1.5'>
                    <span className='bg-[#1f976b] text-white text-caption font-extrabold px-1.5 py-0.5 rounded'>개인도서</span>
                    <span className='font-bold text-[#181718] text-body-xs'>도서 금액의 50% 지원</span>
                  </div>
                  <p className='text-caption text-[#555a5c] leading-tight'>
                    • 1권당 최대 <strong>10,000원</strong> 한도 지원 (월 1권)
                  </p>
                </div>
              </div>

              {/* 세부 이용 안내 목록 — 기본 접힘, 필요할 때만 펼쳐서 확인 */}
              <div className='bg-white/90 rounded-lg border border-[#d1ebd9] text-caption text-[#334155]'>
                <button type='button' aria-expanded={showSubsidyPolicyDetail} onClick={() => setShowSubsidyPolicyDetail((prev) => !prev)} className='w-full flex items-center justify-between gap-1 p-3.5 font-bold text-[#181718] text-caption'>
                  <span className='flex items-center gap-1'>
                    <ShieldCheck className='w-4 h-4 text-[#1f976b]' />
                    <span>이용 안내 및 복합결제 규정 자세히 보기</span>
                  </span>
                  {showSubsidyPolicyDetail ? <ChevronUp className='w-4 h-4 text-[#80888a]' /> : <ChevronDown className='w-4 h-4 text-[#80888a]' />}
                </button>
                {showSubsidyPolicyDetail && (
                  <ul className='space-y-1.5 text-caption text-[#475569] list-disc list-inside px-3.5 pb-3.5 leading-relaxed'>
                    <li>
                      <strong>구매 한도 및 갱신</strong>: 지원 한도는 매월 1일 리셋되며 당월 미사용분은 다음 달로 이월되지 않습니다.
                    </li>
                    <li>
                      <strong>복합결제 및 주문 관리</strong>: 회사 지원금이 차감된 후, 남은 직원 부담금만 선택한 결제수단으로 결제되며 하나의 주문번호(Order ID)로 통합 관리됩니다.
                    </li>
                    <li>
                      <strong>취소 및 환불 규정</strong>: 주문 취소/반품 시 직원 실결제 금액 환불과 함께 적용된 회사 지원금 및 월 1권 신청 한도가 즉시 복원됩니다. (전자책 다운로드/열람 시 취소 기준 적용)
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* 회사 지원금 최대혜택 상태 배너 — 토글 대신, 지금 실제로 최대혜택이 적용돼 있는지를 있는 그대로 보여준다 */}
            {relevantSubsidyTypes.length > 0 && (
              <div className={`border-2 rounded-lg p-4 space-y-2 shadow-xs ${isMaxBenefitApplied ? 'border-[#1f976b] bg-[#e8f5ef]' : 'border-[#f0b429] bg-[#fffbeb]'}`}>
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <Wallet className='w-4 h-4' style={{ color: 'var(--color-foreground-secondary)' }} />
                    <span className='text-body-md' style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>
                      회사 지원금 최대혜택
                    </span>
                  </div>
                  {isMaxBenefitApplied ? (
                    <span className='text-body-xs font-bold flex items-center gap-1' style={{ color: 'var(--color-success)' }}>
                      <CheckCircle2 className='w-4 h-4' style={{ color: 'var(--color-success)' }} />
                      적용됨
                    </span>
                  ) : (
                    <button type='button' onClick={handleApplyMaxBenefit} className='btn btn--primary btn--sm' style={{ backgroundColor: 'var(--color-success)' }}>
                      최대혜택 적용하기
                    </button>
                  )}
                </div>
                <div className='text-body-xs' style={{ color: 'var(--color-foreground-secondary)' }}>
                  {isMaxBenefitApplied ? (
                    <p>지원 혜택이 가장 큰 도서에 지원금이 자동 적용되었습니다.</p>
                  ) : hasAnySubsidyApplied ? (
                    <>
                      <p>지원 혜택이 가장 큰 도서가 아닌 다른 도서에 지원금이 적용되어 있어요.</p>
                      <p>버튼을 클릭하면 가장 비싼 도서로 바뀌어요.</p>
                    </>
                  ) : (
                    <>
                      <p>아직 지원금을 적용하지 않았어요.</p>
                      <p>버튼을 클릭하면 가장 비싼 도서에 자동으로 적용돼요.</p>
                    </>
                  )}
                  <p>
                    주문상품 목록의 <b>[지원금 적용하기]</b> 버튼으로 원하는 도서를 직접 선택할 수도 있어요.
                  </p>
                </div>
              </div>
            )}
            {/* 2. 주문상품 Accordion */}
            <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white'>
              <div onClick={() => toggleSection('items')} className='px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]'>
                <div className='flex items-center gap-2'>
                  <h2 className='font-bold text-body-md text-[#181718]'>주문상품</h2>
                  <span className='text-caption bg-[#f6f6f6] text-[#555a5c] px-2 py-0.5 rounded font-semibold'>{selectedItems.length}건</span>
                </div>

                {activeAccordion.items ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
              </div>

              <p className='flex-1 text-caption px-5 py-2 text-[red]'>※ [지원금 적용하기] 버튼을 클릭하면 해당 도서에 지원금이 적용됩니다.</p>
              {activeAccordion.items && (
                <div className='overflow-x-auto'>
                  <table className='w-full text-caption text-left'>
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
                      {selectedItems.map((item) => (
                        <tr key={item.id} className={item.isSubsidyApplied ? 'bg-[#edf0f1] hover:bg-[#f6f6f6]' : 'hover:bg-[#fafafa]'}>
                          <td className='p-3 pl-5 flex items-center gap-3'>
                            <BookCoverImage title={item.book.title} coverImage={item.book.coverImage} coverBackground={item.book.coverBackground} className='w-14 h-20 rounded border border-[#edf0f1] flex-shrink-0' titleClassName='text-[8px]' />
                            <div className='space-y-1'>
                              <div className='flex items-center gap-1.5 flex-wrap'>
                                {item.book.bookType === 'recommended' && (
                                  <span className='text-caption px-2 py-0.5 rounded font-extrabold flex items-center gap-1 bg-[#ffebeb] text-[#df0000] border border-[#fca5a5]'>
                                    <Award className='w-3 h-3' />
                                    추천도서
                                  </span>
                                )}

                                <span className={`text-caption px-2 py-0.5 rounded-lg border font-medium inline-flex items-center gap-1 ${item.format === 'ebook' ? 'bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]' : 'bg-[#f6f6f6] text-[#555a5c] border-[#cbd2d4]'}`}>
                                  {item.format === 'ebook' ? (
                                    <>
                                      <Smartphone className='w-3 h-3' /> 전자책
                                    </>
                                  ) : (
                                    <>
                                      <BookOpen className='w-3 h-3' /> 종이책
                                    </>
                                  )}
                                </span>
                              </div>

                              <div className='font-bold text-body-xs text-[#181718]'>{item.book.title}</div>
                            </div>
                          </td>
                          <td className='p-3 text-right align-center'>
                            <div>
                              <span className='text-[#df0000] font-bold mr-1'>{item.book.discountRate}%</span>
                              <span className='font-bold text-[#181718]'>{item.itemSellingPrice.toLocaleString()}원</span>
                            </div>
                            {item.quantity >= 2 && <div className='text-caption text-[#80888a] font-normal mt-0.5'>(1권당 {item.book.sellingPrice.toLocaleString()}원)</div>}
                          </td>
                          <td className='p-3 text-center font-medium'>{item.quantity}</td>
                          <td className='p-3 text-right font-semibold text-[#1f976b] align-top space-y-1.5'>
                            <div className='h-[18px]'>{item.isSubsidyApplied && item.itemCompanySubsidy > 0 ? <span className={`font-bold ${item.book.bookType === 'recommended' ? 'text-[#df0000]' : 'text-[#1f976b]'}`}>-{item.itemCompanySubsidy.toLocaleString()}원</span> : null}</div>

                            {/* 회사 지원금 적용 토글 버튼 및 상태 문구 */}
                            <div className='flex flex-col items-end gap-1'>
                              {(() => {
                                const type = item.book.bookType;
                                const isExhausted = type === 'recommended' ? subsidyLedger.recommendedUsed : subsidyLedger.personalUsed;

                                // 케이스 C: 이번 달 지원금 결제 완료로 소진된 경우
                                if (isExhausted) {
                                  return (
                                    <>
                                      <button type='button' disabled aria-pressed={false} className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption font-bold bg-[#f6f6f6] text-[#9c9c9c] border border-[#cbd2d4] cursor-not-allowed whitespace-nowrap shadow-2xs'>
                                        <Circle className='w-3 h-3 text-[#9c9c9c]' />
                                        적용 불가
                                      </button>
                                      <span className='text-caption text-[#df0000] font-normal whitespace-nowrap'>이번 달 {type === 'recommended' ? '추천도서' : '개인도서'} 1권 소진</span>
                                    </>
                                  );
                                }

                                // 케이스 B: 지원금 적용됨
                                if (item.isSubsidyApplied) {
                                  return (
                                    <>
                                      <button
                                        type='button'
                                        aria-pressed={true}
                                        onClick={() => removeCartSubsidy(item.id)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption font-bold text-white border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${type === 'personal' ? 'bg-[#1f976b] border-[#1f976b]' : 'bg-[#df0000] border-[#df0000]'}`}
                                      >
                                        <CheckCircle2 className='w-4 h-4' />
                                        지원금 적용됨
                                      </button>
                                    </>
                                  );
                                }

                                // 케이스 A: 미적용 (기본 상태) — 버튼임을 명확히 인지하도록 강조 스타일 + 행동 유도형 문구 사용
                                return (
                                  <button
                                    type='button'
                                    aria-pressed={false}
                                    onClick={() => applyCartSubsidy(item.id)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption  bg-white transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                                      type === 'recommended' ? 'text-[#df0000] border-2 border-[#df0000] hover:bg-[#df0000] hover:text-white' : 'text-[#1f976b] border-2 border-[#1f976b] hover:bg-[#1f976b] hover:text-white'
                                    }`}
                                  >
                                    <Circle className='w-3.5 h-3.5' />
                                    지원금 적용하기
                                  </button>
                                );
                              })()}
                            </div>
                          </td>
                          <td className='p-3 text-right pr-5 font-bold text-[#181718]'>{item.itemEmployeePayment.toLocaleString()}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 1. 배송지 Accordion */}
            <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white'>
              <div onClick={() => toggleSection('shipping')} className='px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]'>
                <h2 className='font-bold text-body-md text-[#181718]'>배송지</h2>
                {activeAccordion.shipping ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
              </div>

              {activeAccordion.shipping && (
                <div className='p-5 space-y-4 text-caption sm:text-body-xs'>
                  {/* 배송지 선택 라디오 + 배송지 목록 */}
                  <div className='flex items-center gap-4'>
                    <label className='flex items-center gap-1.5 cursor-pointer'>
                      <input type='radio' name='addr_type' checked={true} readOnly className='w-4 h-4 accent-[#df0000]' />
                      <span className='text-[#181718] font-medium'>기본 배송지</span>
                    </label>
                    <label
                      className='flex items-center gap-1.5 cursor-pointer text-[#80888a]'
                      onClick={() => {
                        setAddressModalTab('new');
                        setIsAddressModalOpen(true);
                      }}
                    >
                      <input type='radio' name='addr_type' checked={false} readOnly className='w-4 h-4' />
                      <span>신규 배송지</span>
                    </label>
                    <button
                      type='button'
                      onClick={() => {
                        setAddressModalTab('list');
                        setIsAddressModalOpen(true);
                      }}
                      className='px-2.5 py-1 rounded border border-[#cbd2d4] bg-[#f6f6f6] hover:bg-[#edf0f1] text-caption font-semibold text-[#181718] transition-colors'
                    >
                      배송지 목록
                    </button>
                  </div>

                  {/* 배송지 요약 카드 — 상세 필드는 팝업(배송지 정보 수정)에서 편집 */}
                  <div className='p-4 bg-[#f6f6f6] border border-[#cbd2d4] rounded-lg space-y-1.5'>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='font-bold text-body-xs text-[#181718]'>
                        {selectedAddress.title} ({selectedAddress.recipient})
                      </span>
                      <button
                        type='button'
                        onClick={() => {
                          setAddressModalTab('new');
                          setIsAddressModalOpen(true);
                        }}
                        className='px-2.5 py-1 rounded border border-[#cbd2d4] bg-white hover:bg-[#edf0f1] text-caption font-semibold text-[#181718] transition-colors whitespace-nowrap'
                      >
                        배송지 정보 수정
                      </button>
                    </div>
                    <div className='text-[#595959]'>{selectedAddress.phone1}</div>
                    <div className='text-[#181718]'>
                      ({selectedAddress.postalCode}) {selectedAddress.roadAddress} {selectedAddress.detailAddress}
                    </div>
                    <div className='text-[#80888a]'>{selectedAddress.jibunAddress}</div>
                  </div>

                  {/* 배송 메모 — 개선 항목 4: "직접 입력" 선택 시 textarea 슬라이드 다운 */}
                  <div className='grid grid-cols-[100px_1fr] items-start gap-2 pt-1'>
                    <span className='font-medium text-[#555a5c] pt-2'>배송 메모</span>
                    <div className='space-y-1 max-w-lg text-body-xs'>
                      <select
                        value={isCustomMemo ? '직접 입력' : deliveryMemo}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '직접 입력') {
                            setIsCustomMemo(true);
                            setDeliveryMemo(customMemoText);
                          } else {
                            setIsCustomMemo(false);
                            setCustomMemoText('');
                            setDeliveryMemo(val);
                          }
                        }}
                        className='w-full h-10 px-3 border border-[#cbd2d4] rounded text-body-xs bg-white focus:outline-none focus:border-[#df0000]'
                      >
                        <option value='문 앞에 놓아주세요.'>문 앞에 놓아주세요.</option>
                        <option value='배송 전 미리 연락해 주세요.'>배송 전 미리 연락해 주세요.</option>
                        <option value='경비실에 맡겨 주세요.'>경비실에 맡겨 주세요.</option>
                        <option value='택배함에 보관해 주세요.'>택배함에 보관해 주세요.</option>
                        <option value='직접 수령하겠습니다.'>직접 수령하겠습니다.</option>
                        <option value='직접 입력'>직접 입력</option>
                      </select>

                      <div className='delivery-memo' data-open={isCustomMemo}>
                        <div className='relative pt-2'>
                          <textarea
                            value={customMemoText}
                            onChange={(e) => {
                              const val = e.target.value.slice(0, 100);
                              setCustomMemoText(val);
                              setDeliveryMemo(val);
                            }}
                            maxLength={100}
                            placeholder='배송 기사님께 전달할 메모를 입력해주세요.'
                            className='w-full h-20 resize-none px-3 py-2 border border-[#cbd2d4] rounded text-body-xs focus:outline-none focus:border-2 focus:border-[#df0000] placeholder-[#9da6a8]'
                          />
                          <div className='flex items-center justify-end gap-1 text-caption mt-1' style={{ color: customMemoText.length >= 100 ? 'var(--color-danger)' : 'var(--color-foreground-secondary)' }}>
                            <PenLine className='w-3.5 h-3.5' style={{ color: 'var(--color-muted)' }} />
                            <span>{customMemoText.length}/100</span>
                          </div>
                        </div>
                      </div>

                      <p className='text-caption text-[#80888a]'>• 택배사 송장에 표기되는 메시지입니다.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. 할인 Accordion */}
            {/* <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white'>
              <div onClick={() => toggleSection('discount')} className='px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]'>
                <h2 className='font-bold text-body-md text-[#181718]'>할인</h2>
                {activeAccordion.discount ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
              </div>

              {activeAccordion.discount && (
                <div className='p-5 text-caption text-[#80888a] flex items-center justify-between'>
                  <span className='font-medium text-[#555a5c]'>교환권/쿠폰</span>
                  <span>사용가능한 쿠폰이 없습니다.</span>
                </div>
              )}
            </div> */}

            {/* 4. YP 포인트 Accordion */}
            {/* <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white'>
              <div onClick={() => toggleSection('points')} className='px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]'>
                <h2 className='font-bold text-body-md text-[#181718]'>YP 포인트</h2>
                {activeAccordion.points ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
              </div>

              {activeAccordion.points && (
                <div className='p-5 space-y-3 text-caption'>
                  {['예치금', '적립금', 'e머니', 'e캐시'].map((pt, idx) => (
                    <div key={pt} className='grid grid-cols-[80px_1fr] items-center gap-3'>
                      <span className='text-[#555a5c] font-medium'>{pt}</span>
                      <div className='flex items-center gap-2'>
                        <input type='text' readOnly value={0} className='w-32 h-9 px-3 border border-[#cbd2d4] rounded text-right text-body-xs' />
                        <button type='button' className='px-3 h-9 rounded border border-[#cbd2d4] bg-[#f6f6f6] text-caption font-medium text-[#555a5c]'>
                          전액 사용
                        </button>
                        <span className='text-neutral-400'>(보유: {idx === 1 ? '1,000' : '0'}원)</span>
                      </div>
                    </div>
                  ))}
                  <p className='text-caption text-[#80888a] pt-2'>• 적립금 사용 시 예상 적립금이 변경될 수 있습니다.</p>
                </div>
              )}
            </div> */}

            {/* 6. 결제수단 Accordion (직원 결제분 PG 선택) */}
            <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white'>
              <div onClick={() => toggleSection('paymentMethod')} className='px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f6f6f6] select-none border-b border-[#edf0f1]'>
                <h2 className='font-bold text-body-md text-[#181718]'>결제수단 (직원 부담금 결제)</h2>
                {activeAccordion.paymentMethod ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
              </div>

              {activeAccordion.paymentMethod && (
                <div className='p-5 space-y-4 text-caption'>
                  {/* Option 1: 퀵계좌이체 */}
                  <label className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#f6f6f6]'>
                    <input type='radio' name='mop' checked={selectedMethod === 'quick_bank'} onChange={() => setSelectedMethod('quick_bank')} className='w-4 h-4 accent-[#df0000]' />
                    <span className='font-bold text-body-xs text-[#181718]'>퀵계좌이체</span>
                    <span className='text-caption bg-[#df0000] text-white px-1.5 py-0.2 rounded font-bold'>혜택</span>
                    <span className='text-caption text-[#df0000] font-medium'>1만원 이상 결제시 0.5% 할인</span>
                  </label>

                  {/* Option 2: 영풍빠른결제 */}
                  <label className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#f6f6f6]'>
                    <input type='radio' name='mop' checked={selectedMethod === 'yp_quick_pay'} onChange={() => setSelectedMethod('yp_quick_pay')} className='w-4 h-4 accent-[#df0000]' />
                    <span className='font-bold text-body-xs text-[#181718]'>영풍빠른결제</span>
                  </label>

                  {/* Option 3: 다른 결제수단 */}
                  <div className='pt-2 border-t border-[#edf0f1]'>
                    <label className='flex items-center gap-2 cursor-pointer mb-3'>
                      <input type='radio' name='mop' checked={!['quick_bank', 'yp_quick_pay'].includes(selectedMethod)} onChange={() => setSelectedMethod('credit_card')} className='w-4 h-4 accent-[#df0000]' />
                      <span className='font-bold text-body-xs text-[#181718]'>다른 결제수단</span>
                    </label>

                    {/* Multi-payment Grid matching payment.png */}
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5'>
                      {PAYMENT_METHODS.map((item) => (
                        <button
                          key={item.id}
                          type='button'
                          onClick={() => setSelectedMethod(item.id)}
                          className={`relative h-12 rounded border text-caption font-semibold flex items-center justify-center transition-all ${
                            selectedMethod === item.id ? 'border-[#df0000] bg-[#ffebeb]/40 text-[#df0000] ring-1 ring-[#df0000]' : 'border-[#cbd2d4] bg-white text-[#555a5c] hover:border-[#80888a]'
                          }`}
                        >
                          {item.badge && <span className={`absolute top-1 right-1 text-caption text-white px-1 rounded font-bold ${item.badgeColor}`}>{item.badge}</span>}
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Accordion Benefits Box matching screenshot */}
                    <div className='mt-4 space-y-1.5 text-caption text-[#555a5c]' style={{ display: 'none' }}>
                      {['퀵계좌이체 1만원 이상 결제시 0.5% 할인', '영풍빠른결제 이벤트 응모시 2천원 적립', 'KB Pay 3만원 이상 결제시 2천원 즉시할인', '네이버페이 3만원 이상 결제시 1천 포인트 적립', 'PAYCO 3만원 이상 결제시 1천원 즉시할인'].map((promo, idx) => (
                        <div key={idx} className='bg-[#f6f6f6] p-2.5 rounded flex items-center justify-between cursor-pointer hover:bg-[#edf0f1]'>
                          <span className='flex items-center gap-1.5'>
                            <span className='bg-[#df0000] text-white text-caption px-1.5 py-0.2 rounded font-bold'>혜택</span>
                            <span>{promo}</span>
                          </span>
                          <ChevronDown className='w-3.5 h-3.5 text-[#80888a]' />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Buyer info & Payment summary) matching payment.png */}
          <div className='space-y-4 lg:sticky lg:top-24'>
            {/* 주문자 정보 Box */}
            <div className='border border-[#cbd2d4] rounded-lg p-4 bg-white space-y-3 text-caption'>
              <h3 className='font-bold text-body-xs text-[#181718] border-b border-[#edf0f1] pb-2'>주문자 정보</h3>

              <div className='space-y-2'>
                <div>
                  <span className='text-[#555a5c] block mb-0.5'>이름*</span>
                  <div className='font-semibold text-body-xs text-[#181718]'>김민서</div>
                </div>

                <div>
                  <span className='text-[#555a5c] block mb-0.5'>연락처*</span>
                  <div className='flex items-center gap-1 text-caption'>
                    <select value={ordererPhonePrefix} onChange={(e) => setOrdererPhonePrefix(e.target.value)} className='px-1.5 py-1 bg-white rounded border border-[#cbd2d4] focus:outline-none focus:border-[#df0000]'>
                      <option value='010'>010</option>
                      <option value='011'>011</option>
                      <option value='02'>02</option>
                    </select>
                    <span>-</span>
                    <input type='text' maxLength={4} value={ordererPhoneMid} onChange={(e) => setOrdererPhoneMid(e.target.value.replace(/[^0-9]/g, ''))} className='w-16 px-2 py-1 bg-white rounded border border-[#cbd2d4] text-center focus:outline-none focus:border-[#df0000]' />
                    <span>-</span>
                    <input type='text' maxLength={4} value={ordererPhoneEnd} onChange={(e) => setOrdererPhoneEnd(e.target.value.replace(/[^0-9]/g, ''))} className='w-16 px-2 py-1 bg-white rounded border border-[#cbd2d4] text-center focus:outline-none focus:border-[#524040]' />
                  </div>
                </div>

                <div>
                  <span className='text-[#555a5c] block mb-0.5'>이메일</span>
                  <input type='email' value={ordererEmail} onChange={(e) => setOrdererEmail(e.target.value)} className='w-full p-1.5 bg-white rounded border border-[#cbd2d4] text-caption focus:outline-none focus:border-[#df0000]' />
                </div>

                <div className='text-caption text-[#80888a] pt-1 leading-normal'>• 주문자 연락처로 주문 관련 알림톡이 발송되므로 정확한 주문자 정보를 입력해 주세요.</div>
              </div>
            </div>

            {/* 결제 정보 Box (Matching payment.png) */}
            <div className='border border-[#cbd2d4] rounded-lg p-5 bg-white space-y-3.5 shadow-sm'>
              <h3 className='font-bold text-body-md text-[#181718] border-b border-[#edf0f1] pb-2.5'>결제 정보</h3>

              <div className='space-y-2 text-body-xs'>
                <div className='flex justify-between text-[#595959]'>
                  <span>상품금액</span>
                  <span>{cartStats.totalListPrice.toLocaleString()}원</span>
                </div>
                <div className='flex justify-between text-[#df0000]'>
                  <span>상품할인</span>
                  <span>- {cartStats.totalProductDiscount.toLocaleString()}원</span>
                </div>

                {/* B2B 기업 지원금 차감 표시 */}
                <div className='flex justify-between text-[#1f976b] font-semibold bg-[#e8f5ef] p-1.5 rounded'>
                  <span>회사 지원금</span>
                  <span>- {cartStats.totalCompanySubsidy.toLocaleString()}원</span>
                </div>

                <div className='flex justify-between text-[#595959]'>
                  <span>배송비</span>
                  <span>{cartStats.shippingFee === 0 ? '0원' : `${cartStats.shippingFee.toLocaleString()}원`}</span>
                </div>
              </div>

              {/* 총 결제금액(직원 부담금) */}
              <div className='border-t border-[#dadada] pt-3'>
                <div className='flex justify-between items-baseline items-center'>
                  <span className='font-bold text-body-xs text-[#181718]'>
                    총 결제금액
                    <br />
                    (직원 부담금)
                  </span>
                  <div className='text-right items-center'>
                    <span className='text-h2 font-black text-[#df0000]'>{cartStats.finalPaymentAmount.toLocaleString()}</span>
                    <span className='text-body-xs font-bold text-[#df0000] ml-1'>원</span>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className='border-t border-[#dadada] pt-3'>
                <label className='flex items-start gap-2 cursor-pointer text-caption text-[#555a5c] leading-tight'>
                  <input type='checkbox' checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className='w-4 h-4 accent-[#df0000] mt-0.5 flex-shrink-0' />
                  <span>
                    주문 내용을 확인하였으며, <br />
                    <strong className='underline'>개인정보 수집 및 제3자 제공 등</strong>에 동의합니다.
                  </span>
                </label>
              </div>

              {/* 결제하기 — 화면당 유일한 Primary CTA (개선 항목 2), 실제 PG 승인 금액을 버튼 텍스트에 표기 */}
              <button type='submit' className='btn btn--primary btn--lg w-full gap-2'>
                <CreditCard className='w-4 h-4' style={{ color: 'var(--white)' }} />
                {cartStats.finalPaymentAmount.toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 놓침 방지 확인 팝업 — 지원 대상 도서가 미적용 상태로 남은 채 결제하기를 누른 경우 */}
      {showSubsidyConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={() => setShowSubsidyConfirm(false)}>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl' onClick={(e) => e.stopPropagation()}>
            <h3 className='font-bold text-body-md text-[#181718]'>지원금을 적용하지 않고 진행하시겠어요?</h3>
            <p className='text-caption text-[#80888a] leading-relaxed'>{missedSubsidyTypes.map((t) => (t === 'recommended' ? '추천도서' : '개인도서')).join(', ')} 지원금을 아직 적용하지 않았습니다. 지금 적용하면 회사 지원금이 반영된 금액으로 결제됩니다.</p>
            <div className='flex gap-2 pt-2'>
              <button type='button' onClick={handleProceedWithoutSubsidy} className='flex-1 py-2.5 rounded border border-[#cbd2d4] text-body-xs font-semibold text-[#595959] hover:bg-[#f6f6f6]'>
                그냥 진행
              </button>
              <button type='button' onClick={handleApplyMissedSubsidy} className='flex-1 py-2.5 rounded bg-[#df0000] hover:bg-[#ea2e2e] text-white text-body-xs font-bold'>
                최대혜택 적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 결제 확인 팝업 — 06_checkout.html #modalConfirm 대응 */}
      {showPaymentConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={() => setShowPaymentConfirm(false)}>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl text-center' onClick={(e) => e.stopPropagation()}>
            <div className='w-12 h-12 rounded-full bg-[#ffebeb] flex items-center justify-center mx-auto'>
              <CreditCard className='w-6 h-6' style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className='font-bold text-body-md text-[#181718]'>{cartStats.finalPaymentAmount.toLocaleString()}원을 결제하시겠습니까?</h3>
            {cartStats.totalCompanySubsidy > 0 && (
              <p className='text-caption text-[#80888a] leading-relaxed'>
                회사 지원금 {cartStats.totalCompanySubsidy.toLocaleString()}원이 먼저 차감되고, 직원 결제금 {cartStats.finalPaymentAmount.toLocaleString()}원이 결제됩니다.
              </p>
            )}
            <div className='flex gap-2 pt-2'>
              <button type='button' onClick={() => setShowPaymentConfirm(false)} className='flex-1 py-2.5 rounded border border-[#cbd2d4] text-body-xs font-semibold text-[#595959] hover:bg-[#f6f6f6]'>
                취소
              </button>
              <button type='button' onClick={handleConfirmPayment} className='flex-1 py-2.5 rounded bg-[#df0000] hover:bg-[#ea2e2e] text-white text-body-xs font-bold'>
                결제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 결제 진행중 팝업 — 06_checkout.html #modalProgress 대응 */}
      {isPaymentProcessing && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-white rounded-lg p-8 max-w-sm w-full space-y-3 shadow-xl text-center'>
            <Loader2 className='w-8 h-8 mx-auto animate-spin' style={{ color: 'var(--color-primary)' }} />
            <h3 className='font-bold text-body-md text-[#181718]'>결제 진행 중입니다…</h3>
            <p className='text-caption text-[#80888a]'>잠시만 기다려 주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
};
