import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Printer } from 'lucide-react';

export const EstimateModal: React.FC = () => {
  const { isEstimateModalOpen, setIsEstimateModalOpen, cart, cartStats } = useShop();

  if (!isEstimateModalOpen) return null;

  const selectedItems = cart.filter((i) => i.selected);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto'>
      <div className='relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden my-auto animate-in fade-in duration-150'>
        <div className='bg-[#181718] text-white px-5 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-[#df0000] font-bold text-lg'>YP</span>
            <span className='font-bold text-base'>도서 구매 견적서 (B2B 복합결제용)</span>
          </div>
          <button onClick={() => setIsEstimateModalOpen(false)} className='text-neutral-400 hover:text-white'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6 text-sm text-[#181718] space-y-4'>
          <div className='flex justify-between items-start border-b border-[#dadada] pb-4'>
            <div>
              <h1 className='text-xl font-bold text-[#181718]'>도서 구매 견적서</h1>
              <p className='text-xs text-[#80888a] mt-1'>견적일자: 2026년 09월 15일</p>
              <p className='text-xs text-[#80888a]'>발행기관: (주)영풍문고 B2B 법인영업팀</p>
            </div>
            <div className='text-right text-xs'>
              <p className='font-semibold text-sm'>신청 임직원: 김민서</p>
              <p className='text-[#595959]'>지원 프로그램: 2026 하반기 임직원 독서지원</p>
            </div>
          </div>

          <table className='w-full text-xs text-left border border-[#cbd2d4]'>
            <thead className='bg-[#f6f6f6] border-b border-[#cbd2d4] text-[#555a5c]'>
              <tr>
                <th className='p-2.5'>도서명 / 저자</th>
                <th className='p-2.5 text-center'>유형</th>
                <th className='p-2.5 text-center'>수량</th>
                <th className='p-2.5 text-right'>정가</th>
                <th className='p-2.5 text-right'>판매가</th>
                <th className='p-2.5 text-right'>회사 지원금</th>
                <th className='p-2.5 text-right'>직원 실부담</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#edf0f1]'>
              {selectedItems.map((item, idx) => (
                <tr key={idx}>
                  <td className='p-2.5'>
                    <div className='font-semibold text-sm'>{item.book.title}</div>
                    <div className='text-[#80888a]'>
                      {item.book.author} | {item.book.publisher}
                    </div>
                  </td>
                  <td className='p-2.5 text-center font-medium'>
                    <div className={item.book.bookType === 'recommended' ? 'text-[#df0000] font-bold' : 'text-[#1f976b] font-bold'}>{item.book.bookType === 'recommended' ? '추천 (100%)' : '개인 (50%)'}</div>
                    <div className='text-[11px] text-[#555a5c]'>{item.format === 'ebook' ? '전자책' : '종이책'}</div>
                  </td>
                  <td className='p-2.5 text-center'>{item.quantity}</td>
                  <td className='p-2.5 text-right text-[#80888a]'>{(item.book.listPrice * item.quantity).toLocaleString()}원</td>
                  <td className='p-2.5 text-right font-semibold'>{item.itemSellingPrice.toLocaleString()}원</td>
                  <td className='p-2.5 text-right text-[#1f976b] font-medium'>-{item.itemCompanySubsidy.toLocaleString()}원</td>
                  <td className='p-2.5 text-right text-[#df0000] font-bold'>{item.itemEmployeePayment.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
            <tfoot className='bg-[#fffafa] border-t-2 border-[#cbd2d4] font-bold'>
              <tr>
                <td colSpan={4} className='p-3 text-right'>
                  합계 견적 금액:
                </td>
                <td className='p-3 text-right'>{cartStats.totalSellingPrice.toLocaleString()}원</td>
                <td className='p-3 text-right text-[#1f976b]'>-{cartStats.totalCompanySubsidy.toLocaleString()}원</td>
                <td className='p-3 text-right text-[#df0000]'>{cartStats.totalEmployeePayment.toLocaleString()}원</td>
              </tr>
            </tfoot>
          </table>

          <div className='text-xs text-[#80888a] bg-[#f6f6f6] p-3 rounded leading-relaxed'>
            * 배송비: {cartStats.shippingFee.toLocaleString()}원 (30,000원 이상 주문 시 무료배송)
            <br />* 최종 실결제 예상금액: <strong className='text-[#df0000] text-sm'>{cartStats.finalPaymentAmount.toLocaleString()}원</strong>
          </div>
        </div>

        <div className='bg-[#f6f6f6] px-5 py-3.5 flex justify-end gap-2 border-t border-[#dadada]'>
          <button onClick={() => window.print()} className='flex items-center gap-1.5 px-4 py-2 rounded bg-white border border-[#cbd2d4] text-xs font-semibold text-[#181718]'>
            <Printer className='w-3.5 h-3.5' />
            인쇄
          </button>
          <button onClick={() => setIsEstimateModalOpen(false)} className='px-5 py-2 rounded bg-[#df0000] text-white text-xs font-bold'>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
