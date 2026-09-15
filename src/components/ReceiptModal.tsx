import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, selectedOrderForReceipt } = useShop();

  if (!isReceiptModalOpen || !selectedOrderForReceipt) return null;

  const order = selectedOrderForReceipt;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="bg-[#181718] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#df0000] font-extrabold text-lg tracking-tighter">YP</span>
            <span className="font-bold text-base">영풍문고 전자결제 영수증 (B2B 복합결제)</span>
          </div>
          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="text-neutral-400 hover:text-white p-1"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-sm text-[#181718] space-y-4">
          <div className="text-center pb-3 border-b border-[#dadada]">
            <div className="text-xs text-[#80888a]">주문번호 (Order ID)</div>
            <div className="font-bold text-lg text-[#df0000] mt-0.5">{order.orderId}</div>
            <div className="text-xs text-[#595959] mt-1">거래일시: {order.orderDate}</div>
          </div>

          {/* Customer & Enterprise Info */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-[#f6f6f6] p-3 rounded">
            <div>
              <span className="text-[#80888a]">주문자:</span>{' '}
              <span className="font-semibold">{order.employeeName}</span> (임직원)
            </div>
            <div>
              <span className="text-[#80888a]">소속사:</span>{' '}
              <span className="font-semibold">(주)파트너스 B2B</span>
            </div>
            <div className="col-span-2">
              <span className="text-[#80888a]">배송지:</span> {order.deliveryAddress.roadAddress}{' '}
              {order.deliveryAddress.detailAddress}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border-t border-b border-[#dadada] py-2">
            <div className="text-xs font-bold text-[#80888a] mb-2 flex justify-between">
              <span>상품명 / 수량</span>
              <span>판매가 | 회사지원 | 직원결제</span>
            </div>
            <div className="divide-y divide-[#edf0f1]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-start justify-between text-xs">
                  <div className="max-w-[200px]">
                    <div className="font-semibold text-sm truncate">{item.title}</div>
                    <div className="text-[#80888a]">
                      {item.bookType === 'recommended' ? '추천도서 (100% 지원)' : '개인도서 (50% 지원)'} · {item.format === 'ebook' ? '전자책' : '종이책'} · {item.quantity}권
                    </div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="text-[#181718] font-bold">{item.sellingPrice.toLocaleString()}원</div>
                    <div className="text-[#1f976b]">지원금 -{item.companySubsidy.toLocaleString()}원</div>
                    <div className="text-[#df0000] font-semibold">실부담 {item.employeePayment.toLocaleString()}원</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settlement Summary */}
          <div className="space-y-1.5 text-xs bg-[#fffafa] border border-[#f9cdcd] p-3.5 rounded">
            <div className="flex justify-between">
              <span className="text-[#595959]">총 상품금액</span>
              <span>{order.totalSellingPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-[#1f976b] font-medium">
              <span>B2B 기업 지원금 (회사 부담)</span>
              <span>- {order.totalCompanySubsidy.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-[#595959]">
              <span>배송비</span>
              <span>{order.shippingFee.toLocaleString()}원</span>
            </div>
            <div className="border-t border-[#f5baba] pt-2 flex justify-between text-sm font-bold text-[#df0000]">
              <span>직원 실결제금액 (PG승인)</span>
              <span>{order.finalPaidAmount.toLocaleString()}원</span>
            </div>
            <div className="text-[11px] text-[#80888a] text-right pt-1">
              결제수단: {order.paymentMethod}
            </div>
          </div>

          {/* Notice */}
          <div className="text-[11px] text-[#80888a] text-center leading-relaxed">
            * 본 영수증은 회사 지원금 및 직원 결제가 하나의 주문번호로 승인된 복합결제 증빙용 영수증입니다.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f6f6f6] px-5 py-3.5 flex justify-end gap-2 border-t border-[#dadada]">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-white border border-[#cbd2d4] hover:bg-[#edf0f1] text-xs font-semibold text-[#181718]"
          >
            <Printer className="w-3.5 h-3.5" />
            인쇄하기
          </button>
          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="px-5 py-2 rounded bg-[#df0000] text-white text-xs font-bold hover:bg-[#ea2e2e]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
