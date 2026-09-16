import React, { useState } from 'react';
import { ChevronLeft, Minus, Plus, Quote, Star, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const BookDetailPage: React.FC = () => {
  const {
    selectedBookForDetail: book,
    setSelectedBookForDetail,
    cart,
    addToCart,
    removeFromCart,
    setActivePage,
    calculateBookSubsidy,
  } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!book) return null;

  const cartItem = cart.find((item) => item.book.id === book.id);
  const pricing = calculateBookSubsidy(book, 'paper', quantity);
  const goBack = () => {
    setSelectedBookForDetail(null);
    setActivePage(book.bookType === 'recommended' ? 'recommended' : 'explore');
  };

  return (
    <div className="w-full bg-white text-[#181718]">
      <div className="border-b border-[#edf0f1]">
        <div className="mx-auto flex max-w-[1200px] items-center gap-2 px-4 py-3 text-xs text-[#80888a]">
          <button type="button" onClick={goBack} className="flex items-center gap-1 hover:text-[#df0000]"><ChevronLeft className="h-3.5 w-3.5" />목록으로</button>
          <span>›</span><span>{book.tags[0] || '도서'}</span>
          {book.bookType === 'recommended' && <span className="rounded bg-[#ffebeb] px-2 py-0.5 font-bold text-[#df0000]">이달의 추천도서</span>}
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr_300px]">
          <div className="flex flex-col gap-4">
            <img src={book.coverImage} alt={book.title} className="aspect-[3/4] w-full rounded object-cover bg-[#f6f6f6] shadow-xl" />
            <div className="border-t border-[#edf0f1] pt-4"><h3 className="mb-3 text-sm font-bold">이 책의 태그</h3><div className="flex flex-wrap gap-2">{book.tags.map((tag) => <span key={tag} className="rounded bg-[#f6f6f6] px-2.5 py-1.5 text-xs text-[#80888a]">{tag}</span>)}</div></div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              <span className={`rounded px-2.5 py-1 text-[11px] font-bold ${book.bookType === 'recommended' ? 'bg-[#df0000] text-white' : 'border border-[#cbd2d4] text-[#595959]'}`}>{book.bookType === 'recommended' ? '이달의 추천도서' : '개인도서'}</span>
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{book.bookType === 'recommended' ? '회사 100% 지원' : '회사 50% 지원'}</span>
              <span className="rounded border border-[#cbd2d4] px-2.5 py-1 text-[11px] font-semibold text-[#595959]">무료배송</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight">{book.title}<span className="text-[#80888a]">{book.subtitle && ` - ${book.subtitle}`}</span></h1>
            <p className="text-[15px] text-[#80888a]">{book.author} 저 <span className="mx-2 text-[#dadada]">|</span>{book.publisher}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#80888a]"><span>{book.publishDate}</span><span>|</span><span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-current text-amber-500" /><b className="text-[#181718]">{book.rating}</b> 리뷰 {book.reviewCount.toLocaleString()}</span></div>
            <div className="flex items-baseline gap-2.5 border-t border-[#edf0f1] pt-4"><span className="text-3xl font-extrabold">{book.sellingPrice.toLocaleString()}<small className="ml-0.5 text-lg">원</small></span><span className="text-base text-[#9c9c9c] line-through">{book.listPrice.toLocaleString()}원</span><span className="text-sm text-[#80888a]">적립 {book.rewardPoint.toLocaleString()}P</span></div>
            <div className="rounded-xl bg-[#f6f6f6] p-4"><p className="text-sm leading-relaxed text-[#3c4142]">{book.description}</p><div className="mt-3 flex gap-2 border-t border-[#dadada] pt-3 text-xs text-[#80888a]"><Quote className="h-3.5 w-3.5 text-[#df0000]" />영풍문고 B2B 큐레이션과 지원금 혜택을 함께 확인하세요.</div></div>
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Truck className="h-4 w-4" />지금 구매하면 <b>내일 수령 가능</b></div>
          </div>

          <aside className="h-fit rounded-2xl border border-[#cbd2d4] p-5 lg:sticky lg:top-8">
            <div className="flex items-center gap-3 border-b border-[#edf0f1] pb-4"><img src={book.coverImage} alt="" className="h-16 w-12 rounded object-cover" /><p className="line-clamp-2 text-sm font-bold">{book.title}</p></div>
            <div className="flex items-center justify-between py-4"><span className="text-sm font-semibold">수량</span><div className="flex items-center gap-1 rounded-lg border border-[#cbd2d4]"><button type="button" aria-label="수량 줄이기" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-2 disabled:text-[#dadada]"><Minus className="h-3.5 w-3.5" /></button><span className="w-8 text-center text-sm font-bold">{quantity}</span><button type="button" aria-label="수량 늘리기" disabled={quantity >= 3} onClick={() => setQuantity((value) => Math.min(3, value + 1))} className="p-2 disabled:text-[#dadada]"><Plus className="h-3.5 w-3.5" /></button></div></div>
            <div className="space-y-2 border-t border-[#edf0f1] py-4 text-sm"><div className="flex justify-between text-[#80888a]"><span>상품금액</span><span>{(book.sellingPrice * quantity).toLocaleString()}원</span></div><div className="flex justify-between text-[#80888a]"><span>회사 지원금</span><span className="font-semibold text-[#1f976b]">-{pricing.companySubsidy.toLocaleString()}원</span></div><div className="flex items-baseline justify-between border-t border-[#cbd2d4] pt-3"><span className="font-bold">결제금액</span><span className="text-xl font-extrabold text-[#df0000]">{pricing.employeePayment.toLocaleString()}원</span></div></div>
            {cartItem ? <button type="button" onClick={() => removeFromCart(cartItem.id)} className="w-full rounded-lg border-2 border-[#df0000] py-3.5 text-sm font-bold text-[#df0000]">장바구니에 담음 · 빼기</button> : <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => addToCart(book, 'paper', quantity)} className="rounded-lg border border-[#c3c2c2] py-3.5 text-sm font-bold">장바구니</button><button type="button" onClick={() => addToCart(book, 'paper', quantity, true)} className="rounded-lg bg-[#df0000] py-3.5 text-sm font-bold text-white">바로 구매</button></div>}
          </aside>
        </div>
      </main>
    </div>
  );
};
