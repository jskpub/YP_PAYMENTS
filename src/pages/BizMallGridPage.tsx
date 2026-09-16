import React from 'react';
import { useShop } from '../context/ShopContext';
import { BizMallHome } from '../prototype/components/BizMallHome';
import { toPrototypeBenefit } from '../data/prototypeBookAdapter';
import { PROTOTYPE_ALL_BOOKS } from '../data/prototypeBookAdapter';
import type { GnbMenu } from '../prototype/types';

/** '베스트'/'신상품' 탭 공용 — B2B프로토타입의 BizMallHome 그리드를 activeMenu만 바꿔 재사용한다. */
export const BizMallGridPage: React.FC<{ menu: Extract<GnbMenu, 'BEST' | 'NEW'> }> = ({ menu }) => {
  const { books, cart, addToCart, removeFromCart, setSelectedBookForDetail, subsidyLedger, showToast } = useShop();
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
      searchQuery=""
      cart={prototypeCart}
      onAddToCart={add}
      onRemoveFromCart={remove}
      onOpenBook={openBook}
      onPendingNav={(label) => showToast(`${label} 화면은 준비 중입니다`)}
    />
  );
};
