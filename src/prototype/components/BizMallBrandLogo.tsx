import React from 'react';

interface BizMallBrandLogoProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const BizMallBrandLogo: React.FC<BizMallBrandLogoProps> = ({ size = 'md', className = '' }) => (
  <div className={`inline-flex select-none items-center gap-2.5 ${className}`}>
    <div className='flex h-auto w-[120px] shrink-0 flex-col items-center justify-center rounded-full  font-black tracking-tighter '>
      {' '}
      <img src='https://cdn.ypbooks.co.kr/image/logo/202512/d4bd4b8c-948f-4703-9cd2-0be0cccadf27.png' alt='영풍문고' />
    </div>

    <span className='rounded-md bg-yp-red px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-white'>비즈몰</span>
  </div>
);
