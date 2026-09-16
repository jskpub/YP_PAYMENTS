import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BookDetailPage as PrototypeBookDetailPageView } from '../prototype/components/BookDetailPage';
import { INITIAL_CHAT, RECOMMENDED_BOOKS, findBook } from '../prototype/data/mockData';
import type { BenefitState as PrototypeBenefitState, BookComment as PrototypeBookComment, CartLine as PrototypeCartLine } from '../prototype/types';

const toBenefit = (remainingSubsidy: number, recommendedUsed: boolean): PrototypeBenefitState => ({
  cycleLabel: '2026년 9월',
  resetDescription: '매월 1일 자동 리셋',
  carryOver: false,
  personalBook: {
    limitAmount: 10000,
    usedAmount: Math.max(0, 10000 - remainingSubsidy),
    remainingAmount: Math.min(10000, remainingSubsidy),
    rate: 50,
    limitCount: 1,
    usedCount: remainingSubsidy >= 10000 ? 0 : 1,
  },
  recommendedBook: {
    limitCount: 1,
    usedCount: recommendedUsed ? 1 : 0,
    recentBookTitle: recommendedUsed ? '추천도서 사용완료' : '',
    recentAmount: 0,
  },
});

export const PrototypeBookDetailPage: React.FC = () => {
  const { books, cart, addToCart, removeFromCart, setActivePage, setSelectedBookForDetail, selectedBookForDetail, subsidyLedger } = useShop();
  const [chat] = useState<PrototypeBookComment[]>(INITIAL_CHAT);
  const bookId = selectedBookForDetail?.id || RECOMMENDED_BOOKS[0].id;
  const book = findBook(bookId) || RECOMMENDED_BOOKS[0];
  const prototypeCart: PrototypeCartLine[] = cart.filter((item) => RECOMMENDED_BOOKS.some((recommendedBook) => recommendedBook.id === item.book.id)).map((item) => ({ bookId: item.book.id, quantity: item.quantity }));
  const benefit = toBenefit(subsidyLedger.remainingSubsidy, subsidyLedger.recommendedUsed);

  const findCurrentBook = (targetId: string) => books.find((currentBook) => currentBook.id === targetId);
  const add = (targetId: string, quantity: number) => {
    const currentBook = findCurrentBook(targetId);
    if (currentBook) addToCart(currentBook, 'paper', quantity, false);
  };
  const buy = (targetId: string, quantity: number) => {
    const currentBook = findCurrentBook(targetId);
    if (currentBook) addToCart(currentBook, 'paper', quantity, true);
  };
  const remove = (targetId: string) => {
    const item = cart.find((cartItem) => cartItem.book.id === targetId);
    if (item) removeFromCart(item.id);
  };
  const openBook = (targetId: string) => {
    const currentBook = findCurrentBook(targetId);
    if (currentBook) setSelectedBookForDetail(currentBook);
  };

  return (
    <PrototypeBookDetailPageView
      book={book}
      benefit={benefit}
      cart={prototypeCart}
      onAddToCart={add}
      onBuyNow={buy}
      onRemoveFromCart={remove}
      onOpenBook={openBook}
      onBack={() => {
        setSelectedBookForDetail(null);
        setActivePage('recommended');
      }}
    />
  );
};
