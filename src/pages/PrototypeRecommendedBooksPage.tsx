import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { RecommendedBooksPage as PrototypeRecommendedBooksPageView } from '../prototype/components/RecommendedBooksPage';
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

export const PrototypeRecommendedBooksPage: React.FC = () => {
  const { books, cart, addToCart, removeFromCart, setActivePage, setSelectedBookForDetail, subsidyLedger } = useShop();
  const [chat, setChat] = useState<PrototypeBookComment[]>(INITIAL_CHAT);
  const prototypeCart: PrototypeCartLine[] = cart
    .filter((item) => RECOMMENDED_BOOKS.some((book) => book.id === item.book.id))
    .map((item) => ({ bookId: item.book.id, quantity: item.quantity }));
  const benefit = toBenefit(subsidyLedger.remainingSubsidy, subsidyLedger.recommendedUsed);

  const findCurrentBook = (bookId: string) => books.find((book) => book.id === bookId);
  const add = (bookId: string, directToPayment = false) => {
    const book = findCurrentBook(bookId);
    if (book) addToCart(book, 'paper', 1, directToPayment);
  };
  const remove = (bookId: string) => {
    const item = cart.find((cartItem) => cartItem.book.id === bookId);
    if (item) removeFromCart(item.id);
  };
  const openBook = (bookId: string) => {
    const book = findCurrentBook(bookId);
    if (book) {
      setSelectedBookForDetail(book);
      setActivePage('recommended');
    }
  };

  return (
    <PrototypeRecommendedBooksPageView
      benefit={benefit}
      cart={prototypeCart}
      chat={chat}
      authorLabel="임직원"
      onAddToCart={(bookId) => add(bookId)}
      onBuyNow={(bookId) => add(bookId, true)}
      onRemoveFromCart={remove}
      onChatSubmit={(text) => setChat((previous) => [{ author: '임직원', text, createdAt: new Date().toISOString().slice(0, 10) }, ...previous])}
      onOpenBook={openBook}
    />
  );
};
