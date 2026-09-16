/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DeliveryModal } from './components/DeliveryModal';
import { ReceiptModal } from './components/ReceiptModal';
import { EstimateModal } from './components/EstimateModal';
import { BookExplorePage } from './pages/BookExplorePage';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { PrototypeRecommendedBooksPage } from './pages/PrototypeRecommendedBooksPage';
import { PrototypeBookDetailPage } from './pages/PrototypeBookDetailPage';
import { BizMallGridPage } from './pages/BizMallGridPage';
import { CartPage } from './pages/CartPage';
import { GiftSelectPage } from './pages/GiftSelectPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderCompletePage } from './pages/OrderCompletePage';
import EmployeeMyPage from './pages/EmployeeMyPage';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, toastMessage, selectedBookForDetail } = useShop();

  if (activePage === 'intranet') {
    return <AuthPage />;
  }

  return (
    <div className='min-h-screen flex flex-col bg-white text-[#181718] antialiased selection:bg-[#df0000] selection:text-white'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed top-5 left-1/2 -translate-x-1/2 z-70 bg-[#181718]/90 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200'>
          <CheckCircle2 className='w-4 h-4 text-[#a3e635] flex-shrink-0' />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* Main Page Content */}
      <main className='flex-1 w-full'>
        {selectedBookForDetail && (activePage === 'recommended' || activePage === 'best' || activePage === 'new') ? (
          <PrototypeBookDetailPage />
        ) : (
          <>
            {activePage === 'home' && <HomePage />}
            {activePage === 'recommended' && <PrototypeRecommendedBooksPage />}
            {activePage === 'best' && <BizMallGridPage menu='BEST' />}
            {activePage === 'new' && <BizMallGridPage menu='NEW' />}
            {activePage === 'explore' && <BookExplorePage />}
          </>
        )}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'gift' && <GiftSelectPage />}
        {activePage === 'payment' && <PaymentPage />}
        {activePage === 'complete' && <OrderCompletePage />}
        {activePage === 'mypage' && <EmployeeMyPage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals */}
      <DeliveryModal />
      <ReceiptModal />
      <EstimateModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
