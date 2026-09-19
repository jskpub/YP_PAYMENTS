export type ActiveTab =
  | 'benefit' // 나의 지원금
  | 'wishlist' // 위시리스트
  | 'cart' // 장바구니
  | 'orders' // 주문 조회
  | 'refund' // 환불/반품
  | 'member-info' // 회원정보 관리
  | 'dashboard'; // 마이페이지 홈

export interface BenefitState {
  user: {
    name: string;
    grade: string;
    employeeId: string;
    isVerified: boolean;
    email: string;
    phone: string;
    birthDate: string;
    gender: 'male' | 'female';
    address: string;
    detailAddress: string;
  };
  semester: string; // "2026년도 상반기"
  expiryDate: string; // "2026.06.30"
  personalBook: {
    totalLimit: number; // 10,000
    usedAmount: number; // 5,000
    remainingAmount: number; // 5,000
    rate: number; // 50%
  };
  recommendedBook: {
    totalLimitCount: number; // 1
    usedCount: number; // 1
    recentBookTitle: string; // "『AI 시대의 일하는 방식』 (18,000원 전액)"
    recentAmount: number; // 18,000
  };
}

export interface BenefitHistoryItem {
  id: string;
  date: string;
  type: '추천도서' | '개인도서';
  bookTitle: string;
  originalPrice: number;
  policy: string; // "100% 전액지원" | "50% 지원"
  benefitAmount: number; // -18000, -5000
  selfPayAmount: number; // 0, 5000
  orderNumber: string;
  status: string; // "배송완료"
}

export interface BookItem {
  id: string;
  title: string;
  subTitle?: string;
  author: string;
  publisher: string;
  originalPrice: number;
  salePrice: number;
  discountRate: number; // 10%
  pointReward: number;
  category: string;
  coverColor: string;
  coverLabel?: string;
  supportType: 'recommended' | 'personal' | 'general';
  supportBadge: string;
  shippingInfo: string;
  estimatedSelfPay?: number;
  benefitDiscount?: number;
  wishDate?: string;
  selected?: boolean;
  quantity?: number;
  likesCount?: number;
}

export interface OrderItem {
  orderNumber: string;
  orderDate: string;
  status: '결제완료' | '상품준비중' | '배송중' | '배송완료' | '주문취소';
  statusDescription: string;
  deliveryTracker?: {
    carrier: string;
    trackingNumber: string;
  };
  items: {
    bookId: string;
    title: string;
    author: string;
    publisher: string;
    quantity: number;
    category: string;
    coverColor: string;
    coverLabel?: string;
    originalPrice: number;
    salePrice: number;
    supportType: 'recommended' | 'personal' | 'general';
    supportLabel: string;
    benefitAmount: number;
    selfPay: number;
    status: string;
  }[];
  totalPrice: number;
  totalBenefitAmount: number;
  finalPaidAmount: number;
  paymentMethod: string;
  shippingAddress: string;
}

export interface RefundHistoryItem {
  id: string;
  receiptNumber: string;
  date: string;
  type: '반품환불' | '주문취소';
  bookTitle: string;
  authorAndPublisher: string;
  orderNumber: string;
  reason: string;
  refundAmount: number;
  benefitRestored: string;
  status: '환불완료' | '취소완료';
  processedDate: string;
}
