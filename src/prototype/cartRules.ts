import {BenefitState, Book, CartLine} from './types';
import {findBook} from './data/mockData';

/**
 * 월 1권 제한 판정.
 * 추천도서·개인도서 각각 월 1권이며, 이미 사용한 수에 장바구니에 담긴 수를 더해 계산한다.
 * (「개발 검토사항」 지원금 Rule Engine / 「문의 회신」 2번)
 */
export const countInCart = (cart: CartLine[], supportType: Book['supportType']) =>
  cart.filter((line) => findBook(line.bookId)?.supportType === supportType).length;

export const getRemainingCount = (
  benefit: BenefitState,
  cart: CartLine[],
  supportType: Book['supportType'],
) => {
  if (supportType === 'general') return Number.POSITIVE_INFINITY;

  const rule =
    supportType === 'recommended'
      ? {limit: benefit.recommendedBook.limitCount, used: benefit.recommendedBook.usedCount}
      : {limit: benefit.personalBook.limitCount, used: benefit.personalBook.usedCount};

  return rule.limit - rule.used - countInCart(cart, supportType);
};

export interface PriceBreakdown {
  /** 정가 × 수량 */
  productAmount: number;
  /** 도서정가제 할인 */
  discountAmount: number;
  /** 회사 지원금 */
  subsidyAmount: number;
  /** 직원 결제금액 */
  payableAmount: number;
  /** 지원 대상 권수 — 월 1권이므로 초과분은 직원 부담 */
  subsidizedCount: number;
}

/**
 * 지원금 계산.
 * 추천도서는 1권 전액, 개인도서는 1권의 50%를 월 한도(1만원) 안에서 지원한다.
 * 수량을 늘려도 지원은 1권까지이고 초과분은 직원이 부담한다.
 */
export const calculatePrice = (
  book: Book,
  quantity: number,
  benefit: BenefitState,
  cart: CartLine[],
): PriceBreakdown => {
  const productAmount = book.originalPrice * quantity;
  const discountAmount = (book.originalPrice - book.salePrice) * quantity;
  const saleTotal = book.salePrice * quantity;

  const remaining = getRemainingCount(benefit, cart, book.supportType);
  const subsidizedCount = Math.min(quantity, Math.max(0, remaining));

  let subsidyAmount = 0;
  if (subsidizedCount > 0) {
    if (book.supportType === 'recommended') {
      subsidyAmount = book.salePrice;
    } else if (book.supportType === 'personal') {
      subsidyAmount = Math.min(
        Math.floor((book.salePrice * benefit.personalBook.rate) / 100),
        benefit.personalBook.remainingAmount,
      );
    }
  }

  return {
    productAmount,
    discountAmount,
    subsidyAmount,
    payableAmount: saleTotal - subsidyAmount,
    subsidizedCount,
  };
};

export const canAddToCart = (
  book: Book,
  benefit: BenefitState,
  cart: CartLine[],
): {allowed: true} | {allowed: false; reason: string} => {
  if (cart.some((line) => line.bookId === book.id)) {
    return {allowed: false, reason: '이미 장바구니에 담긴 도서입니다'};
  }

  if (getRemainingCount(benefit, cart, book.supportType) > 0) return {allowed: true};

  const label = book.supportType === 'recommended' ? '추천도서' : '개인도서';
  return {allowed: false, reason: `이번 달 ${label} 지원은 1권까지만 신청할 수 있어요`};
};
