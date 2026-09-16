import React, { useState } from 'react';
import { ChevronRight, Heart, Trash2, ShoppingCart, Check, Info, Plus } from 'lucide-react';
import { BookItem, ActiveTab, BenefitState } from '../../types';

interface WishlistViewProps {
  books: BookItem[];
  setBooks: React.Dispatch<React.SetStateAction<BookItem[]>>;
  onAddToCart: (book: BookItem) => void;
  onBuyNow: (book: BookItem) => void;
  setActiveTab: (tab: ActiveTab) => void;
  benefitState: BenefitState;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  books,
  setBooks,
  onAddToCart,
  onBuyNow,
  setActiveTab,
  benefitState,
}) => {
  const [subTab, setSubTab] = useState<'all' | 'benefit' | 'normal'>('all');
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(books.map((b) => b.id));

  const filteredBooks = books.filter((book) => {
    if (subTab === 'benefit') return book.supportType === 'recommended' || book.supportType === 'personal';
    if (subTab === 'normal') return book.supportType === 'general';
    return true;
  });

  const isAllSelected = filteredBooks.length > 0 && filteredBooks.every((b) => selectedBookIds.includes(b.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(filteredBooks.map((b) => b.id));
    }
  };

  const handleToggleSelectBook = (id: string) => {
    if (selectedBookIds.includes(id)) {
      setSelectedBookIds(selectedBookIds.filter((item) => item !== id));
    } else {
      setSelectedBookIds([...selectedBookIds, id]);
    }
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter((b) => b.id !== id));
    setSelectedBookIds(selectedBookIds.filter((item) => item !== id));
  };

  const handleDeleteSelected = () => {
    if (selectedBookIds.length === 0) return alert('선택된 도서가 없습니다.');
    if (confirm(`선택한 ${selectedBookIds.length}권의 도서를 위시리스트에서 삭제하시겠습니까?`)) {
      setBooks(books.filter((b) => !selectedBookIds.includes(b.id)));
      setSelectedBookIds([]);
    }
  };

  const handleAddSelectedToCart = () => {
    const selected = books.filter((b) => selectedBookIds.includes(b.id));
    if (selected.length === 0) return alert('선택된 도서가 없습니다.');
    selected.forEach((b) => onAddToCart(b));
    alert(`${selected.length}권의 도서를 장바구니에 담았습니다.`);
  };

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span className="hover:text-gray-800 cursor-pointer" onClick={() => setActiveTab('dashboard')}>홈</span>
        <ChevronRight size={12} />
        <span className="hover:text-gray-800 cursor-pointer" onClick={() => setActiveTab('dashboard')}>마이페이지</span>
        <ChevronRight size={12} />
        <span className="text-gray-600">내 서재 관리</span>
        <ChevronRight size={12} />
        <span className="text-[#D7001E] font-bold">위시리스트 (찜한 도서)</span>
      </div>

      {/* 헤더 타이틀 */}
      <div className="border-b border-gray-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>위시리스트 (찜한 도서)</span>
            <span className="text-xs font-normal text-gray-500">
              관심 도서로 등록하신 상품 목록입니다. 지원금 혜택을 확인하고 구매해 보세요.
            </span>
          </h1>
        </div>
        <div className="text-xs text-gray-500">
          전체 <strong className="text-[#D7001E]">{books.length}</strong>건
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex items-center justify-between border-b border-gray-200 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <button
            type="button"
            onClick={() => setSubTab('all')}
            className={`py-2 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
              subTab === 'all'
                ? 'border-[#D7001E] text-[#D7001E]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            전체 ({books.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('benefit')}
            className={`py-2 px-3 border-b-2 font-bold cursor-pointer transition-colors flex items-center gap-1 ${
              subTab === 'benefit'
                ? 'border-[#D7001E] text-[#D7001E]'
                : 'border-transparent text-gray-600 hover:text-[#D7001E]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7001E]"></span>
            <span>임직원 추천/지원도서 (3)</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('normal')}
            className={`py-2 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
              subTab === 'normal'
                ? 'border-[#D7001E] text-[#D7001E]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            일반 개인도서 (2)
          </button>
        </div>

        <button 
          type="button"
          onClick={() => alert('새 폴더 추가 기능입니다.')}
          className="text-gray-600 hover:text-[#D7001E] flex items-center gap-1 font-medium py-1 px-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
        >
          <Plus size={12} />
          <span>폴더추가</span>
        </button>
      </div>

      {/* 선택 및 일괄 조작 바 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleSelectAll}
              className="accent-[#D7001E] w-4 h-4 rounded cursor-pointer"
            />
            <span>
              전체선택 ({selectedBookIds.length}/{filteredBooks.length})
            </span>
          </label>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="text-gray-600 hover:text-red-600 cursor-pointer"
          >
            선택삭제
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => alert('품절/절판 도서가 없습니다.')}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            품절/절판도서 삭제
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleAddSelectedToCart}
            className="text-gray-700 font-semibold hover:text-[#D7001E] cursor-pointer"
          >
            선택상품 장바구니 담기
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <select className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-gray-700">
            <option>최근 찜한 순</option>
            <option>인기순</option>
            <option>낮은 가격순</option>
          </select>
          <span className="text-[11px] text-gray-400 hidden md:inline">
            찜한 상품은 최대 200개까지 보관됩니다.
          </span>
        </div>
      </div>

      {/* 도서 목록 */}
      <div className="space-y-3">
        {filteredBooks.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400 text-sm">
            등록된 위시리스트 도서가 없습니다.
          </div>
        ) : (
          filteredBooks.map((book) => {
            const isSelected = selectedBookIds.includes(book.id);

            return (
              <div
                key={book.id}
                className={`bg-white border rounded-xl p-4 transition-all hover:shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isSelected ? 'border-red-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelectBook(book.id)}
                    className="accent-[#D7001E] w-4 h-4 rounded mt-1.5 cursor-pointer"
                  />

                  {/* 도서 가상 커버 */}
                  <div
                    className="w-16 h-22 rounded shrink-0 shadow-xs flex flex-col justify-between p-1.5 text-white font-bold text-center select-none"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <span className="text-[9px] uppercase tracking-tighter opacity-80 font-mono">YP BOOKS</span>
                    <span className="text-[10px] leading-tight whitespace-pre-line my-auto">
                      {book.coverLabel || book.title.replace(/[『』]/g, '')}
                    </span>
                    <span className="text-[8px] opacity-70 font-light truncate">{book.author}</span>
                  </div>

                  {/* 도서 상세 내용 */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        book.supportType === 'recommended'
                          ? 'bg-emerald-100 text-emerald-800'
                          : book.supportType === 'personal'
                          ? 'bg-red-100 text-[#D7001E]'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {book.category}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        book.supportType === 'recommended'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : book.supportType === 'personal'
                          ? 'bg-red-50 text-[#D7001E] border-red-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {book.supportBadge}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        {book.shippingInfo}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm hover:text-[#D7001E] transition-colors cursor-pointer">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {book.publisher} | {book.author} 저
                    </p>

                    <div className="flex items-center gap-3 text-xs pt-1 flex-wrap">
                      <span className="text-gray-400 line-through">
                        정가 {book.originalPrice.toLocaleString()}원
                      </span>
                      <span className="font-bold text-gray-900">
                        {book.salePrice.toLocaleString()}원
                      </span>
                      <span className="text-[#D7001E] font-bold">
                        ({book.discountRate}%↓)
                      </span>

                      {/* 지원금 실 결제 예상 금액 계산 바 */}
                      {book.supportType === 'recommended' && (
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold text-xs border border-emerald-200">
                          실 결제 예상: 0원 (임직원 지원금 {book.salePrice.toLocaleString()}원 전액차감)
                        </span>
                      )}
                      {book.supportType === 'personal' && (
                        <span className="bg-red-50 text-[#D7001E] px-2 py-0.5 rounded font-bold text-xs border border-red-200">
                          실 결제 예상: {(book.salePrice - 5000).toLocaleString()}원 (잔여 지원금 5,000원 차감 적용 시)
                        </span>
                      )}
                      {book.supportType === 'general' && book.pointReward && (
                        <span className="text-blue-600 text-[11px]">
                          {book.pointReward}P 적립 (+5%)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                      <span className="flex items-center gap-1 text-red-500">
                        <Heart size={11} fill="currentColor" /> {book.likesCount?.toLocaleString()}
                      </span>
                      <span>·</span>
                      <span>등록일: {book.wishDate}</span>
                    </div>
                  </div>
                </div>

                {/* 우측 액션 버튼 열 */}
                <div className="w-full md:w-40 flex flex-row md:flex-col items-center gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  {book.supportType === 'recommended' && (
                    <span className="w-full text-center py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded">
                      전액 지원 가능
                    </span>
                  )}
                  {book.supportType === 'personal' && (
                    <span className="w-full text-center py-1 text-[11px] font-bold text-[#D7001E] bg-red-50 border border-red-200 rounded">
                      지원금 5,000원 적용
                    </span>
                  )}
                  {book.supportType === 'general' && (
                    <span className="w-full text-center py-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded">
                      일반 배송도서
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(book);
                      alert(`『${book.title}』 도서가 장바구니에 담겼습니다.`);
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    장바구니 담기
                  </button>

                  <button
                    type="button"
                    onClick={() => onBuyNow(book)}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-[#D7001E] rounded hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
                  >
                    바로구매
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteBook(book.id)}
                    className="text-[11px] text-gray-400 hover:text-red-500 flex items-center gap-0.5 mt-1 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 하단 전체 액션 바 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleSelectAll}
              className="accent-[#D7001E] w-4 h-4 rounded cursor-pointer"
            />
            <span>전체선택</span>
          </label>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={handleDeleteSelected} className="text-gray-600 hover:text-red-600 cursor-pointer">
            선택 삭제
          </button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={handleAddSelectedToCart} className="text-gray-700 font-semibold hover:text-[#D7001E] cursor-pointer">
            선택상품 장바구니 담기
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (selectedBookIds.length === 0) return alert('선택된 상품이 없습니다.');
            setActiveTab('cart');
          }}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#D7001E] text-white font-bold rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <ShoppingCart size={15} />
          <span>선택상품 바로구매 ({selectedBookIds.length}건)</span>
        </button>
      </div>

      {/* 페이징 네비게이션 */}
      <div className="flex justify-center items-center gap-2 pt-2">
        <button type="button" className="w-7 h-7 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">
          &lt;
        </button>
        <button type="button" className="w-7 h-7 bg-[#D7001E] text-white rounded text-xs font-bold shadow-xs">
          1
        </button>
        <button type="button" className="w-7 h-7 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">
          &gt;
        </button>
      </div>

      {/* 위시리스트 이용 및 지원금 결제 안내 */}
      <div className="bg-[#FBFBFB] border border-gray-200 rounded-xl p-4 text-xs text-gray-600 space-y-2">
        <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
          <Info size={14} className="text-[#D7001E]" />
          <span>위시리스트 이용 및 지원금 결제 안내</span>
        </h4>
        <ul className="space-y-1 list-disc pl-4 text-[11px] text-gray-500">
          <li>위시리스트(찜한 도서)는 최대 200권까지 보관 가능하며, 장기간 보관 시 출판사의 사정으로 가격 변동이나 품절/절판이 발생할 수 있습니다.</li>
          <li>
            <strong>임직원 도서 지원금:</strong> 추천도서(100% 무료 지원) 및 개인도서(권당 지원한도 5,000원)는 결제 단계에서 자동 적용되며, 잔여 지원금 한도 내에서 차감됩니다.
          </li>
          <li>위시리스트에서 바로구매 또는 장바구니로 이동하셔도 찜 상태는 계속 유지되며, 필요 없을 시 [선택 삭제]를 이용해 정리할 수 있습니다.</li>
          <li>매장 수령(나우드림) 가능 여부는 도서별 상세페이지 또는 장바구니 단계에서 선택하실 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
};
