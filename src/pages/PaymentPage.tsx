import React, { useLayoutEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import { ChevronDown, ChevronUp, AlertCircle, CreditCard, Building2, ExternalLink, HelpCircle, Award, BookOpen, Smartphone, CheckCircle2, Circle, ShieldCheck, Wallet, PenLine, Loader2, Sparkles, X } from 'lucide-react';
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
  const { cart, cartStats, selectedAddress, setIsAddressModalOpen, setAddressModalTab, processPayment, showToast, subsidyLedger, resetSubsidyLedger, applyCartSubsidy, removeCartSubsidy, toggleItemSelection, setActivePage } = useShop();

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

  // 결제 진행중 팝업 플로우
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

  // Accordion states for group cards
  const [isRecommendedOpen, setIsRecommendedOpen] = useState(true);
  const [isPersonalOpen, setIsPersonalOpen] = useState(true);

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
    if (relevantSubsidyTypes.length > 0 && !isMaxBenefitApplied) {
      setShowSubsidyConfirm(true);
      return;
    }

    startPaymentProcessing();
  };

  // 결제 진행중 팝업(약 1.2초) → 실제 주문 처리.
  const startPaymentProcessing = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      processPayment(PAYMENT_METHOD_LABELS[selectedMethod] ?? selectedMethod, true, deliveryMemo);
    }, 1200);
  };

  // 결제창 내 즉시 제외 [✕] 기능 & 개인도서 지원금 자동 승계
  const handleExcludeItem = (item: (typeof cart)[0]) => {
    const wasApplied = item.isSubsidyApplied;
    const bookType = item.book.bookType;

    // 이번 결제 목록에서 제외 (장바구니 원본 상품은 보존)
    toggleItemSelection(item.id);

    // 만약 지원금이 적용 중이던 개인도서를 [✕]로 제외하면, 목록에 남은 다른 개인도서 중 할인액이 가장 큰 도서로 지원금 자동 승계
    if (wasApplied && bookType === 'personal') {
      const remainingPersonal = selectedItems.filter((i) => i.id !== item.id && i.book.bookType === 'personal');
      if (remainingPersonal.length > 0) {
        const highestDiscountItem = remainingPersonal.reduce(
          (best, cur) => (cur.itemSellingPrice > best.itemSellingPrice ? cur : best),
          remainingPersonal[0]
        );
        applyCartSubsidy(highestDiscountItem.id);
      }
    }
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

  // [그대로 진행] 선택 시: 팝업 닫고 현재 선택 상태 그대로 즉시 결제 처리 진행
  const handleProceedWithoutSubsidy = () => {
    setShowSubsidyConfirm(false);
    startPaymentProcessing();
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
  const unappliedMaxTypes = relevantSubsidyTypes.filter((type) => !isMaxBenefitAppliedForType(type));
  const hasAnySubsidyApplied = cartStats.totalCompanySubsidy > 0;

  // 장바구니에 담긴 도서 유형 기반 당월 지원금 적용 현황 문구 생성
  const getSubsidyStatusSummary = () => {
    const parts: string[] = [];
    const hasRecommendedInCart = selectedItems.some((i) => i.book.bookType === 'recommended');
    const hasPersonalInCart = selectedItems.some((i) => i.book.bookType === 'personal');

    if (hasRecommendedInCart) {
      if (subsidyLedger.recommendedUsed) {
        parts.push('추천도서 소진');
      } else if (selectedItems.some((i) => i.book.bookType === 'recommended' && i.isSubsidyApplied)) {
        parts.push('추천도서 적용');
      } else {
        parts.push('추천도서 미적용');
      }
    }

    if (hasPersonalInCart) {
      if (subsidyLedger.personalUsed) {
        parts.push('개인도서 소진');
      } else if (selectedItems.some((i) => i.book.bookType === 'personal' && i.isSubsidyApplied)) {
        parts.push('개인도서 적용');
      } else {
        parts.push('개인도서 미적용');
      }
    }

    if (parts.length === 0) return '';
    return `(당월 현황: ${parts.join(' / ')})`;
  };

  // 최대혜택 적용하기 — 유형별로 아직 가장 비싼 도서에 적용돼 있지 않은 경우에만(놓친 경우 + 다른 도서에 적용된 경우 모두) 다시 적용한다.
  const handleApplyMaxBenefit = () => {
    relevantSubsidyTypes.forEach((type) => {
      if (isMaxBenefitAppliedForType(type)) return;
      const itemsOfType = selectedItems.filter((i) => i.book.bookType === type);
      const mostExpensive = itemsOfType.reduce((best, cur) => (cur.itemSellingPrice > best.itemSellingPrice ? cur : best), itemsOfType[0]);
      if (mostExpensive) applyCartSubsidy(mostExpensive.id);
    });
  };

  // 팝업에서 [최대혜택 적용하기] 선택 시: 팝업을 닫고 현재 화면에서 최대혜택 적용 (바로 결제 진행 안함)
  const handleApplyMaxBenefitOnly = () => {
    handleApplyMaxBenefit();
    setShowSubsidyConfirm(false);
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
        {/* {(subsidyLedger.recommendedUsed || subsidyLedger.personalUsed) && (
          <div className='border border-[#fca5a5] bg-[#ffebeb] rounded-lg p-3.5 flex items-center justify-between text-caption text-[#181718] shadow-xs'>
            <div className='flex items-center gap-2.5'>
              <AlertCircle className='w-4 h-4 text-[#df0000] flex-shrink-0' />
              <span className='font-semibold'>이번 달 {subsidyLedger.recommendedUsed && subsidyLedger.personalUsed ? '추천도서·개인도서' : subsidyLedger.recommendedUsed ? '추천도서' : '개인도서'} 지원금(1권)을 이미 사용하셨어요. 다음 달 1일에 초기화돼요.</span>
            </div>
          </div>
        )} */}

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
                    {/* <li>
                      <strong>취소 및 환불 규정</strong>: 주문 취소/반품 시 직원 실결제 금액 환불과 함께 적용된 회사 지원금 및 월 1권 신청 한도가 즉시 복원됩니다. (전자책 다운로드/열람 시 취소 기준 적용)
                    </li> */}
                  </ul>
                )}
              </div>
            </div>

            {/* 회사 지원금 통합 상태 & 최대혜택 안내 Callout Banner */}
            {(relevantSubsidyTypes.length > 0 || subsidyLedger.recommendedUsed || subsidyLedger.personalUsed) && (
              <div className='mt-3'>
                {subsidyLedger.recommendedUsed && subsidyLedger.personalUsed ? (
                  /* 1) [모두 소진 상태] */
                  <div className='bg-[#F0F5FF] border border-[#D0DDFB] border-l-4 border-l-[#3B82F6] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all'>
                    <div className='flex items-start md:items-center gap-3.5'>
                      <div className='w-9 h-9 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE] shadow-2xs mt-0.5 md:mt-0'>
                        <AlertCircle className='w-5 h-5 text-[#2563EB]' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <h4 className='font-extrabold text-sm text-[#1E3A8A] tracking-tight'>
                            이번 달 도서 지원금(추천·개인도서)이 모두 소진되었습니다.
                          </h4>
                        </div>
                        <p className='text-body-xs text-[#1E3A8A]/80 mt-0.5 leading-relaxed font-normal'>
                          (전액 직원 부담금으로 결제됩니다.)
                        </p>
                      </div>
                    </div>
                    <div className='inline-flex items-center gap-1.5 bg-white border border-[#BFDBFE] text-[#1E3A8A] text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-2xs shrink-0 self-start md:self-auto'>
                      <span>매월 1일 자동 갱신</span>
                    </div>
                  </div>
                ) : subsidyLedger.recommendedUsed || subsidyLedger.personalUsed ? (
                  /* 2) [한 유형만 소진 상태] */
                  <div className='bg-[#F0F5FF] border border-[#D0DDFB] border-l-4 border-l-[#3B82F6] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all'>
                    <div className='flex items-start md:items-center gap-3.5'>
                      <div className='w-9 h-9 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE] shadow-2xs mt-0.5 md:mt-0'>
                        {isMaxBenefitApplied ? <AlertCircle className='w-5 h-5 text-[#2563EB]' /> : <Sparkles className='w-5 h-5 text-[#2563EB]' />}
                      </div>
                      <div>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <h4 className='font-extrabold text-sm text-[#1E3A8A] tracking-tight'>
                            {subsidyLedger.recommendedUsed
                              ? '이번 달 추천도서 지원금이 모두 소진되었습니다.'
                              : '이번 달 개인도서 지원금이 모두 소진되었습니다.'}
                          </h4>
                        </div>
                        <p className='text-body-xs text-[#1E3A8A]/80 mt-0.5 leading-relaxed font-normal'>
                          {subsidyLedger.recommendedUsed
                            ? isMaxBenefitApplied
                              ? '(개인도서 지원금은 적용 가능하며, 추천도서는 소진되어 직원 부담금으로 결제됩니다.)'
                              : '(개인도서 지원금 적용 가능. [최대혜택 적용하기]를 눌러 가장 큰 할인을 받아보세요.)'
                            : isMaxBenefitApplied
                              ? '(추천도서 지원금은 적용 가능하며, 개인도서는 소진되어 직원 부담금으로 결제됩니다.)'
                              : '(추천도서 지원금 적용 가능. [최대혜택 적용하기]를 눌러 가장 큰 할인을 받아보세요.)'}
                        </p>
                      </div>
                    </div>
                    {isMaxBenefitApplied ? (
                      <div className='inline-flex items-center gap-1.5 bg-white border border-[#BFDBFE] text-[#1E3A8A] text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-2xs shrink-0 self-start md:self-auto'>
                        <span>매월 1일 자동 갱신</span>
                      </div>
                    ) : (
                      <button
                        type='button'
                        onClick={handleApplyMaxBenefit}
                        className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-all whitespace-nowrap active:scale-98 cursor-pointer shrink-0 flex items-center gap-1.5 self-start md:self-auto'
                      >
                        <Sparkles className='w-4 h-4 text-white' />
                        <span>최대혜택 적용하기</span>
                      </button>
                    )}
                  </div>
                ) : isMaxBenefitApplied ? (
                  /* 3) [모두 보유 & 최대혜택 적용 완료] */
                  <div className='bg-[#F0F5FF] border border-[#D0DDFB] border-l-4 border-l-[#3B82F6] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all'>
                    <div className='flex items-start md:items-center gap-3.5'>
                      <div className='w-9 h-9 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE] shadow-2xs mt-0.5 md:mt-0'>
                        <CheckCircle2 className='w-5 h-5 text-[#2563EB]' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <h4 className='font-extrabold text-sm text-[#1E3A8A] tracking-tight'>
                            지원 혜택이 가장 큰 도서에 지원금이 자동 적용되었습니다.
                          </h4>
                        </div>
                        {getSubsidyStatusSummary() && (
                          <p className='text-body-xs text-[#1E3A8A]/80 mt-0.5 leading-relaxed font-normal'>
                            {getSubsidyStatusSummary()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='inline-flex items-center gap-1.5 bg-white border border-[#BFDBFE] text-[#1E3A8A] text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-2xs shrink-0 self-start md:self-auto'>
                      <CheckCircle2 className='w-4 h-4 text-[#2563EB]' />
                      <span>적용 완료 ✓</span>
                    </div>
                  </div>
                ) : (
                  /* 4) [모두 보유 & 최대혜택 미적용] */
                  <div className='bg-[#F0F5FF] border border-[#D0DDFB] border-l-4 border-l-[#3B82F6] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all'>
                    <div className='flex items-start md:items-center gap-3.5'>
                      <div className='w-9 h-9 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE] shadow-2xs mt-0.5 md:mt-0'>
                        <Sparkles className='w-5 h-5 text-[#2563EB]' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <h4 className='font-extrabold text-sm text-[#1E3A8A] tracking-tight'>
                            [최대혜택 적용하기]를 눌러 가장 큰 할인 혜택을 확인해 보세요.
                          </h4>
                        </div>
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={handleApplyMaxBenefit}
                      className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-all whitespace-nowrap active:scale-98 cursor-pointer shrink-0 flex items-center gap-1.5 self-start md:self-auto'
                    >
                      <Sparkles className='w-4 h-4 text-white' />
                      <span>최대혜택 적용하기</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* 2. 주문상품 Section (2개 그룹 카드) */}
            <div className='space-y-6'>
              {selectedItems.length === 0 ? (
                <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white p-10 text-center space-y-3 shadow-2xs'>
                  <p className='font-bold text-body-xs text-[#555a5c]'>선택된 주문 상품이 없습니다.</p>
                  <p className='text-caption text-[#80888a]'>주문서에서 제외된 도서는 장바구니에 보존되어 있습니다.</p>
                  <button
                    type='button'
                    onClick={() => setActivePage('cart')}
                    className='px-4 py-2 bg-[#df0000] hover:bg-[#ea2e2e] text-white text-caption font-bold rounded transition-colors shadow-2xs cursor-pointer'
                  >
                    장바구니로 이동
                  </button>
                </div>
              ) : (
                <>
                  {/* 1) 추천도서 주문 목록 카드 */}
                  {selectedItems.some((i) => i.book.bookType === 'recommended') && (
                    <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white shadow-2xs'>
                      {/* 아코디언 카드 헤더 */}
                      <div
                        onClick={() => setIsRecommendedOpen(!isRecommendedOpen)}
                        className='px-5 py-4 flex flex-wrap items-center justify-between gap-2 bg-[#ffffff] hover:bg-[#f6f6f6] select-none cursor-pointer border-b border-[#edf0f1]'
                      >
                        <div className='flex items-center gap-2.5'>
                          <span className='text-caption-lg px-2.5 py-1 rounded-md font-extrabold flex items-center gap-1 bg-[#ffebeb] text-[#df0000] border border-[#fca5a5]'>
                            <Award className='w-3.5 h-3.5' />
                            추천도서
                          </span>
                          <span className='font-bold text-body-xs text-[#181718]'>회사 100% 지원 (월 1권)</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          {subsidyLedger.recommendedUsed ? (
                            <span className='inline-flex items-center gap-1 text-caption-lg font-bold text-[red] bg-[#f1f5f9] border border-[red] px-2.5 py-1 rounded-full'>
                              ○  지원금 사용 완료
                            </span>
                          ) : (
                            <span className='inline-flex items-center gap-1 text-caption-lg font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-full'>
                              ✓ 100% 지원 적용
                            </span>
                          )}
                          {isRecommendedOpen ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
                        </div>
                      </div>

                      {/* 테이블 (5컬럼: 상품정보 | 판매가 | 수량 | 회사 지원금 | 직원 결제액) */}
                      {isRecommendedOpen && (
                        <div className='overflow-x-auto'>
                          <table className='w-full text-caption text-left border-collapse'>
                            <thead className='bg-[#f6f6f6] text-[#80888a] font-semibold border-b border-[#edf0f1]'>
                              <tr>
                                <th className='p-3 pl-5'>상품정보</th>
                                <th className='p-3 text-right'>판매가</th>
                                <th className='p-3 text-center'>수량</th>
                                <th className='p-3 text-center'>회사 지원금</th>
                                <th className='p-3 text-right pr-9'>직원 결제액</th>
                              </tr>
                            </thead>
                            <tbody className='divide-y divide-[#edf0f1]'>
                              {selectedItems
                                .filter((i) => i.book.bookType === 'recommended')
                                .map((item) => {
                                  const isEbook = item.format === 'ebook';
                                  const isExhausted = subsidyLedger.recommendedUsed;

                                  return (
                                    <tr key={item.id} className='hover:bg-[#fafafa]'>
                                      {/* 1. 상품정보 */}
                                      <td className='p-3.5 pl-5 align-middle'>
                                        <div className='flex items-center gap-3'>
                                          <BookCoverImage
                                            title={item.book.title}
                                            coverImage={item.book.coverImage}
                                            coverBackground={item.book.coverBackground}
                                            className='w-14 h-20 rounded border border-[#edf0f1] flex-shrink-0 shadow-xs'
                                            titleClassName='text-[8px]'
                                          />
                                          <div className='space-y-1 min-w-0 flex-1 pr-6'>
                                            <div className='flex items-center gap-1.5 flex-wrap'>
                                              <span className={`text-caption px-2 py-0.5 rounded-lg border font-medium inline-flex items-center gap-1 ${isEbook ? 'bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]' : 'bg-[#f6f6f6] text-[#555a5c] border-[#cbd2d4]'}`}>
                                                {isEbook ? <Smartphone className='w-3 h-3' /> : <BookOpen className='w-3 h-3' />}
                                                {isEbook ? '전자책' : '종이책'}
                                              </span>
                                            </div>
                                            <div className='font-bold text-body-xs text-[#181718] leading-tight'>{item.book.title}</div>
                                            <p className='text-caption text-[#80888a] mt-0.5'>
                                              {item.book.author} · {item.book.publisher}
                                            </p>
                                          </div>
                                        </div>
                                      </td>

                                      {/* 2. 판매가 */}
                                      <td className='p-3 text-right align-middle font-medium'>
                                        <span className='text-[#df0000] font-bold mr-1'>{item.book.discountRate}%</span>
                                        <span className='font-bold text-[#181718]'>{item.itemSellingPrice.toLocaleString()}원</span>
                                      </td>

                                      {/* 3. 수량 */}
                                      <td className='p-3 text-center align-middle font-medium text-[#181718]'>{item.quantity}</td>

                                      {/* 4. 회사 지원금 */}
                                      <td className='p-3 text-center align-middle'>
                                        {isExhausted ? (
                                          <span className='px-2.5 py-1 text-caption font-bold text-[#64748b] bg-[#f1f5f9] border border-[#cbd5e1] rounded-full inline-block cursor-not-allowed shadow-2xs'>
                                            한도 소진
                                          </span>
                                        ) : item.isSubsidyApplied ? (
                                          <span className='px-2.5 py-1 text-caption font-bold text-[#df0000] bg-[#ffebeb] border border-[#fca5a5] rounded-full inline-block shadow-2xs'>
                                            -{item.itemCompanySubsidy.toLocaleString()}원 / ✓ 적용 중
                                          </span>
                                        ) : (
                                          <button
                                            type='button'
                                            onClick={() => applyCartSubsidy(item.id)}
                                            className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption font-bold text-[#df0000] border-2 border-[#df0000] hover:bg-[#df0000] hover:text-white transition-all cursor-pointer whitespace-nowrap shadow-2xs'
                                          >
                                            지원금 적용
                                          </button>
                                        )}
                                      </td>

                                      {/* 5. 직원 결제액 및 제외 버튼 */}
                                      <td className='p-3 text-right align-middle font-bold text-[#181718] relative pr-9'>
                                        <span>{item.itemEmployeePayment.toLocaleString()}원</span>
                                        <button
                                          type='button'
                                          onClick={() => handleExcludeItem(item)}
                                          className='btn-book-remove'
                                          title='이번 결제에서 제외 (장바구니에는 보존)'
                                          aria-label='상품 제외'
                                        >
                                          ✕
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2) 개인도서 주문 목록 카드 */}
                  {selectedItems.some((i) => i.book.bookType === 'personal') && (
                    <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white shadow-2xs'>
                      {/* 아코디언 카드 헤더 */}
                      <div
                        onClick={() => setIsPersonalOpen(!isPersonalOpen)}
                        className='px-5 py-4 flex flex-wrap items-center justify-between gap-2 bg-[#ffffff] hover:bg-[#f6f6f6] select-none cursor-pointer border-b border-[#edf0f1]'
                      >
                        <div className='flex items-center gap-2.5'>
                          <span className='text-caption-lg px-2.5 py-1 rounded-md font-extrabold flex items-center gap-1 bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]'>
                            <BookOpen className='w-3.5 h-3.5' />
                            개인도서
                          </span>
                          <span className='font-bold text-body-xs text-[#181718]'>50% 지원 (권당 최대 1만 원, 월 1권)</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          {subsidyLedger.personalUsed ? (
                            <span className='inline-flex items-center gap-1 text-caption-lg font-bold text-[#64748b] bg-[#f1f5f9] border border-[#cbd5e1] px-2.5 py-1 rounded-full'>
                              ○ 한도 소진
                            </span>
                          ) : (
                            <span className='inline-flex items-center gap-1 text-caption-lg font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-full'>
                              ✓ 지원금 적용 가능
                            </span>
                          )}
                          {isPersonalOpen ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
                        </div>
                      </div>

                      {/* 테이블 (5컬럼: 상품정보 | 판매가 | 수량 | 회사 지원금 | 직원 결제액) */}
                      {isPersonalOpen && (
                        <div className='overflow-x-auto'>
                          <table className='w-full text-caption text-left border-collapse'>
                            <thead className='bg-[#f6f6f6] text-[#80888a] font-semibold border-b border-[#edf0f1]'>
                              <tr>
                                <th className='p-3 pl-5'>상품정보</th>
                                <th className='p-3 text-right'>판매가</th>
                                <th className='p-3 text-center'>수량</th>
                                <th className='p-3 text-center'>회사 지원금</th>
                                <th className='p-3 text-right pr-9'>직원 결제액</th>
                              </tr>
                            </thead>
                            <tbody className='divide-y divide-[#edf0f1]'>
                              {selectedItems
                                .filter((i) => i.book.bookType === 'personal')
                                .map((item) => {
                                  const isEbook = item.format === 'ebook';
                                  const isExhausted = subsidyLedger.personalUsed;

                                  return (
                                    <tr
                                      key={item.id}
                                      className={`transition-colors ${item.isSubsidyApplied ? 'bg-[#f0fdf4] hover:bg-[#e6f4ea]' : 'hover:bg-[#fafafa]'}`}
                                    >
                                      {/* 1. 상품정보 */}
                                      <td className='p-3.5 pl-5 align-middle'>
                                        <div className='flex items-center gap-3'>
                                          <BookCoverImage
                                            title={item.book.title}
                                            coverImage={item.book.coverImage}
                                            coverBackground={item.book.coverBackground}
                                            className='w-14 h-20 rounded border border-[#edf0f1] flex-shrink-0 shadow-xs'
                                            titleClassName='text-[8px]'
                                          />
                                          <div className='space-y-1 min-w-0 flex-1 pr-6'>
                                            <div className='flex items-center gap-1.5 flex-wrap'>
                                              <span className={`text-caption px-2 py-0.5 rounded-lg border font-medium inline-flex items-center gap-1 ${isEbook ? 'bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]' : 'bg-[#f6f6f6] text-[#555a5c] border-[#cbd2d4]'}`}>
                                                {isEbook ? <Smartphone className='w-3 h-3' /> : <BookOpen className='w-3 h-3' />}
                                                {isEbook ? '전자책' : '종이책'}
                                              </span>
                                            </div>
                                            <div className='font-bold text-body-xs text-[#181718] leading-tight'>{item.book.title}</div>
                                            <p className='text-caption text-[#80888a] mt-0.5'>
                                              {item.book.author} · {item.book.publisher}
                                            </p>
                                          </div>
                                        </div>
                                      </td>

                                      {/* 2. 판매가 */}
                                      <td className='p-3 text-right align-middle font-medium'>
                                        <span className='text-[#df0000] font-bold mr-1'>{item.book.discountRate}%</span>
                                        <span className='font-bold text-[#181718]'>{item.itemSellingPrice.toLocaleString()}원</span>
                                      </td>

                                      {/* 3. 수량 */}
                                      <td className='p-3 text-center align-middle font-medium text-[#181718]'>{item.quantity}</td>

                                      {/* 4. 회사 지원금 */}
                                      <td className='p-3 text-center align-middle'>
                                        {isExhausted ? (
                                          <span className='px-2.5 py-1 text-caption font-bold text-[#64748b] bg-[#f1f5f9] border border-[#cbd5e1] rounded-full inline-block cursor-not-allowed shadow-2xs'>
                                            한도 소진
                                          </span>
                                        ) : item.isSubsidyApplied ? (
                                          <span className='px-2.5 py-1 text-caption font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] rounded-full inline-block shadow-2xs'>
                                            -{item.itemCompanySubsidy.toLocaleString()}원 / ✓ 적용 중
                                          </span>
                                        ) : (
                                          <button
                                            type='button'
                                            onClick={() => applyCartSubsidy(item.id)}
                                            className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption font-bold text-[#2563eb] border-2 border-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all cursor-pointer whitespace-nowrap shadow-2xs'
                                          >
                                            지원금 적용
                                          </button>
                                        )}
                                      </td>

                                      {/* 5. 직원 결제액 및 제외 버튼 */}
                                      <td className='p-3 text-right align-middle font-bold text-[#181718] relative pr-9'>
                                        <span>{item.itemEmployeePayment.toLocaleString()}원</span>
                                        <button
                                          type='button'
                                          onClick={() => handleExcludeItem(item)}
                                          className='btn-book-remove'
                                          title='이번 결제에서 제외 (장바구니에는 보존)'
                                          aria-label='상품 제외'
                                        >
                                          ✕
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </>
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
                          className={`relative h-12 rounded border text-caption font-semibold flex items-center justify-center transition-all ${selectedMethod === item.id ? 'border-[#df0000] bg-[#ffebeb]/40 text-[#df0000] ring-1 ring-[#df0000]' : 'border-[#cbd2d4] bg-white text-[#555a5c] hover:border-[#80888a]'
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

            {/* 결제 정보 Box (영수증형 클린 뷰) */}
            <div className='border border-[#cbd2d4] rounded-lg p-5 bg-white space-y-3.5 shadow-sm'>
              <h3 className='font-bold text-body-md text-[#181718] border-b border-[#edf0f1] pb-2.5'>결제 정보</h3>

              <div className='space-y-2.5 text-body-xs'>
                <div className='flex justify-between text-[#595959]'>
                  <span>상품금액</span>
                  <span className='font-semibold text-[#181718]'>{cartStats.totalSellingPrice.toLocaleString()}원</span>
                </div>

                {/* 추천도서 지원금 */}
                {selectedItems.some((i) => i.book.bookType === 'recommended') && (
                  <div className='flex justify-between items-center'>
                    <span className='text-[#595959]'>추천도서 지원금</span>
                    {(() => {
                      const recApplied = selectedItems.find((i) => i.book.bookType === 'recommended' && i.isSubsidyApplied);
                      if (recApplied && recApplied.itemCompanySubsidy > 0) {
                        return <span className='font-bold text-[#df0000]'>- {recApplied.itemCompanySubsidy.toLocaleString()}원</span>;
                      }
                      return <span className='text-[#94a3b8] font-normal'>0원</span>;
                    })()}
                  </div>
                )}

                {/* 개인도서 지원금 */}
                {selectedItems.some((i) => i.book.bookType === 'personal') && (
                  <div className='flex justify-between items-center'>
                    <span className='text-[#595959]'>개인도서 지원금</span>
                    {(() => {
                      const perApplied = selectedItems.find((i) => i.book.bookType === 'personal' && i.isSubsidyApplied);
                      if (perApplied && perApplied.itemCompanySubsidy > 0) {
                        return <span className='font-bold text-[#16a34a]'>- {perApplied.itemCompanySubsidy.toLocaleString()}원</span>;
                      }
                      return <span className='text-[#94a3b8] font-normal'>0원</span>;
                    })()}
                  </div>
                )}

                <div className='flex justify-between text-[#595959]'>
                  <span>배송비</span>
                  <span>{cartStats.shippingFee === 0 ? '0원' : `${cartStats.shippingFee.toLocaleString()}원`}</span>
                </div>
              </div>

              {/* 총 결제금액(직원 부담금) */}
              <div className='border-t border-[#dadada] pt-3'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold text-body-xs text-[#181718]'>
                    최종 결제금액
                  </span>
                  <div className='text-right'>
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

              {/* 결제하기 버튼 */}
              <button type='submit' className='btn btn--primary btn--lg w-full gap-2'>
                <CreditCard className='w-4 h-4' style={{ color: 'var(--white)' }} />
                {cartStats.finalPaymentAmount.toLocaleString()}원 결제하기
              </button>

              {/* 안전 링크: 장바구니로 돌아가 상품 수정 */}
              <button
                type='button'
                onClick={() => setActivePage('cart')}
                className='w-full text-center py-1 text-body-xs text-[#64748b] hover:text-[#181718] flex items-center justify-center gap-1 cursor-pointer transition-colors font-medium'
              >
                ‹ 장바구니로 돌아가 상품 수정
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 최대혜택 미적용 단일 안내 팝업 */}
      {showSubsidyConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={() => setShowSubsidyConfirm(false)}>
          <div className='relative bg-white rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-xl' onClick={(e) => e.stopPropagation()}>
            {/* 우측 상단 [X] 닫기 버튼 */}
            <button
              type='button'
              onClick={() => setShowSubsidyConfirm(false)}
              className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer'
              aria-label='닫기'
            >
              <X className='w-5 h-5' />
            </button>

            {/* 헤더 & 타이틀 */}
            <div className='flex items-center gap-3 pt-1 pr-6'>
              <div className='w-10 h-10 rounded-full bg-red-50 text-[#df0000] flex items-center justify-center shrink-0 border border-red-100'>
                <Sparkles className='w-5 h-5 text-[#df0000]' />
              </div>
              <div>
                <h3 className='font-extrabold text-base text-[#181718] tracking-tight'>최대 혜택이 적용되지 않았습니다</h3>
              </div>
            </div>

            {/* 액션 버튼 (가로 2열 배치) */}
            <div className='flex gap-2.5 pt-1'>
              <button
                type='button'
                onClick={handleProceedWithoutSubsidy}
                className='flex-1 py-3 rounded-lg border border-[#cbd2d4] text-body-xs font-semibold text-[#595959] hover:bg-[#f6f6f6] transition-colors cursor-pointer'
              >
                그대로 진행
              </button>
              <button
                type='button'
                onClick={handleApplyMaxBenefitOnly}
                className='flex-1 py-3 rounded-lg bg-[#df0000] hover:bg-[#ea2e2e] text-white text-body-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer'
              >
                <Sparkles className='w-4 h-4 text-white' />
                <span>최대혜택 적용하기</span>
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
