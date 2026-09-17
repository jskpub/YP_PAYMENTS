import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BookDetailPage as PrototypeBookDetailPageView } from '../prototype/components/BookDetailPage';
import { INITIAL_CHAT, RECOMMENDED_BOOKS, findBook } from '../prototype/data/mockData';
import { toPrototypeBenefit } from '../data/prototypeBookAdapter';
import type { BookComment as PrototypeBookComment, CartLine as PrototypeCartLine } from '../prototype/types';

export const PrototypeBookDetailPage: React.FC = () => {
  const { books, cart, addToCart, removeFromCart, setSelectedBookForDetail, selectedBookForDetail, subsidyLedger, setActivePage } = useShop();
  const [chat] = useState<PrototypeBookComment[]>(INITIAL_CHAT);
  const bookId = selectedBookForDetail?.id || RECOMMENDED_BOOKS[0].id;
  const book = findBook(bookId) || RECOMMENDED_BOOKS[0];
  const prototypeCart: PrototypeCartLine[] = cart.filter((item) => RECOMMENDED_BOOKS.some((recommendedBook) => recommendedBook.id === item.book.id)).map((item) => ({ bookId: item.book.id, quantity: item.quantity }));
  const benefit = toPrototypeBenefit(subsidyLedger.remainingSubsidy, subsidyLedger.recommendedUsed);

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

  return (
    <PrototypeBookDetailPageView
      book={book}
      benefit={benefit}
      cart={prototypeCart}
      onAddToCart={add}
      onBuyNow={buy}
      onRemoveFromCart={remove}
      onBack={() => setSelectedBookForDetail(null)}
      onGoToRecommended={() => {
        setSelectedBookForDetail(null);
        setActivePage('recommended');
      }}
    />
  );
};
