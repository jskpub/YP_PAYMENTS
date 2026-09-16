export type AuthMethod = 'SSO_INTRANET' | 'ROSTER_AUTH';

export type AppViewMode = 'INTRANET_PORTAL' | 'DIRECT_LOGIN' | 'BIZ_MALL';

export type GnbMenu = 'ALL' | 'RECOMMENDED' | 'BEST' | 'NEW';

export interface EmployeeProfile {
  id: string;
  name: string;
  employeeId: string;
  company: string;
  companyCode: string;
  division: string;
  role: string;
  email: string;
  hireDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED';
}

/**
 * 지원금 상태.
 * 주기는 매월 1일 리셋 · 미사용분 이월 없음 (「문의 회신」 2번 항목).
 * 고객사에 따라 분기/반기 운영도 가능하다고 회신돼 있어 cycleLabel로 표기만 분리해둠.
 */
export interface BenefitState {
  cycleLabel: string;
  resetDescription: string;
  carryOver: boolean;
  /** 개인도서: 50% 지원, 월 1만원 한도, 월 1권 */
  personalBook: {
    limitAmount: number;
    usedAmount: number;
    remainingAmount: number;
    rate: number;
    limitCount: number;
    usedCount: number;
  };
  /** 추천도서: 100% 전액 지원, 월 1권 */
  recommendedBook: {
    limitCount: number;
    usedCount: number;
    recentBookTitle: string;
    recentAmount: number;
  };
}

export interface UserSession {
  employee: EmployeeProfile;
  benefit: BenefitState;
  authMethod: AuthMethod;
  authenticatedAt: string;
  sessionToken: string;
}

export type SupportType = 'recommended' | 'personal' | 'general';

/** 추천인 — 영풍문고 큐레이션 후 기업 관리자가 선정하며, 일부 도서에만 붙는다. */
export interface Recommender {
  type: string;
  name: string;
}

export interface BookComment {
  author: string;
  text: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher: string;
  publishDate: string;
  /** 표지 이미지가 없으면 coverBackground와 제목으로 표지를 그린다. */
  coverImage?: string;
  coverBackground: string;
  /** 정가 */
  originalPrice: number;
  /** 도서정가제 기준 최대 10% 할인 */
  discountRate: number;
  salePrice: number;
  /** 도서정가제 기준 5% 적립 */
  pointReward: number;
  category: string;
  categoryName: string;
  rating: number;
  reviewsCount: number;
  isBestseller: boolean;
  isNewRelease: boolean;
  supportType: SupportType;
  isbn: string;

  /* 상세 페이지 */
  pages: string;
  size: string;
  format: string;
  description: string;
  toc: string[];
  authorBio: string;
  publisherReview: string;
  /** 추천사 — 있는 책에만 붙는다. */
  endorsements?: {text: string; by: string}[];

  /* 추천도서 전용 */
  targetLabel?: string;
  curationReason?: string;
  recommender?: Recommender | null;
  recommenderNote?: string | null;
  purchaseCount?: number;
  tags?: string[];
  comments?: BookComment[];
}

export interface CartLine {
  bookId: string;
  quantity: number;
}
