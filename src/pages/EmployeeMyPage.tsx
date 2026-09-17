import React, { useState } from 'react';
import { Sidebar } from '../employee/components/Sidebar';
import { BenefitView } from '../employee/components/views/BenefitView';
import { WishlistView } from '../employee/components/views/WishlistView';
import { CartView } from '../employee/components/views/CartView';
import { OrdersView } from '../employee/components/views/OrdersView';
import { RefundView } from '../employee/components/views/RefundView';
import { MemberInfoView } from '../employee/components/views/MemberInfoView';
import { DashboardView } from '../employee/components/views/DashboardView';
import { RecommendedBooksModal } from '../employee/components/RecommendedBooksModal';
import { OrderDetailModal } from '../employee/components/OrderDetailModal';

import { ActiveTab, BookItem, OrderItem } from '../employee/types';
import { initialBenefitState, benefitHistories, initialWishlistBooks, initialCartBooks, initialOrders, refundHistories } from '../employee/mockData';

export default function App() {
  // 현재 활성 탭 (기본값: 마이페이지 홈)
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // 핵심 상태 관리
  const [benefitState, setBenefitState] = useState(initialBenefitState);
  const [wishlistBooks, setWishlistBooks] = useState<BookItem[]>(initialWishlistBooks);
  const [cartBooks, setCartBooks] = useState<BookItem[]>(initialCartBooks);
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [history, setHistory] = useState(benefitHistories);

  // 모달 상태
  const [isRecommendedModalOpen, setIsRecommendedModalOpen] = useState(false);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);

  // 장바구니 담기 핸들러
  const handleAddToCart = (book: BookItem) => {
    setCartBooks((prev) => {
      const existing = prev.find((b) => b.title === book.title);
      if (existing) {
        return prev.map((b) => (b.title === book.title ? { ...b, quantity: (b.quantity || 1) + 1 } : b));
      }
      return [
        ...prev,
        {
          ...book,
          id: `cart-${Date.now()}`,
          quantity: 1,
          selected: true,
        },
      ];
    });
  };

  // 바로구매 핸들러
  const handleBuyNow = (book: BookItem) => {
    handleAddToCart(book);
    setActiveTab('cart');
  };

  // 주문 결제 완료 시뮬레이션
  const handleCheckout = (selectedItems: BookItem[]) => {
    const newOrderNumber = `YP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 금액 및 지원금 계산
    const hasRec = selectedItems.some((i) => i.supportType === 'recommended');
    const recDiscount = hasRec ? selectedItems.find((i) => i.supportType === 'recommended')?.salePrice || 0 : 0;

    const personalEligible = selectedItems.filter((i) => i.supportType !== 'recommended').reduce((acc, i) => acc + i.salePrice * (i.quantity || 1), 0);
    const personalDiscount = Math.min(Math.floor(personalEligible * 0.5), benefitState.personalBook.remainingAmount);
    const totalBenefit = recDiscount + personalDiscount;

    const totalSale = selectedItems.reduce((acc, i) => acc + i.salePrice * (i.quantity || 1), 0);
    const finalPaid = Math.max(0, totalSale - totalBenefit);

    const newOrder: OrderItem = {
      orderNumber: newOrderNumber,
      orderDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      status: '결제완료',
      statusDescription: '내일 도착 예정',
      paymentMethod: '신용카드(현대카드)',
      shippingAddress: `${benefitState.user.address} ${benefitState.user.detailAddress}`,
      totalPrice: totalSale,
      totalBenefitAmount: totalBenefit,
      finalPaidAmount: finalPaid,
      items: selectedItems.map((item) => ({
        bookId: `order-item-${Math.random()}`,
        title: item.title,
        author: item.author,
        publisher: item.publisher,
        quantity: item.quantity || 1,
        category: item.category,
        coverColor: item.coverColor,
        coverLabel: item.coverLabel,
        originalPrice: item.originalPrice,
        salePrice: item.salePrice,
        supportType: item.supportType,
        supportLabel: item.supportBadge,
        benefitAmount: item.supportType === 'recommended' ? item.salePrice : Math.min(item.salePrice * 0.5, personalDiscount),
        selfPay: item.supportType === 'recommended' ? 0 : item.salePrice - Math.min(item.salePrice * 0.5, personalDiscount),
        status: '결제완료',
      })),
    };

    // 지원금 차감 반영
    setBenefitState((prev) => ({
      ...prev,
      personalBook: {
        ...prev.personalBook,
        remainingAmount: Math.max(0, prev.personalBook.remainingAmount - personalDiscount),
        usedAmount: prev.personalBook.usedAmount + personalDiscount,
      },
      recommendedBook: {
        ...prev.recommendedBook,
        usedCount: hasRec ? 1 : prev.recommendedBook.usedCount,
      },
    }));

    // 주문 추가 & 장바구니에서 제거
    setOrders([newOrder, ...orders]);
    setCartBooks((prev) => prev.filter((b) => !selectedItems.some((s) => s.id === b.id)));

    alert(`주문이 완료되었습니다! (주문번호: ${newOrderNumber})\n임직원 도서 지원금 ${totalBenefit.toLocaleString()}원이 차감되었습니다.`);
    setActiveTab('orders');
  };

  // 사내 권장도서 100선에서 선택 시
  const handleSelectRecommendedBook = (book: any) => {
    const newBook: BookItem = {
      id: `rec-book-${Date.now()}`,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      originalPrice: book.price,
      salePrice: Math.floor(book.price * 0.9),
      discountRate: 10,
      pointReward: Math.floor(book.price * 0.05),
      category: '추천도서',
      coverColor: '#065F46',
      coverLabel: book.title.replace(/[『』]/g, ''),
      supportType: 'recommended',
      supportBadge: '100% 임직원 전액지원 대상',
      shippingInfo: '내일(수) 도착 예정 (무료배송)',
      quantity: 1,
      selected: true,
    };
    handleAddToCart(newBook);
    alert(`『${book.title}』 도서가 100% 지원대상으로 장바구니에 담겼습니다.`);
    setActiveTab('cart');
  };

  const selectedOrder = orders.find((o) => o.orderNumber === selectedOrderNumber) || null;

  return (
    <div className='w-full bg-[#F8F9FA] py-8 font-sans text-gray-800'>
      <div className='max-w-7xl w-full mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-start gap-8'>
          {/* 좌측 LNB 마이페이지 사이드바 */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} benefitState={benefitState} cartCount={cartBooks.length} wishlistCount={wishlistBooks.length} orderCount={orders.length} />

          {/* 우측 메인 콘텐츠 뷰 */}
          <div className='flex-1 w-full min-w-0'>
            {activeTab === 'benefit' && <BenefitView benefitState={benefitState} history={history} onOpenRecommendedModal={() => setIsRecommendedModalOpen(true)} onOpenOrderDetail={(orderNum) => setSelectedOrderNumber(orderNum)} setActiveTab={setActiveTab} />}

            {activeTab === 'wishlist' && <WishlistView books={wishlistBooks} setBooks={setWishlistBooks} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} setActiveTab={setActiveTab} benefitState={benefitState} />}

            {activeTab === 'cart' && <CartView cartBooks={cartBooks} setCartBooks={setCartBooks} benefitState={benefitState} onCheckout={handleCheckout} setActiveTab={setActiveTab} />}

            {activeTab === 'orders' && <OrdersView orders={orders} setOrders={setOrders} benefitState={benefitState} setBenefitState={setBenefitState} setHistory={setHistory} onOpenOrderDetail={(orderNum) => setSelectedOrderNumber(orderNum)} setActiveTab={setActiveTab} />}

            {activeTab === 'refund' && <RefundView refundHistories={refundHistories} benefitState={benefitState} setBenefitState={setBenefitState} setActiveTab={setActiveTab} />}

            {activeTab === 'member-info' && <MemberInfoView benefitState={benefitState} setBenefitState={setBenefitState} setActiveTab={setActiveTab} />}

            {activeTab === 'dashboard' && <DashboardView benefitState={benefitState} cartCount={cartBooks.length} wishlistCount={wishlistBooks.length} orderCount={orders.length} setActiveTab={setActiveTab} onOpenRecommendedModal={() => setIsRecommendedModalOpen(true)} />}
          </div>
        </div>
      </div>

      {/* 팝업 모달들 */}
      <RecommendedBooksModal isOpen={isRecommendedModalOpen} onClose={() => setIsRecommendedModalOpen(false)} onSelectBook={handleSelectRecommendedBook} />

      <OrderDetailModal isOpen={!!selectedOrderNumber} onClose={() => setSelectedOrderNumber(null)} order={selectedOrder} />
    </div>
  );
}
