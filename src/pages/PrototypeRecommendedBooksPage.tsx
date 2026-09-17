import React from 'react';
import { useShop } from '../context/ShopContext';
import { RecommendedBooksPage as PrototypeRecommendedBooksPageView } from '../prototype/components/RecommendedBooksPage';
import { RECOMMENDED_BOOKS } from '../prototype/data/mockData';
import type { CartLine as PrototypeCartLine } from '../prototype/types';

export const PrototypeRecommendedBooksPage: React.FC = () => {
  const { books, cart, addToCart, removeFromCart, setSelectedBookForDetail } = useShop();
  const prototypeCart: PrototypeCartLine[] = cart.filter((item) => RECOMMENDED_BOOKS.some((book) => book.id === item.book.id)).map((item) => ({ bookId: item.book.id, quantity: item.quantity }));

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
      cart={prototypeCart}
      onAddToCart={(bookId) => add(bookId)}
      onBuyNow={(bookId) => add(bookId, true)}
      onRemoveFromCart={remove}
      onOpenBook={openBook}
    />
  );
};
