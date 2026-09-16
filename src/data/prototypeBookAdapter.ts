import { Book } from '../types';
import { MOCK_BOOKS, RECOMMENDED_BOOKS } from '../prototype/data/mockData';
import type { Book as PrototypeBook, BenefitState as PrototypeBenefitState } from '../prototype/types';

const toAdapterBook = (book: PrototypeBook): Book => ({
  id: book.id,
  title: book.title,
  subtitle: book.subtitle,
  author: book.author,
  publisher: book.publisher,
  publishDate: book.publishDate,
  // 실제 표지 사진 대신 추천도서 목록과 동일하게 배경색+제목으로 통일해서 그린다
  // (개인도서 원본 데이터에 스톡 사진 URL이 섞여 있어, 화면마다 표지 스타일이 달라 보이는 문제가 있었다).
  coverImage: '',
  coverBackground: book.coverBackground,
  listPrice: book.originalPrice,
  sellingPrice: book.salePrice,
  discountRate: book.discountRate,
  rewardPoint: book.pointReward,
  format: 'paper',
  bookType: book.supportType,
  tags: book.tags || [],
  description: book.description,
  rating: book.rating,
  reviewCount: book.reviewsCount,
});

/** 이달의 추천도서 8권 — 추천도서 목록/상세 페이지 전용 */
export const PROTOTYPE_RECOMMENDED_BOOKS: Book[] = RECOMMENDED_BOOKS.map(toAdapterBook);

/** 추천도서 + 개인도서 전체 — 베스트/신상품 등 프로토타입 도서 그리드 전용 */
export const PROTOTYPE_ALL_BOOKS: Book[] = MOCK_BOOKS.map(toAdapterBook);

/** ShopContext의 subsidyLedger를 프로토타입 컴포넌트가 쓰는 BenefitState 형태로 변환한다. */
export const toPrototypeBenefit = (remainingSubsidy: number, recommendedUsed: boolean): PrototypeBenefitState => ({
  cycleLabel: '2026년 9월',
  resetDescription: '매월 1일 자동 리셋',
  carryOver: false,
  personalBook: {
    limitAmount: 10000,
    usedAmount: Math.max(0, 10000 - remainingSubsidy),
    remainingAmount: Math.min(10000, remainingSubsidy),
    rate: 50,
    limitCount: 1,
    usedCount: remainingSubsidy >= 10000 ? 0 : 1,
  },
  recommendedBook: {
    limitCount: 1,
    usedCount: recommendedUsed ? 1 : 0,
    recentBookTitle: recommendedUsed ? '추천도서 사용완료' : '',
    recentAmount: 0,
  },
});
