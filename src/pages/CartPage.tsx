import React from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import {
  Truck,
  Trash2,
  Bookmark,
  Printer,
  ChevronRight,
  HelpCircle,
  X,
  Plus,
  Minus,
  Check,
  ChevronDown,
  Info,
  CreditCard,
  ShoppingBag,
  Award,
  BookOpen,
  Smartphone,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { MOCK_BOOKS } from '../data/mockBooks';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartTab,
    setCartTab,
    cartStats,
    updateQuantity,
    removeFromCart,
    removeSelectedFromCart,
    toggleItemSelection,
    toggleAllSelection,
    applyCartSubsidy,
    removeCartSubsidy,
    updateItemFormat,
    subsidyLedger,
    selectedAddress,
    setIsAddressModalOpen,
    setAddressModalTab,
    setActivePage,
    setIsEstimateModalOpen,
    addToCart,
    showToast
  } = useShop();

  const allSelected = cart.length > 0 && cart.every((i) => i.selected);
  const selectedItems = cart.filter((i) => i.selected);

  const handleOrderClick = () => {
    if (selectedItems.length === 0) {
      showToast('주문하실 상품을 선택해주세요.');
      return;
    }
    // Proceed to Step 2 (Gift Selection)
    setActivePage('gift');
  };

  return (
    <div className="w-full bg-white py-8 min-h-screen text-[#3d3c3f]">
      <div className="max-w-[1280px] mx-auto px-4 space-y-6">
        
        {/* Top Header: Title & Step Indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#dadada] pb-5 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#181718] tracking-tight">장바구니</h1>
            <p className="text-xs text-[#80888a] mt-1">
              담으신 도서별로 <strong className="text-[#1f976b]">[지원금 적용]</strong> 버튼을 클릭하여 회사 지원금과 개인 부담금을 확인하실 수 있습니다.
            </p>
          </div>
          <StepIndicator currentStep="cart" />
        </div>

        {/* 2-Column Main Layout matching cart.png */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
          
          {/* LEFT COLUMN: Cart Items and Tables */}
          <div className="space-y-5">
            
            {/* Cart Type Tabs (일반배송 vs 나우드림) */}
            <div className="flex border-b border-[#dadada] text-base font-semibold">
              <button
                onClick={() => setCartTab('normal')}
                className={`py-3 px-6 transition-colors relative ${
                  cartTab === 'normal'
                    ? 'border-t-2 border-x border-[#181718] border-b-white bg-white text-[#181718] font-bold rounded-t-lg -mb-[1px]'
                    : 'text-[#80888a] bg-[#f6f6f6] hover:text-[#181718]'
                }`}
              >
                일반배송 장바구니 ({cart.length})
              </button>
              <button
                onClick={() => {
                  setCartTab('nowdream');
                  showToast('나우드림(매장픽업) 장바구니에 담긴 상품이 없습니다.');
                }}
                className={`py-3 px-6 transition-colors relative ${
                  cartTab === 'nowdream'
                    ? 'border-t-2 border-x border-[#181718] border-b-white bg-white text-[#181718] font-bold rounded-t-lg -mb-[1px]'
                    : 'text-[#80888a] bg-[#f6f6f6] hover:text-[#181718]'
                }`}
              >
                나우드림 장바구니 (0)
              </button>
            </div>

            {/* B2B Policy Status Overview Banner */}
            <div className="border border-[#b8e2cd] bg-[#f0faf5] rounded-lg p-4 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#1f976b]" />
                  <span className="font-bold text-sm text-[#181718]">B2B 기업 독서 지원금 정책 안내 및 이번 달 한도</span>
                </div>
                <button
                  onClick={() => setActivePage('mypage')}
                  className="text-xs text-[#1f976b] font-semibold underline hover:text-[#187e59]"
                >
                  내 지원금 내역 &gt;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 추천도서 규정 */}
                <div className="bg-white p-2.5 rounded border border-[#d2edd0] flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#df0000] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">추천도서</span>
                      <strong className="text-[#181718]">100% 회사 전액 지원</strong>
                    </div>
                    <p className="text-[11px] text-[#595959] mt-1">• 월 1권 제한 | <strong>종이도서만 지원</strong> (전자책 불가)</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    subsidyLedger.recommendedUsed
                      ? 'bg-[#ffebeb] text-[#df0000]'
                      : 'bg-[#e8f5ef] text-[#1f976b]'
                  }`}>
                    {subsidyLedger.recommendedUsed ? '이번달 소진' : '신청 가능'}
                  </span>
                </div>

                {/* 개인도서 규정 */}
                <div className="bg-white p-2.5 rounded border border-[#d2edd0] flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#1f976b] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">개인도서</span>
                      <strong className="text-[#181718]">50% 지원 (최대 10,000원)</strong>
                    </div>
                    <p className="text-[11px] text-[#595959] mt-1">• 월 1권 제한 | <strong>종이도서 또는 전자도서</strong> 선택 가능</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    subsidyLedger.personalUsed
                      ? 'bg-[#ffebeb] text-[#df0000]'
                      : 'bg-[#e8f5ef] text-[#1f976b]'
                  }`}>
                    {subsidyLedger.personalUsed ? '이번달 소진' : '신청 가능'}
                  </span>
                </div>
              </div>
            </div>

            {/* Free Shipping Progress Bar (Matching cart.png) */}
            <div className="border border-[#f5baba] bg-[#fffafa] rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f14646] flex items-center justify-center text-white shadow-xs flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#181718]">
                    {cartStats.freeShippingShortfall > 0 ? (
                      <>
                        <span className="text-[#df0000] font-extrabold">
                          {cartStats.freeShippingShortfall.toLocaleString()}원
                        </span>{' '}
                        더 담으면 <span className="font-extrabold text-[#181718]">무료 배송</span>
                      </>
                    ) : (
                      <span className="text-[#1f976b] font-extrabold">무료 배송 기준(30,000원)을 달성했습니다!</span>
                    )}
                  </div>
                  <div className="text-xs text-[#80888a] mt-0.5">30,000원 이상 결제 시 기본 배송비 무료 (미만 시 2,500원)</div>
                </div>
              </div>

              {/* Progress bar and "상품 더 담기" button */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:w-48 bg-[#dadada] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f14646] to-[#ffb34b] rounded-full transition-all duration-300"
                    style={{ width: `${cartStats.freeShippingProgress}%` }}
                  ></div>
                </div>
                <button
                  onClick={() => setActivePage('explore')}
                  className="px-3 py-1.5 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] text-xs font-semibold text-[#595959] whitespace-nowrap transition-colors"
                >
                  상품 더 담기
                </button>
              </div>
            </div>

            {/* Cart Table Controls */}
            <div className="flex items-center justify-between border-b border-[#dadada] pb-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#181718]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleAllSelection(e.target.checked)}
                    className="w-4 h-4 accent-[#df0000] cursor-pointer"
                  />
                  <span>전체 선택 ({selectedItems.length}/{cart.length})</span>
                </label>
                <span className="text-[#dadada]">|</span>
                <button
                  onClick={removeSelectedFromCart}
                  className="text-[#80888a] hover:text-[#df0000] transition-colors"
                >
                  선택 상품 삭제
                </button>
              </div>

              <div className="text-xs text-[#80888a] flex items-center gap-1">
                <span>서울/수도권 인근 월~토 12시까지 주문 시 당일배송</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#9c9c9c]" />
              </div>
            </div>

            {/* Cart Table Header */}
            <div className="hidden sm:grid grid-cols-[1fr_150px_130px] text-xs font-semibold text-[#80888a] bg-[#f6f6f6] py-2.5 px-4 rounded border border-[#edf0f1]">
              <div>도서 정보 / B2B 지원금 적용 및 분할</div>
              <div className="text-center flex items-center justify-center gap-1">
                <span>주문금액 / 수량</span>
                <HelpCircle className="w-3 h-3 text-[#9c9c9c]" />
              </div>
              <div className="text-center flex items-center justify-center gap-1">
                <span>배송일정</span>
                <HelpCircle className="w-3 h-3 text-[#9c9c9c]" />
              </div>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="border border-[#cbd2d4] rounded-lg p-16 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#9da6a8] mx-auto" />
                <p className="text-lg font-semibold text-[#80888a]">장바구니에 담긴 상품이 없습니다.</p>
                <button
                  onClick={() => setActivePage('explore')}
                  className="px-6 py-2.5 bg-[#df0000] text-white rounded text-sm font-bold hover:bg-[#ea2e2e] transition-colors shadow-sm"
                >
                  추천/개인도서 둘러보기
                </button>
              </div>
            ) : (
              <div className="border border-[#cbd2d4] rounded-lg divide-y divide-[#dadada] bg-white">
                {cart.map((item) => {
                  const isRecommended = item.book.bookType === 'recommended';
                  const isEbook = item.format === 'ebook';

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-[1fr_150px_130px] gap-4 items-start sm:items-center relative"
                    >
                      {/* Product details column */}
                      <div className="flex items-start gap-3 w-full">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleItemSelection(item.id)}
                          className="w-4 h-4 accent-[#df0000] mt-1 cursor-pointer flex-shrink-0"
                        />
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="w-20 h-28 object-contain rounded shadow-xs border border-[#edf0f1] flex-shrink-0"
                        />
                        
                        <div className="space-y-2 min-w-0 flex-1">
                          
                          {/* 1. 도서 메타데이터 뱃지 (추천도서/개인도서, 종이책/전자책) */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* 추천도서 vs 개인도서 뱃지 */}
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-extrabold flex items-center gap-1 ${
                                isRecommended
                                  ? 'bg-[#ffebeb] text-[#df0000] border border-[#fca5a5]'
                                  : 'bg-[#e8f5ef] text-[#1f976b] border border-[#a3d9bc]'
                              }`}
                            >
                              <Award className="w-3 h-3" />
                              {isRecommended ? 'B2B 추천도서 (100% 지원)' : 'B2B 개인도서 (50% 지원)'}
                            </span>

                            {/* 종이책 vs 전자책 뱃지 및 형태 전환 버튼 */}
                            <div className="inline-flex rounded border border-[#cbd2d4] overflow-hidden text-[11px]">
                              <button
                                type="button"
                                onClick={() => updateItemFormat(item.id, 'paper')}
                                className={`px-2 py-0.5 flex items-center gap-0.5 font-medium transition-colors ${
                                  !isEbook
                                    ? 'bg-[#181718] text-white font-bold'
                                    : 'bg-white text-[#555a5c] hover:bg-[#f6f6f6]'
                                }`}
                              >
                                <BookOpen className="w-2.5 h-2.5" />
                                종이책
                              </button>
                              <button
                                type="button"
                                onClick={() => updateItemFormat(item.id, 'ebook')}
                                className={`px-2 py-0.5 flex items-center gap-0.5 font-medium transition-colors ${
                                  isEbook
                                    ? 'bg-[#181718] text-white font-bold'
                                    : 'bg-white text-[#555a5c] hover:bg-[#f6f6f6]'
                                }`}
                              >
                                <Smartphone className="w-2.5 h-2.5" />
                                전자책(eBook)
                              </button>
                            </div>

                            <span className="text-[10px] text-[#555a5c] bg-[#edf0f1] px-1.5 py-0.5 rounded font-medium">
                              소득공제
                            </span>
                          </div>

                          {/* 제목 및 저자 */}
                          <div>
                            <h3 className="font-bold text-base text-[#181718] leading-tight">
                              {item.book.title}
                            </h3>
                            <p className="text-xs text-[#80888a] mt-0.5">
                              {item.book.author} · {item.book.publisher}
                            </p>
                          </div>

                          {/* 정가 & 할인가격 표시 */}
                          <div className="text-xs text-[#80888a] flex items-center gap-2">
                            <span className="text-[#df0000] font-bold">{item.book.discountRate}%</span>
                            <span className="font-bold text-sm text-[#181718]">
                              {item.book.sellingPrice.toLocaleString()}원
                            </span>
                            <span className="line-through text-[#9c9c9c]">
                              {item.book.listPrice.toLocaleString()}원
                            </span>
                            <span className="text-[#1f976b] font-medium">P {item.book.rewardPoint}원 적립</span>
                          </div>

                          {/* 2. 도서별 [지원금 적용] 버튼 및 계산 내역 (회사지원금 vs 개인부담금) */}
                          <div className="pt-1">
                            {!item.isSubsidyApplied ? (
                              <div className="bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg p-3 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="text-xs text-[#555a5c]">
                                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold mr-1.5">
                                      지원금 미적용 상태
                                    </span>
                                    {isRecommended ? (
                                      <span>추천도서는 <strong>100% 전액 지원</strong> 가능합니다.</span>
                                    ) : (
                                      <span>개인도서는 <strong>50% 지원(최대 1만원)</strong> 가능합니다.</span>
                                    )}
                                  </div>
                                  
                                  {/* [B2B 지원금 적용] 버튼 */}
                                  <button
                                    type="button"
                                    onClick={() => applyCartSubsidy(item.id)}
                                    className="px-3.5 py-1.5 rounded-md bg-[#1f976b] hover:bg-[#187e59] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    B2B 지원금 적용
                                  </button>
                                </div>

                                <div className="text-[11px] text-[#80888a] flex items-center justify-between border-t border-[#edf0f1] pt-1.5">
                                  <span>현재 결제예정: 전액 본인부담 ({item.itemSellingPrice.toLocaleString()}원)</span>
                                  <span className="text-[#1f976b] font-medium">버튼 클릭 시 회사 지원금이 계산됩니다</span>
                                </div>
                              </div>
                            ) : (
                              /* 지원금 적용 완료 상태: 회사지원금 & 개인부담금 분할 명시 */
                              <div className="bg-[#f0faf5] border border-[#9fd3ba] rounded-lg p-3 space-y-2 shadow-xs">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="bg-[#1f976b] text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      지원금 적용완료
                                    </span>
                                    <span className="text-xs font-semibold text-[#181718]">
                                      {item.subsidyNote}
                                    </span>
                                  </div>

                                  {/* [적용 취소] 버튼 */}
                                  <button
                                    type="button"
                                    onClick={() => removeCartSubsidy(item.id)}
                                    className="text-xs text-[#80888a] hover:text-[#df0000] underline font-medium"
                                  >
                                    적용 취소
                                  </button>
                                </div>

                                {/* 회사지원금 vs 개인부담금 그리드 */}
                                <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded border border-[#b8e2cd] text-xs">
                                  <div>
                                    <div className="text-[#80888a] text-[11px]">회사 지원금 (B2B 예산)</div>
                                    <div className="text-sm font-extrabold text-[#1f976b] mt-0.5">
                                      -{item.itemCompanySubsidy.toLocaleString()}원
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[#80888a] text-[11px]">개인 부담금 (직원 실결제)</div>
                                    <div className="text-sm font-black text-[#df0000] mt-0.5">
                                      {item.itemEmployeePayment.toLocaleString()}원
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>

                      {/* Quantity and price column */}
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 w-full text-center">
                        <div>
                          <div className="font-bold text-base text-[#181718]">
                            {item.itemSellingPrice.toLocaleString()}원
                          </div>
                          <div className="text-[11px] text-[#80888a]">
                            ({item.book.sellingPrice.toLocaleString()}원 × {item.quantity})
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#cbd2d4] rounded bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#555a5c] hover:bg-[#f6f6f6]"
                            aria-label="수량 감소"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 h-7 flex items-center justify-center text-xs font-semibold border-x border-[#cbd2d4]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#555a5c] hover:bg-[#f6f6f6]"
                            aria-label="수량 증가"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Delivery schedule column */}
                      <div className="text-xs text-center w-full sm:w-auto text-[#595959] space-y-0.5">
                        <div className="font-semibold text-[#181718]">
                          {isEbook ? '결제 즉시 열람' : '내일 출고 가능'}
                        </div>
                        <div className="text-[#80888a]">
                          {isEbook ? '전자책 서재 등록' : '9/16(수) 배송예정'}
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-3 right-3 text-[#9c9c9c] hover:text-[#df0000] p-1"
                        aria-label="삭제"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions Bar matching cart.png */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={removeSelectedFromCart}
                  className="px-3 py-1.5 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] font-medium text-[#595959]"
                >
                  선택 삭제
                </button>
                <button
                  onClick={() => showToast('선택한 도서가 내 서재에 보관되었습니다.')}
                  className="px-3 py-1.5 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] font-medium text-[#595959]"
                >
                  내 서재 담기
                </button>
                <button
                  onClick={() => showToast('나우드림(매장픽업) 장바구니로 이동되었습니다.')}
                  className="px-3 py-1.5 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] font-medium text-[#595959]"
                >
                  나우드림 장바구니로 이동
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('explore')}
                  className="px-4 py-1.5 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] font-semibold text-[#181718]"
                >
                  쇼핑 계속하기
                </button>
                <button
                  onClick={() => setIsEstimateModalOpen(true)}
                  className="px-4 py-1.5 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] font-semibold text-[#181718] flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  견적서 출력
                </button>
              </div>
            </div>

            {/* Cart Notices from screenshot */}
            <div className="border-t border-[#dadada] pt-5 space-y-4 text-xs text-[#80888a] leading-relaxed">
              <div>
                <h4 className="font-bold text-[#181718] mb-1">B2B 복합결제 및 주문 안내사항</h4>
                <ul className="list-disc list-inside space-y-0.5">
                  <li><strong>추천도서</strong>: 100% 회사 지원 (월 1권 한도, <strong>종이도서만 지원</strong>)</li>
                  <li><strong>개인도서</strong>: 50% 회사 지원 (최대 10,000원 한도, <strong>종이도서 또는 전자도서</strong>)</li>
                  <li>지원금을 초과하는 금액은 신용카드, 카카오페이, 네이버페이 등 개인 결제수단으로 복합결제됩니다.</li>
                  <li>회원 로그인 후 장바구니에 상품을 담으시면 30일간 자동 보관 됩니다.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#181718] mb-1">일반배송상품(택배수령) 안내사항</h4>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>재고 여부에 따라 품절/지연될 수 있으며, 이 경우 별도로 안내드립니다.</li>
                  <li>당일배송은 서울 및 수도권 인근지역에서 12:00까지 주문 시 가능합니다.</li>
                  <li>직장, 기관 등의 배송지는 당일배송이 어려울 수 있으며, 학교 배송지는 당일배송이 불가합니다.</li>
                </ul>
              </div>
            </div>

            {/* Recommendations / Carousel: 오늘의 책 & 최근 본 상품 */}
            <div className="pt-6 space-y-8">
              
              {/* 오늘의 책 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#181718]">오늘의 추천 책</h3>
                  <button onClick={() => setActivePage('explore')} className="text-xs text-[#80888a] hover:text-[#181718]">
                    더보기 &gt;
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {MOCK_BOOKS.slice(2, 7).map((recBook) => (
                    <div
                      key={recBook.id}
                      onClick={() => addToCart(recBook, 'paper', 1, false)}
                      className="p-3 bg-white rounded border border-[#cbd2d4] hover:border-[#df0000] cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <img
                        src={recBook.coverImage}
                        alt={recBook.title}
                        className="w-full h-32 object-contain rounded shadow-xs mb-2"
                      />
                      <div>
                        <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                          recBook.bookType === 'recommended' ? 'bg-[#ffebeb] text-[#df0000]' : 'bg-[#e8f5ef] text-[#1f976b]'
                        }`}>
                          {recBook.bookType === 'recommended' ? '추천' : '개인'}
                        </span>
                        <p className="text-xs font-bold text-[#181718] line-clamp-1 mt-1">{recBook.title}</p>
                        <p className="text-[11px] text-[#80888a] line-clamp-1">{recBook.author}</p>
                        <div className="text-xs font-semibold text-[#df0000] mt-1">
                          {recBook.sellingPrice.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary Sidebar matching cart.png */}
          <div className="space-y-5 lg:sticky lg:top-24">
            
            {/* Delivery address widget */}
            <div className="border border-[#cbd2d4] rounded-lg p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#181718]">배송지</span>
                <button
                  type="button"
                  onClick={() => {
                    setAddressModalTab('new');
                    setIsAddressModalOpen(true);
                  }}
                  className="text-xs text-[#80888a] hover:text-[#181718]"
                >
                  해외로 배송 &gt;
                </button>
              </div>

              {/* Selected destination selector */}
              <div
                onClick={() => {
                  setAddressModalTab('list');
                  setIsAddressModalOpen(true);
                }}
                className="w-full p-2.5 bg-[#f6f6f6] border border-[#cbd2d4] rounded flex items-center justify-between text-xs text-[#181718] cursor-pointer hover:border-[#80888a]"
              >
                <span className="truncate font-semibold">{selectedAddress.roadAddress.slice(0, 16)}...</span>
                <ChevronDown className="w-4 h-4 text-[#80888a]" />
              </div>

              <div className="text-[11px] text-[#80888a] space-y-1">
                <p className="text-[#181718] font-medium">• 내일 출고 가능</p>
                <p>• 상품별 배송 예상일이 다른 경우, 가장 늦은 상품에 맞춰 함께 배송됩니다.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAddressModalTab('new');
                  setIsAddressModalOpen(true);
                }}
                className="text-xs text-[#df0000] hover:underline font-semibold block pt-1"
              >
                배송지 등록 / 변경
              </button>
            </div>

            {/* Order Summary Card */}
            <div className="border-2 border-[#181718] rounded-lg p-5 bg-white space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-[#181718] border-b border-[#dadada] pb-3 flex items-center justify-between">
                <span>주문 합계</span>
                <span className="text-xs text-[#80888a] font-normal">
                  선택 {selectedItems.length}종 {selectedItems.reduce((a, b) => a + b.quantity, 0)}권
                </span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#595959]">
                  <span>총 도서 정가</span>
                  <span className="font-semibold text-[#181718]">{cartStats.totalListPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-[#df0000]">
                  <span>도서 기본 할인</span>
                  <span>- {cartStats.totalProductDiscount.toLocaleString()}원</span>
                </div>

                <div className="flex justify-between text-[#595959]">
                  <span>도서 실판매가 합계</span>
                  <span className="font-semibold text-[#181718]">{cartStats.totalSellingPrice.toLocaleString()}원</span>
                </div>

                {/* B2B Company Subsidy Reduction */}
                <div className="flex justify-between text-[#1f976b] font-bold bg-[#e8f5ef] p-2 rounded border border-[#a3d9bc]">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    B2B 회사 지원금
                  </span>
                  <span>- {cartStats.totalCompanySubsidy.toLocaleString()}원</span>
                </div>

                <div className="flex justify-between text-[#595959] items-center">
                  <span className="flex items-center gap-1">
                    배송비 <HelpCircle className="w-3 h-3 text-[#9c9c9c]" />
                  </span>
                  <span>{cartStats.shippingFee === 0 ? '무료 (3만원 이상)' : `${cartStats.shippingFee.toLocaleString()}원`}</span>
                </div>
              </div>

              {/* 최종 직원 결제금액 */}
              <div className="border-t-2 border-[#181718] pt-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-sm text-[#181718] block">직원 실결제금액</span>
                    <span className="text-[11px] text-[#80888a]">(개인부담금 + 배송비)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#df0000]">
                      {cartStats.finalPaymentAmount.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-[#df0000] ml-1">원</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#595959] border-t border-[#edf0f1] pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>기본 적립 포인트</span>
                  <span className="text-[#181718] font-semibold">P {cartStats.totalRewardPoints.toLocaleString()}원</span>
                </div>
              </div>

              {/* Action Button: 주문하기 */}
              <button
                type="button"
                onClick={handleOrderClick}
                className="w-full py-3.5 rounded bg-[#df0000] hover:bg-[#ea2e2e] text-white font-bold text-base shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>주문하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Naver Pay Button Box matching cart.png */}
            <div className="border border-[#cbd2d4] rounded-lg p-3 bg-white text-center space-y-2">
              <div className="text-[11px] text-[#595959]">
                <span className="font-bold text-[#03c75a]">NAVER</span> 네이버ID로 간편구매
              </div>
              <button
                onClick={handleOrderClick}
                className="w-full py-2 rounded bg-[#03c75a] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs hover:bg-[#02b350]"
              >
                <span>NPay</span> 구매
              </button>
              <div className="text-[10px] text-[#80888a]">
                이벤트 100% 지급! 최대 1만 포인트 · 네이버페이 주문/취소/배송 안내
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
