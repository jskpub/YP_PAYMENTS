import React from 'react';

interface AuthLoadingScreenProps {
  title: string;
  description: string;
}

/**
 * 사번 로그인과 인트라넷 SSO 진입이 공유하는 로그인 로딩 화면.
 * 두 경로의 진입 경험을 동일하게 맞추기 위해 문구만 주입받는다.
 */
export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({title, description}) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white font-sans antialiased">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-yp-gray-200 border-t-yp-red" />
      <h2 className="text-sm font-bold tracking-tight text-yp-ink">{title}</h2>
      <p className="mt-1 text-xs font-normal text-yp-gray-400">{description}</p>
    </div>
  </div>
);
