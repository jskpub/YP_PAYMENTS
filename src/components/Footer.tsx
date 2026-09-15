import React from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronRight, Phone, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setMyPageTab } = useShop();

  return (
    <footer className="w-full bg-[#f9f9f9] border-t border-[#dadada] pt-10 pb-12 text-[#303030] text-xs select-none">
      <div className="max-w-[1280px] mx-auto px-4">
        
        {/* Above row */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 pb-8 border-b border-[#dadada]/60">
          
          {/* Customer Service Info */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-[#80888a]">고객센터</div>
            <div className="text-3xl font-bold tracking-tight text-[#181718] flex items-center gap-2">
              <Phone className="w-6 h-6 text-[#df0000]" />
              1544-9020
            </div>
            <div className="text-xs text-[#595959] space-y-1">
              <p>상담가능시간: 평일 09:00 ~ 18:00 / 점심시간 12:15 ~ 13:15</p>
              <p>대표 메일: customer@ypbooks.co.kr</p>
              <p>대량 주문: webmaster@ypbooks.co.kr</p>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setActivePage('mypage');
                  setMyPageTab('orders');
                }}
                className="px-3 py-1.5 rounded bg-[#eee] hover:bg-[#e2e2e2] text-xs text-[#303030] flex items-center gap-1 font-medium transition-colors"
              >
                FAQ <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setActivePage('mypage');
                  setMyPageTab('orders');
                }}
                className="px-3 py-1.5 rounded bg-[#eee] hover:bg-[#e2e2e2] text-xs text-[#303030] flex items-center gap-1 font-medium transition-colors"
              >
                1:1 고객상담 <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActivePage('explore')}
                className="px-3 py-1.5 rounded bg-[#eee] hover:bg-[#e2e2e2] text-xs text-[#303030] flex items-center gap-1 font-medium transition-colors"
              >
                입점문의 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-[#595959]">
            <div>
              <h4 className="font-bold text-[#181718] mb-2.5">영풍문고</h4>
              <ul className="space-y-1.5">
                <li><a href="#about" className="hover:text-[#181718]">회사소개</a></li>
                <li><a href="#store" className="hover:text-[#181718]">매장안내</a></li>
                <li><a href="#nowdream" className="hover:text-[#181718]">나우드림</a></li>
                <li><span className="text-[#1f976b] font-semibold">B2B 독서지원</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#181718] mb-2.5">비즈니스</h4>
              <ul className="space-y-1.5">
                <li><a href="#partner" className="hover:text-[#181718]">입점문의</a></li>
                <li><a href="#ad" className="hover:text-[#181718]">광고안내</a></li>
                <li><a href="#scm" className="text-[#df0000] font-semibold hover:underline">상품관리SCM</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#181718] mb-2.5">쇼핑도우미</h4>
              <ul className="space-y-1.5">
                <li><a href="#search" className="hover:text-[#181718]">도서검색</a></li>
                <li><a href="#member" className="hover:text-[#181718]">회원등급 혜택</a></li>
                <li>
                  <button
                    onClick={() => {
                      setActivePage('mypage');
                      setMyPageTab('orders');
                    }}
                    className="hover:text-[#181718] text-left"
                  >
                    주문/배송조회
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActivePage('mypage');
                      setMyPageTab('refund');
                    }}
                    className="hover:text-[#181718] text-left"
                  >
                    취소/교환/환불
                  </button>
                </li>
                <li><a href="#point" className="hover:text-[#181718]">적립금 사용</a></li>
                <li><a href="#coupon" className="hover:text-[#181718]">교환권 사용</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#181718] mb-2.5">고객지원</h4>
              <ul className="space-y-1.5">
                <li><a href="#cs" className="hover:text-[#181718]">1:1 고객상담</a></li>
                <li><a href="#faq" className="hover:text-[#181718]">자주 묻는 질문(FAQ)</a></li>
                <li><a href="#notice" className="hover:text-[#181718]">공지사항</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Below row (Company information, policies & copyright) */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#df0000] flex items-center justify-center text-white font-extrabold text-xs">
              YP
            </div>
            <div className="font-bold text-[#181718] text-sm">
              서점다운서점 <span className="text-[#df0000]">영풍문고</span>
            </div>
          </div>

          {/* Policy links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#595959]">
            <a href="#terms" className="hover:text-[#181718]">이용약관</a>
            <span className="text-[#dadada]">|</span>
            <a href="#privacy" className="font-bold text-[#181718] hover:underline">개인정보처리방침</a>
            <span className="text-[#dadada]">|</span>
            <a href="#video" className="hover:text-[#181718]">영상정보관리방침</a>
            <span className="text-[#dadada]">|</span>
            <a href="#youth" className="hover:text-[#181718]">청소년보호정책</a>
            <span className="text-[#dadada]">|</span>
            <a href="#email" className="hover:text-[#181718]">이메일 무단 수집거부</a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full hover:bg-[#eee] text-[#555a5c]"
              aria-label="인스타그램"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Legal text */}
        <div className="mt-4 text-[11px] text-[#80888a] space-y-1 leading-relaxed">
          <p>
            (주) 영풍문고 | 주소: 서울특별시 강남구 강남대로 542(논현동, 영풍빌딩) (우)06110 | 대표이사: 김경환
          </p>
          <p>
            사업자 등록번호: 773-86-01800 <span className="text-[#df0000] underline cursor-pointer">[사업자정보확인]</span> | 통신판매등록번호: 2024-서울강남-06241 | 개인정보관리 책임자: 조순제
          </p>
          <p className="pt-1 text-[#9c9c9c]">
            COPYRIGHT © YOUNGPOONG BOOKSTORE INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};
