import React, { useState } from 'react';
import { X, Search, Check, Sparkles, BookOpen } from 'lucide-react';
import { recommendedBook100List } from '../mockData';
import { BookItem } from '../types';

interface RecommendedBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: any) => void;
}

export const RecommendedBooksModal: React.FC<RecommendedBooksModalProps> = ({ isOpen, onClose, onSelectBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  if (!isOpen) return null;

  const categories = ['전체', '자기계발/IT', '인문/심리', 'IT/개발', '경영/전략', '리더십', '역사/인문'];

  const filtered = recommendedBook100List.filter((b) => {
    const matchesSearch = b.title.includes(searchTerm) || b.author.includes(searchTerm);
    const matchesCat = selectedCategory === '전체' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs'>
      <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150'>
        {/* 모달 헤더 */}
        <div className='p-4 bg-emerald-700 text-white flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <BookOpen size={20} />
            <div>
              <h3 className='font-bold text-base'>사내 권장도서 100선 목록</h3>
              <p className='text-xs text-emerald-100'>100% 임직원 전액 지원 대상 (정가 전액 무료 지원, 본인부담금 0원)</p>
            </div>
          </div>
          <button type='button' onClick={onClose} className='p-1 hover:bg-emerald-800 rounded-full cursor-pointer'>
            <X size={20} />
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className='p-4 border-b border-gray-200 bg-gray-50 space-y-2 text-xs'>
          <div className='relative'>
            <input type='text' placeholder='도서명 또는 저자 검색' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500' />
            <Search size={15} className='absolute right-2.5 top-2.5 text-gray-400' />
          </div>

          <div className='flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none'>
            {categories.map((cat) => (
              <button
                key={cat}
                type='button'
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap ${selectedCategory === cat ? 'bg-emerald-700 text-white font-bold' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 도서 목록 */}
        <div className='flex-1 overflow-y-auto p-4 divide-y divide-gray-100 text-xs'>
          {filtered.map((book) => (
            <div key={book.id} className='py-3 flex items-center justify-between gap-4 hover:bg-gray-50/80 px-2 rounded-lg transition-colors'>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px]'>{book.category}</span>
                  <span className='text-emerald-700 font-bold text-[12px]'>100% 무료 지원</span>
                </div>
                <h4 className='font-bold text-gray-900 text-sm'>{book.title}</h4>
                <p className='text-gray-500 text-xs'>
                  {book.publisher} | {book.author} 저 · 정가 {book.price.toLocaleString()}원
                </p>
              </div>

              <button
                type='button'
                onClick={() => {
                  onSelectBook(book);
                  onClose();
                }}
                className='px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs cursor-pointer shadow-xs shrink-0'
              >
                장바구니 담기
              </button>
            </div>
          ))}
        </div>

        {/* 모달 푸터 */}
        <div className='p-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500'>사내 권장도서는 반기당 1권에 한해 전액 무료(본인부담금 0원)로 지원됩니다.</div>
      </div>
    </div>
  );
};
