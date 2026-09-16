import React from 'react';
import {Book} from '../types';

interface BookCoverProps {
  book: Book;
  className?: string;
  titleClassName?: string;
}

/**
 * 표지 이미지가 있으면 이미지를, 없으면 배경 위에 제목을 얹어 표지를 그린다.
 * 추천도서는 실제 표지 이미지 제공 전이라 후자로 표시된다.
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
    {book.coverImage ? (
      <img
        src={book.coverImage}
        alt={book.title}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
      />
    ) : (
      <span
        className={`break-keep px-4 text-center font-extrabold leading-snug text-white ${titleClassName}`}
        style={{textShadow: '0 2px 6px rgba(0,0,0,.35)'}}
      >
        {book.title}
      </span>
    )}
  </div>
);
