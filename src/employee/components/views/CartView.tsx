import React, { useState } from 'react';
import { ChevronRight, Trash2, Plus, Minus, Info, Check, ArrowRight } from 'lucide-react';
import { BookItem, ActiveTab, BenefitState } from '../../types';

interface CartViewProps {
  cartBooks: BookItem[];
  setCartBooks: React.Dispatch<React.SetStateAction<BookItem[]>>;
  benefitState: BenefitState;
  onCheckout: (selectedItems: BookItem[]) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const CartView: React.FC<CartViewProps> = ({ cartBooks, setCartBooks, benefitState, onCheckout, setActiveTab }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(cartBooks.map((b) => b.id));

  // 수량 변경 핸들러
  const handleQuantityChange = (id: string, delta: number) => {
    setCartBooks((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  // 선택 토글
  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected = cartBooks.length > 0 && cartBooks.every((b) => selectedIds.includes(b.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartBooks.map((b) => b.id));
    }
  };

  const handleDeleteItem = (id: string) => {
    setCartBooks((prev) => prev.filter((b) => b.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert('선택된 상품이 없습니다.');
    if (confirm(`선택한 ${selectedIds.length}개 상품을 장바구니에서 삭제하시겠습니까?`)) {
      setCartBooks((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
      setSelectedIds([]);
    }
  };

  // 선택된 항목들에 대한 실시간 계산
  const selectedBooks = cartBooks.filter((b) => selectedIds.includes(b.id));

  const totalOriginalPrice = selectedBooks.reduce((acc, item) => acc + item.originalPrice * (item.quantity || 1), 0);
  const totalSalePrice = selectedBooks.reduce((acc, item) => acc + item.salePrice * (item.quantity || 1), 0);
  const totalBasicDiscount = totalOriginalPrice - totalSalePrice;
  const totalPoints = selectedBooks.reduce((acc, item) => acc + (item.pointReward || 0) * (item.quantity || 1), 0);

  // 임직원 지원금 계산:
  // 1) 추천도서: 선택된 것 중 1권에 대해 100% 무료 (16,200원 등)
  const hasRecommendedInCart = selectedBooks.some((b) => b.supportType === 'recommended');
  const recommendedDiscount = hasRecommendedInCart ? selectedBooks.find((b) => b.supportType === 'recommended')?.salePrice || 0 : 0;

  // 2) 개인도서 지원금: 개인도서나 일반도서 중 50% 지원, 최대 잔여한도 5,000원까지 차감
  const personalEligibleTotal = selectedBooks.filter((b) => b.supportType !== 'recommended').reduce((acc, item) => acc + item.salePrice * (item.quantity || 1), 0);

  const personalBenefitDiscount = Math.min(Math.floor(personalEligibleTotal * 0.5), benefitState.personalBook.remainingAmount);

  const totalBenefitDiscount = recommendedDiscount + personalBenefitDiscount;
  const finalEstimatedPrice = Math.max(0, totalSalePrice - totalBenefitDiscount);

  return (
    <div className='space-y-6'>
      {/* 브레드크럼 및 스텝 인디케이터 */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3'>
        <div className='flex items-center gap-1.5 text-xs text-gray-500'>
          <span className='hover:text-gray-800 cursor-pointer' onClick={() => setActiveTab('dashboard')}>
            홈
          </span>
          <ChevronRight size={12} />
          <span className='text-[#D7001E] font-bold'>장바구니</span>
        </div>

        {/* 1 장바구니 > 2 주문/결제 > 3 주문완료 */}
        <div className='flex items-center gap-2 text-xs font-semibold'>
          <span className='flex items-center gap-1 text-[#D7001E]'>
            <span className='w-4 h-4 rounded-full bg-[#D7001E] text-white flex items-center justify-center text-[10px] font-bold'>1</span>
            <span>01 장바구니</span>
          </span>
          <ChevronRight size={12} className='text-gray-400' />
          <span className='text-gray-400'>02 주문/결제</span>
          <ChevronRight size={12} className='text-gray-400' />
          <span className='text-gray-400'>03 주문완료</span>
        </div>
      </div>

      {/* 헤더 */}
      <div>
        <h1 className='text-2xl font-black text-gray-900 tracking-tight flex items-baseline gap-2'>
          <span>장바구니</span>
          <span className='text-xs font-semibold text-gray-500'>
            담긴 상품 <strong className='text-[#D7001E]'>{cartBooks.length}</strong>개
          </span>
        </h1>
      </div>

      {/* 임직원 지원금 안내 배너 (시안 4와 100% 일치) */}
      <div className='bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-blue-900 shadow-xs'>
        <Info size={16} className='text-blue-600 shrink-0 mt-0.5' />
        <div className='leading-relaxed'>
          <p className='font-bold text-blue-950'>💡 임직원 도서 지원금 적용 가능 장바구니입니다.</p>
          <p className='text-blue-800 mt-0.5'>
            현재 담긴 도서 중 <strong className='text-blue-950'>[추천 도서 100% 무료 지원]</strong> 또는 <strong className='text-blue-950'>[개인 도서 반기 누적 한도 잔여 {benefitState.personalBook.remainingAmount.toLocaleString()}원(50%)]</strong>을 다음 주문/결제 단계에서 자유롭게 적용하여
            결제금액을 할인받으실 수 있습니다.
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 (좌측 상품 리스트 + 우측 결제 요약) */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 좌측 상품 리스트 */}
        <div className='lg:col-span-2 space-y-4'>
          {/* 전체선택 바 */}
          <div className='bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs'>
            <div className='flex items-center gap-3'>
              <label className='flex items-center gap-2 font-medium text-gray-800 cursor-pointer'>
                <input type='checkbox' checked={isAllSelected} onChange={handleToggleSelectAll} className='accent-[#D7001E] w-4 h-4 rounded cursor-pointer' />
                <span>
                  전체선택 ({selectedIds.length}/{cartBooks.length})
                </span>
              </label>
              <span className='text-gray-300'>|</span>
              <button type='button' onClick={handleDeleteSelected} className='text-gray-600 hover:text-red-600 cursor-pointer'>
                선택삭제
              </button>
              <span className='text-gray-300'>|</span>
              <button type='button' onClick={() => alert('품절/절판 도서가 없습니다.')} className='text-gray-600 hover:text-gray-900 cursor-pointer'>
                품절/절판 삭제
              </button>
            </div>
          </div>

          {/* 도서 카드들 */}
          {cartBooks.length === 0 ? (
            <div className='bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 text-sm'>
              장바구니가 비어 있습니다.{' '}
              <button type='button' onClick={() => setActiveTab('wishlist')} className='text-[#D7001E] underline font-bold ml-2 cursor-pointer'>
                위시리스트 보러가기
              </button>
            </div>
          ) : (
            <div className='space-y-3'>
              {cartBooks.map((book) => {
                const isSelected = selectedIds.includes(book.id);
                const quantity = book.quantity || 1;
                const itemTotal = book.salePrice * quantity;

                return (
                  <div key={book.id} className={`bg-white border rounded-xl p-4 transition-all hover:shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isSelected ? 'border-red-200 shadow-xs' : 'border-gray-200'}`}>
                    <div className='flex items-start gap-3 flex-1'>
                      <input type='checkbox' checked={isSelected} onChange={() => handleToggleSelect(book.id)} className='accent-[#D7001E] w-4 h-4 rounded mt-1.5 cursor-pointer' />

                      {/* 도서 표지 */}
                      <div className='w-14 h-19 rounded shrink-0 shadow-xs flex flex-col justify-between p-1.5 text-white font-bold text-center select-none' style={{ backgroundColor: book.coverColor }}>
                        <span className='text-[8px] uppercase tracking-tighter opacity-80 '>YP</span>
                        <span className='text-[9px] leading-tight whitespace-pre-line my-auto'>{book.coverLabel || book.title.replace(/[『』]/g, '')}</span>
                        <span className='text-[7px] opacity-70 font-light truncate'>{book.author}</span>
                      </div>

                      {/* 도서 정보 */}
                      <div className='space-y-1 flex-1'>
                        <div className='flex items-center gap-1.5 flex-wrap'>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${book.supportType === 'recommended' ? 'bg-emerald-100 text-emerald-800' : book.supportType === 'personal' ? 'bg-red-100 text-[#D7001E]' : 'bg-gray-100 text-gray-700'}`}>{book.category}</span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              book.supportType === 'recommended' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : book.supportType === 'personal' ? 'bg-red-50 text-[#D7001E] border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {book.supportBadge}
                          </span>
                        </div>

                        <h3 className='font-bold text-gray-900 text-sm'>{book.title}</h3>
                        <p className='text-xs text-gray-500'>
                          {book.publisher} | {book.author} 저
                        </p>

                        <div className='flex items-center gap-2 text-xs pt-1'>
                          <span className='text-gray-400 line-through'>{book.originalPrice.toLocaleString()}원</span>
                          <span className='font-bold text-gray-900'>{book.salePrice.toLocaleString()}원</span>
                          <span className='text-[#D7001E] font-bold'>({book.discountRate}% 할인)</span>
                          <span className='text-gray-300'>|</span>
                          <span className='text-blue-600 text-[11px]'>{book.pointReward}P 적립</span>
                        </div>

                        <p className='text-[11px] text-emerald-600 font-medium pt-0.5'>✓ {book.shippingInfo}</p>
                      </div>
                    </div>

                    {/* 수량 및 금액 액션 */}
                    <div className='flex flex-row sm:flex-col items-end sm:items-end justify-between sm:justify-center w-full sm:w-36 shrink-0 gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100'>
                      <span className='text-base font-black text-gray-900'>{itemTotal.toLocaleString()}원</span>

                      {/* 수량 조절 버튼 */}
                      <div className='flex items-center border border-gray-300 rounded bg-white overflow-hidden text-xs'>
                        <button type='button' onClick={() => handleQuantityChange(book.id, -1)} className='px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer'>
                          <Minus size={11} />
                        </button>
                        <span className='px-3 py-1 font-bold text-gray-800 min-w-[28px] text-center'>{quantity}</span>
                        <button type='button' onClick={() => handleQuantityChange(book.id, 1)} className='px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer'>
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className='flex items-center gap-2 w-full'>
                        <button type='button' onClick={() => onCheckout([book])} className='flex-1 py-1.5 px-2 text-xs font-bold text-white bg-[#D7001E] rounded hover:bg-red-700 transition-colors cursor-pointer text-center'>
                          주문하기
                        </button>
                        <button type='button' onClick={() => handleDeleteItem(book.id)} className='py-1.5 px-2 text-xs text-gray-500 hover:text-red-600 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer'>
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 하단 보조 액션 버튼 바 */}
          <div className='flex items-center justify-between text-xs text-gray-600 pt-2'>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => {
                  alert('선택한 상품이 위시리스트에 담겼습니다.');
                }}
                className='hover:text-gray-900 cursor-pointer underline'
              >
                선택상품 위시리스트 담기
              </button>
              <span className='text-gray-300'>|</span>
              <button type='button' onClick={handleDeleteSelected} className='hover:text-red-600 cursor-pointer'>
                선택상품 삭제
              </button>
            </div>
            <button type='button' onClick={() => setActiveTab('wishlist')} className='text-[#D7001E] font-semibold hover:underline cursor-pointer flex items-center gap-1'>
              <span>쇼핑 계속하기</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* 우측 결제 예정 금액 요약 카드 (시안 4와 100% 일치) */}
        <div className='space-y-4'>
          <div className='bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 sticky top-28'>
            <h3 className='font-bold text-gray-900 text-sm border-b border-gray-100 pb-3'>결제 예정 금액</h3>

            <div className='space-y-2.5 text-xs text-gray-600'>
              <div className='flex justify-between items-center'>
                <span>총 상품금액 ({selectedBooks.length}권)</span>
                <span className='font-bold text-gray-900'>{totalOriginalPrice.toLocaleString()}원</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>기본 도서할인</span>
                <span className='font-bold text-[#D7001E]'>-{totalBasicDiscount.toLocaleString()}원</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>배송비</span>
                <span className='font-semibold text-emerald-700'>0원 (무료)</span>
              </div>

              {/* 임직원 지원금 할인 박스 */}
              <div className='bg-red-50/60 border border-red-100 rounded-lg p-3 space-y-1.5 mt-2'>
                <div className='flex justify-between items-center text-xs font-bold text-[#D7001E]'>
                  <span className='flex items-center gap-1'>
                    <Check size={13} />
                    <span>예상 임직원 지원금 할인</span>
                  </span>
                  <span>-{totalBenefitDiscount.toLocaleString()}원</span>
                </div>
                <div className='text-[11px] text-gray-600 space-y-0.5 pl-3 border-l-2 border-red-200'>
                  <div className='flex justify-between'>
                    <span>• 추천도서 100% 전액지원:</span>
                    <span className='font-semibold text-emerald-700'>-{recommendedDiscount.toLocaleString()}원</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>• 개인도서 잔여한도 지원:</span>
                    <span className='font-semibold text-[#D7001E]'>-{personalBenefitDiscount.toLocaleString()}원</span>
                  </div>
                </div>
                <p className='text-[10px] text-gray-400 pt-1'>* 결제단계에서 지원금 적용 시 최종 차감</p>
              </div>

              {/* 최종 결제 예상금액 */}
              <div className='border-t border-gray-200 pt-3 mt-3 flex justify-between items-baseline'>
                <span className='text-xs font-bold text-gray-900'>최종 결제 예상금액</span>
                <div className='text-right'>
                  <span className='text-2xl font-black text-[#D7001E]'>{finalEstimatedPrice.toLocaleString()}</span>
                  <span className='text-xs font-bold text-gray-900 ml-1'>원</span>
                </div>
              </div>

              <div className='flex justify-between items-center text-[11px] text-gray-500 pt-1'>
                <span>예상 적립 포인트</span>
                <span className='font-semibold text-blue-600'>{totalPoints.toLocaleString()} P</span>
              </div>
            </div>

            {/* 결제 버튼들 */}
            <div className='space-y-2 pt-2'>
              <button
                type='button'
                onClick={() => {
                  if (cartBooks.length === 0) return alert('장바구니에 담긴 상품이 없습니다.');
                  onCheckout(cartBooks);
                }}
                className='w-full py-3 px-4 bg-[#D7001E] text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-xs text-sm cursor-pointer'
              >
                전체상품 주문하기 ({cartBooks.length}개)
              </button>
              <button
                type='button'
                onClick={() => {
                  if (selectedBooks.length === 0) return alert('주문할 상품을 선택해주세요.');
                  onCheckout(selectedBooks);
                }}
                className='w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-xs cursor-pointer'
              >
                선택상품 주문하기
              </button>
            </div>

            {/* 장바구니 이용 안내 */}
            <div className='bg-gray-50 rounded-lg p-3 text-[11px] text-gray-500 space-y-1 border border-gray-100'>
              <p className='font-bold text-gray-700'>장바구니 이용 안내</p>
              <p>• 장바구니에 담긴 도서는 최대 30일간 보관됩니다.</p>
              <p>• 임직원 도서 지원금은 '주문서 작성/결제' 화면에서 실 결제 시 최종 적용됩니다.</p>
              <p>• 가격, 할인율 및 사은품 혜택은 주문 시점에 따라 변경될 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
