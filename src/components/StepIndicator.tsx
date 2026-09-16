import React from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronRight } from 'lucide-react';
import { PageTab } from '../types';

interface StepIndicatorProps {
  currentStep: 'cart' | 'gift' | 'payment' | 'complete';
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const { setActivePage } = useShop();

  const steps: { key: 'cart' | 'gift' | 'payment' | 'complete'; label: string; number: number }[] = [
    { key: 'cart', label: '장바구니', number: 1 },
    { key: 'gift', label: '사은품 선택', number: 2 },
    { key: 'payment', label: '결제하기', number: 3 },
    { key: 'complete', label: '주문완료', number: 4 },
  ];

  return (
    <div className='flex items-center text-[15px] sm:text-[16px] select-none'>
      {steps.map((step, idx) => {
        const isActive = step.key === currentStep;
        const isPast = (currentStep === 'payment' && (step.key === 'cart' || step.key === 'gift')) || (currentStep === 'gift' && step.key === 'cart') || currentStep === 'complete';

        return (
          <React.Fragment key={step.key}>
            <button
              onClick={() => {
                if (step.key !== 'complete') {
                  setActivePage(step.key as PageTab);
                }
              }}
              disabled={step.key === 'complete'}
              className={`flex items-center gap-1.5 transition-colors ${isActive ? 'font-bold text-[#181718]' : isPast ? 'text-[#595959] hover:text-[#181718]' : 'text-[#9c9c9c] hover:text-[#595959]'}`}
            >
              {isActive && <span className='w-5 h-5 rounded-full bg-[#181718] text-white flex items-center justify-center text-xs font-bold'>{step.number}</span>}
              <span>{step.label}</span>
            </button>

            {idx < steps.length - 1 && <ChevronRight className='w-4 h-4 mx-2 sm:mx-3 text-[#cbd2d4]' />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
