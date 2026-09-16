import React from 'react';

interface BookCoverImageProps {
  title: string;
  coverImage?: string;
  coverBackground?: string;
  className?: string;
  titleClassName?: string;
}

/**
 * 표지 이미지가 있으면 이미지를, 없으면(B2B프로토타입에서 가져온 도서 등) 배경색 위에 제목을 얹어
 * 그린다. 추천도서/베스트/신상품 목록에서 쓰는 표지 통일 방식을, 그 도서가 장바구니·결제·주문내역
 * 등 YP 자체 화면으로 넘어갔을 때도 그대로 유지하기 위한 공용 컴포넌트.
 */
export const BookCoverImage: React.FC<BookCoverImageProps> = ({ title, coverImage, coverBackground, className = '', titleClassName = 'text-xs' }) => {
  if (coverImage) {
    return <img src={coverImage} alt={title} className={`object-contain ${className}`} />;
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded ${className}`} style={{ background: coverBackground || '#595959' }}>
      <span className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 rounded-l`} style={{ background: 'linear-gradient(to right, rgba(0,0,0,.30), rgba(255,255,255,.14) 60%, rgba(255,255,255,0))' }} />
      <span className={`break-keep px-1.5 text-center font-extrabold leading-snug text-white ${titleClassName}`} style={{ textShadow: '0 2px 6px rgba(0,0,0,.35)' }}>
        {title}
      </span>
    </div>
  );
};
