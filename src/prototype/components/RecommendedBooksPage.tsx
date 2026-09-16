import React from 'react';
import { Check, Heart, Quote, Star } from 'lucide-react';
import { BenefitState, Book, BookComment, CartLine } from '../types';
import { PROGRAM, PURCHASE_COUNT_MIN, RECOMMENDED_BOOKS, findBook } from '../data/mockData';
import { getRemainingCount } from '../cartRules';
import { BookCover } from './BookCover';
import { ChatRoom } from './ChatRoom';

interface RecommendedBooksPageProps {
  benefit: BenefitState;
  cart: CartLine[];
  chat: BookComment[];
  authorLabel: string;
  onAddToCart: (bookId: string) => void;
  onBuyNow: (bookId: string) => void;
  onRemoveFromCart: (bookId: string) => void;
  onChatSubmit: (text: string) => void;
  onOpenBook: (bookId: string) => void;
  onResetSubsidy?: () => void;
}

export const RecommendedBooksPage: React.FC<RecommendedBooksPageProps> = ({
  benefit,
  cart,
  chat,
  authorLabel,
  onAddToCart,
  onBuyNow,
  onRemoveFromCart,
  onChatSubmit,
  onOpenBook,
  onResetSubsidy,
}) => {
  const cartIds = new Set(cart.map((line) => line.bookId));

  const recommendedInCart = cart.filter(
    (line) => findBook(line.bookId)?.supportType === 'recommended',
  );
  const remainingCount = getRemainingCount(benefit, cart, 'recommended');
  const canAddMore = remainingCount > 0;
  const blockingTitle = recommendedInCart.length
    ? findBook(recommendedInCart[0].bookId)?.title
    : null;

  const totalReaders = RECOMMENDED_BOOKS.reduce(
    (sum, book) => sum + (book.purchaseCount ?? 0),
    0,
  );

  /** 책별 의견과 채팅방 의견을 합쳐 최신순으로 보여준다. */
  const allComments = [...RECOMMENDED_BOOKS.flatMap((book) => book.comments ?? []), ...chat].sort(
    (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
  );

  const renderCta = (book: Book) => {
    if (!canAddMore && !cartIds.has(book.id)) {
      return (
        <span className="flex h-13 w-full cursor-not-allowed items-center justify-center rounded-lg bg-yp-gray-100 px-3 text-center text-sm font-semibold text-yp-gray-400">
          {blockingTitle
            ? `이번 달은 『${blockingTitle}』 담는 중`
            : '이번 달 추천도서를 이미 사용했어요'}
        </span>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {cartIds.has(book.id) ? (
          <button
            type="button"
            onClick={() => onRemoveFromCart(book.id)}
            className="flex h-13 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-2 border-yp-red bg-white text-sm font-bold text-yp-red transition-colors hover:bg-yp-red-soft"
          >
            <Check className="h-4 w-4" />
            담음 · 빼기
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart(book.id)}
            className="h-13 cursor-pointer rounded-lg border border-yp-gray-300 bg-white text-sm font-bold text-yp-ink transition-colors hover:bg-yp-gray-50"
          >
            장바구니 담기
          </button>
        )}

        <button
          type="button"
          onClick={() => onBuyNow(book.id)}
          className="h-13 cursor-pointer rounded-lg bg-yp-red text-sm font-bold text-white transition-opacity hover:opacity-92"
        >
          구매하기
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1">
      {/* 히어로 */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#8d1b12] via-yp-red to-[#c53a2b] px-6 py-16 text-center text-white">
        <p className="text-sm tracking-[2px] text-[#ffd9d6]">도서비 100% 지원</p>
        <h1 className="mt-2.5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {PROGRAM.monthNumber}월 추천도서
        </h1>
      </header>

      {/* 참여 현황 띠 */}
      <div className="bg-yp-gray-800 px-6 py-5 text-center text-lg font-semibold text-white">
        {blockingTitle ? (
          <>
            이번 달 <b className="font-extrabold text-[#ff9d92]">『{blockingTitle}』</b>
            를 장바구니에 담았어요
          </>
        ) : (
          <>
            지금 우리 회사{' '}
            <b className="font-extrabold tabular-nums text-[#ff9d92]">
              {totalReaders.toLocaleString()}
            </b>
            명이 이달의 책을 읽는 중
          </>
        )}
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-yp-ink">이달의 추천도서</h2>
            <p className="mt-1.5 text-sm text-yp-gray-500">
              영풍문고 큐레이션 목록에서 우리 회사 관리자가 고른 {RECOMMENDED_BOOKS.length}권입니다.
              한 달에 한 권, 회사가 전액 지원합니다.
            </p>
          </div>
        </div>

        {/* 2열 목록형 */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {RECOMMENDED_BOOKS.map((book) => (
            <article
              key={book.id}
              className="flex flex-col rounded-2xl border border-yp-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex gap-5">
                <div className="relative shrink-0">
                  {book.recommender && (
                    <span className="absolute -left-3 -top-3 z-10 -rotate-6 rounded bg-yp-red px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md">
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
                      className="h-44 w-32 shadow-lg"
                      titleClassName="text-[13px]"
                    />
                  </button>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="w-fit rounded bg-yp-gray-100 px-2 py-0.5 text-[11px] font-bold text-yp-gray-700">
                    {book.targetLabel}
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenBook(book.id)}
                    className="cursor-pointer text-left"
                  >
                    <h3 className="break-keep text-lg font-bold leading-snug text-yp-ink hover:underline hover:underline-offset-4">
                      {book.title}
                    </h3>
                    {book.subtitle && (
                      <p className="mt-0.5 break-keep text-xs text-yp-gray-500">{book.subtitle}</p>
                    )}
                  </button>

                  <p className="text-sm text-yp-gray-500">
                    {book.author} · {book.publisher}
                  </p>

                  <p className="text-xs text-yp-gray-400">
                    {book.publishDate} · {book.categoryName}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                    <span className="font-bold text-yp-gray-700">{book.rating}</span>
                    <span className="text-yp-gray-400">리뷰 {book.reviewsCount.toLocaleString()}</span>
                  </div>

                  <div className="mt-auto pt-1">
                    <span className="mr-1.5 text-xs text-yp-gray-400 line-through">
                      {book.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-base font-extrabold text-yp-ink">
                      {book.salePrice.toLocaleString()}원
                    </span>
                    <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      직원 부담 0원
                    </span>
                  </div>
                </div>
              </div>

              {/* 선정 이유 — 추천인 코멘트 유무와 상관없이 높이를 고정해 카드별 버튼 위치를 맞춘다 */}
              <div className="mt-5 h-44 overflow-y-auto rounded-xl bg-yp-gray-50 p-4">
                <p className="break-keep text-sm leading-relaxed text-yp-gray-800">
                  {book.curationReason}
                </p>
                {book.recommenderNote && book.recommender && (
                  <div className="mt-3 flex gap-2 border-t border-yp-gray-200 pt-3">
                    <Quote className="h-3.5 w-3.5 shrink-0 text-yp-red" />
                    <p className="break-keep text-xs leading-relaxed text-yp-gray-500">
                      {book.recommenderNote}
                      <span className="mt-1 block font-semibold text-yp-gray-700">
                        — {book.recommender.name}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* 태그 */}
              <div className="mt-3 flex min-h-8 flex-wrap gap-1.5">
                {book.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="h-fit rounded bg-yp-gray-100 px-2 py-1 text-[11px] text-yp-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 구매자 수 — 표본이 적으면 숫자를 감춘다 */}
              <div className="mt-auto border-t border-yp-gray-100 pt-4 text-sm">
                {(book.purchaseCount ?? 0) >= PURCHASE_COUNT_MIN ? (
                  <span className="flex items-center gap-1.5 text-yp-gray-500">
                    <Heart className="h-4 w-4 fill-current text-[#e4453a]" />
                    이번 달 <b className="font-bold tabular-nums text-yp-ink">
                      {book.purchaseCount}명
                    </b>{' '}
                    구매
                  </span>
                ) : (
                  <span className="text-yp-gray-300">아직 구매 데이터가 모이지 않았어요</span>
                )}
              </div>

              <div className="mt-4">{renderCta(book)}</div>
            </article>
          ))}
        </div>
      </main>

      <ChatRoom comments={allComments} authorLabel={authorLabel} onSubmit={onChatSubmit} />
    </div>
  );
};
