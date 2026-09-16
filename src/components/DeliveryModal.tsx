import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, AlertCircle, Search, Check } from 'lucide-react';
import { Address } from '../types';

export const DeliveryModal: React.FC = () => {
  const { isAddressModalOpen, setIsAddressModalOpen, addressModalTab, setAddressModalTab, addresses, selectedAddress, setSelectedAddress, addAddress, showToast } = useShop();

  // Form states for "신규 배송지 등록"
  const [deliveryType, setDeliveryType] = useState<'domestic' | 'overseas'>('domestic');
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sameAsBuyer, setSameAsBuyer] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState('010');
  const [phoneMid, setPhoneMid] = useState('');
  const [phoneEnd, setPhoneEnd] = useState('');
  const [phone2Prefix, setPhone2Prefix] = useState('');
  const [phone2Mid, setPhone2Mid] = useState('');
  const [phone2End, setPhone2End] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [jibunAddress, setJibunAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Address Search Picker state
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [addressSearchTerm, setAddressSearchTerm] = useState('');

  const sampleAddresses = [
    {
      post: '03154',
      road: '서울특별시 종로구 청계천로 41 (서린동, 영풍빌딩)',
      jibun: '서울특별시 종로구 서린동 33 영풍빌딩',
    },
    {
      post: '06110',
      road: '서울특별시 강남구 강남대로 542 (논현동, 영풍빌딩)',
      jibun: '서울특별시 강남구 논현동 142-3',
    },
    {
      post: '06544',
      road: '서울특별시 서초구 신반포로 176 (반포동, 센트럴시티)',
      jibun: '서울특별시 서초구 반포동 19-3 센트럴시티 영풍문고',
    },
    {
      post: '04050',
      road: '서울특별시 마포구 양화로 160 (동교동, 홍대입구역 복합역사)',
      jibun: '서울특별시 마포구 동교동 160-5',
    },
    {
      post: '05551',
      road: '서울특별시 송파구 올림픽로 300 (신천동, 롯데월드몰)',
      jibun: '서울특별시 송파구 신천동 29 롯데월드몰 캐주얼동',
    },
  ];

  if (!isAddressModalOpen) return null;

  const handleSameAsBuyerChange = (checked: boolean) => {
    setSameAsBuyer(checked);
    if (checked) {
      setRecipient('김민서');
      setPhonePrefix('010');
      setPhoneMid('1354');
      setPhoneEnd('5678');
    }
  };

  const handlePickAddress = (item: { post: string; road: string; jibun: string }) => {
    setPostalCode(item.post);
    setRoadAddress(item.road);
    setJibunAddress(item.jibun);
    setShowAddressPicker(false);
  };

  const handleSubmitNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      showToast('수령인 이름을 입력해주세요.');
      return;
    }
    if (!phoneMid.trim() || !phoneEnd.trim()) {
      showToast('연락처를 정확히 입력해주세요.');
      return;
    }
    if (!roadAddress.trim()) {
      showToast('주소를 검색하여 입력해주세요.');
      return;
    }

    const fullPhone = `${phonePrefix}-${phoneMid}-${phoneEnd}`;
    const fullPhone2 = phone2Mid && phone2End ? `${phone2Prefix || '02'}-${phone2Mid}-${phone2End}` : undefined;

    addAddress({
      title: title.trim() || `${recipient}님의 배송지`,
      recipient: recipient.trim(),
      phone1: fullPhone,
      phone2: fullPhone2,
      postalCode: postalCode || '03154',
      roadAddress,
      jibunAddress: jibunAddress || roadAddress,
      detailAddress: detailAddress.trim() || '상세주소 없음',
      isDefault,
      type: deliveryType,
    });
  };

  const selectExistingAddress = (addr: Address) => {
    setSelectedAddress(addr);
    setIsAddressModalOpen(false);
    showToast(`배송지가 '${addr.title}'(으)로 변경되었습니다.`);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto'>
      <div className='relative w-full max-w-[620px] bg-white rounded-lg shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200'>
        {/* Header - Matching delivery_new.png red bar */}
        <div className='bg-[#df0000] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0'>
          <h2 className='text-lg font-bold'>배송지 변경</h2>
          <button onClick={() => setIsAddressModalOpen(false)} className='text-white hover:text-white/80 p-1 rounded transition-colors' aria-label='닫기'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tab Selection */}
        <div className='flex border-b border-[#dadada] bg-white text-sm font-semibold flex-shrink-0'>
          <button type='button' onClick={() => setAddressModalTab('list')} className={`flex-1 py-3 text-center transition-colors ${addressModalTab === 'list' ? 'text-[#181718] border-b-2 border-[#181718] font-bold' : 'text-[#80888a] hover:text-[#181718]'}`}>
            주소록
          </button>
          <button type='button' onClick={() => setAddressModalTab('recent')} className={`flex-1 py-3 text-center transition-colors ${addressModalTab === 'recent' ? 'text-[#181718] border-b-2 border-[#181718] font-bold' : 'text-[#80888a] hover:text-[#181718]'}`}>
            최근 배송지
          </button>
          <button type='button' onClick={() => setAddressModalTab('new')} className={`flex-1 py-3 text-center transition-colors ${addressModalTab === 'new' ? 'text-[#181718] border-b-2 border-[#181718] font-bold' : 'text-[#80888a] hover:text-[#181718]'}`}>
            신규 배송지 등록
          </button>
        </div>

        {/* Modal Body */}
        <div className='p-5 overflow-y-auto flex-1 text-[#3d3c3f] text-sm'>
          {/* TAB 1: 주소록 */}
          {addressModalTab === 'list' && (
            <div className='space-y-3'>
              <div className='text-xs text-[#80888a] mb-2'>등록된 배송지 목록 중 배송받으실 주소를 선택해주세요.</div>
              {addresses.map((addr) => {
                const isCurrent = selectedAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => selectExistingAddress(addr)}
                    className={`p-4 rounded border transition-all cursor-pointer flex items-start justify-between ${isCurrent ? 'border-[#df0000] bg-[#ffebeb]/30 ring-1 ring-[#df0000]' : 'border-[#cbd2d4] hover:border-[#80888a] bg-white'}`}
                  >
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-bold text-base text-[#181718]'>{addr.title}</span>
                        {addr.isDefault && <span className='text-[11px] bg-[#df0000] text-white px-2 py-0.5 rounded font-medium'>기본배송지</span>}
                      </div>
                      <div className='text-sm font-medium text-[#595959] mt-1'>
                        수령인: {addr.recipient} | {addr.phone1}
                      </div>
                      <div className='text-sm text-[#181718] mt-1 font-normal'>
                        ({addr.postalCode}) {addr.roadAddress} {addr.detailAddress}
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        selectExistingAddress(addr);
                      }}
                      className={`text-xs px-3 py-1.5 rounded font-semibold border ${isCurrent ? 'bg-[#df0000] text-white border-[#df0000]' : 'bg-white text-[#555a5c] border-[#cbd2d4] hover:bg-[#f6f6f6]'}`}
                    >
                      {isCurrent ? '선택됨' : '선택'}
                    </button>
                  </div>
                );
              })}

              <div className='pt-3 text-center'>
                <button type='button' onClick={() => setAddressModalTab('new')} className='text-xs font-semibold text-[#df0000] hover:underline'>
                  + 새로운 배송지 등록하기
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: 최근 배송지 */}
          {addressModalTab === 'recent' && (
            <div className='space-y-3'>
              <div className='text-xs text-[#80888a] mb-2'>최근 주문 시 사용하셨던 배송지 내역입니다.</div>
              {addresses.slice(0, 3).map((addr) => (
                <div key={addr.id} className='p-4 rounded border border-[#cbd2d4] hover:border-[#80888a] bg-white flex items-start justify-between'>
                  <div>
                    <span className='font-bold text-sm text-[#181718]'>
                      {addr.recipient} ({addr.title})
                    </span>
                    <div className='text-xs text-[#595959] mt-0.5'>{addr.phone1}</div>
                    <div className='text-sm text-[#181718] mt-1'>
                      {addr.roadAddress} {addr.detailAddress}
                    </div>
                  </div>
                  <button type='button' onClick={() => selectExistingAddress(addr)} className='text-xs px-3 py-1.5 rounded font-semibold border bg-white text-[#df0000] border-[#df0000] hover:bg-[#ffebeb]'>
                    이 주소로 선택
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: 신규 배송지 등록 (Exact delivery_new.png) */}
          {addressModalTab === 'new' && (
            <form onSubmit={handleSubmitNewAddress} className='space-y-3.5'>
              {/* 배송 방식 선택 */}
              <div className='flex items-center gap-6 pb-1'>
                <label className='flex items-center gap-2 cursor-pointer text-sm font-medium'>
                  <input type='radio' name='deliveryMethod' checked={deliveryType === 'domestic'} onChange={() => setDeliveryType('domestic')} className='w-4 h-4 accent-[#df0000]' />
                  <span>국내 배송</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer text-sm text-[#80888a]'>
                  <input type='radio' name='deliveryMethod' checked={deliveryType === 'overseas'} onChange={() => setDeliveryType('overseas')} className='w-4 h-4 accent-[#df0000]' />
                  <span>해외배송(FedEx)</span>
                </label>
              </div>

              {/* 배송지명 */}
              <div className='grid grid-cols-[90px_1fr] sm:grid-cols-[100px_1fr] items-center gap-2'>
                <label className='text-sm text-[#555a5c] font-medium'>배송지명</label>
                <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='배송지명을 입력하세요 (예: 자택, 회사)' className='w-full h-10 px-3 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm placeholder-[#9da6a8]' />
              </div>

              {/* 수령인 */}
              <div className='grid grid-cols-[90px_1fr] sm:grid-cols-[100px_1fr] items-center gap-2'>
                <label className='text-sm text-[#555a5c] font-medium'>
                  수령인<span className='text-[#df0000]'>*</span>
                </label>
                <div className='flex items-center gap-3'>
                  <input type='text' value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder='수령인 이름을 입력하세요' className='flex-1 h-10 px-3 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm placeholder-[#9da6a8]' />
                  <label className='flex items-center gap-1.5 cursor-pointer text-xs text-[#555a5c] whitespace-nowrap'>
                    <input type='checkbox' checked={sameAsBuyer} onChange={(e) => handleSameAsBuyerChange(e.target.checked)} className='w-4 h-4 accent-[#df0000]' />
                    <span>주문자와 동일</span>
                  </label>
                </div>
              </div>

              {/* 연락처1 */}
              <div className='grid grid-cols-[90px_1fr] sm:grid-cols-[100px_1fr] items-center gap-2'>
                <label className='text-sm text-[#555a5c] font-medium'>
                  연락처1<span className='text-[#df0000]'>*</span>
                </label>
                <div className='flex items-center gap-2'>
                  <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)} className='w-20 h-10 px-2 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm bg-white'>
                    <option value='010'>010</option>
                    <option value='011'>011</option>
                    <option value='016'>016</option>
                    <option value='017'>017</option>
                    <option value='019'>019</option>
                    <option value='02'>02</option>
                    <option value='031'>031</option>
                  </select>
                  <span className='text-[#9da6a8]'>-</span>
                  <input type='text' maxLength={4} value={phoneMid} onChange={(e) => setPhoneMid(e.target.value.replace(/[^0-9]/g, ''))} className='w-20 h-10 px-2 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm text-center' />
                  <span className='text-[#9da6a8]'>-</span>
                  <input type='text' maxLength={4} value={phoneEnd} onChange={(e) => setPhoneEnd(e.target.value.replace(/[^0-9]/g, ''))} className='w-20 h-10 px-2 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm text-center' />
                </div>
              </div>

              {/* 연락처2 */}
              <div className='grid grid-cols-[90px_1fr] sm:grid-cols-[100px_1fr] items-center gap-2'>
                <label className='text-sm text-[#555a5c] font-medium'>연락처2</label>
                <div className='flex items-center gap-2'>
                  <select value={phone2Prefix} onChange={(e) => setPhone2Prefix(e.target.value)} className='w-20 h-10 px-2 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm bg-white text-[#80888a]'>
                    <option value=''>선택</option>
                    <option value='010'>010</option>
                    <option value='02'>02</option>
                    <option value='031'>031</option>
                    <option value='051'>051</option>
                  </select>
                  <span className='text-[#9da6a8]'>-</span>
                  <input type='text' maxLength={4} value={phone2Mid} onChange={(e) => setPhone2Mid(e.target.value.replace(/[^0-9]/g, ''))} className='w-20 h-10 px-2 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm text-center' />
                  <span className='text-[#9da6a8]'>-</span>
                  <input type='text' maxLength={4} value={phone2End} onChange={(e) => setPhone2End(e.target.value.replace(/[^0-9]/g, ''))} className='w-20 h-10 px-2 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm text-center' />
                </div>
              </div>

              {/* 배송지 주소 */}
              <div className='grid grid-cols-[90px_1fr] sm:grid-cols-[100px_1fr] items-start gap-2 pt-1'>
                <label className='text-sm text-[#555a5c] font-medium pt-2'>
                  배송지 주소<span className='text-[#df0000]'>*</span>
                </label>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <input type='text' readOnly value={postalCode} placeholder='우편번호' className='w-28 h-10 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm text-[#181718]' />
                    <button type='button' onClick={() => setShowAddressPicker(true)} className='h-10 px-4 border border-[#cbd2d4] rounded bg-white hover:bg-[#f6f6f6] text-sm font-semibold text-[#181718] transition-colors'>
                      주소 검색
                    </button>
                  </div>

                  <div className='flex items-center gap-1.5 text-xs text-[#80888a]'>
                    <AlertCircle className='w-3.5 h-3.5 text-[#80888a] flex-shrink-0' />
                    <span>주소 입력 시 반드시 [주소 검색] 버튼을 클릭하여 주소를 입력해 주세요.</span>
                  </div>

                  <input type='text' readOnly value={roadAddress} placeholder='도로명' className='w-full h-10 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm text-[#181718]' />
                  <input type='text' readOnly value={jibunAddress} placeholder='지번' className='w-full h-10 px-3 border border-[#cbd2d4] rounded bg-[#f6f6f6] text-sm text-[#181718]' />
                  <input type='text' value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} placeholder='상세주소' className='w-full h-10 px-3 border border-[#cbd2d4] rounded focus:border-[#df0000] focus:outline-none text-sm placeholder-[#9da6a8]' />

                  <div className='pt-1'>
                    <label className='flex items-center gap-2 cursor-pointer text-xs text-[#555a5c]'>
                      <input type='checkbox' checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className='w-4 h-4 accent-[#df0000]' />
                      <span>기본배송지로 선택</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Warning Notice Box (from delivery_new.png) */}
              <div className='bg-[#fffafa] border border-[#f9cdcd] rounded p-3.5 text-xs space-y-1 text-[#555a5c] leading-relaxed'>
                <p className='text-[#df0000]'>• 당일배송 주문시는 반드시 주소를 재입력해주시기 바랍니다.</p>
                <p>
                  • 사서함 주소지(<span className='text-[#df0000]'>군부대, 교도소, 일부도서지역 등</span>)로 주문하실 경우 주문완료 후 <span className='text-[#df0000] font-semibold'>고객센터(1544-9020)</span> 또는 <span className='text-[#df0000] font-semibold'>1:1 상담</span>으로 반드시 연락주시기
                  바랍니다.
                </p>
                <p>
                  • <span className='text-[#df0000]'>학교</span>는 당일배송이 불가하며, <span className='text-[#df0000]'>직장</span>으로 배송받으시는 경우 토요일 배송 예정 시 수령이 불가능할 수 있습니다.
                </p>
              </div>

              {/* Footer Actions */}
              <div className='flex items-center justify-center gap-3 pt-3 border-t border-[#edf0f1]'>
                <button type='button' onClick={() => setIsAddressModalOpen(false)} className='min-w-[120px] h-10 px-6 rounded border border-[#cbd2d4] bg-white text-sm font-semibold text-[#555a5c] hover:bg-[#f6f6f6] transition-colors'>
                  취소
                </button>
                <button type='submit' className='min-w-[120px] h-10 px-6 rounded bg-[#df0000] hover:bg-[#ea2e2e] text-sm font-bold text-white transition-colors shadow-sm'>
                  저장
                </button>
              </div>
            </form>
          )}

          {/* Sub-popup: Address Search Picker */}
          {showAddressPicker && (
            <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4'>
              <div className='bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden border border-[#cbd2d4]'>
                <div className='bg-[#181718] text-white px-4 py-3 flex items-center justify-between'>
                  <span className='font-bold text-sm'>우편번호 & 도로명 주소 검색</span>
                  <button onClick={() => setShowAddressPicker(false)} className='text-neutral-400 hover:text-white'>
                    <X className='w-4 h-4' />
                  </button>
                </div>
                <div className='p-4 space-y-3'>
                  <div className='flex gap-2'>
                    <input type='text' value={addressSearchTerm} onChange={(e) => setAddressSearchTerm(e.target.value)} placeholder='도로명 또는 건물명 검색 (예: 종로, 강남대로, 서초구)' className='flex-1 h-10 px-3 border border-[#cbd2d4] rounded text-sm focus:outline-none focus:border-[#df0000]' />
                    <button type='button' className='px-4 bg-[#df0000] text-white rounded text-sm font-bold flex items-center gap-1'>
                      <Search className='w-4 h-4' />
                      검색
                    </button>
                  </div>
                  <div className='text-xs text-[#80888a]'>아래 검색 예시 주소를 클릭하여 바로 입력하실 수 있습니다.</div>
                  <div className='max-h-60 overflow-y-auto divide-y divide-[#edf0f1] border border-[#cbd2d4] rounded'>
                    {sampleAddresses
                      .filter((a) => !addressSearchTerm || a.road.includes(addressSearchTerm) || a.jibun.includes(addressSearchTerm))
                      .map((item, i) => (
                        <div key={i} onClick={() => handlePickAddress(item)} className='p-3 hover:bg-[#ffebeb]/40 cursor-pointer text-left transition-colors'>
                          <div className='flex items-center gap-2'>
                            <span className='bg-[#edf0f1] text-[#181718] px-2 py-0.5 rounded text-xs font-bold'>{item.post}</span>
                            <span className='text-sm font-bold text-[#181718]'>{item.road}</span>
                          </div>
                          <div className='text-xs text-[#80888a] mt-1'>지번: {item.jibun}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
