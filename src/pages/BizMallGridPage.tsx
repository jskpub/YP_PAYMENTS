import React from 'react';
import { useShop } from '../context/ShopContext';
import { BizMallHome } from '../prototype/components/BizMallHome';
import { toPrototypeBenefit } from '../data/prototypeBookAdapter';
import { PROTOTYPE_ALL_BOOKS } from '../data/prototypeBookAdapter';
import type { GnbMenu } from '../prototype/types';

/** B2B 프로토타입 메인/도서 목록 그리드 — 추천/베스트/신상품/전체 및 검색 결과 공용 */
export const BizMallGridPage: React.FC<{ menu?: GnbMenu }> = ({ menu = 'ALL' }) => {
  const { books, cart, addToCart, removeFromCart, setSelectedBookForDetail, subsidyLedger, searchQuery, showToast } = useShop();
  const benefit = toPrototypeBenefit(subsidyLedger.remainingSubsidy, subsidyLedger.recommendedUsed);
  const prototypeCart = cart.filter((item) => PROTOTYPE_ALL_BOOKS.some((book) => book.id === item.book.id)).map((item) => ({ bookId: item.book.id, quantity: item.quantity }));

  const findCurrentBook = (bookId: string) => books.find((book) => book.id === bookId);
  const add = (bookId: string) => {
    const book = findCurrentBook(bookId);
    if (book) addToCart(book, 'paper', 1, false);
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
    <BizMallHome
      benefit={benefit}
      activeMenu={menu}
      searchQuery={searchQuery || ''}
      cart={prototypeCart}
      onAddToCart={add}
      onRemoveFromCart={remove}
      onOpenBook={openBook}
      onPendingNav={(label) => showToast(`${label} 화면은 준비 중입니다`)}
    />
  );
};
