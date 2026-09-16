import React from 'react';
import {Book} from '../types';

interface BookCoverProps {
  book: Book;
  className?: string;
  titleClassName?: string;
}

/**
 * 배경색 위에 제목을 얹어 표지를 그린다. 도서마다 실제 표지 이미지 출처가 제각각이라
 * (스톡 사진 등) 목록 전체의 톤을 통일하기 위해 coverImage 유무와 상관없이 항상 이 방식으로 그린다.
 */
export const BookCover: React.FC<BookCoverProps> = ({
  book,
  className = '',
  titleClassName = 'text-sm',
}) => (
  <div
    className={`relative flex items-center justify-center overflow-hidden rounded ${className}`}
    style={{background: book.coverBackground}}
  >
    <span
      className="pointer-events-none absolute inset-y-0 left-0 w-2.5 rounded-l"
      style={{
        background:
          'linear-gradient(to right, rgba(0,0,0,.30), rgba(255,255,255,.14) 60%, rgba(255,255,255,0))',
      }}
    />
    <span
      className={`break-keep px-4 text-center font-extrabold leading-snug text-white ${titleClassName}`}
      style={{textShadow: '0 2px 6px rgba(0,0,0,.35)'}}
    >
      {book.title}
    </span>
  </div>
);
