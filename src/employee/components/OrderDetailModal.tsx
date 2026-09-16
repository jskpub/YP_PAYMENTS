import React from 'react';
import { X, Package, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { OrderItem } from '../types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* 헤더 */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={18} />
            <div>
              <h3 className="font-bold text-base">주문 및 지원금 적용 상세</h3>
              <p className="text-[11px] text-gray-300 font-mono">주문번호: {order.orderNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 바디 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 상태 배너 */}
          <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-center justify-between">
            <span className="font-bold text-[#D7001E]">주문상태: {order.status}</span>
            <span className="text-gray-500 text-[11px]">{order.orderDate} 결제완료</span>
          </div>

          {/* 도서 품목 리스트 */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-1.5">
              주문 상품 ({order.items.length}종)
            </h4>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.bookId} className="py-2.5 flex justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {item.supportLabel}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-gray-500 text-[11px]">
                      {item.author} 저 · 수량 {item.quantity}권
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">{item.salePrice.toLocaleString()}원</p>
                    {item.benefitAmount > 0 && (
                      <p className="text-[11px] text-[#D7001E] font-medium">
                        지원금 -{item.benefitAmount.toLocaleString()}원
                      </p>
                    )}
                    <p className="text-[11px] font-semibold text-gray-700">
                      실결제: {item.selfPay.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 및 지원금 정산 영수증 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">최종 결제 및 지원금 내역</h4>
            <div className="flex justify-between text-gray-600">
              <span>총 주문금액</span>
              <span>{order.totalPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-[#D7001E] font-bold">
              <span>임직원 도서 지원금 차감</span>
              <span>-{order.totalBenefitAmount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>배송비</span>
              <span>0원 (무료배송)</span>
            </div>
            <div className="pt-2 border-t border-gray-300 flex justify-between items-baseline font-bold text-sm">
              <span>최종 본인 실 결제금액</span>
              <span className="text-lg text-[#D7001E] font-black">
                {order.finalPaidAmount.toLocaleString()}원
              </span>
            </div>
            <p className="text-[11px] text-gray-500 pt-1">
              결제 수단: {order.paymentMethod}
            </p>
          </div>

          {/* 배송지 정보 */}
          <div className="space-y-1 text-gray-600 bg-white border border-gray-200 p-3 rounded-lg">
            <p className="font-bold text-gray-900">배송지 정보</p>
            <p>{order.shippingAddress}</p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 text-white rounded font-medium hover:bg-gray-900 cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
