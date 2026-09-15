/**
 * 영풍문고 B2B 도서구매 & 복합결제 타입 정의
 * Web 표준 가이드 및 B2B 복합결제 PRD 기준
 */

export type BookType = 'recommended' | 'personal' | 'general'; // 추천도서 | 개인도서 | 일반도서(지원금 미적용)
export type BookFormat = 'paper' | 'ebook'; // 종이도서 | 전자도서
export type PageTab = 'explore' | 'cart' | 'gift' | 'payment' | 'complete' | 'mypage';

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher: string;
  publishDate: string;
  coverImage: string;
  listPrice: number;       // 정가
  sellingPrice: number;    // 판매가 (할인가)
  discountRate: number;    // 할인율 (%)
  rewardPoint: number;     // 예상 적립금
  format: BookFormat;
  bookType: BookType;      // 추천/개인
  tags: string[];
  description: string;
  rating: number;
  reviewCount: number;
  badge?: string;          // 소득공제, 베스트, 신간 등
}

export interface CartItem {
  id: string;
  book: Book;
  quantity: number;
  format: BookFormat;
  deliveryType: 'normal' | 'nowdream';
  estimatedDeliveryDate: string;
  selected: boolean;
  // 계산된 금액 (수량 반영)
  itemSellingPrice: number;
  itemCompanySubsidy: number; // 회사 지원금
  itemEmployeePayment: number; // 직원 부담금
  isSubsidyApplied?: boolean; // 지원금 적용 여부
  subsidyNote?: string;       // 지원금 설명 노트
}

export interface Address {
  id: string;
  title: string;          // 배송지명 (예: 우리집, 회사)
  recipient: string;      // 수령인
  phone1: string;         // 연락처1
  phone2?: string;        // 연락처2
  postalCode: string;     // 우편번호
  roadAddress: string;    // 도로명주소
  jibunAddress: string;   // 지번주소
  detailAddress: string;  // 상세주소
  isDefault: boolean;     // 기본배송지 여부
  deliveryMemo?: string;  // 배송메모
  type?: 'domestic' | 'overseas';
}

export interface OrderItemRecord {
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  format: BookFormat;
  bookType: BookType;
  quantity: number;
  listPrice: number;
  sellingPrice: number;
  companySubsidy: number;
  employeePayment: number;
  isSubsidyApplied?: boolean;
  subsidyNote?: string;
}

export interface Order {
  orderId: string;
  orderDate: string;
  employeeId: string;
  employeeName: string;
  employeePhone: string;
  employeeEmail: string;
  items: OrderItemRecord[];
  totalListPrice: number;
  totalSellingPrice: number;
  totalDiscount: number;
  totalCompanySubsidy: number; // 회사 지원금 총액
  totalEmployeePayment: number; // 직원 실결제 총액
  shippingFee: number;
  finalPaidAmount: number;     // totalEmployeePayment + shippingFee
  pointsUsed: number;
  earnedPoints?: number;       // 적립 예정 포인트
  deliveryAddress: Address;
  deliveryMemo: string;
  paymentMethod: string;
  culturalDeduction: boolean;  // 문화비 소득공제 신청 여부
  status: '결제완료' | '상품준비중' | '배송중' | '배송완료' | '주문취소' | '환불완료';
  isRefunded?: boolean;
  refundDate?: string;
  refundReason?: string;
}

export interface SubsidyLedger {
  month: string;                // "2026-09"
  monthlyLimit: number;         // 30,000원 기준
  recommendedUsed: boolean;     // 추천도서 월 1권 사용 여부
  personalUsed: boolean;        // 개인도서 월 1권 사용 여부
  recommendedBookTitle?: string;
  personalBookTitle?: string;
  recommendedSubsidyAmount: number; // 추천도서 지원액
  personalSubsidyAmount: number;    // 개인도서 지원액
  totalUsedSubsidy: number;     // 총 사용 지원금
  remainingSubsidy: number;     // 남은 지원금
  totalEmployeePaid: number;    // 직원이 부담한 실결제액 누적
}

export interface GiftItem {
  id: string;
  name: string;
  minAmount: number;
  image: string;
  description: string;
}
