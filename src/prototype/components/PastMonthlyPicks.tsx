import React, { useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PastMonthPicks, PAST_MONTHLY_PICKS } from '../data/pastPicks';
import { BookCover } from './BookCover';

const MONTHS_PER_PAGE = 3;
const CARD_WIDTH = 150;
const CARD_GAP = 20;
const CARDS_PER_PAGE = 5;

const MonthRow: React.FC<{ picks: PastMonthPicks }> = ({ picks }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ left: 0, max: 0 });

  const syncScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setScroll({ left: track.scrollLeft, max: track.scrollWidth - track.clientWidth });
  };

  useLayoutEffect(syncScroll, []);

  const scrollByPage = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * CARDS_PER_PAGE * (CARD_WIDTH + CARD_GAP), behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[22px] font-bold tracking-[-0.5px] text-yp-ink">{picks.month}월 추천도서</h2>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="이전 도서 보기"
          onClick={() => scrollByPage(-1)}
          disabled={scroll.left <= 0}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-yp-gray-200 bg-white text-yp-ink transition-opacity disabled:cursor-default disabled:opacity-30"
        >
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>

        <div
          ref={trackRef}
          onScroll={syncScroll}
          className="flex flex-1 gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {picks.books.map((book) => (
            <div key={book.id} className="flex shrink-0 flex-col gap-2.5" style={{ width: CARD_WIDTH }}>
              <BookCover book={book} className="h-[200px] w-full" titleClassName="text-[13px] leading-[1.35]" />
              <p className="line-clamp-2 break-keep text-sm font-bold leading-snug text-yp-ink">{book.title}</p>
              <div className="flex flex-col gap-1">
                <p className="truncate text-xs text-yp-gray-500">{book.author}</p>
                <p className="truncate text-[11px] text-yp-gray-400">{book.targetLabel}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="다음 도서 보기"
          onClick={() => scrollByPage(1)}
          disabled={scroll.left >= scroll.max - 1}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-yp-gray-200 bg-white text-yp-ink transition-opacity disabled:cursor-default disabled:opacity-30"
        >
          <ChevronRight className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
};

export const PastMonthlyPicks: React.FC = () => {
  const [visibleMonths, setVisibleMonths] = useState(MONTHS_PER_PAGE);
  const hasMore = visibleMonths < PAST_MONTHLY_PICKS.length;

  return (
    <section className="mt-16 flex w-full flex-col gap-14 border-t border-yp-gray-200 pt-16">
      {PAST_MONTHLY_PICKS.slice(0, visibleMonths).map((picks) => (
        <MonthRow key={picks.month} picks={picks} />
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleMonths((count) => count + MONTHS_PER_PAGE)}
          className="mx-auto h-13 cursor-pointer rounded-lg border border-yp-gray-200 bg-white px-8 text-sm font-bold text-yp-ink transition-colors hover:bg-yp-gray-50"
        >
          지난 추천도서 더보기
        </button>
      )}
    </section>
  );
};
