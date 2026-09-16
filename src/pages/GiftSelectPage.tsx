import React from 'react';
import { useShop } from '../context/ShopContext';
import { StepIndicator } from '../components/StepIndicator';
import { MOCK_GIFTS } from '../data/mockBooks';
import { Gift, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export const GiftSelectPage: React.FC = () => {
  const {
    cartStats,
    selectedGiftId,
    setSelectedGiftId,
    setActivePage
  } = useShop();

  const handleNext = () => {
    setActivePage('payment');
  };

  return (
    <div className="w-full bg-white py-8 min-h-screen text-[#3d3c3f]">
      <div className="max-w-[1280px] mx-auto px-4 space-y-6">

        {/* Step Indicator Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#dadada] pb-5 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#181718] tracking-tight">사은품 선택</h1>
            <p className="text-xs text-[#80888a] mt-1">
              구매 금액별 사은품을 선택해 주세요. (한정 수량 선착순 증정)
            </p>
          </div>
          <StepIndicator currentStep="gift" />
        </div>

        {/* Current Order Summary Notice */}
        <div className="bg-[#f6f6f6] border border-[#edf0f1] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#df0000]" />
            <span>
              선택 상품 주문 금액: <strong className="text-[#181718]">{cartStats.totalSellingPrice.toLocaleString()}원</strong>
            </span>
          </div>
          <div className="text-xs text-[#80888a]">
            * B2B 기업 지원금이 적용되어도 사은품 선택 혜택은 동일하게 적용됩니다.
          </div>
        </div>

        {/* Gift Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {MOCK_GIFTS.map((gift) => {
            const isEligible = cartStats.totalSellingPrice >= gift.minAmount;
            const isSelected = selectedGiftId === gift.id;

            return (
              <div
                key={gift.id}
                onClick={() => {
                  if (isEligible) {
                    setSelectedGiftId(gift.id);
                  }
                }}
                className={`border rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer relative ${isSelected
                    ? 'border-[#df0000] ring-2 ring-[#df0000] bg-[#fffafa]'
                    : isEligible
                      ? 'border-[#cbd2d4] hover:border-[#80888a] bg-white'
                      : 'border-[#edf0f1] bg-[#f6f6f6] opacity-60 cursor-not-allowed'
                  }`}
              >
                {/* Active Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#df0000] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1f976b]">
                      {gift.minAmount === 0 ? '기본' : `${gift.minAmount.toLocaleString()}원 이상 구매 시`}
                    </span>
                    {!isEligible && (
                      <span className="text-xs text-[#ee293b] font-medium">조건 미달</span>
                    )}
                  </div>

                  {gift.image ? (
                    <div className="h-44 rounded-lg overflow-hidden bg-[#edf0f1]">
                      <img
                        src={gift.image}
                        alt={gift.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-44 rounded-lg bg-[#edf0f1] flex items-center justify-center text-[#80888a] text-sm font-semibold">
                      사은품 미수령
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-base text-[#181718]">{gift.name}</h3>
                    <p className="text-xs text-[#80888a] mt-1">{gift.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#edf0f1] mt-4">
                  <button
                    type="button"
                    disabled={!isEligible}
                    className={`w-full py-2.5 rounded text-xs font-bold transition-colors ${isSelected
                        ? 'bg-[#df0000] text-white'
                        : isEligible
                          ? 'bg-[#f6f6f6] text-[#181718] hover:bg-[#edf0f1]'
                          : 'bg-[#edf0f1] text-[#9c9c9c]'
                      }`}
                  >
                    {isSelected ? '선택 완료' : isEligible ? '이 사은품 선택' : '금액 부족'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-[#dadada]">
          <button
            type="button"
            onClick={() => setActivePage('cart')}
            className="px-8 py-3 rounded border border-[#cbd2d4] bg-white text-sm font-semibold text-[#555a5c] hover:bg-[#f6f6f6] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            장바구니로 돌아가기
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-10 py-3 rounded bg-[#df0000] hover:bg-[#ea2e2e] text-white text-sm font-bold shadow-md flex items-center gap-1.5 transition-colors"
          >
            결제하기 단계로 이동
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
