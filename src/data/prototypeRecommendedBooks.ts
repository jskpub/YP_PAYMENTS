import { Book } from '../types';

const cover = (background: string, title: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 290"><rect width="200" height="290" rx="6" fill="${background}"/><rect x="0" width="9" height="290" fill="#000" opacity=".18"/><text x="100" y="142" fill="#fff" font-family="sans-serif" font-size="16" font-weight="700" text-anchor="middle">${title}</text><text x="100" y="260" fill="#fff" opacity=".7" font-family="sans-serif" font-size="9" text-anchor="middle">YOUNGPOONG BOOKS</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const recommended = (book: Omit<Book, 'format' | 'bookType'>): Book => ({
  ...book,
  format: 'paper',
  bookType: 'recommended',
});

export const PROTOTYPE_RECOMMENDED_BOOKS: Book[] = [
  recommended({
    id: 'rec-b01', title: '함께 자라기', subtitle: '애자일로 가는 길', author: '김창준', publisher: '인사이트', publishDate: '2018년 11월 30일', coverImage: cover('#5b382b', '함께 자라기'), listPrice: 15000, sellingPrice: 13500, discountRate: 10, rewardPoint: 675, tags: ['#애자일', '#협업', '#팀빌딩', '#코드리뷰', '#자기계발'], description: '코드 리뷰와 페어 프로그래밍 문화를 고민하는 팀에게 이달의 1순위로 추천합니다.', rating: 4.8, reviewCount: 412, badge: 'CEO 픽',
  }),
  recommended({
    id: 'rec-b02', title: '최선의 하루', subtitle: '지치지 않고 오래 가는 법', author: '김재원', publisher: '다산북스', publishDate: '2026년 03월 14일', coverImage: cover('#3f566f', '최선의 하루'), listPrice: 17000, sellingPrice: 15300, discountRate: 10, rewardPoint: 765, tags: ['#번아웃', '#회복', '#워라밸', '#에세이', '#마음챙김'], description: '연차와 무관하게 요즘 많은 분들이 공감하시는 주제라 이달 추천도서로 골랐습니다.', rating: 4.5, reviewCount: 128,
  }),
  recommended({
    id: 'rec-b03', title: '소년이 온다', author: '한강', publisher: '창비', publishDate: '2014년 05월 19일', coverImage: cover('#554368', '소년이 온다'), listPrice: 15000, sellingPrice: 13500, discountRate: 10, rewardPoint: 675, tags: ['#한강', '#노벨문학상', '#광주', '#한국소설', '#현대사'], description: '부서 구분 없이 모두에게 권하고 싶은 이 시대의 필독 소설입니다.', rating: 4.9, reviewCount: 1893,
  }),
  recommended({
    id: 'rec-b04', title: '실무형 리더십', subtitle: '처음 팀장이 된 사람들을 위한 안내서', author: '이랑주', publisher: '비즈니스북스', publishDate: '2026년 01월 22일', coverImage: cover('#365d4a', '실무형 리더십'), listPrice: 18000, sellingPrice: 16200, discountRate: 10, rewardPoint: 810, tags: ['#리더십', '#팀장', '#조직관리', '#피드백', '#경제경영'], description: '올해 신임 팀장이 많은 조직 특성을 고려해 인사팀 요청으로 선정했습니다.', rating: 4.4, reviewCount: 76,
  }),
  recommended({
    id: 'rec-b05', title: '세이노의 가르침', author: '세이노', publisher: '데이원', publishDate: '2023년 03월 02일', coverImage: cover('#8a6a35', '세이노의 가르침'), listPrice: 7200, sellingPrice: 7200, discountRate: 0, rewardPoint: 360, tags: ['#자기계발', '#부자되는법', '#일머리', '#현실조언', '#베스트셀러'], description: '매달 베스트셀러 상위권을 지키고 있는 화제작이라 소개합니다.', rating: 4.3, reviewCount: 2417,
  }),
  recommended({
    id: 'rec-b06', title: '초격차', subtitle: '리더의 질문', author: '권오현', publisher: '쌤앤파커스', publishDate: '2018년 09월 20일', coverImage: cover('#555b78', '초격차'), listPrice: 17000, sellingPrice: 15300, discountRate: 10, rewardPoint: 765, tags: ['#경영전략', '#리더십', '#조직문화', '#삼성', '#경제경영'], description: '영업 전략 수립 시기에 맞춰 영업팀에서 직접 요청한 도서입니다.', rating: 4.6, reviewCount: 534,
  }),
  recommended({
    id: 'rec-b07', title: '숫자 감각', subtitle: '비전공자를 위한 실무 재무', author: '박성현', publisher: '한빛비즈', publishDate: '2026년 05월 08일', coverImage: cover('#77404a', '숫자 감각'), listPrice: 19000, sellingPrice: 17100, discountRate: 10, rewardPoint: 855, tags: ['#재무', '#회계', '#손익계산서', '#실무입문', '#경제경영'], description: '연말 예산 시즌을 앞두고 재무팀 관리자 선정으로 이달 목록에 올렸습니다.', rating: 4.2, reviewCount: 41,
  }),
  recommended({
    id: 'rec-b08', title: '물고기는 존재하지 않는다', subtitle: '상실, 사랑 그리고 숨어 있는 삶의 질서에 관한 이야기', author: '룰루 밀러', publisher: '곰출판', publishDate: '2021년 12월 17일', coverImage: cover('#3e6b6b', '물고기는 존재하지 않는다'), listPrice: 17000, sellingPrice: 15300, discountRate: 10, rewardPoint: 765, tags: ['#논픽션', '#교양과학', '#분류학', '#에세이', '#인생책'], description: '장르 편식 없이 다양한 책을 만나셨으면 하는 마음으로 골랐습니다.', rating: 4.7, reviewCount: 967,
  }),
];
