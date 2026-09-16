import {BenefitState, Book, BookComment, EmployeeProfile} from '../types';
import {BOOK_DETAILS, BookDetail} from './bookDetails';

/** 상세 콘텐츠는 bookDetails.ts에서 id로 붙인다. */
type BookBase = Omit<Book, keyof BookDetail>;

const withDetails = (books: BookBase[]): Book[] =>
  books.map((book) => ({...book, ...BOOK_DETAILS[book.id]}));

/**
 * 고객사 인증 방식.
 * 「문의 회신」1번: 고객사별 기준이 다양하므로 표준 API(SAML 2.0 / OAuth 2.0)를 제시하는 방향.
 */
export const COMPANIES = [
  {code: 'SEC', name: '삼성전자', hasSSO: true, ssoType: 'SAML 2.0 (사내 포털 연동)'},
  {code: 'HMC', name: '현대자동차', hasSSO: false, ssoType: '미구축 — 사번 명부 대조 인증'},
  {code: 'LGE', name: 'LG전자', hasSSO: false, ssoType: '미구축 — 사번 명부 대조 인증'},
];

/** 이번 달 프로그램 */
export const PROGRAM = {month: '2026년 9월', monthNumber: 9, deadline: '2026-09-30'};

/** 구매자 수는 표본이 이 값 미만이면 숫자를 노출하지 않는다. */
export const PURCHASE_COUNT_MIN = 10;

const BASE_BENEFIT = {
  cycleLabel: PROGRAM.month,
  resetDescription: '매월 1일 자동 리셋',
  carryOver: false,
};

const DEFAULT_BENEFIT: BenefitState = {
  ...BASE_BENEFIT,
  personalBook: {
    limitAmount: 10000,
    usedAmount: 0,
    remainingAmount: 10000,
    rate: 50,
    limitCount: 1,
    usedCount: 0,
  },
  recommendedBook: {
    limitCount: 1,
    usedCount: 0,
    recentBookTitle: '',
    recentAmount: 0,
  },
};

/** 이번 달 추천도서를 이미 사용한 임직원 — 월 1권 제한이 걸린 상태를 보여준다. */
const USED_BENEFIT: BenefitState = {
  ...BASE_BENEFIT,
  personalBook: {
    limitAmount: 10000,
    usedAmount: 10000,
    remainingAmount: 0,
    rate: 50,
    limitCount: 1,
    usedCount: 1,
  },
  recommendedBook: {
    limitCount: 1,
    usedCount: 1,
    recentBookTitle: '『소년이 온다』 (13,500원 전액)',
    recentAmount: 13500,
  },
};

export const MOCK_ROSTER: EmployeeProfile[] = [
  {
    id: 'emp_sec_01',
    name: '김민서',
    employeeId: 'SEC-20240881',
    company: '삼성전자',
    companyCode: 'SEC',
    division: 'DS부문 반도체연구소 차세대공정개발팀',
    role: '책임연구원',
    email: 'minseo.kim@samsung.com',
    hireDate: '2020-03-02',
    status: 'ACTIVE',
  },
  {
    id: 'emp_sec_02',
    name: '이서진',
    employeeId: 'SEC-20184420',
    company: '삼성전자',
    companyCode: 'SEC',
    division: 'DX부문 영상디스플레이사업부 SW개발팀',
    role: '수석연구원',
    email: 'seojin.lee@samsung.com',
    hireDate: '2018-01-15',
    status: 'ACTIVE',
  },
  {
    id: 'emp_sec_03',
    name: '박준호',
    employeeId: 'SEC-20260105',
    company: '삼성전자',
    companyCode: 'SEC',
    division: 'SAIT(종합기술원) AI인공지능센터',
    role: '연구원',
    email: 'junho.park@samsung.com',
    hireDate: '2026-01-02',
    status: 'ACTIVE',
  },
];

export const BENEFIT_BY_EMPLOYEE: Record<string, BenefitState> = {
  emp_sec_01: DEFAULT_BENEFIT,
  emp_sec_02: USED_BENEFIT,
  emp_sec_03: DEFAULT_BENEFIT,
};

export const getBenefitFor = (employee: EmployeeProfile): BenefitState =>
  BENEFIT_BY_EMPLOYEE[employee.id] ?? DEFAULT_BENEFIT;

/** 도서정가제: 정가 대비 최대 10% 할인 + 판매가의 5% 적립 */
const priced = (originalPrice: number, salePrice = Math.floor((originalPrice * 0.9) / 10) * 10) => ({
  originalPrice,
  salePrice,
  discountRate: Math.round((1 - salePrice / originalPrice) * 100),
  pointReward: Math.floor(salePrice * 0.05),
});

const COVER = [
  'linear-gradient(150deg,#7a4b3a,#4a2b20)',
  'linear-gradient(150deg,#3f5f78,#22394a)',
  'linear-gradient(150deg,#6a4a6e,#3a2740)',
  'linear-gradient(150deg,#4a6b55,#27402f)',
  'linear-gradient(150deg,#8a6a35,#4d3a19)',
  'linear-gradient(150deg,#5a5f7a,#2f3346)',
  'linear-gradient(150deg,#77404a,#421f26)',
  'linear-gradient(150deg,#3e6b6b,#1f3c3c)',
];

/**
 * 이달의 추천도서 — 도서추천 프로토타입(`B2B 도서추천 프로토타입/data/books.js`)이 원본.
 * 평점·리뷰 수는 원본에 없어 프로토타입용으로 채운 값이다.
 */
const RECOMMENDED_BASE: BookBase[] = [
  {
    id: 'rec-b01',
    title: '함께 자라기',
    subtitle: '애자일로 가는 길',
    author: '김창준',
    publisher: '인사이트',
    publishDate: '2018년 11월 30일',
    coverBackground: COVER[0],
    ...priced(15000, 13500),
    category: 'SELF_IMPROVE',
    categoryName: '자기계발 > 성공/처세',
    rating: 4.8,
    reviewsCount: 412,
    isBestseller: true,
    isNewRelease: false,
    supportType: 'recommended',
    isbn: '9788966262335',
    tags: ['#애자일', '#협업', '#팀빌딩', '#코드리뷰', '#자기계발'],
    targetLabel: '개발팀을 위한 책',
    curationReason:
      '코드 리뷰와 페어 프로그래밍 문화를 고민하는 팀에게 이달의 1순위로 추천합니다.',
    recommender: {type: 'CEO', name: '박지훈 대표'},
    recommenderNote: '협업의 본질을 다시 보게 한 책입니다. 팀장이라면 꼭 한 번 읽어보셨으면 합니다.',
    purchaseCount: 24,
    comments: [
      {
        author: '개발팀 임직원',
        text: '협업 관점이 많이 바뀌었어요. 신입 때 읽었으면 더 좋았을 책.',
        createdAt: '2026-09-10',
      },
      {
        author: '기획팀 임직원',
        text: '개발팀 얘기인 줄 알았는데 기획 회의에도 그대로 적용되네요.',
        createdAt: '2026-09-12',
      },
    ],
  },
  {
    id: 'rec-b02',
    title: '최선의 하루',
    subtitle: '지치지 않고 오래 가는 법',
    author: '김재원',
    publisher: '다산북스',
    publishDate: '2026년 03월 14일',
    coverBackground: COVER[1],
    ...priced(17000, 15300),
    category: 'ESSAY',
    categoryName: '에세이 > 한국에세이',
    rating: 4.5,
    reviewsCount: 128,
    isBestseller: false,
    isNewRelease: true,
    supportType: 'recommended',
    isbn: '9791130612345',
    tags: ['#번아웃', '#회복', '#워라밸', '#에세이', '#마음챙김'],
    targetLabel: '번아웃이 오려는 당신에게',
    curationReason: '연차와 무관하게 요즘 많은 분들이 공감하시는 주제라 이달 추천도서로 골랐습니다.',
    recommender: null,
    recommenderNote: null,
    purchaseCount: 31,
    comments: [
      {
        author: '마케팅팀 임직원',
        text: '야근 많던 시기에 딱 필요했던 책이었어요.',
        createdAt: '2026-09-08',
      },
    ],
  },
  {
    id: 'rec-b03',
    title: '소년이 온다',
    author: '한강',
    publisher: '창비',
    publishDate: '2014년 05월 19일',
    coverBackground: COVER[2],
    ...priced(15000, 13500),
    category: 'NOVEL',
    categoryName: '소설 > 한국소설',
    rating: 4.9,
    reviewsCount: 1893,
    isBestseller: true,
    isNewRelease: false,
    supportType: 'recommended',
    isbn: '9788936434120',
    tags: ['#한강', '#노벨문학상', '#광주', '#한국소설', '#현대사'],
    targetLabel: '문학이 필요한 계절에',
    curationReason: '부서 구분 없이 모두에게 권하고 싶은 이 시대의 필독 소설입니다.',
    recommender: null,
    recommenderNote: null,
    purchaseCount: 42,
    comments: [
      {
        author: '인사팀 임직원',
        text: '읽는 내내 마음이 무거웠지만 꼭 읽어야 할 책이라 생각해요.',
        createdAt: '2026-09-05',
      },
      {author: '재무팀 임직원', text: '올해 읽은 책 중 최고였습니다.', createdAt: '2026-09-11'},
      {
        author: '개발팀 임직원',
        text: '문장이 정말 아름다운데 내용은 아파요.',
        createdAt: '2026-09-13',
      },
    ],
  },
  {
    id: 'rec-b04',
    title: '실무형 리더십',
    subtitle: '처음 팀장이 된 사람들을 위한 안내서',
    author: '이랑주',
    publisher: '비즈니스북스',
    publishDate: '2026년 01월 22일',
    coverBackground: COVER[3],
    ...priced(18000, 16200),
    category: 'BUSINESS_MGMT',
    categoryName: '경제경영 > 리더십',
    rating: 4.4,
    reviewsCount: 76,
    isBestseller: false,
    isNewRelease: true,
    supportType: 'recommended',
    isbn: '9791163223456',
    tags: ['#리더십', '#팀장', '#조직관리', '#피드백', '#경제경영'],
    targetLabel: '새로 팀장이 된 분들께',
    curationReason: '올해 신임 팀장이 많은 조직 특성을 고려해 인사팀 요청으로 선정했습니다.',
    recommender: {type: '부서장', name: '개발2팀 최OO 팀장'},
    recommenderNote:
      '저도 팀장 1년차에 읽고 큰 도움을 받았습니다. 새로 보직 맡으신 분들께 권합니다.',
    purchaseCount: 9,
    comments: [],
  },
  {
    id: 'rec-b05',
    title: '세이노의 가르침',
    author: '세이노',
    publisher: '데이원',
    publishDate: '2023년 03월 02일',
    coverBackground: COVER[4],
    ...priced(7200, 7200),
    category: 'SELF_IMPROVE',
    categoryName: '자기계발 > 성공/처세',
    rating: 4.3,
    reviewsCount: 2417,
    isBestseller: true,
    isNewRelease: false,
    supportType: 'recommended',
    isbn: '9791168473690',
    tags: ['#자기계발', '#부자되는법', '#일머리', '#현실조언', '#베스트셀러'],
    targetLabel: '인생관이 흔들릴 때',
    curationReason: '매달 베스트셀러 상위권을 지키고 있는 화제작이라 소개합니다.',
    recommender: null,
    recommenderNote: null,
    purchaseCount: 18,
    comments: [
      {
        author: '영업팀 임직원',
        text: '동의 안 되는 부분도 있었지만 자극이 됐어요.',
        createdAt: '2026-09-09',
      },
    ],
  },
  {
    id: 'rec-b06',
    title: '초격차',
    subtitle: '리더의 질문',
    author: '권오현',
    publisher: '쌤앤파커스',
    publishDate: '2018년 09월 20일',
    coverBackground: COVER[5],
    ...priced(17000, 15300),
    category: 'BUSINESS_MGMT',
    categoryName: '경제경영 > 경영전략',
    rating: 4.6,
    reviewsCount: 534,
    isBestseller: false,
    isNewRelease: false,
    supportType: 'recommended',
    isbn: '9788965708773',
    tags: ['#경영전략', '#리더십', '#조직문화', '#삼성', '#경제경영'],
    targetLabel: '영업팀을 위한 책',
    curationReason: '영업 전략 수립 시기에 맞춰 영업팀에서 직접 요청한 도서입니다.',
    recommender: {type: '임원', name: '영업본부 정OO 상무'},
    recommenderNote: '하반기 전략 워크숍 전에 팀원들과 같이 읽어보면 좋겠습니다.',
    purchaseCount: 6,
    comments: [
      {author: '영업팀 임직원', text: '영업팀만 보기엔 아까운 책 같아요.', createdAt: '2026-09-07'},
    ],
  },
  {
    id: 'rec-b07',
    title: '숫자 감각',
    subtitle: '비전공자를 위한 실무 재무',
    author: '박성현',
    publisher: '한빛비즈',
    publishDate: '2026년 05월 08일',
    coverBackground: COVER[6],
    ...priced(19000, 17100),
    category: 'BUSINESS_MGMT',
    categoryName: '경제경영 > 재무/회계',
    rating: 4.2,
    reviewsCount: 41,
    isBestseller: false,
    isNewRelease: true,
    supportType: 'recommended',
    isbn: '9791157849876',
    tags: ['#재무', '#회계', '#손익계산서', '#실무입문', '#경제경영'],
    targetLabel: '재무팀을 위한 책',
    curationReason: '연말 예산 시즌을 앞두고 재무팀 관리자 선정으로 이달 목록에 올렸습니다.',
    recommender: null,
    recommenderNote: null,
    purchaseCount: 4,
    comments: [],
  },
  {
    id: 'rec-b08',
    title: '물고기는 존재하지 않는다',
    subtitle: '상실, 사랑 그리고 숨어 있는 삶의 질서에 관한 이야기',
    author: '룰루 밀러',
    publisher: '곰출판',
    publishDate: '2021년 12월 17일',
    coverBackground: COVER[7],
    ...priced(17000, 15300),
    category: 'SCIENCE',
    categoryName: '과학 > 교양과학',
    rating: 4.7,
    reviewsCount: 967,
    isBestseller: true,
    isNewRelease: false,
    supportType: 'recommended',
    isbn: '9791189327156',
    tags: ['#논픽션', '#교양과학', '#분류학', '#에세이', '#인생책'],
    targetLabel: '생각이 많아지는 밤에',
    curationReason: '장르 편식 없이 다양한 책을 만나셨으면 하는 마음으로 골랐습니다.',
    recommender: null,
    recommenderNote: null,
    purchaseCount: 15,
    comments: [
      {
        author: '기획팀 임직원',
        text: '제목만 보고 골랐는데 생각보다 훨씬 좋았어요.',
        createdAt: '2026-09-06',
      },
    ],
  },
];

/** 임직원이 직접 고르는 개인도서 — 베스트/신상품 탭에 노출된다. */
const PERSONAL_BASE: BookBase[] = [
  {
    id: 'bk-001',
    title: '생성형 AI 엔지니어링: 파운데이션 모델과 실전 LLM 아키텍처',
    author: '칩 후옌 지음 / 이선우 옮김',
    publisher: '위키북스',
    publishDate: '2026년 06월 18일',
    coverImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    coverBackground: '#1E293B',
    ...priced(38000),
    category: 'TECH_AI',
    categoryName: 'IT / AI 엔지니어링',
    rating: 4.9,
    reviewsCount: 142,
    isBestseller: true,
    isNewRelease: true,
    supportType: 'personal',
    isbn: '9791158395421',
  },
  {
    id: 'bk-002',
    title: '반도체 공정 및 첨단 패키징 기술 핸드북',
    author: '김영호, 박성민 공저',
    publisher: '한빛아카데미',
    publishDate: '2026년 04월 30일',
    coverImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    coverBackground: '#0F172A',
    ...priced(42000),
    category: 'TECH_AI',
    categoryName: '반도체 / 하드웨어',
    rating: 4.8,
    reviewsCount: 89,
    isBestseller: true,
    isNewRelease: false,
    supportType: 'personal',
    isbn: '9791156644392',
  },
  {
    id: 'bk-003',
    title: '데이터 중심 애플리케이션 설계',
    author: '마틴 클레프만 지음 / 정재열 옮김',
    publisher: '제이펍',
    publishDate: '2025년 11월 12일',
    coverImage:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    coverBackground: '#1E3A8A',
    ...priced(35000),
    category: 'TECH_AI',
    categoryName: 'SW 아키텍처',
    rating: 5.0,
    reviewsCount: 310,
    isBestseller: true,
    isNewRelease: false,
    supportType: 'personal',
    isbn: '9791158391720',
  },
  {
    id: 'bk-004',
    title: '원칙: 인생과 일의 원칙',
    author: '레이 달리오 지음 / 고영태 옮김',
    publisher: '한빛비즈',
    publishDate: '2025년 09월 01일',
    coverImage:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    coverBackground: '#334155',
    ...priced(32000),
    category: 'BUSINESS_MGMT',
    categoryName: '경영 / 리더십',
    rating: 4.8,
    reviewsCount: 220,
    isBestseller: false,
    isNewRelease: false,
    supportType: 'personal',
    isbn: '9791157842209',
  },
  {
    id: 'bk-005',
    title: '트렌드 코리아 2027',
    author: '김난도 외 지음',
    publisher: '미래의창',
    publishDate: '2026년 09월 05일',
    coverImage:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    coverBackground: '#991B1B',
    ...priced(20000),
    category: 'TREND',
    categoryName: '트렌드 / 경제경영',
    rating: 4.6,
    reviewsCount: 512,
    isBestseller: true,
    isNewRelease: true,
    supportType: 'personal',
    isbn: '9791193506554',
  },
  {
    id: 'bk-006',
    title: '함께 자라기: 애자일로 가는 길 (개정판)',
    author: '김창준',
    publisher: '인사이트',
    publishDate: '2026년 08월 20일',
    coverImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80',
    coverBackground: '#0F766E',
    ...priced(12000),
    category: 'SELF_IMPROVE',
    categoryName: '자기계발 / 조직문화',
    rating: 4.7,
    reviewsCount: 431,
    isBestseller: false,
    isNewRelease: true,
    supportType: 'personal',
    isbn: '9788966262281',
  },
  {
    id: 'bk-007',
    title: '생각에 관한 생각',
    author: '대니얼 카너먼 지음 / 이창신 옮김',
    publisher: '김영사',
    publishDate: '2025년 06월 10일',
    coverImage:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
    coverBackground: '#78350F',
    ...priced(22000),
    category: 'HUMANITIES',
    categoryName: '인문 / 심리',
    rating: 4.5,
    reviewsCount: 288,
    isBestseller: true,
    isNewRelease: false,
    supportType: 'personal',
    isbn: '9788934972464',
  },
  {
    id: 'bk-008',
    title: '일의 감각: 성과를 만드는 사람들의 태도',
    author: '조수용',
    publisher: '북스톤',
    publishDate: '2026년 09월 01일',
    coverImage:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80',
    coverBackground: '#312E81',
    ...priced(17000),
    category: 'SELF_IMPROVE',
    categoryName: '자기계발 / 커리어',
    rating: 4.4,
    reviewsCount: 97,
    isBestseller: false,
    isNewRelease: true,
    supportType: 'general',
    isbn: '9791167930552',
  },
];

export const RECOMMENDED_BOOKS: Book[] = withDetails(RECOMMENDED_BASE);
export const PERSONAL_BOOKS: Book[] = withDetails(PERSONAL_BASE);
export const MOCK_BOOKS: Book[] = [...RECOMMENDED_BOOKS, ...PERSONAL_BOOKS];

export const findBook = (id: string) => MOCK_BOOKS.find((book) => book.id === id);

/**
 * 채팅방 초기 메시지.
 * 책 하나에 종속되지 않고 이달 추천도서 전체에 대해 남기는 공간이라,
 * 책별 comments를 모아서 함께 보여준다.
 */
export const INITIAL_CHAT: BookComment[] = [];

export const POPULAR_KEYWORDS = [
  '트렌드코리아 2027',
  '생성형 AI',
  '함께 자라기',
  '소년이 온다',
  '직무역량',
];
