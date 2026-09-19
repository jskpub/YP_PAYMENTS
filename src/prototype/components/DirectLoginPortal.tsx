import React, { useState } from 'react';
import { UserSession } from '../types';
import { MOCK_ROSTER, getBenefitFor } from '../data/mockData';
import { AuthLoadingScreen } from './AuthLoadingScreen';

interface DirectLoginPortalProps {
  onLoginSuccess: (session: UserSession) => void;
  onGoToIntranetSSO?: () => void;
}

export const DirectLoginPortal: React.FC<DirectLoginPortalProps> = ({ onLoginSuccess, onGoToIntranetSSO }) => {
  const [employeeId, setEmployeeId] = useState<string>('SEC-20240881');
  const [password, setPassword] = useState<string>('••••••••');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      setErrorMessage('사번을 입력해 주세요.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    // Matches image.png loading state (1.2 seconds)
    setTimeout(() => {
      // Find matching employee by 사번
      const matched = MOCK_ROSTER.find((emp) => emp.employeeId.toLowerCase() === employeeId.trim().toLowerCase()) || MOCK_ROSTER[0]; // fallback to default employee profile if custom

      const session: UserSession = {
        employee: matched,
        benefit: getBenefitFor(matched),
        authMethod: 'ROSTER_AUTH',
        authenticatedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sessionToken: `YP_EMP_${matched.employeeId}_${Date.now()}`,
      };

      setIsLoading(false);
      onLoginSuccess(session);
    }, 1200);
  };

  if (isLoading) {
    return <AuthLoadingScreen title='로그인 처리 중입니다' description='사번 정보를 확인하고 있습니다' />;
  }

  // Image 1: Split Screen Login Layout
  return (
    <div className='min-h-screen w-full flex flex-col md:flex-row font-sans antialiased bg-white select-none'>
      {/* Quick shortcut to Intranet at top right if needed for testing */}
      {onGoToIntranetSSO && (
        <button onClick={onGoToIntranetSSO} className='fixed top-4 right-4 z-20 text-[12px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-colors border border-slate-200 shadow-xs'>
          사내 인트라넷 화면으로 이동 ↗
        </button>
      )}

      {/* Left Column: Dark Charcoal Container */}
      <div className='w-full md:w-[48%] lg:w-[50%] bg-[#363333] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[320px] md:min-h-screen relative'>
        {/* Top Left: Brand Logo + B2B Red Badge */}
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-full bg-yp-red text-white flex flex-col items-center justify-center font-black shadow-xs shrink-0 tracking-tighter overflow-hidden rounded-full'>
            <img src='https://cdn.ypbooks.co.kr/front_web/assets/img/temp/yp_md_default.png' alt='' />
          </div>
          <span className='font-black text-xl tracking-tight text-white'>영풍문고</span>
          <span className='bg-yp-red text-white text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wide'>비즈몰</span>
        </div>

        {/* Center-Left Heading */}
        <div className='my-auto py-12 md:py-0'>
          <h1 className='text-2xl sm:text-3xl lg:text-[34px] font-extrabold leading-[1.3] text-white tracking-tight'>
            책 한 권의 기쁨을,
            <br />
            모든 임직원에게.
          </h1>
        </div>

        {/* Bottom Left Note */}
        <div className='text-[12px] text-slate-400 font-normal'>대한전자 · 삼성전자 · LG전자 외 120여 개 기업이 함께합니다</div>
      </div>

      {/* Right Column: White Login Form */}
      <div className='flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 bg-white min-h-[500px]'>
        <div className='w-full max-w-[340px] space-y-6'>
          {/* Header */}
          <div>
            <h2 className='text-xl font-bold text-slate-900 tracking-tight'>B2B 임직원 로그인</h2>
            <p className='text-xs text-slate-500 mt-1'>사번과 비밀번호를 입력해 로그인하세요.</p>
          </div>

          {/* Form - Strictly NO partner company selector as instructed */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Field 1: 사번 */}
            <div>
              <label htmlFor='emp-id-input' className='block text-xs font-medium text-slate-700 mb-1'>
                사번
              </label>
              <input
                id='emp-id-input'
                type='text'
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder='2024-0871'
                className='w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-yp-red rounded-lg focus:outline-none focus:ring-1 focus:ring-yp-red transition-all '
                required
              />
            </div>

            {/* Field 2: 비밀번호 */}
            <div>
              <label htmlFor='emp-pw-input' className='block text-xs font-medium text-slate-700 mb-1'>
                비밀번호
              </label>
              <input
                id='emp-pw-input'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='비밀번호'
                className='w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all'
                required
              />
            </div>

            {/* Error message */}
            {errorMessage && <p className='text-xs text-yp-red font-medium'>{errorMessage}</p>}

            {/* Submit Button: Red Pill/Rect */}
            <button type='submit' className='w-full bg-yp-red hover:bg-yp-red-hover active:bg-yp-red-hover text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow-xs'>
              로그인
            </button>
          </form>

          {/* Bottom Help */}
          <div className='pt-2 text-center space-y-4'>
            <p className='text-[12px] text-slate-400'>사번을 잊으셨나요? IT 관리자에게 문의하세요.</p>
            <p className='text-[12px] text-slate-400'>© 영풍문고 · 임직원 전용 시스템</p>
          </div>
        </div>
      </div>
    </div>
  );
};
