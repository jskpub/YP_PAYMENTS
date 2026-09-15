import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Book, BookFormat } from '../types';
import { Check, Info, ShoppingCart, CreditCard, Sparkles, BookOpen, Star, Award, ChevronRight } from 'lucide-react';

export const BookExplorePage: React.FC = () => {
  const { books, addToCart, setActivePage, subsidyLedger, calculateBookSubsidy } = useShop();
  const [filterType, setFilterType] = useState<'all' | 'recommended' | 'personal'>('all');
  const [selectedFormat, setSelectedFormat] = useState<Record<string, BookFormat>>({});
  const [activeQuickDetailBook, setActiveQuickDetailBook] = useState<Book | null>(null);

  const filteredBooks = books.filter((b) => {
    if (filterType === 'recommended') return b.bookType === 'recommended';
    if (filterType === 'personal') return b.bookType === 'personal';
    return true;
  });

  const getFormat = (bookId: string): BookFormat => selectedFormat[bookId] || 'paper';
  const handleFormatChange = (bookId: string, format: BookFormat) => {
    setSelectedFormat((prev) => ({ ...prev, [bookId]: format }));
  };

  return (
    <div className="w-full bg-[#f6f6f6] min-h-screen py-8">
      <div className="max-w-[1280px] mx-auto px-4 space-y-6">

        {/* Top B2B Program Announcement Banner */}
        <div className="bg-gradient-to-r from-[#181718] to-[#363636] text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-[#df0000] text-white text-xs font-bold px-2.5 py-0.5 rounded">
                B2B 기업 독서지원
              </span>
              <span className="text-xs text-[#cbd2d4]">임직원 복합결제 프로그램</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              2026년 9월 독서 지원 프로그램 안내
            </h1>
            <p className="text-xs sm:text-sm text-[#cbd2d4] leading-relaxed">
              • <strong>추천도서</strong>: 회사 지원금 100% 전액 지원 (월 1권, 직원 실결제 0원)<br />
              • <strong>개인도서</strong>: 도서가격의 50% 지원 (월 1권, 최대 10,000원 한도, 초과분 직원 결제)
            </p>
          </div>

          {/* Current Month Support Status Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg min-w-[280px] space-y-2 text-xs">
            <div className="flex justify-between items-center text-neutral-300">
              <span>9월 지원금 잔여 한도</span>
              <span className="text-sm font-bold text-white">
                {subsidyLedger.remainingSubsidy.toLocaleString()}원 / {subsidyLedger.monthlyLimit.toLocaleString()}원
              </span>
            </div>
            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1f976b] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((subsidyLedger.totalUsedSubsidy / subsidyLedger.monthlyLimit) * 100)
                  )}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between pt-1 text-[11px]">
              <span className={subsidyLedger.recommendedUsed ? 'text-neutral-400 line-through' : 'text-[#a3e635] font-semibold'}>
                {subsidyLedger.recommendedUsed ? '✓ 추천도서 사용완료' : '● 추천도서 잔여 1권'}
              </span>
              <span className={subsidyLedger.personalUsed ? 'text-neutral-400 line-through' : 'text-[#38bdf8] font-semibold'}>
                {subsidyLedger.personalUsed ? '✓ 개인도서 사용완료' : '● 개인도서 잔여 1권'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-[#cbd2d4]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filterType === 'all'
                ? 'bg-[#181718] text-white shadow-sm'
                : 'bg-[#f6f6f6] text-[#595959] hover:bg-[#edf0f1]'
                }`}
            >
              전체 도서 ({books.length})
            </button>
            <button
              onClick={() => setFilterType('recommended')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${filterType === 'recommended'
                ? 'bg-[#df0000] text-white shadow-sm'
                : 'bg-[#f6f6f6] text-[#595959] hover:bg-[#edf0f1]'
                }`}
            >
              <Award className="w-4 h-4" />
              추천도서 (회사 100% 지원)
            </button>
            <button
              onClick={() => setFilterType('personal')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${filterType === 'personal'
                ? 'bg-[#1f976b] text-white shadow-sm'
                : 'bg-[#f6f6f6] text-[#595959] hover:bg-[#edf0f1]'
                }`}
            >
              <Sparkles className="w-4 h-4" />
              개인도서 (50% 복합지원)
            </button>
          </div>

          <div className="text-xs text-[#80888a]">
            * 도서를 선택하시면 실시간 지원금 계산 결과를 확인하실 수 있습니다.
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const format = getFormat(book.id);
            const { companySubsidy, employeePayment, ruleExplanation, canApply } = calculateBookSubsidy(book, format, 1);
            const isRecommended = book.bookType === 'recommended';

            return (
              <div
                key={book.id}
                className="bg-white rounded-lg border border-[#cbd2d4] hover:border-[#80888a] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {/* Badge & Type */}
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${isRecommended
                        ? 'bg-[#ffebeb] text-[#df0000] border border-[#f9cdcd]'
                        : 'bg-[#edf0f1] text-[#1f976b] border border-[#cbd2d4]'
                        }`}
                    >
                      {isRecommended ? '추천도서 100% 지원' : '개인도서 50% 지원'}
                    </span>
                    <span className="text-[#80888a]">{book.publisher}</span>
                  </div>

                  {/* Book Cover */}
                  <div
                    onClick={() => setActiveQuickDetailBook(book)}
                    className="cursor-pointer group relative flex justify-center py-2 bg-[#f6f6f6] rounded"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-32 h-44 object-contain shadow-md rounded group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center text-white text-xs font-semibold">
                      도서 상세 보기
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3
                      onClick={() => setActiveQuickDetailBook(book)}
                      className="font-bold text-[#181718] text-base hover:text-[#df0000] cursor-pointer line-clamp-1"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#80888a] mt-0.5 line-clamp-1">{book.author}</p>
                  </div>

                  {/* Format Selector: Paper vs eBook */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleFormatChange(book.id, 'paper')}
                      className={`flex-1 py-1 rounded text-xs font-medium border ${format === 'paper'
                        ? 'bg-[#181718] text-white border-[#181718]'
                        : 'bg-white text-[#595959] border-[#cbd2d4] hover:bg-[#f6f6f6]'
                        }`}
                    >
                      종이책
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatChange(book.id, 'ebook')}
                      className={`flex-1 py-1 rounded text-xs font-medium border ${format === 'ebook'
                        ? 'bg-[#181718] text-white border-[#181718]'
                        : 'bg-white text-[#595959] border-[#cbd2d4] hover:bg-[#f6f6f6]'
                        }`}
                    >
                      전자책(eBook)
                    </button>
                  </div>

                  {/* Real-time B2B Complex Payment Calculation Box */}
                  <div className="bg-[#fffafa] border border-[#f9cdcd] rounded p-2.5 text-xs space-y-1">
                    <div className="flex justify-between text-[#595959]">
                      <span>판매금액:</span>
                      <span className="font-semibold text-[#181718]">{book.sellingPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-[#1f976b] font-medium">
                      <span>회사 지원금:</span>
                      <span>- {companySubsidy.toLocaleString()}원</span>
                    </div>
                    <div className="border-t border-[#f5baba] pt-1 flex justify-between font-bold text-[#df0000] text-sm">
                      <span>직원 실결제:</span>
                      <span>{employeePayment.toLocaleString()}원</span>
                    </div>

                    {isRecommended && format === 'ebook' && (
                      <p className="text-[10px] text-[#df0000] pt-1 font-semibold">
                        ⚠️ 추천도서는 종이도서만 지원 가능 (전자책 지원불가)
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(book, format, 1, false)}
                    className="py-2.5 px-3 rounded border border-[#cbd2d4] bg-white hover:bg-[#f6f6f6] text-xs font-bold text-[#181718] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    장바구니
                  </button>
                  <button
                    onClick={() => addToCart(book, format, 1, true)}
                    className="py-2.5 px-3 rounded bg-[#df0000] hover:bg-[#ea2e2e] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    바로구매
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Book Detail Modal */}
        {activeQuickDetailBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-[#cbd2d4] animate-in fade-in duration-150">
              <div className="bg-[#181718] text-white px-5 py-4 flex items-center justify-between">
                <span className="font-bold text-base">도서 상세 정보 및 지원금 계산기</span>
                <button
                  onClick={() => setActiveQuickDetailBook(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-5">
                  <img
                    src={activeQuickDetailBook.coverImage}
                    alt={activeQuickDetailBook.title}
                    className="w-32 h-44 object-contain shadow-md rounded"
                  />
                  <div className="flex-1 space-y-1.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${activeQuickDetailBook.bookType === 'recommended'
                        ? 'bg-[#ffebeb] text-[#df0000]'
                        : 'bg-[#edf0f1] text-[#1f976b]'
                        }`}
                    >
                      {activeQuickDetailBook.bookType === 'recommended' ? '추천도서 100% 지원' : '개인도서 50% 지원'}
                    </span>
                    <h2 className="text-xl font-bold text-[#181718]">{activeQuickDetailBook.title}</h2>
                    <p className="text-xs text-[#595959]">{activeQuickDetailBook.subtitle}</p>
                    <p className="text-sm text-[#80888a]">
                      저자: {activeQuickDetailBook.author} | 출판사: {activeQuickDetailBook.publisher}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#df0000] pt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-[#181718]">{activeQuickDetailBook.rating}</span>
                      <span className="text-[#80888a]">({activeQuickDetailBook.reviewCount}개의 서평)</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#555a5c] bg-[#f6f6f6] p-3 rounded leading-relaxed">
                  {activeQuickDetailBook.description}
                </div>

                {/* Subsidies Calculation Table */}
                <div className="bg-[#fffafa] border border-[#f9cdcd] p-4 rounded-lg space-y-2 text-sm">
                  <div className="font-bold text-[#181718] text-xs pb-1 border-b border-[#f5baba]">
                    B2B 복합결제 적용 내역 (임직원 독서지원 규정)
                  </div>
                  <div className="flex justify-between text-xs text-[#555a5c]">
                    <span>도서 정가</span>
                    <span className="line-through">{activeQuickDetailBook.listPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#555a5c]">
                    <span>판매가 (10% 할인)</span>
                    <span>{activeQuickDetailBook.sellingPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1f976b] font-bold">
                    <span>회사 지원금 (B2B 기업 부담)</span>
                    <span>- {calculateBookSubsidy(activeQuickDetailBook).companySubsidy.toLocaleString()}원</span>
                  </div>
                  <div className="border-t border-[#f5baba] pt-2 flex justify-between font-extrabold text-[#df0000] text-base">
                    <span>직원 실결제 부담금</span>
                    <span>{calculateBookSubsidy(activeQuickDetailBook).employeePayment.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      addToCart(activeQuickDetailBook, 'paper', 1, false);
                      setActiveQuickDetailBook(null);
                    }}
                    className="flex-1 py-3 border border-[#cbd2d4] bg-white text-[#181718] font-bold text-sm rounded hover:bg-[#f6f6f6]"
                  >
                    장바구니 담기
                  </button>
                  <button
                    onClick={() => {
                      addToCart(activeQuickDetailBook, 'paper', 1, true);
                      setActiveQuickDetailBook(null);
                    }}
                    className="flex-1 py-3 bg-[#df0000] text-white font-bold text-sm rounded hover:bg-[#ea2e2e]"
                  >
                    바로 결제하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
