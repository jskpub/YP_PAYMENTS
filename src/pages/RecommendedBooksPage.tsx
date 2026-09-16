import React from 'react';
import { Check, ChevronRight, Heart, Quote, ShoppingCart, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const RecommendedBooksPage: React.FC = () => {
  const { books, cart, addToCart, removeFromCart, setActivePage, setSelectedBookForDetail, subsidyLedger } = useShop();

  const recommendedBooks = books.filter((book) => book.bookType === 'recommended');
  const recommendedInCart = cart.find((item) => item.book.bookType === 'recommended');
  const remainingCount = subsidyLedger.recommendedUsed || recommendedInCart ? 0 : 1;
  const totalReaders = recommendedBooks.reduce((total, book) => total + book.reviewCount, 0);

  return (
    <div className='w-full bg-white text-[#181718]'>
      <section className='bg-gradient-to-br from-[#8d1b12] via-[#df0000] to-[#c53a2b] px-6 py-14 text-center text-white'>
        <p className='text-sm tracking-[2px] text-[#ffd9d6]'>도서비 100% 지원</p>
        <h1 className='mt-2 text-4xl font-extrabold leading-tight sm:text-5xl'>9월 추천도서</h1>
      </section>

      <div className='bg-[#363636] px-6 py-5 text-center text-lg font-semibold text-white'>
        {recommendedInCart ? (
          <>
            이번 달 <b className='text-[#ff9d92]'>『{recommendedInCart.book.title}』</b>를 장바구니에 담았어요
          </>
        ) : (
          <>
            지금 우리 회사 <b className='text-[#ff9d92]'>{totalReaders.toLocaleString()}</b>명이 이달의 책을 읽는 중
          </>
        )}
      </div>

      <main className='mx-auto w-full max-w-[1200px] px-4 py-12'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>이달의 추천도서</h2>
            <p className='mt-1.5 text-sm text-[#80888a]'>우리 회사 관리자가 고른 추천도서입니다. 한 달에 한 권, 회사가 전액 지원합니다.</p>
          </div>
          <span className='rounded-full bg-[#ffebeb] px-3 py-1.5 text-xs font-bold text-[#df0000]'>이번 달 남은 추천도서 {remainingCount}권</span>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {recommendedBooks.map((book, index) => {
            const inCart = cart.some((item) => item.book.id === book.id);
            const isBlocked = remainingCount === 0 && !inCart;
            return (
              <article key={book.id} className='flex flex-col rounded-2xl border border-[#cbd2d4] bg-white p-6 transition-shadow hover:shadow-md'>
                <div className='flex gap-5'>
                  <div className='relative shrink-0'>
                    {index === 0 && <span className='absolute -left-3 -top-3 z-10 -rotate-6 rounded bg-[#df0000] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md'>이번 달 PICK</span>}
                    <button type='button' onClick={() => setSelectedBookForDetail(book)}>
                      <img src={book.coverImage} alt={book.title} className='h-44 w-32 rounded object-cover bg-[#f6f6f6] shadow-lg' />
                    </button>
                  </div>
                  <div className='flex min-w-0 flex-1 flex-col gap-2'>
                    <span className='w-fit rounded bg-[#f6f6f6] px-2 py-0.5 text-[11px] font-bold text-[#595959]'>임직원 추천도서</span>
                    <button type='button' onClick={() => setSelectedBookForDetail(book)} className='text-left text-lg font-bold leading-snug hover:text-[#df0000]'>
                      {book.title}
                    </button>
                    <p className='text-sm text-[#80888a]'>
                      {book.author} · {book.publisher}
                    </p>
                    <p className='text-xs text-[#9c9c9c]'>
                      {book.publishDate} · {book.tags[0]}
                    </p>
                    <div className='flex items-center gap-1.5 text-xs'>
                      <Star className='h-3.5 w-3.5 fill-current text-amber-500' />
                      <span className='font-bold text-[#595959]'>{book.rating}</span>
                      <span className='text-[#9c9c9c]'>리뷰 {book.reviewCount.toLocaleString()}</span>
                    </div>
                    <div className='mt-auto pt-1'>
                      <span className='mr-1.5 text-xs text-[#9c9c9c] line-through'>{book.listPrice.toLocaleString()}원</span>
                      <span className='text-base font-extrabold'>{book.sellingPrice.toLocaleString()}원</span>
                      <span className='ml-2 rounded bg-[#e8f5ef] px-1.5 py-0.5 text-[11px] font-bold text-[#1f976b]'>직원 부담 0원</span>
                    </div>
                  </div>
                </div>

                <div className='mt-5 min-h-32 rounded-xl bg-[#f6f6f6] p-4'>
                  <p className='text-sm leading-relaxed text-[#3c4142]'>{book.description}</p>
                  <div className='mt-3 flex gap-2 border-t border-[#dadada] pt-3 text-xs text-[#80888a]'>
                    <Quote className='h-3.5 w-3.5 shrink-0 text-[#df0000]' />
                    회사와 함께 읽는 이번 달의 큐레이션 도서입니다.
                  </div>
                </div>

                <div className='mt-4 border-t border-[#edf0f1] pt-4 text-sm text-[#80888a]'>
                  <Heart className='mr-1 inline h-4 w-4 fill-current text-[#e4453a]' />
                  이번 달 {book.reviewCount}명 관심
                </div>
                <div className='mt-4 grid grid-cols-2 gap-2'>
                  {isBlocked ? (
                    <span className='col-span-2 flex h-12 items-center justify-center rounded-lg bg-[#f6f6f6] px-3 text-center text-sm font-semibold text-[#9c9c9c]'>이번 달 추천도서 지원을 사용했어요</span>
                  ) : (
                    <>
                      <button
                        type='button'
                        onClick={() => (inCart ? removeFromCart(cart.find((item) => item.book.id === book.id)!.id) : addToCart(book))}
                        className={`flex h-12 items-center justify-center gap-1.5 rounded-lg text-sm font-bold ${inCart ? 'border-2 border-[#df0000] text-[#df0000]' : 'border border-[#c3c2c2] text-[#181718]'}`}
                      >
                        {inCart ? <Check className='h-4 w-4' /> : <ShoppingCart className='h-4 w-4' />}
                        {inCart ? '담음 · 빼기' : '장바구니 담기'}
                      </button>
                      <button type='button' onClick={() => addToCart(book, 'paper', 1, true)} className='h-12 rounded-lg bg-[#df0000] text-sm font-bold text-white hover:bg-[#ea2e2e]'>
                        구매하기
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <button type='button' onClick={() => setActivePage('home')} className='mx-auto mt-10 flex items-center gap-1 text-sm font-semibold text-[#595959] hover:text-[#df0000]'>
          <ChevronRight className='h-4 w-4 rotate-180' />
          비즈몰 홈으로 돌아가기
        </button>
      </main>
    </div>
  );
};
