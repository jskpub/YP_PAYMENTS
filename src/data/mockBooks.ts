import { Book, GiftItem, Address } from '../types';

// SVG Book Cover helper for clean, reliable rendering
function createBookCover(bg: string, title: string, author: string, accentColor: string = '#ffffff'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 290" width="200" height="290">
    <defs>
      <linearGradient id="g_${encodeURIComponent(title.slice(0, 4))}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="${bg}" stop-opacity="0.85" />
      </linearGradient>
      <filter id="spine" x="0" y="0" width="10" height="290" filterUnits="userSpaceOnUse">
        <feDropShadow dx="2" dy="0" stdDeviation="1" flood-opacity="0.2"/>
      </filter>
    </defs>
    <rect width="200" height="290" rx="4" fill="url(#g_${encodeURIComponent(title.slice(0, 4))})" />
    <rect x="0" y="0" width="8" height="290" fill="#000000" opacity="0.18" />
    <rect x="8" y="0" width="2" height="290" fill="#ffffff" opacity="0.15" />
    <circle cx="100" cy="85" r="36" fill="${accentColor}" opacity="0.2" />
    <circle cx="100" cy="85" r="22" fill="${accentColor}" opacity="0.3" />
    <text x="100" y="150" font-family="'Pretendard', sans-serif" font-size="16" font-weight="700" fill="${accentColor}" text-anchor="middle" width="170">
      ${title.length > 9 ? title.slice(0, 9) + '..' : title}
    </text>
    <text x="100" y="172" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" fill="${accentColor}" opacity="0.9" text-anchor="middle">
      ${author}
    </text>
    <line x1="40" y1="195" x2="160" y2="195" stroke="${accentColor}" stroke-width="1" opacity="0.3" />
    <text x="100" y="260" font-family="'Pretendard', sans-serif" font-size="10" font-weight="600" fill="${accentColor}" opacity="0.75" text-anchor="middle" letter-spacing="1">
      YOUNGPOONG BOOKS
    </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}


export const MOCK_BOOKS: Book[] = [
  {
    id: 'b-01',
    title: '소설 보다: 가을 2026',
    subtitle: '문학과지성사 계간 신작 단편선',
    author: '문학과지성사 편집부',
    publisher: '문학과지성사',
    publishDate: '2026-09-01',
    coverImage: 'https://image.aladin.co.kr/product/40168/74/cover500/8932045720_1.jpg',
    listPrice: 5500,
    sellingPrice: 4950,
    discountRate: 10,
    rewardPoint: 270,
    format: 'paper',
    bookType: 'general', // 일반도서 (B2B 지원금 미적용)
    tags: ['한국소설', '문학선집', '계간지', '가을신작'],
    description: '젊은 작가들의 가장 빛나는 순간을 포착한 단편 소설 모음집. 가을의 정취와 문학적 통찰이 어우러진 깊이 있는 작품들로 채워져 있습니다.',
    rating: 4.8,
    reviewCount: 32,
    badge: '소득공제',
  },
  {
    id: 'b-02',
    title: '모순',
    subtitle: '인생은 탐구당하는 것이 아니라 살아가는 것이다',
    author: '양귀자',
    publisher: '쓰다',
    publishDate: '2026-08-15',
    coverImage: 'https://image.aladin.co.kr/product/2584/37/cover500/s392131969_1.jpg',
    listPrice: 17700,
    sellingPrice: 15930,
    discountRate: 10,
    rewardPoint: 880,
    format: 'paper',
    bookType: 'personal', // 개인도서: 50% = 7,965원 지원
    tags: ['베스트셀러', '한국소설', '스테디셀러', '현대문학'],
    description: '삶의 모순을 조망하는 양귀자 작가의 베스트셀러 소설. 거짓과 진실, 불행과 행복의 경계에서 펼쳐지는 삶의 통찰.',
    rating: 4.9,
    reviewCount: 148,
    badge: '소득공제',
  },
  {
    id: 'b-03',
    title: '대변동 : 위기, 선택, 변화',
    subtitle: '위기 시대의 리더십과 문명의 변곡점',
    author: '재레드 다이아몬드',
    publisher: '김영사',
    publishDate: '2026-07-20',
    coverImage: 'https://image.aladin.co.kr/product/19212/63/cover500/8934995793_1.jpg',
    listPrice: 24800,
    sellingPrice: 22320,
    discountRate: 10,
    rewardPoint: 1240,
    format: 'ebook',
    bookType: 'personal', // 개인도서: 50% = 11,160원 -> 상한 10,000원 지원
    tags: ['경영/리더십', '인문교양', '역사', '조직문화'],
    description: '역사상 가장 위대한 국가와 리더들은 결정적 위기 순간 어떻게 진단하고 해결했는가? 재레드 다이아몬드가 밝히는 성패의 결정적 선택들.',
    rating: 4.7,
    reviewCount: 89,
    badge: '소득공제',
  },
  {
    id: 'b-04',
    title: '82년생 김지영',
    subtitle: '조남주 장편소설 (추천도서)',
    author: '조남주',
    publisher: '민음사',
    publishDate: '2026-06-10',
    coverImage: 'https://image.aladin.co.kr/product/9476/48/cover500/8937473135_1.jpg',
    listPrice: 18000,
    sellingPrice: 18000,
    discountRate: 0,
    rewardPoint: 900,
    format: 'paper',
    bookType: 'recommended', // 추천도서: 100% 회사 지원 (18,000원 지원, 0원 실결제)
    tags: ['추천도서', 'B2B필독서', '현대소설', '올해의책'],
    description: '조남주 작가의 화제의 스테디셀러. 한 인물의 삶을 둘러싼 사회적 맥락과 진솔한 고백이 마음에 깊은 울림을 선사합니다.',
    rating: 4.8,
    reviewCount: 215,
    badge: '추천도서 100%',
  },
  {
    id: 'b-05',
    title: '천 개의 파랑',
    subtitle: '휴머니즘 SF의 새로운 지평',
    author: '천선란',
    publisher: '허블',
    publishDate: '2026-05-30',
    coverImage: 'https://image.aladin.co.kr/product/24895/69/cover500/k882632470_2.jpg',
    listPrice: 16000,
    sellingPrice: 14400,
    discountRate: 10,
    rewardPoint: 800,
    format: 'paper',
    bookType: 'recommended', // 추천도서: 100% 회사 지원
    tags: ['추천도서', '한국문학', 'SF소설', '따뜻한이야기'],
    description: '로봇 투데이와 기수 연재, 휴머노이드와 인간 사이의 가슴 따뜻한 연대. 천선란 작가 특유의 다정한 시선이 빛나는 소설.',
    rating: 4.9,
    reviewCount: 94,
    badge: '추천도서 100%',
  },
  {
    id: 'b-06',
    title: '알사탕',
    subtitle: '마음의 소리를 듣는 알사탕의 마법',
    author: '백희나 글·그림',
    publisher: '책읽는곰',
    publishDate: '2026-08-01',
    coverImage: 'https://image.aladin.co.kr/product/17046/70/cover500/k662534784_1.jpg',
    listPrice: 15000,
    sellingPrice: 13500,
    discountRate: 10,
    rewardPoint: 750,
    format: 'paper',
    bookType: 'recommended', // 추천도서: 100% 회사 지원
    tags: ['추천도서', '가족도서', '동화', '일러스트'],
    description: '알사탕을 입에 넣으면 들려오는 마음의 소리! 백희나 작가의 감동적인 그림책.',
    rating: 4.7,
    reviewCount: 67,
    badge: '추천도서 100%',
  },
  {
    id: 'b-07',
    title: '돈의 속성',
    subtitle: '최상위 부자가 말하는 돈에 대한 모든 것',
    author: '김승호',
    publisher: '스노우폭스북스',
    publishDate: '2026-04-12',
    coverImage: 'https://image.aladin.co.kr/product/24191/64/cover500/k562639753_1.jpg',
    listPrice: 20000,
    sellingPrice: 20000,
    discountRate: 0,
    rewardPoint: 1000,
    format: 'ebook',
    bookType: 'personal', // 개인도서: 50% = 10,000원 지원, 직원부담 10,000원
    tags: ['경제경영', '재테크', '금융투자', '자기계발'],
    description: '단순한 수익률 경쟁이 아닌, 평생 지속 가능한 부의 시스템을 구축하는 정석 투자 바이블.',
    rating: 4.6,
    reviewCount: 112,
    badge: '소득공제',
  },
  {
    id: 'b-08',
    title: '슬로 호시스 (Slow Horses)',
    subtitle: '영국 MI5 낙오자 부서의 치밀한 첩보전',
    author: '믹 헤론',
    publisher: '비채',
    publishDate: '2026-03-25',
    coverImage: 'https://image.aladin.co.kr/product/40018/75/cover500/k812130233_1.jpg',
    listPrice: 19000,
    sellingPrice: 17100,
    discountRate: 10,
    rewardPoint: 950,
    format: 'paper',
    bookType: 'personal', // 개인도서: 50% = 8,550원 지원
    tags: ['추리/스릴러', '영미소설', '첩보', '인기원작'],
    description: '드라마로도 큰 사랑을 받은 슬라우 하우스 시리즈의 첫 권. 무능한 낙오 요원들이 펼치는 날카로운 풍자와 긴장감 넘치는 첩보 반전극.',
    rating: 5.0,
    reviewCount: 58,
    badge: '소득공제',
  },
  {
    id: 'b-09',
    title: '트렌드 코리아 2025',
    subtitle: 'AI 가속화 시대 소비 트렌드의 지각변동',
    author: '김난도 외',
    publisher: '미래의창',
    publishDate: '2026-09-10',
    coverImage: 'https://image.aladin.co.kr/product/34634/14/cover500/8959897221_2.jpg',
    listPrice: 21000,
    sellingPrice: 18900,
    discountRate: 10,
    rewardPoint: 1050,
    format: 'paper',
    bookType: 'recommended', // 추천도서: 100% 회사 지원
    tags: ['추천도서', '트렌드', '경제전망', '비즈니스'],
    description: '대한민국 소비 트렌드를 선제적으로 조망하는 대표 리포트.',
    rating: 4.8,
    reviewCount: 310,
    badge: '추천도서 100%',
  },
];

export const MOCK_GIFTS: GiftItem[] = [
  {
    id: 'g-01',
    name: '[영풍 단독] 북마크 & 독서 메탈 참 세트',
    minAmount: 15000,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=160&auto=format&fit=crop&q=80',
    description: '15,000원 이상 구매 시 선택 가능 (한정 수량)',
  },
  {
    id: 'g-02',
    name: '감성 북엔드 & 패브릭 북커버',
    minAmount: 30000,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=160&auto=format&fit=crop&q=80',
    description: '30,000원 이상 구매 시 선택 가능',
  },
  {
    id: 'g-03',
    name: '사은품을 선택하지 않음',
    minAmount: 0,
    image: '',
    description: '사은품 없이 바로 진행합니다.',
  },
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    title: '자택 (기본배송지)',
    recipient: '김민서',
    phone1: '010-1234-5678',
    phone2: '02-542-0611',
    postalCode: '03154',
    roadAddress: '서울특별시 종로구 청계천로 41 (서린동, 영풍빌딩)',
    jibunAddress: '서울특별시 종로구 서린동 33 영풍빌딩',
    detailAddress: '102동 1404호',
    isDefault: true,
    deliveryMemo: '문 앞에 놓아주세요. (부재 시 연락 바랍니다)',
  },
  {
    id: 'addr-02',
    title: '회사 (영풍빌딩)',
    recipient: '김민서 대리',
    phone1: '010-1234-5678',
    postalCode: '06110',
    roadAddress: '서울특별시 강남구 강남대로 542 (논현동, 영풍빌딩)',
    jibunAddress: '서울특별시 강남구 논현동 142-3',
    detailAddress: '6층 디지털사업본부 B2B팀',
    isDefault: false,
    deliveryMemo: '경비실 또는 안내데스크에 맡겨주세요.',
  },
];
