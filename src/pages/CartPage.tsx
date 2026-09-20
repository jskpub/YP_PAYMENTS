import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import { Truck, Trash2, Bookmark, ChevronRight, ChevronDown, ChevronUp, HelpCircle, X, Plus, Minus, Check, Info, CreditCard, ShoppingBag, Award, BookOpen, Smartphone, ShieldCheck, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { MOCK_BOOKS } from '../data/mockBooks';
import { BookCoverImage } from '../components/BookCoverImage';

export const CartPage: React.FC = () => {
  const { cart, cartStats, updateQuantity, removeFromCart, removeSelectedFromCart, toggleItemSelection, toggleAllSelection, selectedAddress, setIsAddressModalOpen, setAddressModalTab, setActivePage, addToCart, showToast, subsidyLedger } = useShop();

  const allSelected = cart.length > 0 && cart.every((i) => i.selected);
  const selectedItems = cart.filter((i) => i.selected);

  // 안내사항 아코디언 — 필독 항목이라 기본 펼침, 독립적으로 접고 펼 수 있음
  const [openNotices, setOpenNotices] = useState<Record<string, boolean>>({ b2b: true, delivery: true });
  const toggleNotice = (key: string) => setOpenNotices((prev) => ({ ...prev, [key]: !prev[key] }));

  // 배송일정 "?" 팝업
  const [isDeliveryInfoOpen, setIsDeliveryInfoOpen] = useState(false);
  const [isRecommendedOpen, setIsRecommendedOpen] = useState(true);
  const [isPersonalOpen, setIsPersonalOpen] = useState(true);


  const handleOrderClick = () => {
    if (selectedItems.length === 0) {
      showToast('주문하실 상품을 선택해주세요.');
      return;
    }
    // Proceed to Step 2 (Payment Page)
    setActivePage('payment');
  };

  return (
    <div className='w-full bg-white py-8 min-h-screen text-[#3d3c3f]'>
      <div className='max-w-[1280px] mx-auto px-4 space-y-6'>
        {/* Top Header: Title & Step Indicator */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#dadada] pb-5 gap-4'>
          <div>
            <h1 className='font-bold text-[#181718] tracking-tight text-h2'>장바구니</h1>
            <p className='text-body-xs text-gray-800 mt-1'>선택하신 도서 목록과 수량을 확인해 주세요.<br /> </p>
            <p className='text-body-xs text-red-600 mt-1 font-bold'>※ 회사 지원금은 다음 단계인 결제 페이지에서 적용할 수 있습니다.</p>
          </div>
          <StepIndicator currentStep='cart' />
        </div>

        {/* 2-Column Main Layout matching cart.png */}
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start'>
          {/* LEFT COLUMN: Cart Items and Tables */}
          <div className='space-y-5'>
            {/* Free Shipping Progress Bar — 개선 항목 9 */}
            <div className='border border-[#f5baba] bg-[#fffafa] rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-[#f14646] flex items-center justify-center text-white shadow-xs flex-shrink-0'>
                  <Truck className='w-5 h-5' style={{ color: 'var(--white)' }} />
                </div>
                <div>
                  <div className='text-body-xs font-bold text-[#181718] flex items-center gap-1.5'>
                    {cartStats.freeShippingShortfall > 0 ? (
                      <>
                        <span style={{ color: 'var(--color-primary)' }} className='font-extrabold'>
                          {cartStats.freeShippingShortfall.toLocaleString()}원
                        </span>{' '}
                        더 담으면 <span className='font-extrabold text-[#181718]'>무료배송!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className='w-4 h-4' style={{ color: 'var(--color-success)' }} />
                        <span style={{ color: 'var(--color-success)' }} className='font-extrabold'>
                          무료배송 달성!
                        </span>
                      </>
                    )}
                  </div>
                  <div className='text-caption text-[#80888a] mt-0.5'>10,000원 이상 결제 시 기본 배송비 무료 (미만 시 2,500원)</div>
                </div>
              </div>

              {/* Progress bar and "상품 더 담기" button */}
              <div className='flex items-center gap-3 w-full sm:w-auto'>
                <div className='progress-bar flex-1 sm:w-48' role='progressbar' aria-valuenow={cartStats.freeShippingProgress} aria-valuemin={0} aria-valuemax={100} aria-label='무료배송까지 남은 금액'>
                  <div className={`progress-bar__fill ${cartStats.freeShippingShortfall === 0 ? 'progress-bar__fill--success' : ''}`} style={{ width: `${cartStats.freeShippingProgress}%` }}></div>
                </div>
                <button onClick={() => setActivePage('recommended')} className='btn btn--secondary btn--sm whitespace-nowrap'>
                  상품 더 담기
                </button>
              </div>
            </div>
            {/* <div className="border border-[#fca5a5] bg-[#ffebeb] rounded-lg p-3.5 flex items-center justify-between text-caption text-[#181718] shadow-xs"><div className="flex items-center gap-2.5">
              <AlertCircle className="lucide lucide-circle-alert w-4 h-4 text-[#df0000] flex-shrink-0"></AlertCircle><span className="font-semibold">'당월 한도 소진'으로 표시된 도서는 이번 달 지원금이 적용되지 않으며, 전액 본인 부담으로 결제됩니다.</span></div></div> */}

            {/* Cart Table Controls */}
            <div className='flex items-center justify-between border-b border-[#dadada] pb-3 text-caption sm:text-body-xs'>
              <div className='flex items-center gap-3'>
                <span className='flex items-center gap-2 cursor-pointer font-semibold text-[#181718]'>
                  <button type='button' role='checkbox' aria-checked={allSelected} aria-label='전체 상품 선택' onClick={() => toggleAllSelection(!allSelected)} className='checkbox'>
                    {allSelected && <Check className='w-3 h-3' style={{ color: 'var(--white)' }} />}
                  </button>
                  <span>
                    전체 선택 ({selectedItems.length}/{cart.length})
                  </span>
                </span>
                <span className='text-[#dadada]'>|</span>
                <button onClick={removeSelectedFromCart} className='text-[#80888a] hover:text-[#df0000] transition-colors'>
                  선택 상품 삭제
                </button>
              </div>

              <div className='text-caption text-[#80888a] flex items-center gap-1'>
                <span>서울/수도권 인근 월~토 12시까지 주문 시 당일배송</span>
                {/* <HelpCircle className='w-3.5 h-3.5 text-[#9c9c9c]' />서울/수도권 인근 월~토 12시까지 주문 시 당일배송 */}
              </div>
            </div>

            {/* Cart Items Section */}
            {cart.length === 0 ? (
              <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white p-16 text-center space-y-4 shadow-2xs'>
                <ShoppingBag className='w-12 h-12 text-[#9da6a8] mx-auto' />
                <p className='text-h4 font-semibold text-[#80888a]'>장바구니에 담긴 상품이 없습니다.</p>
                <button onClick={() => setActivePage('recommended')} className='btn btn--primary'>
                  추천도서 둘러보기
                </button>
              </div>
            ) : (
              <div className='space-y-6'>
                {/* 1. 추천도서 그룹 카드 */}
                {cart.some((i) => i.book.bookType === 'recommended') && (
                  <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white shadow-2xs'>
                    {/* 아코디언 그룹 헤더 */}
                    <div
                      onClick={() => setIsRecommendedOpen(!isRecommendedOpen)}
                      className='px-5 py-4 flex flex-wrap items-center justify-between gap-2 bg-[#ffffff] hover:bg-[#f6f6f6] select-none cursor-pointer border-b border-[#edf0f1]'
                    >
                      <div className='flex items-center gap-2.5'>
                        <span className='text-caption-lg px-2.5 py-1 rounded-md font-extrabold flex items-center gap-1 bg-[#ffebeb] text-[#df0000] border border-[#fca5a5]'>
                          <Award className='w-3.5 h-3.5' />
                          추천도서
                        </span>
                        <div className='font-bold text-body-xs text-[#181718]'>
                          회사 100% 지원 (월 1권){' '}
                          <span className='text-caption text-[#555a5c] leading-tight font-normal'>
                            *직원 부담금 <strong>0원</strong> (월 1권 한도)
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        {!subsidyLedger.recommendedUsed ? (
                          <span className='inline-flex items-center gap-1 text-caption-lg font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-full'>
                            ✓ 이번 달 1권 지원 가능
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 text-caption-lg font-bold text-[red] bg-[#f1f5f9] border border-[red] px-2.5 py-1 rounded-full'>
                            ○ 지원금 사용 완료
                          </span>
                        )}
                        {isRecommendedOpen ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
                      </div>
                    </div>

                    {/* 테이블 */}
                    {isRecommendedOpen && (
                      <>
                        {subsidyLedger.recommendedUsed && (
                          <div className='px-5 py-2.5 bg-[#ffebeb] border-[#fca5a5] text-[red] text-caption font-bold flex items-center gap-2'>
                            <AlertCircle className='w-4 h-4 text-[red] flex-shrink-0' />
                            <span className="font-normal">추천도서 지원 한도가 소진되어, 추천 도서는 본인 부담으로 결제됩니다.</span>
                          </div>
                        )}
                        <div className='overflow-x-auto'>
                          <table className='w-full text-caption text-left border-collapse'>
                            <thead className='bg-[#f6f6f6] text-[#80888a] font-semibold border-b border-[#edf0f1]'>
                              <tr>
                                <th className='p-3 pl-5'>도서 정보</th>
                                <th className='p-3 text-center'>주문금액 / 수량</th>
                                <th className='p-3 text-center pr-9'>
                                  <div className='inline-flex items-center justify-center gap-1'>
                                    <span>배송일정</span>
                                    <button
                                      type='button'
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDeliveryInfoOpen(true);
                                      }}
                                      aria-label='배송일정 안내 보기'
                                      className='inline-flex items-center justify-center cursor-pointer'
                                    >
                                      <HelpCircle className='w-3.5 h-3.5 text-[#9c9c9c]' />
                                    </button>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className='divide-y divide-[#edf0f1]'>
                              {cart
                                .filter((i) => i.book.bookType === 'recommended')
                                .map((item) => {
                                  const isEbook = item.format === 'ebook';

                                  return (
                                    <tr key={item.id} data-selected={item.selected} className='hover:bg-[#fafafa]'>
                                      {/* 1. 도서 정보 */}
                                      <td className='p-3.5 pl-5 align-middle'>
                                        <div className='flex items-start gap-3'>
                                          <button
                                            type='button'
                                            role='checkbox'
                                            aria-checked={item.selected}
                                            aria-label={`${item.book.title} 선택`}
                                            onClick={() => toggleItemSelection(item.id)}
                                            className='checkbox mt-1 shrink-0'
                                          >
                                            {item.selected && <Check className='w-3 h-3' style={{ color: 'var(--white)' }} />}
                                          </button>
                                          <BookCoverImage
                                            title={item.book.title}
                                            coverImage={item.book.coverImage}
                                            coverBackground={item.book.coverBackground}
                                            className='w-16 h-24 rounded shadow-xs border border-[#edf0f1] flex-shrink-0'
                                            titleClassName='text-[9px]'
                                          />
                                          <div className='space-y-1.5 min-w-0 flex-1 pr-4'>
                                            <div className='flex items-center gap-1.5 flex-wrap'>
                                              <span className={`text-caption px-2 py-0.5 rounded-lg border font-medium inline-flex items-center gap-1 ${isEbook ? 'bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]' : 'bg-[#f6f6f6] text-[#555a5c] border-[#cbd2d4]'}`}>
                                                {isEbook ? <Smartphone className='w-3 h-3' /> : <BookOpen className='w-3 h-3' />}
                                                {isEbook ? '전자책' : '종이책'}
                                              </span>
                                            </div>

                                            <div>
                                              <h3 className='font-bold text-body-xs text-[#181718] leading-tight'>{item.book.title}</h3>
                                              <p className='text-caption text-[#80888a] mt-0.5'>
                                                {item.book.author} · {item.book.publisher}
                                              </p>
                                            </div>

                                            <div className='text-caption text-[#80888a] flex items-center gap-2'>
                                              <span className='text-[#df0000] font-bold'>{item.book.discountRate}%</span>
                                              <span className='font-bold text-caption text-[#181718]'>{item.book.sellingPrice.toLocaleString()}원</span>
                                              <span className='line-through text-[#9c9c9c]'>{item.book.listPrice.toLocaleString()}원</span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      {/* 2. 주문금액 / 수량 */}
                                      <td className='p-3 text-center align-middle'>
                                        <div className='flex flex-col items-center gap-2'>
                                          <div className='font-bold text-body-xs text-[#181718]'>{item.itemSellingPrice.toLocaleString()}원</div>
                                          <div className='flex items-center border border-[#cbd2d4] rounded bg-white overflow-hidden'>
                                            <button
                                              type='button'
                                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                              disabled={item.quantity <= 1}
                                              className='stepper-btn'
                                              aria-label='수량 감소'
                                            >
                                              <Minus className='w-4 h-4' />
                                            </button>
                                            <input
                                              type='number'
                                              min='1'
                                              step='1'
                                              value={item.quantity}
                                              aria-label='상품 수량'
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const rawVal = e.currentTarget.value;
                                                if (rawVal === '') return;
                                                const val = Number(rawVal);
                                                if (Number.isInteger(val) && val >= 1) {
                                                  updateQuantity(item.id, val);
                                                }
                                              }}
                                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                const val = Number(e.currentTarget.value);
                                                if (!Number.isInteger(val) || val < 1) {
                                                  updateQuantity(item.id, 1);
                                                }
                                              }}
                                              className='w-10 h-8 text-center text-body-xs font-bold focus:outline-none focus:bg-[#f0faf5] text-[#181718] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none !border-none'
                                            />
                                            <button
                                              type='button'
                                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                              className='stepper-btn border-0'
                                              aria-label='수량 증가'
                                            >
                                              <Plus className='w-4 h-4' />
                                            </button>
                                          </div>
                                        </div>
                                      </td>

                                      {/* 3. 배송일정 및 삭제 X 버튼 */}
                                      <td className='p-3 text-center align-middle relative pr-9'>
                                        <div className='text-caption text-center text-[#595959] space-y-0.5'>
                                          <div className='font-semibold text-[#181718]'>{isEbook ? '결제 즉시 열람' : '내일 출고 가능'}</div>
                                          <div className='text-[#80888a]'>{isEbook ? '전자책 서재 등록' : '9/16(수) 배송예정'}</div>
                                        </div>
                                        <button
                                          type='button'
                                          onClick={() => removeFromCart(item.id)}
                                          className='btn-book-remove'
                                          aria-label='상품 삭제'
                                          title='장바구니에서 삭제'
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
                      </>
                    )}
                  </div>
                )}

                {/* 2. 개인도서 그룹 카드 */}
                {cart.some((i) => i.book.bookType === 'personal') && (
                  <div className='border border-[#cbd2d4] rounded-lg overflow-hidden bg-white shadow-2xs'>
                    {/* 아코디언 그룹 헤더 */}
                    <div
                      onClick={() => setIsPersonalOpen(!isPersonalOpen)}
                      className='px-5 py-4 flex flex-wrap items-center justify-between gap-2 bg-[#ffffff] hover:bg-[#f6f6f6] select-none cursor-pointer border-b border-[#edf0f1]'
                    >
                      <div className='flex items-center gap-2.5'>
                        <span className='text-caption-lg px-2.5 py-1 rounded-md font-extrabold flex items-center gap-1 bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]'>
                          <BookOpen className='w-3.5 h-3.5' />
                          개인도서
                        </span>
                        <div className='font-bold text-body-xs text-[#181718] '>
                          도서 금액의 50% 지원{' '}
                          <span className='text-caption text-[#555a5c] leading-tight font-normal'>
                            *1권 당 최대 <strong>10,000원</strong> 한도 지원 (월 1권 한도)
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        {!subsidyLedger.personalUsed ? (
                          <span className='inline-flex items-center gap-1 text-caption-lg font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-full'>
                            ✓ 이번 달 1권 지원 가능
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 text-caption-lg font-bold text-[red] bg-[#f1f5f9] border border-[red] px-2.5 py-1 rounded-full'>
                            ○ 지원금 사용 완료
                          </span>
                        )}
                        {isPersonalOpen ? <ChevronUp className='w-5 h-5 text-[#80888a]' /> : <ChevronDown className='w-5 h-5 text-[#80888a]' />}
                      </div>
                    </div>

                    {/* 테이블 */}
                    {isPersonalOpen && (
                      <>
                        {subsidyLedger.personalUsed && (
                          <div className='px-5 py-2.5 bg-[#ffebeb]  border-[#fca5a5] text-[red] text-caption font-bold flex items-center gap-2'>
                            <AlertCircle className='w-4 h-4 text-[red] flex-shrink-0' />
                            <span className="font-normal">개인도서 지원 한도가 소진되어, 개인 도서는 본인 부담으로 결제됩니다.</span>
                          </div>
                        )}
                        <div className='overflow-x-auto'>
                          <table className='w-full text-caption text-left border-collapse'>
                            <thead className='bg-[#f6f6f6] text-[#80888a] font-semibold border-b border-[#edf0f1]'>
                              <tr>
                                <th className='p-3 pl-5'>도서 정보</th>
                                <th className='p-3 text-center'>주문금액 / 수량</th>
                                <th className='p-3 text-center pr-9'>
                                  <div className='inline-flex items-center justify-center gap-1'>
                                    <span>배송일정</span>
                                    <button
                                      type='button'
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDeliveryInfoOpen(true);
                                      }}
                                      aria-label='배송일정 안내 보기'
                                      className='inline-flex items-center justify-center cursor-pointer'
                                    >
                                      <HelpCircle className='w-3.5 h-3.5 text-[#9c9c9c]' />
                                    </button>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className='divide-y divide-[#edf0f1]'>
                              {cart
                                .filter((i) => i.book.bookType === 'personal')
                                .map((item) => {
                                  const isEbook = item.format === 'ebook';

                                  return (
                                    <tr key={item.id} data-selected={item.selected} className='hover:bg-[#fafafa]'>
                                      {/* 1. 도서 정보 */}
                                      <td className='p-3.5 pl-5 align-middle'>
                                        <div className='flex items-start gap-3'>
                                          <button
                                            type='button'
                                            role='checkbox'
                                            aria-checked={item.selected}
                                            aria-label={`${item.book.title} 선택`}
                                            onClick={() => toggleItemSelection(item.id)}
                                            className='checkbox mt-1 shrink-0'
                                          >
                                            {item.selected && <Check className='w-3 h-3' style={{ color: 'var(--white)' }} />}
                                          </button>
                                          <BookCoverImage
                                            title={item.book.title}
                                            coverImage={item.book.coverImage}
                                            coverBackground={item.book.coverBackground}
                                            className='w-16 h-24 rounded shadow-xs border border-[#edf0f1] flex-shrink-0'
                                            titleClassName='text-[9px]'
                                          />
                                          <div className='space-y-1.5 min-w-0 flex-1 pr-4'>
                                            <div className='flex items-center gap-1.5 flex-wrap'>
                                              <span className={`text-caption px-2 py-0.5 rounded-lg border font-medium inline-flex items-center gap-1 ${isEbook ? 'bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]' : 'bg-[#f6f6f6] text-[#555a5c] border-[#cbd2d4]'}`}>
                                                {isEbook ? <Smartphone className='w-3 h-3' /> : <BookOpen className='w-3 h-3' />}
                                                {isEbook ? '전자책' : '종이책'}
                                              </span>
                                            </div>

                                            <div>
                                              <h3 className='font-bold text-body-xs text-[#181718] leading-tight'>{item.book.title}</h3>
                                              <p className='text-caption text-[#80888a] mt-0.5'>
                                                {item.book.author} · {item.book.publisher}
                                              </p>
                                            </div>

                                            <div className='text-caption text-[#80888a] flex items-center gap-2'>
                                              <span className='text-[#df0000] font-bold'>{item.book.discountRate}%</span>
                                              <span className='font-bold text-caption text-[#181718]'>{item.book.sellingPrice.toLocaleString()}원</span>
                                              <span className='line-through text-[#9c9c9c]'>{item.book.listPrice.toLocaleString()}원</span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      {/* 2. 주문금액 / 수량 */}
                                      <td className='p-3 text-center align-middle'>
                                        <div className='flex flex-col items-center gap-2'>
                                          <div className='font-bold text-body-xs text-[#181718]'>{item.itemSellingPrice.toLocaleString()}원</div>
                                          <div className='flex items-center border border-[#cbd2d4] rounded bg-white overflow-hidden'>
                                            <button
                                              type='button'
                                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                              disabled={item.quantity <= 1}
                                              className='stepper-btn'
                                              aria-label='수량 감소'
                                            >
                                              <Minus className='w-4 h-4' />
                                            </button>
                                            <input
                                              type='number'
                                              min='1'
                                              step='1'
                                              value={item.quantity}
                                              aria-label='상품 수량'
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const rawVal = e.currentTarget.value;
                                                if (rawVal === '') return;
                                                const val = Number(rawVal);
                                                if (Number.isInteger(val) && val >= 1) {
                                                  updateQuantity(item.id, val);
                                                }
                                              }}
                                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                const val = Number(e.currentTarget.value);
                                                if (!Number.isInteger(val) || val < 1) {
                                                  updateQuantity(item.id, 1);
                                                }
                                              }}
                                              className='w-10 h-8 text-center text-body-xs font-bold focus:outline-none focus:bg-[#f0faf5] text-[#181718] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none !border-none'
                                            />
                                            <button
                                              type='button'
                                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                              className='stepper-btn border-0'
                                              aria-label='수량 증가'
                                            >
                                              <Plus className='w-4 h-4' />
                                            </button>
                                          </div>
                                        </div>
                                      </td>

                                      {/* 3. 배송일정 및 삭제 X 버튼 */}
                                      <td className='p-3 text-center align-middle relative pr-9'>
                                        <div className='text-caption text-center text-[#595959] space-y-0.5'>
                                          <div className='font-semibold text-[#181718]'>{isEbook ? '결제 즉시 열람' : '내일 출고 가능'}</div>
                                          <div className='text-[#80888a]'>{isEbook ? '전자책 서재 등록' : '9/16(수) 배송예정'}</div>
                                        </div>
                                        <button
                                          type='button'
                                          onClick={() => removeFromCart(item.id)}
                                          className='btn-book-remove'
                                          aria-label='상품 삭제'
                                          title='장바구니에서 삭제'
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
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions Bar — 개선 항목 2 버튼 위계 적용 */}
            <div className='flex flex-wrap items-center justify-between gap-3 pt-2 text-caption'>
              <div className='flex items-center gap-2'>
                <button onClick={removeSelectedFromCart} className='btn btn--secondary btn--sm'>
                  선택 삭제
                </button>
              </div>

              <div className='flex items-center gap-2'>
                <button onClick={() => setActivePage('explore')} className='btn btn--secondary btn--sm'>
                  <ShoppingBag className='w-4 h-4' style={{ color: 'var(--color-foreground)' }} />
                  쇼핑 계속하기
                </button>
              </div>
            </div>

            {/* Cart Notices — 개선 항목 8 안내사항 아코디언 (필독 항목이라 기본 펼침) */}
            <div className='border-t border-[#dadada] pt-5 space-y-3'>
              <div className='border border-[#edf0f1] rounded-md overflow-hidden'>
                <button type='button' role='button' aria-expanded={openNotices.b2b} onClick={() => toggleNotice('b2b')} className='accordion-header'>
                  <span>B2B 복합결제 및 주문 안내사항</span>
                  <ChevronDown className='accordion-header__icon w-[18px] h-[18px]' style={{ color: 'var(--color-foreground-secondary)' }} />
                </button>
                <div className='accordion-content' data-open={openNotices.b2b} aria-hidden={!openNotices.b2b}>
                  <ul className='list-disc list-inside space-y-0.5 text-body-xs'>
                    <li>
                      <strong>추천도서</strong>: 100% 회사 지원 (월 1권 한도, <strong>종이도서만 지원</strong>)
                    </li>
                    <li>
                      <strong>개인도서</strong>: 50% 회사 지원 (최대 10,000원 한도, <strong>종이도서 또는 전자도서</strong>)
                    </li>
                    <li>지원금을 초과하는 금액은 신용카드, 카카오페이, 네이버페이 등 개인 결제수단으로 복합결제됩니다.</li>
                    <li>회원 로그인 후 장바구니에 상품을 담으시면 30일간 자동 보관 됩니다.</li>
                  </ul>
                </div>
              </div>

              <div className='border border-[#edf0f1] rounded-md overflow-hidden'>
                <button type='button' role='button' aria-expanded={openNotices.delivery} onClick={() => toggleNotice('delivery')} className='accordion-header'>
                  <span>일반배송상품(택배수령) 안내사항</span>
                  <ChevronDown className='accordion-header__icon w-[18px] h-[18px]' style={{ color: 'var(--color-foreground-secondary)' }} />
                </button>
                <div className='accordion-content' data-open={openNotices.delivery} aria-hidden={!openNotices.delivery}>
                  <ul className='list-disc list-inside space-y-0.5 text-body-xs'>
                    <li>재고 여부에 따라 품절/지연될 수 있으며, 이 경우 별도로 안내드립니다.</li>
                    <li>
                      당일배송은 서울 및 수도권 인근지역에서 12:00 까지 주문 시 가능합니다.
                      <ul className='list-item list-inside space-y-0.5 pl-5 font-bold'>
                        <li>- 네이버페이, 지마켓, 옥션, 쿠팡 등의 제휴사 주문은 연동시간에 따라 당일배송이 어려울 수 있습니다.</li>
                        <li>- 직장, 기관 등의 배송지는 당일배송이 어려울 수 있으며, 학교 배송지는 당일배송이 불가합니다.</li>
                      </ul>
                    </li>
                    <li>배송지가 동일하더라도 여러건으로 진행된 주문이 각각의 배송료가 부과됩니다.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations / Carousel: 오늘의 책 & 최근 본 상품 */}
            <div className='pt-6 space-y-8' style={{ display: 'none' }}>
              {/* 오늘의 책 */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-body-md font-bold text-[#181718]'>오늘의 추천 책</h3>
                  <button onClick={() => setActivePage('explore')} className='text-caption text-[#80888a] hover:text-[#181718]'>
                    더보기 &gt;
                  </button>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3'>
                  {MOCK_BOOKS.slice(2, 7).map((recBook) => (
                    <div key={recBook.id} onClick={() => addToCart(recBook, recBook.format, 1, false)} className='p-3 bg-white rounded border border-[#cbd2d4] hover:border-[#df0000] cursor-pointer transition-all flex flex-col justify-between'>
                      <img src={recBook.coverImage} alt={recBook.title} className='w-full h-32 object-contain rounded shadow-xs mb-2' />
                      <div>
                        <span className={`text-caption px-1 py-0.2 rounded font-bold ${recBook.bookType === 'recommended' ? 'bg-[#ffebeb] text-[#df0000]' : 'bg-[#e8f5ef] text-[#1f976b]'}`}>{recBook.bookType === 'recommended' ? '추천' : '개인'}</span>
                        <p className='text-caption font-bold text-[#181718] line-clamp-1 mt-1'>{recBook.title}</p>
                        <p className='text-caption text-[#80888a] line-clamp-1'>{recBook.author}</p>
                        <div className='text-caption font-semibold text-[#df0000] mt-1'>{recBook.sellingPrice.toLocaleString()}원</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary Sidebar matching cart.png */}
          <div className='space-y-5 lg:sticky lg:top-24'>
            {/* Delivery address widget */}
            <div className='border border-[#cbd2d4] rounded-lg p-4 bg-white space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-body-xs text-[#181718]'>배송지</span>
                {/* <button
                  type='button'
                  onClick={() => {
                    setAddressModalTab('new');
                    setIsAddressModalOpen(true);
                  }}
                  className='text-caption text-[#80888a] hover:text-[#181718]'
                >
                  해외로 배송 &gt;
                </button> */}
              </div>

              {/* Selected destination selector */}
              <div
                onClick={() => {
                  setAddressModalTab('list');
                  setIsAddressModalOpen(true);
                }}
                className='w-full p-2.5 bg-[#f6f6f6] border border-[#cbd2d4] rounded flex items-center justify-between text-caption text-[#181718] cursor-pointer hover:border-[#80888a]'
              >
                <span className='truncate font-semibold'>{selectedAddress.roadAddress.slice(0, 25)}...</span>
                <ChevronDown className='w-4 h-4 text-[#80888a]' />
              </div>

              <div className='text-caption text-[#80888a] space-y-1'>
                <p className='text-[#181718] font-medium'>• 내일 출고 가능</p>
                <p>• 상품별 배송 예상일이 다른 경우, 가장 늦은 상품에 맞춰 함께 배송됩니다.</p>
              </div>
              {/*
              <button
                type='button'
                onClick={() => {
                  setAddressModalTab('new');
                  setIsAddressModalOpen(true);
                }}
                className='text-caption text-[#df0000] hover:underline font-semibold block pt-1'
              >
                배송지 등록 / 변경
              </button> */}
            </div>

            {/* Order Summary Card */}
            <div className='border border-[#cbd2d4] rounded-lg p-5 bg-white space-y-3.5 shadow-sm'>
              <h3 className='font-bold text-body-md text-[#181718] border-b border-[#edf0f1] pb-2.5 flex items-center justify-between'>
                <span>주문 합계</span>
              </h3>

              <div className='space-y-2 text-body-xs'>
                <div className='flex justify-between text-[#595959]'>
                  <span>총 도서 정가</span>
                  <span>{cartStats.totalListPrice.toLocaleString()}원</span>
                </div>
                <div className='flex justify-between text-[#df0000]'>
                  <span>도서 기본 할인</span>
                  <span>- {cartStats.totalProductDiscount.toLocaleString()}원</span>
                </div>

                <div className='flex justify-between text-[#595959]'>
                  <span>도서 실판매가 합계</span>
                  <span>{cartStats.totalSellingPrice.toLocaleString()}원</span>
                </div>

                <div className='flex justify-between text-[#595959] items-center'>
                  <span>배송비</span>
                  <span>{cartStats.shippingFee === 0 ? '무료 (1만원 이상)' : `${cartStats.shippingFee.toLocaleString()}원`}</span>
                </div>
              </div>

              {/* 최종 결제 예정 금액 */}
              <div className='border-t border-[#dadada] pt-3'>
                <div className='flex justify-between items-baseline items-center'>
                  <span className='font-bold text-body-xs text-[#181718]'>
                    결제 예정 금액
                    <br />
                    <span className='text-caption text-[#80888a] font-normal'>(지원금 미반영)</span>
                  </span>
                  <div className='text-right items-center'>
                    <span className='text-h2 font-black text-[#df0000]'>{(cartStats.totalSellingPrice + cartStats.shippingFee).toLocaleString()}</span>
                    <span className='text-body-xs font-bold text-[#df0000] ml-1'>원</span>
                  </div>
                </div>
              </div>

              {/* 당월 지원 한도 소진 알림 카피 */}
              {subsidyLedger.recommendedUsed && subsidyLedger.personalUsed ? (
                <div className='bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-caption text-red-600 font-medium leading-relaxed flex items-start gap-1.5'>
                  <span className='shrink-0'>💡</span>
                  <span><strong>당월 도서 지원금(추천·개인)</strong>이 모두 소진되어 전액 본인 부담으로 결제됩니다.</span>
                </div>
              ) : subsidyLedger.recommendedUsed && cart.some((i) => i.book.bookType === 'recommended') ? (
                <div className='bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-caption text-gray-700 font-medium leading-relaxed flex items-start gap-1.5'>
                  <span className='shrink-0'>💡</span>
                  <span><strong>추천도서</strong>의 경우 지원금 한도가 소진되어 <br /> 작원 부담금으로 결제됩니다.</span>
                </div>
              ) : subsidyLedger.personalUsed && cart.some((i) => i.book.bookType === 'personal') ? (
                <div className='bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-caption text-gray-700 font-medium leading-relaxed flex items-start gap-1.5'>
                  <span className='shrink-0'>💡</span>
                  <span><strong>개인도서</strong>의 경우 지원금 한도가 소진되어 <br />작원 부담금으로 결제됩니다.</span>
                </div>
              ) : null}

              {/* Action Button: 주문하기 — 화면당 유일한 Primary CTA */}
              <button type='button' onClick={handleOrderClick} className='btn btn--primary btn--lg w-full gap-2'>
                <span>주문하기</span>
                <ChevronRight className='w-4 h-4' style={{ color: 'var(--white)' }} />
              </button>
            </div>

            {/* Naver Pay Button Box matching cart.png */}
            <div className='border border-[#cbd2d4] rounded-lg p-3 bg-white text-center space-y-2' style={{ display: 'none' }}>
              <div className='text-caption text-[#595959]'>
                <span className='font-bold text-[#03c75a]'>NAVER</span> 네이버ID로 간편구매
              </div>
              <button onClick={handleOrderClick} className='w-full py-2 rounded bg-[#03c75a] text-white font-bold text-caption flex items-center justify-center gap-1 shadow-xs hover:bg-[#02b350]'>
                <span>NPay</span> 구매
              </button>
              <div className='text-caption text-[#80888a]'>이벤트 100% 지급! 최대 1만 포인트 · 네이버페이 주문/취소/배송 안내</div>
            </div>
          </div>
        </div>
      </div>

      {/* 배송일정 안내 팝업 */}
      {
        isDeliveryInfoOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={() => setIsDeliveryInfoOpen(false)}>
            <div className='bg-white rounded-lg w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
              <div className='bg-[#df0000] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0'>
                <h2 className='text-h4 font-bold'>[주문/배송] 배송 안내</h2>
                <button onClick={() => setIsDeliveryInfoOpen(false)} className='text-white hover:text-white/80 p-1 rounded transition-colors' aria-label='닫기'>
                  <X className='w-5 h-5' />
                </button>
              </div>

              <div className='p-5 overflow-y-auto space-y-5 text-body-xs text-[#3d3c3f] leading-relaxed'>
                <div className='space-y-1.5'>
                  <h3 className='font-bold text-body-md text-[#181718]'>예상수령일</h3>
                  <p>① 서울·수도권의 11시~12시 대 2권 이상 주문은 당일배송 안될 수 있습니다.</p>
                  <p>② 발송예정일이 5일 이내 '출고예정'인 상품의 경우 (결제일로부터 7일 동안 미입고), 출판사/유통사 사정으로 품절·절판되어 구입이 어려울 수 있습니다. 이 경우 SMS, 메일로 알려드립니다.</p>
                  <p>③ 예상수령일은 출고 이후 택배사의 배송기간이 포함됩니다.</p>
                  <p className='pl-4 text-[#80888a] text-caption'>예) 5일 이내 출고 예정 + 1~2일 (배송기간) = 6~7일 이내 상품 수령 예정</p>
                  <p>④ 예상 수령일이 휴일인 경우 익일 배송됩니다.</p>
                  <p>⑤ 주문도서 중 일부상품 품절 시 예상수령일이 지연될 수 있습니다.</p>
                </div>

                <div className='space-y-1.5'>
                  <h3 className='font-bold text-body-md text-[#181718]'>출고예정일</h3>
                  <p>① 주문하신 상품이 발송되는 날이며 출고예정 기간에는 주말, 공휴일이 제외됩니다.</p>
                  <p>② 출고 예정 기간은 주문일부터 계산됩니다.</p>
                  <p>③ 토요일은 당일 배송만 출고됩니다.</p>
                </div>

                <div className='space-y-1.5'>
                  <h3 className='font-bold text-body-md text-[#181718]'>당일배송 배송지</h3>
                  <p>① 자택주소로 입력해주시기 바랍니다. 직장의 경우 익일 배송으로 처리될 수 있으며, 학교는 당일 배송이 불가합니다.</p>
                  <p className='text-[#df0000] font-medium'>* 당일배송 관련 문의사항은 고객센터로 문의 바랍니다.</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default CartPage;
