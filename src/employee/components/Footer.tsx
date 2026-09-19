import React from 'react';
import { PhoneCall, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className='w-full bg-[#FAFAFA] border-t border-gray-200 mt-16 text-gray-600 text-xs'>
      <div className='max-w-7xl mx-auto px-4 py-10'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-8'>
          {/* 고객센터 안내 */}
          <div className='md:col-span-2 space-y-2'>
            <h3 className='text-sm font-bold text-gray-900 flex items-center gap-1.5'>
              <span>고객센터</span>
            </h3>
            <p className='text-2xl font-black text-gray-900 tracking-tight'>1544-9020</p>
            <div className='text-gray-500 space-y-0.5 text-[12px]'>
              <p>상담가능시간: 평일 09:00 ~ 18:00 / 점심시간 12:15 ~ 13:15</p>
              <p>대표 메일: customer@ypbooks.co.kr</p>
              <p>대량 주문: webmaster@ypbooks.co.kr</p>
            </div>
            <div className='flex items-center gap-2 pt-2 text-[12px] font-medium text-gray-700'>
              <span className='hover:text-[#D7001E] cursor-pointer'>FAQ &gt;</span>
              <span className='text-gray-300'>|</span>
              <span className='hover:text-[#D7001E] cursor-pointer'>1:1고객상담 &gt;</span>
              <span className='text-gray-300'>|</span>
              <span className='hover:text-[#D7001E] cursor-pointer'>입점문의 &gt;</span>
            </div>
          </div>

          {/* 영풍문고 */}
          <div>
            <h4 className='font-bold text-gray-900 mb-2'>영풍문고</h4>
            <ul className='space-y-1.5 text-gray-500 text-[12px]'>
              <li className='hover:text-gray-800 cursor-pointer'>회사소개</li>
              <li className='hover:text-gray-800 cursor-pointer'>매장안내</li>
              <li className='hover:text-[#D7001E] cursor-pointer font-medium'>나우드림</li>
            </ul>
          </div>

          {/* 비즈니스 */}
          <div>
            <h4 className='font-bold text-gray-900 mb-2'>비즈니스</h4>
            <ul className='space-y-1.5 text-gray-500 text-[12px]'>
              <li className='hover:text-gray-800 cursor-pointer'>입점문의</li>
              <li className='hover:text-gray-800 cursor-pointer'>광고안내</li>
              <li className='hover:text-gray-800 cursor-pointer text-red-600 font-medium'>상품관리SCM</li>
            </ul>
          </div>

          {/* 쇼핑도우미 */}
          <div>
            <h4 className='font-bold text-gray-900 mb-2'>쇼핑도우미</h4>
            <ul className='space-y-1.5 text-gray-500 text-[12px]'>
              <li className='hover:text-gray-800 cursor-pointer'>도서검색</li>
              <li className='hover:text-gray-800 cursor-pointer'>회원등급 혜택</li>
              <li className='hover:text-gray-800 cursor-pointer'>주문/배송</li>
              <li className='hover:text-gray-800 cursor-pointer'>취소/교환/반품</li>
              <li className='hover:text-gray-800 cursor-pointer'>적립금 사용</li>
              <li className='hover:text-gray-800 cursor-pointer'>교환권 사용</li>
              <li className='hover:text-gray-800 cursor-pointer'>청약 철회</li>
            </ul>
          </div>
        </div>

        {/* 카피라이트 및 법적 고지 바 */}
        <div className='mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-gray-500'>
          <div className='flex flex-wrap items-center gap-3'>
            <span className='hover:text-gray-900 cursor-pointer'>이용약관</span>
            <span className='text-gray-300'>|</span>
            <span className='hover:text-gray-900 cursor-pointer font-semibold text-gray-800'>개인정보처리방침</span>
            <span className='text-gray-300'>|</span>
            <span className='hover:text-gray-900 cursor-pointer'>청소년보호정책</span>
            <span className='text-gray-300'>|</span>
            <span className='hover:text-gray-900 cursor-pointer'>이메일무단수집거부</span>
            <span className='text-gray-300'>|</span>
            <span className='hover:text-gray-900 cursor-pointer'>대량주문안내</span>
          </div>
          <p>© YOUNGPOONG BOOKSTORE INC. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};
