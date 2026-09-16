import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { RecommendedBooksPage as PrototypeRecommendedBooksPageView } from '../prototype/components/RecommendedBooksPage';
import { INITIAL_CHAT, RECOMMENDED_BOOKS } from '../prototype/data/mockData';
import { toPrototypeBenefit } from '../data/prototypeBookAdapter';
import type { BookComment as PrototypeBookComment, CartLine as PrototypeCartLine } from '../prototype/types';

export const PrototypeRecommendedBooksPage: React.FC = () => {
  const { books, cart, addToCart, removeFromCart, setSelectedBookForDetail, subsidyLedger, resetSubsidyLedger } = useShop();
  const [chat, setChat] = useState<PrototypeBookComment[]>(INITIAL_CHAT);
  const prototypeCart: PrototypeCartLine[] = cart.filter((item) => RECOMMENDED_BOOKS.some((book) => book.id === item.book.id)).map((item) => ({ bookId: item.book.id, quantity: item.quantity }));
  const benefit = toPrototypeBenefit(subsidyLedger.remainingSubsidy, subsidyLedger.recommendedUsed);

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
    if (book) setSelectedBookForDetail(book);
  };

  return (
    <PrototypeRecommendedBooksPageView
      benefit={benefit}
      cart={prototypeCart}
      chat={chat}
      authorLabel='임직원'
      onAddToCart={(bookId) => add(bookId)}
      onBuyNow={(bookId) => add(bookId, true)}
      onRemoveFromCart={remove}
      onChatSubmit={(text) => setChat((previous) => [{ author: '임직원', text, createdAt: new Date().toISOString().slice(0, 10) }, ...previous])}
      onOpenBook={openBook}
      onResetSubsidy={resetSubsidyLedger}
    />
  );
};
