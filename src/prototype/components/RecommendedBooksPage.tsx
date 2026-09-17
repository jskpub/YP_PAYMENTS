import React, { useLayoutEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { CartLine } from '../types';
import { PROGRAM, PURCHASE_COUNT_MIN, RECOMMENDED_BOOKS } from '../data/mockData';
import { BookCover } from './BookCover';
import { PastMonthlyPicks } from './PastMonthlyPicks';

interface RecommendedBooksPageProps {
  cart: CartLine[];
  onAddToCart: (bookId: string) => void;
  onBuyNow: (bookId: string) => void;
  onRemoveFromCart: (bookId: string) => void;
  onOpenBook: (bookId: string) => void;
}

const SCROLL_STEP = 440;

export const RecommendedBooksPage: React.FC<RecommendedBooksPageProps> = ({
  cart,
  onAddToCart,
  onBuyNow,
  onRemoveFromCart,
  onOpenBook,
}) => {
  const [selectedId, setSelectedId] = useState(RECOMMENDED_BOOKS[0].id);
  const [scroll, setScroll] = useState({ left: 0, max: 0, ratio: 1 });
  const trackRef = useRef<HTMLDivElement>(null);

  const cartIds = new Set(cart.map((line) => line.bookId));
  const book = RECOMMENDED_BOOKS.find((item) => item.id === selectedId) ?? RECOMMENDED_BOOKS[0];
  const inCart = cartIds.has(book.id);

  const syncScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setScroll({
      left: track.scrollLeft,
      max: track.scrollWidth - track.clientWidth,
      ratio: track.clientWidth / track.scrollWidth,
    });
  };

  useLayoutEffect(syncScroll, []);

  const scrollTrack = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * SCROLL_STEP, behavior: 'smooth' });
  };

  const progressWidth = Math.min(scroll.ratio, 1) * 100;
  const progressLeft = scroll.max > 0 ? (scroll.left / scroll.max) * (100 - progressWidth) : 0;

  return (
    <div className="flex-1">
      {/* 히어로 */}
      <header className="flex flex-col items-center gap-[22px] bg-gradient-to-br from-[#8d1b12] via-yp-red to-[#c53a2b] px-6 pb-[72px] pt-16 text-center text-white">
        <p className="text-[15px] tracking-[2px] text-yp-red-soft">도서비 100% 지원</p>
        <h1 className="text-[52px] font-bold leading-none tracking-[-1.5px]">
          {PROGRAM.monthNumber}월 추천도서
        </h1>
      </header>

      <main className="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-12 px-4 pb-[90px] pt-[72px]">
        <h2 className="text-[34px] font-bold tracking-[-0.8px] text-yp-ink">{book.targetLabel}</h2>

        {/* 대표 도서 */}
        <div className="flex w-full flex-col gap-12 md:flex-row">
          <div className="relative shrink-0 self-center md:self-start">
            {book.recommender && (
              <span className="absolute -left-3.5 -top-3.5 z-10 -rotate-[8deg] rounded px-4 py-5 text-xl font-bold text-white bg-yp-red">
                {book.recommender.type} 픽
              </span>
            )}
            <button
              type="button"
              aria-label={`${book.title} 상세 보기`}
              onClick={() => onOpenBook(book.id)}
              className="cursor-pointer"
            >
              <BookCover
                book={book}
                className="h-[373px] w-[280px]"
                titleClassName="text-[28px] leading-[1.35]"
              />
            </button>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 pt-2">
            <button type="button" onClick={() => onOpenBook(book.id)} className="cursor-pointer text-left">
              <h3 className="break-keep text-[34px] font-bold leading-tight tracking-[-1px] text-yp-ink hover:underline hover:underline-offset-4">
                {book.title}
              </h3>
            </button>

            <div className="flex flex-col gap-1.5">
              <p className="text-[17px] text-yp-gray-500">
                {book.author} · {book.publisher}
              </p>
              <p className="text-[15px] text-yp-gray-400">
                {book.publishDate} · {book.categoryName}
              </p>
              <div className="flex items-center gap-1.5 text-[15px]">
                <Star className="h-4 w-4 fill-current text-amber-500" />
                <span className="font-bold text-yp-gray-500">{book.rating}</span>
                <span className="text-yp-gray-400">리뷰 {book.reviewsCount.toLocaleString()}개</span>
              </div>
            </div>

            {/* 구매자 수 — 표본이 적으면 숫자를 감춘다 */}
            <div className="flex items-center gap-[26px] border-t border-yp-gray-200 pt-[22px] text-[16px]">
              {(book.purchaseCount ?? 0) >= PURCHASE_COUNT_MIN ? (
                <span className="flex items-center gap-1.5 text-yp-gray-500">
                  <Heart className="h-4 w-4 fill-current text-yp-red" />
                  {book.purchaseCount}명 구매
                </span>
              ) : (
                <span className="text-yp-gray-400">아직 구매 데이터가 모이지 않았어요</span>
              )}
            </div>

            {book.curationReason && (
              <div className="rounded bg-yp-gray-50 px-[26px] py-6">
                <p className="break-keep text-[16px] leading-[1.85] text-yp-gray-800">
                  {book.curationReason}
                </p>
              </div>
            )}

            <div className="grid grid-cols-[1fr_1.8fr] gap-3">
              {inCart ? (
                <button
                  type="button"
                  onClick={() => onRemoveFromCart(book.id)}
                  className="flex h-16 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-2 border-yp-red bg-white text-[18px] font-bold text-yp-red transition-colors hover:bg-yp-red-soft"
                >
                  <Check className="h-5 w-5" />
                  담음 · 빼기
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onAddToCart(book.id)}
                  className="h-16 cursor-pointer rounded-lg border border-yp-gray-200 bg-white text-[18px] font-bold text-yp-ink transition-colors hover:bg-yp-gray-50"
                >
                  장바구니 담기
                </button>
              )}
              <button
                type="button"
                onClick={() => onBuyNow(book.id)}
                className="h-16 cursor-pointer rounded-lg bg-yp-red text-[18px] font-bold text-white transition-opacity hover:opacity-92"
              >
                추천도서 구매하기
              </button>
            </div>
          </div>
        </div>

        {/* 표지 캐러셀 */}
        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="이전 도서 보기"
              onClick={() => scrollTrack(-1)}
              disabled={scroll.left <= 0}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-yp-gray-200 bg-white text-yp-ink transition-opacity disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="h-[18px] w-[18px]" />
            </button>

            <div
              ref={trackRef}
              onScroll={syncScroll}
              className="flex flex-1 gap-3.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {RECOMMENDED_BOOKS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`${item.title} 선택`}
                  aria-pressed={item.id === book.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`relative shrink-0 cursor-pointer rounded transition-opacity ${
                    item.id === book.id ? 'ring-[3px] ring-yp-red' : 'opacity-55 hover:opacity-80'
                  }`}
                >
                  <BookCover book={item} className="h-32 w-24" titleClassName="text-[11px] leading-[1.3]" />
                  {cartIds.has(item.id) && (
                    <span className="absolute right-1 top-1 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-success">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="다음 도서 보기"
              onClick={() => scrollTrack(1)}
              disabled={scroll.left >= scroll.max - 1}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-yp-gray-200 bg-white text-yp-ink transition-opacity disabled:cursor-default disabled:opacity-30"
            >
              <ChevronRight className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="relative h-[3px] w-full rounded-full bg-yp-gray-200">
            <div
              className="absolute top-0 h-[3px] rounded-full bg-yp-red transition-all"
              style={{ width: `${progressWidth}%`, left: `${progressLeft}%` }}
            />
          </div>
        </div>

        <PastMonthlyPicks />
      </main>
    </div>
  );
};
