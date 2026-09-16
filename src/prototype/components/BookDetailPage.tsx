import React, {useMemo, useState} from 'react';
import {ChevronLeft, Minus, Plus, Quote, Star, Truck} from 'lucide-react';
import {BenefitState, Book, CartLine} from '../types';
import {RECOMMENDED_BOOKS} from '../data/mockData';
import {calculatePrice, canAddToCart} from '../cartRules';
import {BookCover} from './BookCover';

interface BookDetailPageProps {
  book: Book;
  benefit: BenefitState;
  cart: CartLine[];
  onAddToCart: (bookId: string, quantity: number) => void;
  onBuyNow: (bookId: string, quantity: number) => void;
  onRemoveFromCart: (bookId: string) => void;
  onOpenBook: (bookId: string) => void;
  onBack: () => void;
}

const MAX_QUANTITY = 3;

const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <section className="border-t border-yp-gray-100 py-8 first:border-t-0">
    <h2 className="mb-4 text-lg font-bold tracking-tight text-yp-ink">{title}</h2>
    {children}
  </section>
);

export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  book,
  benefit,
  cart,
  onAddToCart,
  onBuyNow,
  onRemoveFromCart,
  onOpenBook,
  onBack,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const isInCart = cart.some((line) => line.bookId === book.id);
  const verdict = canAddToCart(book, benefit, cart);
  const price = useMemo(
    () => calculatePrice(book, quantity, benefit, cart),
    [book, quantity, benefit, cart],
  );

  const others = RECOMMENDED_BOOKS.filter((other) => other.id !== book.id).slice(0, 5);

  const supportLabel =
    book.supportType === 'recommended'
      ? '회사 100% 지원'
      : book.supportType === 'personal'
        ? `회사 ${benefit.personalBook.rate}% 지원 (월 ${benefit.personalBook.limitAmount.toLocaleString()}원 한도)`
        : '지원금 미적용';

  return (
    <div className="flex-1 bg-white">
      {/* 브레드크럼 */}
      <div className="border-b border-yp-gray-100">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-xs text-yp-gray-500">
          <button
            type="button"
            onClick={onBack}
            className="flex cursor-pointer items-center gap-1 hover:text-yp-red"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            목록으로
          </button>
          <span className="text-yp-gray-200">›</span>
          <span>{book.categoryName}</span>
          {book.supportType === 'recommended' && (
            <>
              <span className="text-yp-gray-200">›</span>
              <span className="rounded bg-yp-red-soft px-2 py-0.5 font-bold text-yp-red">
                이달의 추천도서
              </span>
            </>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr_300px]">
          {/* 표지 + 태그 */}
          <div className="flex flex-col gap-4">
            <BookCover book={book} className="aspect-3/4 w-full shadow-xl" titleClassName="text-xl" />
            {book.tags && (
              <div className="border-t border-yp-gray-100 pt-4">
                <h3 className="mb-3 text-sm font-bold text-yp-ink">이 책의 태그</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-yp-gray-100 px-2.5 py-1.5 text-[13px] text-yp-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              {book.supportType === 'recommended' && (
                <span className="rounded bg-yp-red px-2.5 py-1 text-[11px] font-bold text-white">
                  이달의 추천도서
                </span>
              )}
              {book.recommender && (
                <span className="rounded bg-yp-gray-800 px-2.5 py-1 text-[11px] font-bold text-white">
                  {book.recommender.type} 픽
                </span>
              )}
              {book.targetLabel && (
                <span className="rounded border border-yp-gray-200 px-2.5 py-1 text-[11px] font-semibold text-yp-gray-700">
                  {book.targetLabel}
                </span>
              )}
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                {supportLabel}
              </span>
              <span className="rounded border border-yp-gray-200 px-2.5 py-1 text-[11px] font-semibold text-yp-gray-700">
                무료배송
              </span>
            </div>

            <h1 className="break-keep text-3xl font-bold leading-tight tracking-tight text-yp-ink">
              {book.title}
              {book.subtitle && (
                <span className="text-yp-gray-500"> - {book.subtitle}</span>
              )}
            </h1>

            <p className="text-[15px] text-yp-gray-500">
              {book.author} 저<span className="mx-2 text-yp-gray-200">|</span>
              {book.publisher}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-yp-gray-500">
              <span>{book.publishDate}</span>
              <span className="text-yp-gray-200">|</span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-current text-amber-500" />
                <b className="font-bold text-yp-ink">{book.rating}</b>
                리뷰 {book.reviewsCount.toLocaleString()}
              </span>
              <span className="text-yp-gray-200">|</span>
              <span>{book.categoryName}</span>
            </div>

            <div className="flex items-baseline gap-2.5 border-t border-yp-gray-100 pt-4">
              {book.discountRate > 0 && (
                <span className="text-2xl font-extrabold text-yp-red">{book.discountRate}%</span>
              )}
              <span className="text-3xl font-extrabold text-yp-ink">
                {book.salePrice.toLocaleString()}
                <small className="ml-0.5 text-lg font-bold">원</small>
              </span>
              {book.discountRate > 0 && (
                <span className="text-base text-yp-gray-400 line-through">
                  {book.originalPrice.toLocaleString()}원
                </span>
              )}
              <span className="ml-1 text-sm text-yp-gray-500">
                적립 {book.pointReward.toLocaleString()}P
              </span>
            </div>

            {book.curationReason && (
              <div className="rounded-xl bg-yp-gray-50 p-4">
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
            )}

            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <Truck className="h-4 w-4" />
              지금 구매하면 <b className="font-bold">내일 수령 가능</b>
            </div>
          </div>

          {/* 구매 카드 */}
          <aside className="h-fit rounded-2xl border border-yp-gray-200 p-5 lg:sticky lg:top-44">
            <div className="flex items-center gap-3 border-b border-yp-gray-100 pb-4">
              <BookCover book={book} className="h-16 w-12" titleClassName="text-[8px]" />
              <p className="line-clamp-2 text-sm font-bold leading-snug text-yp-ink">{book.title}</p>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-sm font-semibold text-yp-gray-700">수량</span>
              <div className="flex items-center gap-1 rounded-lg border border-yp-gray-200">
                <button
                  type="button"
                  aria-label="수량 줄이기"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="cursor-pointer p-2 text-yp-gray-700 disabled:cursor-not-allowed disabled:text-yp-gray-200"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  aria-label="수량 늘리기"
                  disabled={quantity >= MAX_QUANTITY}
                  onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                  className="cursor-pointer p-2 text-yp-gray-700 disabled:cursor-not-allowed disabled:text-yp-gray-200"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-yp-gray-100 py-4 text-sm">
              <div className="flex justify-between text-yp-gray-500">
                <span>상품금액</span>
                <span className="tabular-nums text-yp-ink">
                  {price.productAmount.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-yp-gray-500">
                <span>도서 할인</span>
                <span className="tabular-nums">-{price.discountAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-yp-gray-500">
                <span>회사 지원금</span>
                <span className="font-semibold tabular-nums text-emerald-700">
                  -{price.subsidyAmount.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-yp-gray-200 pt-3">
                <span className="font-bold text-yp-ink">결제금액</span>
                <span className="text-xl font-extrabold tabular-nums text-yp-red">
                  {price.payableAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            {quantity > price.subsidizedCount && price.subsidizedCount > 0 && (
              <p className="mb-3 rounded-lg bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                지원은 이번 달 {price.subsidizedCount}권까지만 적용됩니다. 나머지{' '}
                {quantity - price.subsidizedCount}권은 직원 부담입니다.
              </p>
            )}

            {!verdict.allowed && !isInCart && (
              <p className="mb-3 rounded-lg bg-yp-gray-50 p-3 text-[11px] leading-relaxed text-yp-gray-500">
                {'reason' in verdict ? verdict.reason : ''}
              </p>
            )}

            {isInCart ? (
              <button
                type="button"
                onClick={() => onRemoveFromCart(book.id)}
                className="w-full cursor-pointer rounded-lg border-2 border-yp-red py-3.5 text-sm font-bold text-yp-red hover:bg-yp-red-soft"
              >
                장바구니에 담음 · 빼기
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onAddToCart(book.id, quantity)}
                  className="cursor-pointer rounded-lg border border-yp-gray-300 py-3.5 text-sm font-bold text-yp-ink hover:bg-yp-gray-50"
                >
                  장바구니
                </button>
                <button
                  type="button"
                  onClick={() => onBuyNow(book.id, quantity)}
                  className="cursor-pointer rounded-lg bg-yp-red py-3.5 text-sm font-bold text-white hover:bg-yp-red-hover"
                >
                  바로 구매
                </button>
              </div>
            )}
          </aside>
        </div>

        {/* 도서 정보 */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          <div>
            <Section title="상품 규격 정보">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['ISBN', book.isbn],
                    ['쪽수', book.pages],
                    ['크기', book.size],
                    ['제품구성', book.format],
                    ['정가', `${book.originalPrice.toLocaleString()}원`],
                    ['판매가', `${book.salePrice.toLocaleString()}원`],
                  ].map(([key, value]) => (
                    <tr key={key} className="border-b border-yp-gray-100 last:border-b-0">
                      <th className="w-32 bg-yp-gray-50 px-4 py-2.5 text-left font-semibold text-yp-gray-700">
                        {key}
                      </th>
                      <td className="px-4 py-2.5 text-yp-gray-500">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            <Section title="이 책이 속한 분야">
              <p className="text-sm text-yp-gray-500">국내도서 &gt; {book.categoryName}</p>
            </Section>

            <Section title="책 소개">
              <p
                className={`break-keep text-[15px] leading-loose text-yp-gray-800 ${
                  isDescriptionOpen ? '' : 'line-clamp-4'
                }`}
              >
                {book.description}
              </p>
              <button
                type="button"
                onClick={() => setIsDescriptionOpen((open) => !open)}
                className="mt-3 cursor-pointer text-sm font-semibold text-yp-gray-500 hover:text-yp-red"
              >
                {isDescriptionOpen ? '접기 ⌃' : '펼쳐보기 ⌄'}
              </button>
            </Section>

            <Section title="목차">
              <pre className="whitespace-pre-wrap rounded-xl bg-yp-gray-50 p-5 font-sans text-sm leading-loose text-yp-gray-800">
                {book.toc.join('\n')}
              </pre>
            </Section>

            {book.endorsements && book.endorsements.length > 0 && (
              <Section title="추천사">
                <ul className="space-y-4">
                  {book.endorsements.map((endorsement) => (
                    <li key={endorsement.by} className="border-l-2 border-yp-red pl-4">
                      <p className="break-keep text-[15px] leading-relaxed text-yp-gray-800">
                        “{endorsement.text}”
                      </p>
                      <p className="mt-1.5 text-xs font-semibold text-yp-gray-500">
                        — {endorsement.by}
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title="출판사 서평">
              <p className="break-keep text-[15px] leading-loose text-yp-gray-800">
                {book.publisherReview}
              </p>
            </Section>

            <Section title="저자 소개">
              <p className="break-keep text-[15px] leading-loose text-yp-gray-800">
                {book.authorBio}
              </p>
            </Section>

            <Section title="신청/취소 안내">
              <ul className="space-y-2 text-sm leading-relaxed text-yp-gray-500">
                <li>· 추천도서는 도서비 전액을 회사가 지원하며, 직원 결제금액은 0원입니다.</li>
                <li>
                  · 개인도서는 판매가의 {benefit.personalBook.rate}%를 월{' '}
                  {benefit.personalBook.limitAmount.toLocaleString()}원 한도 안에서 지원합니다.
                </li>
                <li>· 신청은 추천도서·개인도서 각각 월 1권이며, 매월 1일에 초기화됩니다.</li>
                <li>· 사용하지 않은 지원금은 다음 달로 이월되지 않습니다.</li>
                <li>· 수령 전에는 마이페이지에서 취소할 수 있고, 취소 시 한도가 복원됩니다.</li>
                <li>· 수령 후 단순 변심 반품은 수령일로부터 7일 이내에 가능합니다.</li>
              </ul>
            </Section>
          </div>

          <aside className="h-fit rounded-2xl border border-yp-gray-200 p-5">
            <h3 className="mb-4 text-sm font-bold text-yp-ink">이달의 다른 추천도서</h3>
            <ul className="space-y-3">
              {others.map((other) => (
                <li key={other.id}>
                  <button
                    type="button"
                    onClick={() => onOpenBook(other.id)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-1 text-left hover:bg-yp-gray-50"
                  >
                    <BookCover book={other} className="h-14 w-10" titleClassName="text-[7px]" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-yp-ink">
                        {other.title}
                      </span>
                      <span className="block truncate text-xs text-yp-gray-400">
                        {other.targetLabel}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
};
