import React from 'react';
import {BizMallBrandLogo} from './BizMallBrandLogo';

export const BizMallFooter: React.FC = () => (
  <footer className="border-t border-yp-gray-200 bg-white px-4 py-8 text-xs text-yp-gray-500">
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col items-center justify-between gap-4 border-b border-yp-gray-100 pb-4 sm:flex-row">
        <BizMallBrandLogo size="sm" />
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-yp-gray-700">
          <span className="cursor-pointer hover:text-yp-ink">회사소개</span>
          <span className="text-yp-gray-200">|</span>
          <span className="cursor-pointer hover:text-yp-ink">이용약관</span>
          <span className="text-yp-gray-200">|</span>
          <span className="cursor-pointer font-bold text-yp-ink">개인정보처리방침</span>
          <span className="text-yp-gray-200">|</span>
          <span className="cursor-pointer hover:text-yp-ink">B2B 법인 제휴 문의</span>
          <span className="text-yp-gray-200">|</span>
          <span className="cursor-pointer hover:text-yp-ink">고객센터 1544-9020</span>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-2 text-[11px] text-yp-gray-400 sm:flex-row sm:items-center">
        <p>
          (주)영풍문고 B2B 법인사업본부 | 서울특별시 종로구 청계천로 41 영풍빌딩 | 사업자등록번호:
          101-81-37597
          <br />본 화면은 기업 독서 프로그램 기획용 프로토타입으로, 실제 서비스와 다를 수 있습니다.
        </p>
        <p className="shrink-0 font-medium text-yp-gray-500">
          © YOUNGPOONG BOOKSTORE CO., LTD. BIZ MALL.
        </p>
      </div>
    </div>
  </footer>
);
