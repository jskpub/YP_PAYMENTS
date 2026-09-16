import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { NavigationControlBar } from '../prototype/components/NavigationControlBar';
import { SamsungIntranetPortal } from '../prototype/components/SamsungIntranetPortal';
import { DirectLoginPortal } from '../prototype/components/DirectLoginPortal';
import { AuthLoadingScreen } from '../prototype/components/AuthLoadingScreen';
import { MOCK_ROSTER } from '../prototype/data/mockData';
import type { AppViewMode, UserSession } from '../prototype/types';

const DEFAULT_EMPLOYEE = MOCK_ROSTER[0];

export const AuthPage: React.FC = () => {
  const { setActivePage, showToast } = useShop();
  const [currentView, setCurrentView] = useState<AppViewMode>('INTRANET_PORTAL');
  const [isSsoAuthenticating, setIsSsoAuthenticating] = useState(false);

  const enterBizMall = (employeeName?: string) => {
    if (employeeName) showToast(`${employeeName}님, 환영합니다`);
    setActivePage('home');
  };

  const handleLaunchSSO = () => {
    setIsSsoAuthenticating(true);
    setTimeout(() => {
      setIsSsoAuthenticating(false);
      enterBizMall(DEFAULT_EMPLOYEE.name);
    }, 1200);
  };

  const handleDirectLoginSuccess = (session: UserSession) => {
    enterBizMall(session.employee.name);
  };

  const handleNavigate = (view: AppViewMode) => {
    if (view === 'BIZ_MALL') {
      enterBizMall();
      return;
    }
    setCurrentView(view);
  };

  if (isSsoAuthenticating) {
    return <AuthLoadingScreen title='로그인 처리 중입니다' description='사내 인증 정보를 확인하고 있습니다' />;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <NavigationControlBar currentView={currentView} onNavigate={handleNavigate} />
      {currentView === 'INTRANET_PORTAL' && <SamsungIntranetPortal employee={DEFAULT_EMPLOYEE} onLaunchSSO={handleLaunchSSO} />}
      {currentView === 'DIRECT_LOGIN' && <DirectLoginPortal onLoginSuccess={handleDirectLoginSuccess} onGoToIntranetSSO={() => setCurrentView('INTRANET_PORTAL')} />}
    </div>
  );
};
