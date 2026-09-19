import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import { Truck, Trash2, Bookmark, ChevronRight, ChevronDown, HelpCircle, X, Plus, Minus, Check, Info, CreditCard, ShoppingBag, Award, BookOpen, Smartphone, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';
import { MOCK_BOOKS } from '../data/mockBooks';
import { BookCoverImage } from '../components/BookCoverImage';

const MAX_QUANTITY = 10; // 1회 최대 구매 가능 수량

export const CartPage: React.FC = () => {
  const { cart, cartStats, updateQuantity, removeFromCart, removeSelectedFromCart, toggleItemSelection, toggleAllSelection, selectedAddress, setIsAddressModalOpen, setAddressModalTab, setActivePage, addToCart, showToast } = useShop();

  const allSelected = cart.length > 0 && cart.every((i) => i.selected);
  const selectedItems = cart.filter((i) => i.selected);

  // 안내사항 아코디언 — 필독 항목이라 기본 펼침, 독립적으로 접고 펼 수 있음
  const [openNotices, setOpenNotices] = useState<Record<string, boolean>>({ b2b: true, delivery: true });
  const toggleNotice = (key: string) => setOpenNotices((prev) => ({ ...prev, [key]: !prev[key] }));

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
            <h1 className='text-2xl sm:text-3xl font-bold text-[#181718] tracking-tight'>장바구니</h1>
            <p className='text-xs text-[#80888a] mt-1'>선택하신 도서 목록과 수량을 확인해 주세요. (회사 지원금은 다음 단계인 결제 페이지에서 적용할 수 있습니다.)</p>
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
                  <div className='text-sm font-bold text-[#181718] flex items-center gap-1.5'>
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
                  <div className='text-xs text-[#80888a] mt-0.5'>10,000원 이상 결제 시 기본 배송비 무료 (미만 시 2,500원)</div>
                </div>
              </div>

              {/* Progress bar and "상품 더 담기" button */}
              <div className='flex items-center gap-3 w-full sm:w-auto'>
                <div
                  className='progress-bar flex-1 sm:w-48'
                  role='progressbar'
                  aria-valuenow={cartStats.freeShippingProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label='무료배송까지 남은 금액'
                >
                  <div className={`progress-bar__fill ${cartStats.freeShippingShortfall === 0 ? 'progress-bar__fill--success' : ''}`} style={{ width: `${cartStats.freeShippingProgress}%` }}></div>
                </div>
                <button onClick={() => setActivePage('recommended')} className='btn btn--secondary btn--sm whitespace-nowrap'>
                  상품 더 담기
                </button>
              </div>
            </div>

            {/* Cart Table Controls */}
            <div className='flex items-center justify-between border-b border-[#dadada] pb-3 text-xs sm:text-sm'>
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

              <div className='text-xs text-[#80888a] flex items-center gap-1'>
                <span>서울/수도권 인근 월~토 12시까지 주문 시 당일배송</span>
                {/* <HelpCircle className='w-3.5 h-3.5 text-[#9c9c9c]' />서울/수도권 인근 월~토 12시까지 주문 시 당일배송 */}
              </div>
            </div>

            {/* Cart Table Header */}
            <div className='hidden sm:grid grid-cols-[1fr_150px_130px] text-xs font-semibold text-[#80888a] bg-[#f6f6f6] py-2.5 px-4 rounded border border-[#edf0f1]'>
              <div>도서 정보</div>
              <div className='text-center flex items-center justify-center gap-1'>
                <span>주문금액 / 수량</span>
                <HelpCircle className='w-3 h-3 text-[#9c9c9c]' />
              </div>
              <div className='text-center flex items-center justify-center gap-1'>
                <span>배송일정</span>
                <HelpCircle className='w-3 h-3 text-[#9c9c9c]' />
              </div>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className='border border-[#cbd2d4] rounded-lg p-16 text-center space-y-4'>
                <ShoppingBag className='w-12 h-12 text-[#9da6a8] mx-auto' />
                <p className='text-lg font-semibold text-[#80888a]'>장바구니에 담긴 상품이 없습니다.</p>
                <button onClick={() => setActivePage('recommended')} className='btn btn--primary'>
                  추천도서 둘러보기
                </button>
              </div>
            ) : (
              <div className='border border-[#cbd2d4] rounded-lg divide-y divide-[#dadada] bg-white'>
                {cart.map((item) => {
                  const isRecommended = item.book.bookType === 'recommended';
                  const isPersonal = item.book.bookType === 'personal';
                  const isGeneral = item.book.bookType === 'general';
                  const isEbook = item.format === 'ebook';

                  return (
                    <div key={item.id} data-selected={item.selected} className='cart-row p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-[1fr_150px_130px] gap-4 items-start sm:items-center relative'>
                      {/* Product details column */}
                      <div className='flex items-start gap-3 w-full'>
                        <button
                          type='button'
                          role='checkbox'
                          aria-checked={item.selected}
                          aria-label={`${item.book.title} 선택`}
                          onClick={() => toggleItemSelection(item.id)}
                          className='checkbox mt-1'
                        >
                          {item.selected && <Check className='w-3 h-3' style={{ color: 'var(--white)' }} />}
                        </button>
                        <BookCoverImage title={item.book.title} coverImage={item.book.coverImage} coverBackground={item.book.coverBackground} className='w-20 h-28 rounded shadow-xs border border-[#edf0f1] flex-shrink-0' titleClassName='text-[10px]' />

                        <div className='space-y-2 min-w-0 flex-1'>
                          {/* 1. 도서 메타데이터 뱃지 (추천도서 / 개인도서 / 일반도서) */}
                          <div className='flex items-center gap-1.5 flex-wrap'>
                            {isRecommended && (
                              <span className='text-xs px-2 py-0.5 rounded font-extrabold flex items-center gap-1 bg-[#ffebeb] text-[#df0000] border border-[#fca5a5]'>
                                <Award className='w-3 h-3' />
                                추천도서
                              </span>
                            )}

                            {isGeneral && (
                              <span className='text-xs px-2 py-0.5 rounded font-extrabold flex items-center gap-1 bg-[#f6f6f6] text-[#555a5c] border border-[#cbd2d4]'>
                                <Award className='w-3 h-3' />
                                일반도서 (지원금 미적용)
                              </span>
                            )}

                            {/* 종이책 / 전자책 — 토글이 아니라 해당 도서의 실제 형태를 보여주는 정보성 뱃지 (하나만 표시) */}
                            <span className={`text-[12px] px-2 py-0.5 rounded-lg border font-medium inline-flex items-center gap-1 ${isEbook ? 'bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]' : 'bg-[#f6f6f6] text-[#555a5c] border-[#cbd2d4]'}`}>
                              {isEbook ? <Smartphone className='w-3 h-3' /> : <BookOpen className='w-3 h-3' />}
                              {isEbook ? '전자책' : '종이책'}
                            </span>
                          </div>

                          {/* 제목 및 저자 */}
                          <div>
                            <h3 className='font-bold text-base text-[#181718] leading-tight'>{item.book.title}</h3>
                            <p className='text-xs text-[#80888a] mt-0.5'>
                              {item.book.author} · {item.book.publisher}
                            </p>
                          </div>

                          {/* 정가 & 할인가격 표시 */}
                          <div className='text-xs text-[#80888a] flex items-center gap-2'>
                            <span className='text-[#df0000] font-bold'>{item.book.discountRate}%</span>
                            <span className='font-bold text-sm text-[#181718]'>{item.book.sellingPrice.toLocaleString()}원</span>
                            <span className='line-through text-[#9c9c9c]'>{item.book.listPrice.toLocaleString()}원</span>
                            {/* <span className='text-[#1f976b] font-medium'>P {item.book.rewardPoint}원 적립</span> */}
                          </div>
                        </div>
                      </div>

                      {/* Quantity and price column */}
                      <div className='flex sm:flex-col items-center justify-between sm:justify-center gap-2 w-full text-center'>
                        <div>
                          <div className='font-bold text-base text-[#181718]'>{item.itemSellingPrice.toLocaleString()}원</div>
                          {/* <div className='text-[12px] text-[#80888a]'>
                            ({item.book.sellingPrice.toLocaleString()}원 × {item.quantity})
                          </div> */}
                        </div>

                        {/* Quantity Counter with Direct Editable Input — 개선 항목 6 (44×44 터치 영역 + 최대수량 툴팁) */}
                        <div className='flex items-center border border-[#cbd2d4] rounded bg-white overflow-hidden'>
                          <button type='button' onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className='stepper-btn border-0' aria-label='수량 감소'>
                            <Minus className='w-4 h-4' />
                          </button>
                          <input
                            type='number'
                            min='1'
                            max={MAX_QUANTITY}
                            step='1'
                            value={item.quantity}
                            aria-label='상품 수량'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const rawVal = e.currentTarget.value;
                              if (rawVal === '') return;

                              const val = Number(rawVal);
                              if (Number.isInteger(val) && val >= 1) {
                                updateQuantity(item.id, Math.min(val, MAX_QUANTITY));
                              }
                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              const val = Number(e.currentTarget.value);
                              // 입력창에서 벗어났을 때 비어있거나 범위를 벗어나면 유효 범위로 복구
                              if (!Number.isInteger(val) || val < 1) {
                                updateQuantity(item.id, 1);
                              } else if (val > MAX_QUANTITY) {
                                updateQuantity(item.id, MAX_QUANTITY);
                              }
                            }}
                            className='w-12 h-9 text-center text-sm font-bold focus:outline-none focus:bg-[#f0faf5] text-[#181718] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none !border-none'
                          />
                          <div className='relative group'>
                            <button type='button' onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= MAX_QUANTITY} className='stepper-btn border-0' aria-label='수량 증가'>
                              <Plus className='w-4 h-4' />
                            </button>
                            {item.quantity >= MAX_QUANTITY && (
                              <div className='tooltip hidden group-hover:block group-focus-within:block bottom-full left-1/2 -translate-x-1/2 mb-1.5'>최대 구매 가능 수량입니다</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delivery schedule column */}
                      <div className='text-xs text-center w-full sm:w-auto text-[#595959] space-y-0.5'>
                        <div className='font-semibold text-[#181718]'>{isEbook ? '결제 즉시 열람' : '내일 출고 가능'}</div>
                        <div className='text-[#80888a]'>{isEbook ? '전자책 서재 등록' : '9/16(수) 배송예정'}</div>
                      </div>

                      {/* Remove item button */}
                      <button onClick={() => removeFromCart(item.id)} className='absolute top-3 right-3 text-[#9c9c9c] hover:text-[#df0000] p-1' aria-label='상품 삭제'>
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions Bar — 개선 항목 2 버튼 위계 적용 */}
            <div className='flex flex-wrap items-center justify-between gap-3 pt-2 text-xs'>
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
                  <ul className='list-disc list-inside space-y-0.5'>
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
                  <ul className='list-disc list-inside space-y-0.5'>
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
                  <h3 className='text-base font-bold text-[#181718]'>오늘의 추천 책</h3>
                  <button onClick={() => setActivePage('explore')} className='text-xs text-[#80888a] hover:text-[#181718]'>
                    더보기 &gt;
                  </button>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3'>
                  {MOCK_BOOKS.slice(2, 7).map((recBook) => (
                    <div key={recBook.id} onClick={() => addToCart(recBook, recBook.format, 1, false)} className='p-3 bg-white rounded border border-[#cbd2d4] hover:border-[#df0000] cursor-pointer transition-all flex flex-col justify-between'>
                      <img src={recBook.coverImage} alt={recBook.title} className='w-full h-32 object-contain rounded shadow-xs mb-2' />
                      <div>
                        <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${recBook.bookType === 'recommended' ? 'bg-[#ffebeb] text-[#df0000]' : 'bg-[#e8f5ef] text-[#1f976b]'}`}>{recBook.bookType === 'recommended' ? '추천' : '개인'}</span>
                        <p className='text-xs font-bold text-[#181718] line-clamp-1 mt-1'>{recBook.title}</p>
                        <p className='text-[12px] text-[#80888a] line-clamp-1'>{recBook.author}</p>
                        <div className='text-xs font-semibold text-[#df0000] mt-1'>{recBook.sellingPrice.toLocaleString()}원</div>
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
                <span className='font-bold text-sm text-[#181718]'>배송지</span>
                {/* <button
                  type='button'
                  onClick={() => {
                    setAddressModalTab('new');
                    setIsAddressModalOpen(true);
                  }}
                  className='text-xs text-[#80888a] hover:text-[#181718]'
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
                className='w-full p-2.5 bg-[#f6f6f6] border border-[#cbd2d4] rounded flex items-center justify-between text-xs text-[#181718] cursor-pointer hover:border-[#80888a]'
              >
                <span className='truncate font-semibold'>{selectedAddress.roadAddress.slice(0, 25)}...</span>
                <ChevronDown className='w-4 h-4 text-[#80888a]' />
              </div>

              <div className='text-[12px] text-[#80888a] space-y-1'>
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
                className='text-xs text-[#df0000] hover:underline font-semibold block pt-1'
              >
                배송지 등록 / 변경
              </button> */}
            </div>

            {/* Order Summary Card */}
            <div className='border-2 border-[#181718] rounded-lg p-5 bg-white space-y-4 shadow-sm'>
              <h3 className='font-bold text-base text-[#181718] border-b border-[#dadada] pb-3 flex items-center justify-between'>
                <span>주문 합계</span>
                <span className='text-xs text-[#80888a] font-normal'>
                  선택 {selectedItems.length}종 {selectedItems.reduce((a, b) => a + b.quantity, 0)}권
                </span>
              </h3>

              <div className='space-y-2 text-xs'>
                <div className='flex justify-between text-[#595959]'>
                  <span>총 도서 정가</span>
                  <span className='font-semibold text-[#181718]'>{cartStats.totalListPrice.toLocaleString()}원</span>
                </div>
                <div className='flex justify-between text-[#df0000]'>
                  <span>도서 기본 할인</span>
                  <span>- {cartStats.totalProductDiscount.toLocaleString()}원</span>
                </div>

                <div className='flex justify-between text-[#595959]'>
                  <span>도서 실판매가 합계</span>
                  <span className='font-semibold text-[#181718]'>{cartStats.totalSellingPrice.toLocaleString()}원</span>
                </div>

                <div className='flex justify-between text-[#595959] items-center'>
                  <span className='flex items-center gap-1'>
                    배송비
                    {/* <HelpCircle className='w-3 h-3 text-[#9c9c9c]' /> */}
                  </span>
                  <span>{cartStats.shippingFee === 0 ? '무료 (1만원 이상)' : `${cartStats.shippingFee.toLocaleString()}원`}</span>
                </div>
              </div>

              {/* 최종 결제 예정 금액 */}
              <div className='border-t-2 border-[#181718] pt-3'>
                <div className='flex justify-between items-baseline'>
                  <div>
                    <span className='font-bold text-sm text-[#181718] block'>결제 예정 금액</span>
                    <span className='text-[12px] text-[#80888a]'>(지원금 미반영)</span>
                  </div>
                  <div className='text-right'>
                    <span className='text-2xl font-black text-[#df0000]'>{(cartStats.totalSellingPrice + cartStats.shippingFee).toLocaleString()}</span>
                    <span className='text-sm font-bold text-[#df0000] ml-1'>원</span>
                  </div>
                </div>
              </div>

              {/* <div className='text-[12px] text-[#595959] border-t border-[#edf0f1] pt-2 space-y-1'>
                <div className='flex justify-between'>
                  <span>기본 적립 포인트</span>
                  <span className='text-[#181718] font-semibold'>P {cartStats.totalRewardPoints.toLocaleString()}원</span>
                </div>
              </div> */}

              {/* Action Button: 주문하기 — 화면당 유일한 Primary CTA */}
              <button type='button' onClick={handleOrderClick} className='btn btn--primary btn--lg w-full gap-2'>
                <span>주문하기</span>
                <ChevronRight className='w-4 h-4' style={{ color: 'var(--white)' }} />
              </button>
            </div>

            {/* Naver Pay Button Box matching cart.png */}
            <div className='border border-[#cbd2d4] rounded-lg p-3 bg-white text-center space-y-2' style={{ display: 'none' }}>
              <div className='text-[12px] text-[#595959]'>
                <span className='font-bold text-[#03c75a]'>NAVER</span> 네이버ID로 간편구매
              </div>
              <button onClick={handleOrderClick} className='w-full py-2 rounded bg-[#03c75a] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs hover:bg-[#02b350]'>
                <span>NPay</span> 구매
              </button>
              <div className='text-[10px] text-[#80888a]'>이벤트 100% 지급! 최대 1만 포인트 · 네이버페이 주문/취소/배송 안내</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
