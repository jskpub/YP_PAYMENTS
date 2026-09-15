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
    title: '소설 보다 가을 2026',
    subtitle: '문학과지성사 계간 신작 단편선',
    author: '문학과지성사 편집부',
    publisher: '문학과지성사',
    publishDate: '2026-09-01',
    coverImage: createBookCover('#d96b43', '소설 보다 가을', '김지연 외', '#fff6ee'),
    listPrice: 5500,
    sellingPrice: 4950,
    discountRate: 10,
    rewardPoint: 270,
    format: 'paper',
    bookType: 'personal', // 개인도서
    tags: ['한국소설', '문학선집', '계간지', '가을신작'],
    description: '젊은 작가들의 가장 빛나는 순간을 포착한 단편 소설 모음집. 가을의 정취와 문학적 통찰이 어우러진 깊이 있는 작품들로 채워져 있습니다.',
    rating: 4.8,
    reviewCount: 32,
    badge: '소득공제'
  },
  {
    id: 'b-02',
    title: '수족관',
    subtitle: '도심 속 기억과 상실의 풍경',
    author: '민음사 편집부',
    publisher: '민음사',
    publishDate: '2026-08-15',
    coverImage: createBookCover('#2a5f78', '수족관', '이주희 지음', '#e3f3ff'),
    listPrice: 17700,
    sellingPrice: 15930,
    discountRate: 10,
    rewardPoint: 880,
    format: 'paper',
    bookType: 'personal', // 개인도서: 50% = 7,965원 지원
    tags: ['베스트셀러', '한국소설', '스테디셀러', '현대문학'],
    description: '빛과 수면 아래 침묵하는 사람들의 이야기. 거대한 도심 수족관을 배경으로 얽히고설킨 현대인의 고독과 온기를 섬세하게 조명합니다.',
    rating: 4.9,
    reviewCount: 148,
    badge: '소득공제'
  },
  {
    id: 'b-03',
    title: '리더는 언제 차이를 만드는가',
    subtitle: '위기 시대의 리더십과 문명의 변곡점',
    author: '재레드 다이아몬드',
    publisher: '김영사',
    publishDate: '2026-07-20',
    coverImage: createBookCover('#1e293b', '리더는 언제 차이를', '재레드 다이아몬드', '#f8fafc'),
    listPrice: 24800,
    sellingPrice: 22320,
    discountRate: 10,
    rewardPoint: 1240,
    format: 'paper',
    bookType: 'personal', // 개인도서: 50% = 11,160원 -> 상한 10,000원 지원
    tags: ['경영/리더십', '인문교양', '역사', '조직문화'],
    description: '역사상 가장 위대한 리더들은 결정적 순간 어떻게 행동했는가? 재레드 다이아몬드가 밝히는 국가와 기업의 성패를 가른 결정적 선택들.',
    rating: 4.7,
    reviewCount: 89,
    badge: '소득공제'
  },
  {
    id: 'b-04',
    title: '제이',
    subtitle: '내밀한 감정의 궤적을 쫓는 이야기',
    author: '조남주',
    publisher: '민음사',
    publishDate: '2026-06-10',
    coverImage: createBookCover('#3b7a8a', '제이', '조남주 장편소설', '#effbff'),
    listPrice: 18000,
    sellingPrice: 16200,
    discountRate: 10,
    rewardPoint: 900,
    format: 'paper',
    bookType: 'recommended', // 추천도서: 100% 회사 지원 (0원 실결제)
    tags: ['추천도서', 'B2B필독서', '현대소설', '올해의책'],
    description: '조남주 작가가 3년 만에 선보이는 깊이 있는 장편소설. 한 인물의 삶을 둘러싼 관계의 파동과 진솔한 고백이 마음에 깊은 울림을 선사합니다.',
    rating: 4.8,
    reviewCount: 215,
    badge: '추천도서 100%'
  },
  {
    id: 'b-05',
    title: '팡 공원 농구하는 소녀',
    subtitle: '자유와 성장의 골목길 스토리',
    author: '천선란',
    publisher: '창비',
    publishDate: '2026-05-30',
    coverImage: createBookCover('#34795e', '팡 공원 농구하는 소녀', '천선란 소설집', '#edfff5'),
    listPrice: 16000,
    sellingPrice: 14400,
    discountRate: 10,
    rewardPoint: 800,
    format: 'paper',
    bookType: 'recommended', // 추천도서: 100% 회사 지원
    tags: ['추천도서', '청소년문학', '성장소설', '따뜻한이야기'],
    description: '공원의 낡은 농구 골대 아래에서 시작된 우정과 꿈. 천선란 작가 특유의 따스한 시선으로 그려낸 찬란한 청춘의 파노라마.',
    rating: 4.9,
    reviewCount: 94,
    badge: '추천도서 100%'
  },
  {
    id: 'b-06',
    title: '소원 송편 - 보름달 대소동',
    subtitle: '전통과 상상력이 만나는 환상동화',
    author: '김지현 글/그림',
    publisher: '웅진주니어',
    publishDate: '2026-08-01',
    coverImage: createBookCover('#d4a02e', '소원 송편', '김지현 글·그림', '#fffbe6'),
    listPrice: 15000,
    sellingPrice: 13500,
    discountRate: 10,
    rewardPoint: 750,
    format: 'paper',
    bookType: 'recommended', // 추천도서: 100% 회사 지원
    tags: ['추천도서', '가족도서', '동화', '일러스트'],
    description: '보름달 밤, 소원을 빌며 빚는 비밀 송편의 마법! 온 가족이 함께 읽으며 따뜻한 미소를 지을 수 있는 보석 같은 그림책.',
    rating: 4.7,
    reviewCount: 67,
    badge: '추천도서 100%'
  },
  {
    id: 'b-07',
    title: '인생을 바꾸는 투자학개론',
    subtitle: '불확실성의 시대, 자산을 지키고 키우는 법',
    author: '한정수 (세상학개론)',
    publisher: '21세기북스',
    publishDate: '2026-04-12',
    coverImage: createBookCover('#1a1a2e', '인생을 바꾸는 투자학개론', '한정수 지음', '#e6e6fa'),
    listPrice: 20000,
    sellingPrice: 18000,
    discountRate: 10,
    rewardPoint: 1000,
    format: 'paper',
    bookType: 'personal', // 개인도서: 50% = 9,000원 지원, 직원부담 9,000원
    tags: ['경제경영', '재테크', '금융투자', '자기계발'],
    description: '단순한 수익률 경쟁이 아닌, 평생 지속 가능한 부의 시스템을 구축하는 정석 투자 바이블. 기본부터 포트폴리오 다변화까지 총망라.',
    rating: 4.6,
    reviewCount: 112,
    badge: '소득공제'
  },
  {
    id: 'b-08',
    title: '슬로 호시스 (Slow Horses)',
    subtitle: '영국 MI5 낙오자 부서의 치밀한 첩보전',
    author: '믹 헤론',
    publisher: '황금가지',
    publishDate: '2026-03-25',
    coverImage: createBookCover('#314455', '슬로 호시스', '믹 헤론 장편소설', '#f0f4f8'),
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
    badge: '소득공제'
  },
  {
    id: 'b-09',
    title: '트렌드 코리아 2027',
    subtitle: 'AI 가속화 시대 소비 트렌드의 지각변동',
    author: '김난도 외',
    publisher: '미래의창',
    publishDate: '2026-09-10',
    coverImage: createBookCover('#a82828', '트렌드 코리아 2027', '김난도 외', '#ffebeb'),
    listPrice: 21000,
    sellingPrice: 18900,
    discountRate: 10,
    rewardPoint: 1050,
    format: 'paper',
    bookType: 'recommended', // 추천도서: 100% 회사 지원
    tags: ['추천도서', '트렌드', '경제전망', '비즈니스'],
    description: '다가올 2027년의 메가트렌드와 비즈니스 기회를 선제적으로 조망하는 대한민국 대표 트렌드 리포트.',
    rating: 4.8,
    reviewCount: 310,
    badge: '추천도서 100%'
  }
];

export const MOCK_GIFTS: GiftItem[] = [
  {
    id: 'g-01',
    name: '[영풍 단독] 북마크 & 독서 메탈 참 세트',
    minAmount: 15000,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=160&auto=format&fit=crop&q=80',
    description: '15,000원 이상 구매 시 선택 가능 (한정 수량)'
  },
  {
    id: 'g-02',
    name: '감성 북엔드 & 패브릭 북커버',
    minAmount: 30000,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=160&auto=format&fit=crop&q=80',
    description: '30,000원 이상 구매 시 선택 가능'
  },
  {
    id: 'g-03',
    name: '사은품을 선택하지 않음',
    minAmount: 0,
    image: '',
    description: '사은품 없이 바로 진행합니다.'
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    title: '자택 (기본배송지)',
    recipient: '김지선',
    phone1: '010-9243-6290',
    phone2: '02-542-0611',
    postalCode: '03154',
    roadAddress: '서울특별시 종로구 종로 1 (교보빌딩 부근 영풍문고 종각종로)',
    jibunAddress: '서울특별시 종로구 종로1가 24',
    detailAddress: '102동 1404호',
    isDefault: true,
    deliveryMemo: '문 앞에 놓아주세요. (부재 시 연락 바랍니다)'
  },
  {
    id: 'addr-02',
    title: '회사 (영풍빌딩)',
    recipient: '김지선 대리',
    phone1: '010-9243-6290',
    postalCode: '06110',
    roadAddress: '서울특별시 강남구 강남대로 542 (논현동, 영풍빌딩)',
    jibunAddress: '서울특별시 강남구 논현동 142-3',
    detailAddress: '6층 디지털사업본부 B2B팀',
    isDefault: false,
    deliveryMemo: '경비실 또는 안내데스크에 맡겨주세요.'
  }
];
