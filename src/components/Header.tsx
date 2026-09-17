import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BizMallHeader } from '../prototype/components/BizMallHeader';
import { MOCK_ROSTER } from '../prototype/data/mockData';
import { toPrototypeBenefit } from '../data/prototypeBookAdapter';
import type { GnbMenu } from '../prototype/types';

const MENU_TO_PAGE: Record<GnbMenu, 'home' | 'recommended' | 'best' | 'new'> = {
  ALL: 'home',
  RECOMMENDED: 'recommended',
  BEST: 'best',
  NEW: 'new',
};

const PAGE_TO_MENU: Partial<Record<string, GnbMenu>> = {
  home: 'ALL',
  explore: 'ALL',
  recommended: 'RECOMMENDED',
  best: 'BEST',
  new: 'NEW',
};

export const Header: React.FC = () => {
  const { activePage, setActivePage, setSelectedBookForDetail, setMyPageTab, cart, subsidyLedger, searchQuery, setSearchQuery, showToast } = useShop();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const benefit = toPrototypeBenefit(subsidyLedger.remainingSubsidy, subsidyLedger.recommendedUsed);

  // 프로토타입 헤더는 모든 부가 메뉴를 onPendingNav(label) 하나로 통과시킨다.
  // 실제로 연결된 화면(마이페이지/장바구니/주문·환불)만 라우팅하고 나머지는 안내 토스트로 남긴다.
  const handlePendingNav = (label: string) => {
    if (label === '마이페이지') {
      setActivePage('mypage');
      return;
    }
    if (label === '장바구니') {
      setActivePage('cart');
      return;
    }
    if (label === '주문/배송 조회') {
      setActivePage('mypage');
      setMyPageTab('orders');
      return;
    }
    if (label === '취소/반품/교환') {
      setActivePage('mypage');
      setMyPageTab('refund');
      return;
    }
    showToast(`${label} 화면은 준비 중입니다`);
  };

  return (
    <BizMallHeader
      employeeName={MOCK_ROSTER[0].name}
      benefit={benefit}
      activeMenu={PAGE_TO_MENU[activePage] ?? 'ALL'}
      onMenuChange={(menu) => {
        // 상세 페이지가 열려 있는 상태로 다른 GNB 탭(추천/베스트/신상품)을 누르면, activePage만
        // 바뀌고 selectedBookForDetail이 남아있어 App.tsx의 상세뷰 조건을 계속 만족시키는 바람에
        // 화면이 안 바뀌는 것처럼 보이는 문제가 있었다 — 탭 전환 시 항상 상세뷰를 닫고 검색어도 리셋한다.
        setSelectedBookForDetail(null);
        setSearchQuery('');
        setActivePage(MENU_TO_PAGE[menu]);
      }}
      cartCount={cartCount}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={() => {
        setSelectedBookForDetail(null);
        setActivePage('explore');
      }}
      onPendingNav={handlePendingNav}
      onLogout={() => setActivePage('intranet')}
    />
  );
};