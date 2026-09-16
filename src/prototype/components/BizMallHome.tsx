import React from 'react';
import {
  Bookmark,
  Calendar,
  ChevronRight,
  Gift,
  Info,
  MapPin,
  Settings,
  Star,
  Tag,
  Ticket,
  User,
} from 'lucide-react';
import {BenefitState, Book, CartLine, GnbMenu} from '../types';
import {MOCK_BOOKS} from '../data/mockData';
import {BookCover} from './BookCover';

interface BizMallHomeProps {
  benefit: BenefitState;
  activeMenu: GnbMenu;
  searchQuery: string;
  cart: CartLine[];
  onAddToCart: (bookId: string) => void;
  onRemoveFromCart: (bookId: string) => void;
  onOpenBook: (bookId: string) => void;
  onPendingNav: (label: string) => void;
}

const QUICK_MENUS = [
  {label: '출석체크', icon: Calendar},
  {label: '이벤트', icon: Gift},
  {label: '혜택안내', icon: Tag},
  {label: '매장안내', icon: MapPin},
  {label: '기프티콘', icon: Ticket},
  {label: '마이홈', icon: User},
  {label: '내서재', icon: Bookmark},
  {label: '설정하기', icon: Settings},
];

const SUPPORT_BADGE: Record<Book['supportType'], {label: string; className: string}> = {
  recommended: {
    label: '추천도서 · 100% 지원',
    className: 'bg-yp-red text-white',
  },
  personal: {
    label: '개인도서 · 50% 지원',
    className: 'bg-emerald-600 text-white',
  },
  general: {
    label: '일반도서 · 지원 미적용',
    className: 'bg-yp-gray-100 text-yp-gray-500',
  },
};

const SECTION_TITLE: Record<GnbMenu, string> = {
  ALL: '이달의 도서',
  RECOMMENDED: '추천 도서',
  BEST: '베스트',
  NEW: '신상품',
};

export const BizMallHome: React.FC<BizMallHomeProps> = ({
  benefit,
  activeMenu,
  searchQuery,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onOpenBook,
  onPendingNav,
}) => {
  const query = searchQuery.trim().toLowerCase();
  const cartIds = new Set(cart.map((line) => line.bookId));

  const books = MOCK_BOOKS.filter((book) => {
    const matchesMenu =
      activeMenu === 'ALL' ||
      (activeMenu === 'RECOMMENDED' && book.supportType === 'recommended') ||
      (activeMenu === 'BEST' && book.isBestseller) ||
      (activeMenu === 'NEW' && book.isNewRelease);

    const matchesQuery =
      query.length === 0 ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.categoryName.toLowerCase().includes(query);

    return matchesMenu && matchesQuery;
  });

  return (
    <div className="flex-1">
      {/* 임시 화면 안내 — 홈 구성은 영풍문고 측과 협의 예정 */}
      <div className="border-b border-amber-200 bg-amber-50">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-[11px] font-medium text-amber-900">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            비즈몰 홈 화면 구성은 아직 확정 전입니다. 현재는 로그인 이후 진입점을 확인하기 위한 임시
            화면입니다.
          </span>
        </div>
      </div>

      {/* 히어로 — 지원금 규칙 안내 */}
      <section className="bg-yp-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-yp-red px-3 py-1 text-[11px] font-bold">
              임직원 도서 복지 프로그램
            </span>
            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              읽고 싶은 책, 회사가 함께 삽니다
            </h1>
            <p className="text-sm leading-relaxed text-white/80">
              추천 도서는 회사가 전액 지원하고, 직접 고른 개인 도서는 절반을 지원합니다. 지원 한도는
              매월 1일 새로 시작됩니다.
            </p>
          </div>

          <div className="w-full shrink-0 space-y-2 rounded-2xl border border-white/15 bg-white/10 p-5 md:w-80">
            <div className="border-b border-white/15 pb-2 text-xs text-white/70">
              {benefit.cycleLabel} 지원 현황
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-white/80">추천 도서 (100% 지원)</span>
              <span className="text-sm font-bold">
                {benefit.recommendedBook.usedCount} / {benefit.recommendedBook.limitCount}권 사용
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-white/80">
                개인 도서 ({benefit.personalBook.rate}% 지원)
              </span>
              <span className="text-sm font-bold">
                {benefit.personalBook.remainingAmount.toLocaleString()}원 남음
              </span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-yp-red transition-all"
                style={{
                  width: `${
                    (benefit.personalBook.remainingAmount / benefit.personalBook.limitAmount) * 100
                  }%`,
                }}
              />
            </div>

            <p className="pt-1 text-[11px] text-white/60">
              {benefit.resetDescription} · 미사용분은 다음 달로 이월되지 않습니다
            </p>
          </div>
        </div>
      </section>

      {/* 퀵 메뉴 */}
      <section className="border-b border-yp-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-4 gap-3 text-center sm:grid-cols-8">
            {QUICK_MENUS.map(({label, icon: Icon}) => (
              <button
                key={label}
                type="button"
                onClick={() => onPendingNav(label)}
                className="group flex cursor-pointer flex-col items-center gap-1.5 focus:outline-none"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-yp-gray-200 bg-white transition-all group-hover:border-yp-red">
                  <Icon className="h-5 w-5 text-yp-gray-500 transition-colors group-hover:text-yp-red" />
                </span>
                <span className="whitespace-nowrap text-[11px] font-medium text-yp-gray-700 group-hover:text-yp-red">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 도서 목록 */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-xl font-black text-yp-ink">
            <span>{SECTION_TITLE[activeMenu]}</span>
            <ChevronRight className="h-5 w-5 text-yp-gray-400" />
          </h2>
          <span className="text-xs font-semibold text-yp-gray-500">총 {books.length}권</span>
        </div>

        {books.length === 0 ? (
          <p className="rounded-2xl border border-yp-gray-200 bg-white py-16 text-center text-sm text-yp-gray-500">
            조건에 맞는 도서가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => {
              const badge = SUPPORT_BADGE[book.supportType];
              return (
                <article
                  key={book.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-yp-gray-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div>
                    <div className="relative flex h-48 items-center justify-center bg-yp-gray-100 p-4">
                      <button
                        type="button"
                        aria-label={`${book.title} 상세 보기`}
                        onClick={() => onOpenBook(book.id)}
                        className="cursor-pointer"
                      >
                        <BookCover book={book} className="h-40 w-28 shadow-lg" />
                      </button>
                      <span
                        className={`absolute left-2.5 top-2.5 rounded px-2 py-0.5 text-[10px] font-bold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {book.isNewRelease && (
                        <span className="absolute right-2.5 top-2.5 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-yp-ink">
                          신간
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 p-4">
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="font-bold text-yp-gray-700">{book.rating}</span>
                        <span className="text-yp-gray-400">({book.reviewsCount})</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenBook(book.id)}
                        className="cursor-pointer text-left"
                      >
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-yp-ink hover:text-yp-red">
                          {book.title}
                        </h3>
                      </button>

                      <p className="line-clamp-1 text-xs text-yp-gray-500">
                        {book.author} · {book.publisher}
                      </p>

                      <div className="border-t border-yp-gray-100 pt-2">
                        <span className="mr-1.5 text-[11px] text-yp-gray-400 line-through">
                          {book.originalPrice.toLocaleString()}원
                        </span>
                        <span className="text-base font-extrabold text-yp-red">
                          {book.salePrice.toLocaleString()}원
                        </span>
                        <span className="ml-1 rounded bg-yp-red-soft px-1 text-xs font-bold text-yp-red">
                          {book.discountRate}%
                        </span>
                        <p className="mt-0.5 text-[11px] text-yp-gray-400">
                          적립 {book.pointReward.toLocaleString()}P
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => onOpenBook(book.id)}
                      className="cursor-pointer rounded-xl border border-yp-gray-200 px-2.5 py-2 text-xs font-semibold text-yp-gray-700 transition-colors hover:bg-yp-gray-50"
                    >
                      상세 보기
                    </button>
                    {cartIds.has(book.id) ? (
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(book.id)}
                        className="cursor-pointer rounded-xl border-2 border-yp-red px-2.5 py-2 text-xs font-bold text-yp-red transition-colors hover:bg-yp-red-soft"
                      >
                        담음 · 빼기
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart(book.id)}
                        className="cursor-pointer rounded-xl bg-yp-red px-2.5 py-2 text-xs font-bold text-white transition-colors hover:bg-yp-red-hover"
                      >
                        담기
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
