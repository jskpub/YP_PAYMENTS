import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, Camera, Info, Check } from 'lucide-react';
import { BenefitState, ActiveTab } from '../../types';

interface MemberInfoViewProps {
  benefitState: BenefitState;
  setBenefitState: React.Dispatch<React.SetStateAction<BenefitState>>;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MemberInfoView: React.FC<MemberInfoViewProps> = ({
  benefitState,
  setBenefitState,
  setActiveTab,
}) => {
  const [formData, setFormData] = useState({
    name: benefitState.user.name,
    email: benefitState.user.email,
    phone: benefitState.user.phone,
    address: benefitState.user.address,
    detailAddress: benefitState.user.detailAddress,
    birthYear: '1990',
    birthMonth: '05',
    birthDay: '15',
    gender: benefitState.user.gender,
    calendarType: 'solar',
    emailConsent: true,
    smsConsent: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBenefitState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        detailAddress: formData.detailAddress,
      },
    }));
    alert('회원정보가 안전하게 저장되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span className="hover:text-gray-800 cursor-pointer" onClick={() => setActiveTab('dashboard')}>홈</span>
        <ChevronRight size={12} />
        <span className="hover:text-gray-800 cursor-pointer" onClick={() => setActiveTab('dashboard')}>마이페이지</span>
        <ChevronRight size={12} />
        <span className="text-gray-600">내 정보 관리</span>
        <ChevronRight size={12} />
        <span className="text-[#D7001E] font-bold">회원정보 관리</span>
      </div>

      {/* 헤더 */}
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">회원정보 관리</h1>
          <p className="text-xs text-gray-500 mt-1">
            회원님의 소중한 개인정보를 안전하게 관리합니다. 최신 정보로 업데이트해 주세요.
          </p>
        </div>
        <span className="text-xs text-red-600 font-medium">* 표시는 필수 입력 항목입니다</span>
      </div>

      {/* 안내 박스 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
        <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
        <span>
          <strong>안내:</strong> 영풍문고 임직원 계정 연동 및 배송/사은품 서비스 이용을 위해 정확한 정보를 입력해 주시기 바랍니다. 부정확한 정보 입력 시 배송 지연 및 서비스 이용에 제한이 있을 수 있습니다.
        </span>
      </div>

      {/* 폼 카드 */}
      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 text-xs text-gray-800">
        {/* 프로필 이미지 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-gray-100">
          <label className="w-36 font-bold text-gray-700">프로필 이미지 (선택)</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400">
              <Camera size={24} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('프로필 이미지 파일 선택')}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  이미지 변경
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-white border border-gray-200 rounded text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  삭제
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                JPG, PNG 파일 (최대 5MB, 1:1 권장, 선택 항목)
              </p>
            </div>
          </div>
        </div>

        {/* 사번 / 임직원 ID (수정 불가) */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-5 border-b border-gray-100">
          <label className="w-36 font-bold text-gray-700 pt-1.5">사번 / 임직원 ID</label>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                disabled
                value={benefitState.user.employeeId}
                className="w-56 p-2 bg-gray-100 border border-gray-300 rounded font-mono font-bold text-gray-700"
              />
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                <ShieldCheck size={14} />
                <span>임직원 인증완료</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              영풍문고 임직원 사번 및 고유 ID입니다. 정보 수정이 필요한 경우 인사과로 문의하세요.
            </p>
          </div>
        </div>

        {/* 이름 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 border-b border-gray-100">
          <label className="w-36 font-bold text-gray-700">
            이름 <span className="text-red-600">*</span>
          </label>
          <div className="flex-1">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-56 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D7001E]"
            />
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-5 border-b border-gray-100">
          <label className="w-36 font-bold text-gray-700 pt-1.5">
            이메일 <span className="text-red-600">*</span>
          </label>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-72 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D7001E]"
              />
              <span className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded">
                인증완료
              </span>
            </div>
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailConsent}
                onChange={(e) => setFormData({ ...formData, emailConsent: e.target.checked })}
                className="accent-[#D7001E] w-3.5 h-3.5"
              />
              <span>영풍문고 이벤트, 신간 도서 및 할인 혜택 이메일 수신에 동의합니다. (선택)</span>
            </label>
          </div>
        </div>

        {/* 휴대전화 번호 */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-5 border-b border-gray-100">
          <label className="w-36 font-bold text-gray-700 pt-1.5">
            휴대전화 번호 <span className="text-red-600">*</span>
          </label>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-56 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D7001E]"
              />
              <button
                type="button"
                onClick={() => alert('휴대전화 번호 변경 인증 창입니다.')}
                className="px-2.5 py-1 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                번호 변경 / 재인증
              </button>
            </div>
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.smsConsent}
                onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                className="accent-[#D7001E] w-3.5 h-3.5"
              />
              <span>주문/배송 알림톡 및 특가 소식 SMS 수신 동의 (필수 주문 정보는 수신동의 여부와 무관하게 발송)</span>
            </label>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-5 border-b border-gray-100">
          <label className="w-36 font-bold text-gray-700 pt-1.5">비밀번호 변경</label>
          <div className="flex-1 space-y-2 max-w-md">
            <input
              type="password"
              placeholder="현재 비밀번호를 입력해 주세요"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D7001E]"
            />
            <input
              type="password"
              placeholder="새 비밀번호 입력 (영문, 숫자, 특수문자 조합 8~16자리)"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D7001E]"
            />
            <input
              type="password"
              placeholder="새 비밀번호를 한번 더 입력해 주세요"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D7001E]"
            />
            <p className="text-[11px] text-gray-400">
              영문 대/소문자, 숫자, 특수문자(!@#$%^&* 등)를 조합하여 8~16자리로 안전하게 설정해 주세요.
            </p>
          </div>
        </div>

        {/* 생년월일 / 성별 */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-5 border-b border-gray-100">
          <label className="w-36 font-bold text-gray-700 pt-1.5">생년월일 / 성별 (선택)</label>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                className="w-16 p-1.5 border border-gray-300 rounded text-center"
              />
              <span>년</span>
              <input
                type="text"
                value={formData.birthMonth}
                onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                className="w-12 p-1.5 border border-gray-300 rounded text-center"
              />
              <span>월</span>
              <input
                type="text"
                value={formData.birthDay}
                onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                className="w-12 p-1.5 border border-gray-300 rounded text-center"
              />
              <span>일</span>

              <div className="flex items-center gap-3 ml-4">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="calendar"
                    checked={formData.calendarType === 'solar'}
                    onChange={() => setFormData({ ...formData, calendarType: 'solar' })}
                    className="accent-[#D7001E]"
                  />
                  <span>양력</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="calendar"
                    checked={formData.calendarType === 'lunar'}
                    onChange={() => setFormData({ ...formData, calendarType: 'lunar' })}
                    className="accent-[#D7001E]"
                  />
                  <span>음력</span>
                </label>
              </div>

              <div className="flex items-center gap-3 ml-4 border-l border-gray-200 pl-4">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 'male'}
                    onChange={() => setFormData({ ...formData, gender: 'male' })}
                    className="accent-[#D7001E]"
                  />
                  <span>남성</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 'female'}
                    onChange={() => setFormData({ ...formData, gender: 'female' })}
                    className="accent-[#D7001E]"
                  />
                  <span>여성</span>
                </label>
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              등록된 생년월일을 기준으로 매년 생일 축하 할인 쿠폰이 자동 발급됩니다.
            </p>
          </div>
        </div>

        {/* 기본 배송지 주소 */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-5 border-b border-gray-100">
          <label className="w-36 font-bold text-gray-700 pt-1.5">
            기본 배송지 주소 <span className="text-red-600">*</span>
          </label>
          <div className="flex-1 space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                defaultValue="06123"
                readOnly
                className="w-24 p-2 bg-gray-50 border border-gray-300 rounded font-mono"
              />
              <button
                type="button"
                onClick={() => alert('우편번호 검색 팝업입니다.')}
                className="px-3 py-2 bg-gray-800 text-white rounded text-xs hover:bg-gray-900 cursor-pointer"
              >
                우편번호 찾기
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D7001E]"
            />
            <input
              type="text"
              value={formData.detailAddress}
              onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D7001E]"
            />
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#D7001E] w-3.5 h-3.5" />
              <span>현재 주소를 기본 배송지로 설정합니다.</span>
            </label>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('benefit')}
            className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#D7001E] text-white font-bold rounded-md hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
          >
            회원정보 저장하기
          </button>
        </div>

        <div className="text-center pt-2 text-[11px] text-gray-400">
          영풍문고 서비스 탈퇴를 원하시나요?{' '}
          <button
            type="button"
            onClick={() => alert('회원탈퇴 문의 창입니다.')}
            className="text-gray-500 hover:underline cursor-pointer"
          >
            회원탈퇴 바로가기
          </button>
        </div>
      </form>
    </div>
  );
};
