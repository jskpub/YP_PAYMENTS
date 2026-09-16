import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CartItem, Order, SubsidyLedger, Address, PageTab, BookFormat } from '../types';
import { MOCK_BOOKS, INITIAL_ADDRESSES } from '../data/mockBooks';
import { PROTOTYPE_ALL_BOOKS } from '../data/prototypeBookAdapter';

const CART_RESET_VERSION = 'empty-cart-2026-09-16';

interface ShopContextType {
  activePage: PageTab;
  setActivePage: (page: PageTab) => void;
  myPageTab: 'subsidy' | 'orders' | 'refund';
  setMyPageTab: (tab: 'subsidy' | 'orders' | 'refund') => void;

  // Books catalog
  books: Book[];
  selectedBookForDetail: Book | null;
  setSelectedBookForDetail: (book: Book | null) => void;

  // Cart
  cart: CartItem[];
  cartTab: 'normal' | 'nowdream';
  setCartTab: (tab: 'normal' | 'nowdream') => void;
  addToCart: (book: Book, format?: BookFormat, quantity?: number, directToPayment?: boolean) => void;
  updateQuantity: (id: string, newQty: number) => void;
  removeFromCart: (id: string) => void;
  removeSelectedFromCart: () => void;
  toggleItemSelection: (id: string) => void;
  toggleAllSelection: (selected: boolean) => void;
  applyCartSubsidy: (id: string) => void;
  removeCartSubsidy: (id: string) => void;

  // Free Gift
  selectedGiftId: string;
  setSelectedGiftId: (id: string) => void;

  // Pricing calculations
  cartStats: {
    totalListPrice: number;
    totalSellingPrice: number;
    totalProductDiscount: number;
    totalCompanySubsidy: number;
    totalEmployeePayment: number;
    shippingFee: number;
    finalPaymentAmount: number;
    totalRewardPoints: number;
    freeShippingShortfall: number; // 30,000원 기준 부족분
    freeShippingProgress: number; // 0 to 100
    selectedCount: number;
  };

  // Addresses
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (address: Address) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  addressModalTab: 'list' | 'recent' | 'new';
  setAddressModalTab: (tab: 'list' | 'recent' | 'new') => void;

  // Subsidy & Ledger (B2B Rule Engine)
  subsidyLedger: SubsidyLedger;
  calculateBookSubsidy: (
    book: Book,
    formatOrQty?: BookFormat | number,
    qtyParam?: number,
  ) => {
    companySubsidy: number;
    employeePayment: number;
    ruleExplanation: string;
    canApply: boolean;
  };

  // Orders
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  processPayment: (paymentMethod: string, culturalDeduction: boolean, deliveryMemo: string) => Order;
  cancelOrder: (orderId: string, reason?: string) => boolean;

  // Receipt Modal
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  selectedOrderForReceipt: Order | null;
  setSelectedOrderForReceipt: (order: Order | null) => void;

  // Estimate Modal
  isEstimateModalOpen: boolean;
  setIsEstimateModalOpen: (open: boolean) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageTab>('intranet');
  const [myPageTab, setMyPageTab] = useState<'subsidy' | 'orders' | 'refund'>('subsidy');
  const [cartTab, setCartTab] = useState<'normal' | 'nowdream'>('normal');
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<string>('g-01');

  // Address Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalTab, setAddressModalTab] = useState<'list' | 'recent' | 'new'>('new');
  const sanitizeAddressItem = (a: Address): Address => {
    const isKyoboOrOld = a.roadAddress.includes('교보') || a.jibunAddress.includes('교보') || a.roadAddress.includes('종로 1') || a.roadAddress.includes('종로1가') || a.roadAddress.includes('강남대로 542 영풍빌딩 13층') || a.id === 'addr-01';

    const isOldPhone = a.phone1 && (a.phone1.includes('9243') || a.phone1.includes('6290'));

    return {
      ...a,
      phone1: isOldPhone ? '010-1345-2468' : a.phone1,
      roadAddress: isKyoboOrOld ? '서울특별시 종로구 청계천로 41 (서린동, 영풍빌딩)' : a.roadAddress,
      jibunAddress: isKyoboOrOld ? '서울특별시 종로구 서린동 33 영풍빌딩' : a.jibunAddress,
    };
  };

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('yp_addresses');
    if (saved) {
      try {
        const parsed: Address[] = JSON.parse(saved);
        const sanitized = parsed.map(sanitizeAddressItem);
        localStorage.setItem('yp_addresses', JSON.stringify(sanitized));
        return sanitized;
      } catch (e) {}
    }
    return INITIAL_ADDRESSES.map(sanitizeAddressItem);
  });

  const [selectedAddress, setSelectedAddress] = useState<Address>(() => {
    const addr = addresses[0] || INITIAL_ADDRESSES[0];
    return sanitizeAddressItem(addr);
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Receipt & Estimate Modals
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

  // Subsidy Ledger (B2B Rule Engine State)
  const [subsidyLedger, setSubsidyLedger] = useState<SubsidyLedger>(() => {
    const saved = localStorage.getItem('yp_b2b_subsidy');
    if (saved) return JSON.parse(saved);
    return {
      month: '2026-09',
      monthlyLimit: 30000,
      recommendedUsed: false,
      personalUsed: false,
      recommendedSubsidyAmount: 0,
      personalSubsidyAmount: 0,
      totalUsedSubsidy: 0,
      remainingSubsidy: 30000,
      totalEmployeePaid: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem('yp_b2b_subsidy', JSON.stringify(subsidyLedger));
  }, [subsidyLedger]);

  useEffect(() => {
    // Sanitize addresses before saving to localStorage and ensure state update if unsanitized entries exist
    const needsCleanup = addresses.some((a) => a.roadAddress.includes('교보') || a.jibunAddress.includes('교보') || a.roadAddress.includes('종로 1') || a.roadAddress.includes('종로1가') || (a.phone1 && (a.phone1.includes('9243') || a.phone1.includes('6290'))));
    if (needsCleanup) {
      const sanitized = addresses.map(sanitizeAddressItem);
      setAddresses(sanitized);
      if (selectedAddress) {
        setSelectedAddress(sanitizeAddressItem(selectedAddress));
      }
      localStorage.setItem('yp_addresses', JSON.stringify(sanitized));
    } else {
      localStorage.setItem('yp_addresses', JSON.stringify(addresses));
    }
  }, [addresses]);

  // B2B Subsidy Calculation rule
  const calculateBookSubsidy = (book: Book, formatOrQty?: BookFormat | number, qtyParam?: number) => {
    let format: BookFormat = 'paper';
    let quantity = 1;

    if (typeof formatOrQty === 'number') {
      quantity = formatOrQty;
    } else if (typeof formatOrQty === 'string') {
      format = formatOrQty as BookFormat;
      if (typeof qtyParam === 'number') {
        quantity = qtyParam;
      }
    } else if (typeof qtyParam === 'number') {
      quantity = qtyParam;
    }

    if (!book || typeof book.sellingPrice !== 'number' || isNaN(book.sellingPrice)) {
      return {
        companySubsidy: 0,
        employeePayment: 0,
        ruleExplanation: '',
        canApply: false,
      };
    }

    const singlePrice = book.sellingPrice;
    const totalSelling = singlePrice * quantity;

    if (book.bookType === 'recommended') {
      // 추천도서: 종이책만 100% 회사 지원 (월 1권 한도)
      const isEbook = format === 'ebook';
      const canApply = !subsidyLedger.recommendedUsed && !isEbook;
      const singleSubsidy = isEbook ? 0 : singlePrice;
      const companySubsidy = canApply && quantity > 0 ? singleSubsidy : 0;
      const employeePayment = Math.max(0, totalSelling - companySubsidy);
      return {
        companySubsidy,
        employeePayment,
        ruleExplanation: isEbook ? '추천도서는 종이도서만 100% 지원 가능합니다. (전자책 지원불가)' : canApply ? 'B2B 기업 추천도서 100% 전액 지원 (월 1권)' : '이번 달 추천도서 지원 한도(월 1권)를 이미 사용하셨습니다.',
        canApply,
      };
    } else if (book.bookType === 'personal') {
      // 개인도서: MIN(판매금액 * 50%, 10,000원) (월 1권 한도)
      const canApply = !subsidyLedger.personalUsed;
      const singleSubsidy = Math.min(Math.floor(singlePrice * 0.5), 10000);
      const companySubsidy = canApply && quantity > 0 ? singleSubsidy : 0;
      const employeePayment = Math.max(0, totalSelling - companySubsidy);
      return {
        companySubsidy,
        employeePayment,
        ruleExplanation: canApply ? `B2B 개인도서 50% 지원 (최대 10,000원 지원, -${companySubsidy.toLocaleString()}원 차감)` : '이번 달 개인도서 지원 한도(월 1권)를 이미 사용하셨습니다.',
        canApply,
      };
    } else {
      // 일반도서: B2B 지원금 미적용 (회사지원금 0원, 직원 전액부담)
      return {
        companySubsidy: 0,
        employeePayment: totalSelling,
        ruleExplanation: 'B2B 지원금 미적용 일반도서 (전액 본인부담)',
        canApply: false,
      };
    }
  };

  // Re-calculate cart item subsidies according to B2B Rules:
  // 1) Recommended Book: 100% company subsidy for 1 copy (employee payment = 0 KRW for 1st copy)
  // 2) Personal Book: MIN(sellingPrice * 50%, 10,000 KRW) company subsidy for 1 copy
  // 3) General Book: 0 KRW company subsidy (100% employee payment regardless of quantity)
  // 4) Quantities >= 2 for Recommended/Personal: Subsidy applies to 1 copy ONLY; additional copies are 100% employee payment.
  const recalculateCartItem = (item: CartItem): CartItem => {
    const freshBook = MOCK_BOOKS.find((b) => b.id === item.book.id) || item.book;
    const singlePrice = freshBook.sellingPrice;
    const totalSelling = singlePrice * item.quantity;
    const isGeneral = freshBook.bookType === 'general';
    const isApplied = !isGeneral && item.isSubsidyApplied === true; // 기본적으로 지원금 미적용 상태 (버튼 클릭 시에만 true)
    let singleSubsidy = 0;
    let note = '';

    if (isGeneral) {
      singleSubsidy = 0;
      note = 'B2B 지원금 미적용 일반도서 (전액 본인부담)';
    } else if (isApplied) {
      if (freshBook.bookType === 'recommended') {
        // 추천도서: 100% 회사 지원 (1권만 지원)
        singleSubsidy = singlePrice;
        note = item.quantity > 1 ? `B2B 추천도서 100% 지원 (1권 지원, ${item.quantity - 1}권 본인부담)` : 'B2B 추천도서 100% 전액 지원 (직원부담 0원)';
      } else {
        // 개인도서: MIN(판매금액 * 50%, 10,000원) (1권만 지원)
        singleSubsidy = Math.min(Math.floor(singlePrice * 0.5), 10000);
        note = item.quantity > 1 ? `B2B 개인도서 50% 지원 (1권 최대 1만원 지원, ${item.quantity - 1}권 본인부담)` : `B2B 개인도서 50% 지원 (최대 10,000원 지원, -${singleSubsidy.toLocaleString()}원 차감)`;
      }
    } else {
      singleSubsidy = 0;
      note = '지원금 미적용 (전액 본인부담)';
    }

    const companySubsidy = item.quantity > 0 && isApplied ? singleSubsidy : 0;
    const employeePayment = Math.max(0, totalSelling - companySubsidy);

    return {
      ...item,
      book: freshBook,
      isSubsidyApplied: isGeneral ? false : isApplied,
      subsidyNote: note,
      itemSellingPrice: totalSelling,
      itemCompanySubsidy: companySubsidy,
      itemEmployeePayment: employeePayment,
    };
  };

  // 지원금 월 1권 한도(지원금_rule.md §1.4)는 도서 유형(추천/개인)별로 각각 1권까지만 허용한다.
  // 장바구니 토글은 라디오 그룹처럼 유형별 상호배타적으로 동작해야 하며, 이 함수는 그 불변식을
  // 강제하는 단일 지점이다. 실제 서비스라면 결제 요청을 받는 서버가 동일한 검증을 다시 수행해야
  // 하는데(복합결제_통합정리.md, 프론트 우회 방지), 이 프로토타입에는 서버가 없으므로 cart 상태가
  // 바뀔 때마다(아래 useEffect)와 결제 진입 시점(processPayment)에 반복 호출해 같은 효과를 낸다.
  const enforceSubsidyExclusivity = (items: CartItem[]): CartItem[] => {
    const appliedTypes = new Set<CartItem['book']['bookType']>();
    let changed = false;
    const next = items.map((item) => {
      if (!item.isSubsidyApplied) return item;
      if (appliedTypes.has(item.book.bookType)) {
        changed = true;
        return recalculateCartItem({ ...item, isSubsidyApplied: false });
      }
      appliedTypes.add(item.book.bookType);
      return item;
    });
    return changed ? next : items;
  };

  // Initial cart with 3 book types (1 copy each): Recommended (18,000 KRW), Personal (20,000 KRW), General (4,950 KRW)
  // All items default to isSubsidyApplied: false
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (localStorage.getItem('yp_cart_reset_version') !== CART_RESET_VERSION) {
      localStorage.removeItem('yp_cart');
      localStorage.setItem('yp_cart_reset_version', CART_RESET_VERSION);
      return [];
    }

    const saved = localStorage.getItem('yp_cart');
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => recalculateCartItem(item));
      } catch (e) {
        // fallback if parse fails
      }
    }

    const recBook = MOCK_BOOKS.find((b) => b.id === 'b-04') || MOCK_BOOKS[3]; // 추천도서 18,000원 ('제이')
    const perBook = MOCK_BOOKS.find((b) => b.id === 'b-07') || MOCK_BOOKS[6]; // 개인도서 20,000원 ('인생을 바꾸는 투자학개론')
    const genBook = MOCK_BOOKS.find((b) => b.id === 'b-01') || MOCK_BOOKS[0]; // 일반도서 4,950원 ('소설 보다 가을 2026')

    const item1: CartItem = recalculateCartItem({
      id: 'cart-1',
      book: recBook,
      quantity: 1,
      format: recBook.format,
      deliveryType: 'normal',
      estimatedDeliveryDate: '9/16(수) 예정 (내일 출고)',
      selected: true,
      isSubsidyApplied: false,
      itemSellingPrice: recBook.sellingPrice,
      itemCompanySubsidy: 0,
      itemEmployeePayment: recBook.sellingPrice,
    });

    const item2: CartItem = recalculateCartItem({
      id: 'cart-2',
      book: perBook,
      quantity: 1,
      format: perBook.format,
      deliveryType: 'normal',
      estimatedDeliveryDate: '9/16(수) 예정 (내일 출고)',
      selected: true,
      isSubsidyApplied: false,

      itemSellingPrice: perBook.sellingPrice,
      itemCompanySubsidy: 0,
      itemEmployeePayment: perBook.sellingPrice,
    });

    const item3: CartItem = recalculateCartItem({
      id: 'cart-3',
      book: genBook,
      quantity: 1,
      format: genBook.format,
      deliveryType: 'normal',
      estimatedDeliveryDate: '9/16(수) 예정 (내일 출고)',
      selected: true,
      isSubsidyApplied: false,
      itemSellingPrice: genBook.sellingPrice,
      itemCompanySubsidy: 0,
      itemEmployeePayment: genBook.sellingPrice,
    });

    return [item1, item2, item3];
  });

  useEffect(() => {
    localStorage.setItem('yp_cart', JSON.stringify(cart));
  }, [cart]);

  // 지원금 상호배타 자가 교정 — cart가 어떻게 바뀌든(추가/삭제/새로고침) 유형별로 지원금이
  // 2건 이상 동시 적용된 상태가 되면 즉시 교정한다(최대 1건). 지원금 적용은 이제 항상 사용자가
  // 결제 페이지에서 직접 켜는 것뿐이라 자동 적용 로직은 없다 — 아무것도 바뀌지 않으면 원래 배열
  // 참조를 그대로 반환해 불필요한 재렌더를 막는다.
  useEffect(() => {
    setCart((prev) => enforceSubsidyExclusivity(prev));
  }, [cart]);

  // Orders history
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('yp_orders');
    if (saved) return JSON.parse(saved);

    // Initial mock order (8월 독서 지원 프로그램 주문 내역)
    const pastBook = MOCK_BOOKS.find((b) => b.id === 'b-04') || MOCK_BOOKS[3];
    return [
      {
        orderId: 'YP-20260812-49102',
        orderDate: '2026-08-12 14:23',
        employeeId: 'EMP-20240901',
        employeeName: '김민서',
        employeePhone: '010-1345-2468',
        employeeEmail: 'junkyo.jung@ypbooks.co.kr',
        items: [
          {
            bookId: pastBook.id,
            title: pastBook.title,
            author: pastBook.author,
            coverImage: pastBook.coverImage,
            format: 'paper',
            bookType: 'recommended',
            quantity: 1,
            listPrice: pastBook.listPrice,
            sellingPrice: pastBook.sellingPrice,
            companySubsidy: pastBook.sellingPrice,
            employeePayment: 0,
          },
        ],
        totalListPrice: 18000,
        totalSellingPrice: 16200,
        totalDiscount: 1800,
        totalCompanySubsidy: 16200,
        totalEmployeePayment: 0,
        shippingFee: 0,
        finalPaidAmount: 0,
        pointsUsed: 0,
        deliveryAddress: INITIAL_ADDRESSES[0],
        deliveryMemo: '문 앞에 놓아주세요.',
        paymentMethod: 'B2B 회사 전액 지원 (0원 결제)',
        culturalDeduction: true,
        status: '배송완료',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('yp_orders', JSON.stringify(orders));
  }, [orders]);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const addToCart = (book: Book, format: BookFormat = 'paper', quantity = 1, directToPayment = false) => {
    // Check monthly limit warnings
    if (book.bookType === 'recommended' && subsidyLedger.recommendedUsed) {
      showToast('⚠️ 이번 달 추천도서 100% 지원은 이미 사용 완료되었습니다.');
    } else if (book.bookType === 'personal' && subsidyLedger.personalUsed) {
      showToast('⚠️ 이번 달 개인도서 50% 지원은 이미 사용 완료되었습니다.');
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.book.id === book.id && i.format === format);
      if (existing) {
        return prev.map((i) => (i.id === existing.id ? recalculateCartItem({ ...i, quantity: i.quantity + quantity }) : i));
      }
      const newItem: CartItem = recalculateCartItem({
        id: `cart-${Date.now()}`,
        book,
        quantity,
        format,
        deliveryType: 'normal',
        estimatedDeliveryDate: '9/16(수) 예정 (내일 출고)',
        selected: true,
        isSubsidyApplied: false, // 기본적으로 미적용 상태로 추가 — 추천/개인도서 모두 장바구니 토글로 사용자가 직접 적용한다.
        itemSellingPrice: book.sellingPrice * quantity,
        itemCompanySubsidy: 0,
        itemEmployeePayment: book.sellingPrice * quantity,
      });
      return [...prev, newItem];
    });

    if (directToPayment) {
      setActivePage('payment');
    } else {
      showToast(`'${book.title}'이(가) 장바구니에 담겼습니다.`);
    }
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) => prev.map((i) => (i.id === id ? recalculateCartItem({ ...i, quantity: newQty }) : i)));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    showToast('상품이 장바구니에서 삭제되었습니다.');
  };

  const removeSelectedFromCart = () => {
    setCart((prev) => prev.filter((i) => !i.selected));
    showToast('선택한 상품이 삭제되었습니다.');
  };

  const toggleItemSelection = (id: string) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));
  };

  const toggleAllSelection = (selected: boolean) => {
    setCart((prev) => prev.map((i) => ({ ...i, selected })));
  };

  const applyCartSubsidy = (id: string) => {
    const target = cart.find((item) => item.id === id);
    if (!target) return;

    // 같은 유형(추천/개인)은 월 1권 한도이므로 라디오 그룹처럼 동작해야 한다 — 새로 켜는 항목 외에
    // 같은 유형에서 이미 켜져 있던 항목은 자동으로 끈다.
    const previouslyApplied = cart.find((item) => item.id !== id && item.book.bookType === target.book.bookType && item.isSubsidyApplied);

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) return recalculateCartItem({ ...item, isSubsidyApplied: true });
        if (item.book.bookType === target.book.bookType && item.isSubsidyApplied) {
          return recalculateCartItem({ ...item, isSubsidyApplied: false });
        }
        return item;
      }),
    );

    if (previouslyApplied) {
      showToast(`지원금 적용을 『${previouslyApplied.book.title}』에서 『${target.book.title}』(으)로 변경했어요.`);
    } else {
      showToast('회사 지원금이 정상 적용되었습니다.');
    }
  };

  const removeCartSubsidy = (id: string) => {
    setCart((prev) => prev.map((item) => (item.id === id ? recalculateCartItem({ ...item, isSubsidyApplied: false }) : item)));
    showToast('지원금 적용이 취소되어 전액 본인부담으로 변경되었습니다.');
  };

  // Addresses
  const addAddress = (newAddrData: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...newAddrData,
      id: `addr-${Date.now()}`,
    };
    if (newAddress.isDefault) {
      setAddresses((prev) => [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))]);
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }
    setSelectedAddress(newAddress);
    setIsAddressModalOpen(false);
    showToast('배송지가 정상적으로 등록되었습니다.');
  };

  // Cart / Payment stats calculation
  const selectedItems = cart.filter((i) => i.selected);
  const totalListPrice = selectedItems.reduce((acc, i) => acc + i.book.listPrice * i.quantity, 0);
  const totalSellingPrice = selectedItems.reduce((acc, i) => acc + i.itemSellingPrice, 0);
  const totalProductDiscount = totalListPrice - totalSellingPrice;
  const totalCompanySubsidy = selectedItems.reduce((acc, i) => acc + i.itemCompanySubsidy, 0);
  const totalEmployeePayment = selectedItems.reduce((acc, i) => acc + i.itemEmployeePayment, 0);

  // Free shipping policy: free over 10,000 won or 30,000 won (matches cart.png: 5,500원 도서 시 2,500원 배송비)
  const FREE_SHIPPING_THRESHOLD = 30000;
  const shippingFee = selectedItems.length === 0 || totalSellingPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 2500;
  const freeShippingShortfall = Math.max(0, FREE_SHIPPING_THRESHOLD - totalSellingPrice);
  const freeShippingProgress = Math.min(100, Math.round((totalSellingPrice / FREE_SHIPPING_THRESHOLD) * 100));
  const finalPaymentAmount = totalEmployeePayment + shippingFee;
  const totalRewardPoints = selectedItems.reduce((acc, i) => acc + i.book.rewardPoint * i.quantity, 0);

  const cartStats = {
    totalListPrice,
    totalSellingPrice,
    totalProductDiscount,
    totalCompanySubsidy,
    totalEmployeePayment,
    shippingFee,
    finalPaymentAmount,
    totalRewardPoints,
    freeShippingShortfall,
    freeShippingProgress,
    selectedCount: selectedItems.length,
  };

  // Payment process - generates 1 unified Order ID managing company subsidy + employee payment
  const processPayment = (paymentMethod: string, culturalDeduction: boolean, deliveryMemo: string): Order => {
    // 결제 진입 시 재검증 지점 — 실제 서비스라면 서버가 결제 요청을 받을 때 "유형별 지원금 적용이
    // 1건 이하인지"를 다시 검사해야 한다(지원금_rule.md §1.4 월 1권 한도, 복합결제_통합정리.md 4장
    // "프론트 우회로 여러 건이 넘어올 가능성 차단"). 서버가 없는 프로토타입이므로, 실제 결제 금액을
    // 확정하는 이 시점에 다시 한 번 명시적으로 sanitize하여 화면 표시값을 그대로 믿지 않는다.
    const verifiedItems = enforceSubsidyExclusivity(selectedItems);
    const verifiedTotalCompanySubsidy = verifiedItems.reduce((acc, i) => acc + i.itemCompanySubsidy, 0);
    const verifiedTotalEmployeePayment = verifiedItems.reduce((acc, i) => acc + i.itemEmployeePayment, 0);
    const verifiedFinalPaidAmount = verifiedTotalEmployeePayment + shippingFee;

    const orderId = `YP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const orderItems = verifiedItems.map((item) => ({
      bookId: item.book.id,
      title: item.book.title,
      author: item.book.author,
      coverImage: item.book.coverImage,
      coverBackground: item.book.coverBackground,
      format: item.format,
      bookType: item.book.bookType,
      quantity: item.quantity,
      listPrice: item.book.listPrice,
      sellingPrice: item.itemSellingPrice,
      companySubsidy: item.itemCompanySubsidy,
      employeePayment: item.itemEmployeePayment,
      isSubsidyApplied: item.isSubsidyApplied,
      subsidyNote: item.subsidyNote,
    }));

    const newOrder: Order = {
      orderId,
      orderDate: formattedDate,
      employeeId: 'EMP-20240901',
      employeeName: selectedAddress.recipient || '김민서',
      employeePhone: selectedAddress.phone1 || '010-1345-2468',
      employeeEmail: 'junkyo.jung@ypbooks.co.kr',
      items: orderItems,
      totalListPrice,
      totalSellingPrice,
      totalDiscount: totalProductDiscount,
      totalCompanySubsidy: verifiedTotalCompanySubsidy,
      totalEmployeePayment: verifiedTotalEmployeePayment,
      shippingFee,
      finalPaidAmount: verifiedFinalPaidAmount,
      pointsUsed: 0,
      earnedPoints: totalRewardPoints,
      deliveryAddress: selectedAddress,
      deliveryMemo: deliveryMemo || '문 앞에 놓아주세요.',
      paymentMethod,
      culturalDeduction,
      status: '결제완료',
    };

    // Update B2B Subsidy Ledger (Simultaneous DB update for corporate subsidy + monthly limits)
    setSubsidyLedger((prev) => {
      // 월 1권 한도는 "지원금이 실제로 적용된" 구매에만 소비된다 — 지원금 미적용으로 담긴
      // 추천/개인도서(전액 본인부담)까지 한도를 소진시키면 안 된다.
      const hasRecommended = orderItems.some((i) => i.bookType === 'recommended' && i.isSubsidyApplied);
      const hasPersonal = orderItems.some((i) => i.bookType === 'personal' && i.isSubsidyApplied);
      const addedSubsidy = verifiedTotalCompanySubsidy;

      return {
        ...prev,
        recommendedUsed: prev.recommendedUsed || hasRecommended,
        personalUsed: prev.personalUsed || hasPersonal,
        recommendedBookTitle: hasRecommended ? orderItems.find((i) => i.bookType === 'recommended' && i.isSubsidyApplied)?.title : prev.recommendedBookTitle,
        personalBookTitle: hasPersonal ? orderItems.find((i) => i.bookType === 'personal' && i.isSubsidyApplied)?.title : prev.personalBookTitle,
        totalUsedSubsidy: prev.totalUsedSubsidy + addedSubsidy,
        remainingSubsidy: Math.max(0, prev.remainingSubsidy - addedSubsidy),
        totalEmployeePaid: prev.totalEmployeePaid + verifiedTotalEmployeePayment,
      };
    });

    // Save order & clear paid items from cart
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setCart((prev) => prev.filter((i) => !i.selected));

    setActivePage('complete');
    showToast(`주문번호 ${orderId} 결제가 정상 완료되었습니다.`);
    return newOrder;
  };

  // Reverse transaction: Refund / Cancel order with simultaneous restoration of corporate subsidy + monthly quota!
  const cancelOrder = (orderId: string, reason = '고객 변심 및 재신청 요청'): boolean => {
    const orderToCancel = orders.find((o) => o.orderId === orderId);
    if (!orderToCancel || orderToCancel.isRefunded) return false;

    // Restore B2B Subsidy Ledger
    setSubsidyLedger((prev) => {
      // 취소 복원도 결제 시와 동일하게 "실제로 지원금이 적용됐던" 항목 기준으로만 월 1권 한도를 되돌린다.
      const hasRecommended = orderToCancel.items.some((i) => i.bookType === 'recommended' && i.isSubsidyApplied);
      const hasPersonal = orderToCancel.items.some((i) => i.bookType === 'personal' && i.isSubsidyApplied);
      const restoredSubsidy = orderToCancel.totalCompanySubsidy;

      return {
        ...prev,
        recommendedUsed: hasRecommended ? false : prev.recommendedUsed,
        personalUsed: hasPersonal ? false : prev.personalUsed,
        totalUsedSubsidy: Math.max(0, prev.totalUsedSubsidy - restoredSubsidy),
        remainingSubsidy: Math.min(prev.monthlyLimit, prev.remainingSubsidy + restoredSubsidy),
        totalEmployeePaid: Math.max(0, prev.totalEmployeePaid - orderToCancel.totalEmployeePayment),
      };
    });

    // Mark order as cancelled
    const now = new Date();
    const refundDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              status: '주문취소',
              isRefunded: true,
              refundDate,
              refundReason: reason,
            }
          : o,
      ),
    );

    showToast(`주문 취소 및 환불 완료: B2B 기업 지원금(${orderToCancel.totalCompanySubsidy.toLocaleString()}원)과 월 1권 신청 한도가 즉시 복원되었습니다.`);
    return true;
  };

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        myPageTab,
        setMyPageTab,
        books: [...MOCK_BOOKS, ...PROTOTYPE_ALL_BOOKS],
        selectedBookForDetail,
        setSelectedBookForDetail,
        cart,
        cartTab,
        setCartTab,
        addToCart,
        updateQuantity,
        removeFromCart,
        removeSelectedFromCart,
        toggleItemSelection,
        toggleAllSelection,
        applyCartSubsidy,
        removeCartSubsidy,
        selectedGiftId,
        setSelectedGiftId,
        cartStats,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        isAddressModalOpen,
        setIsAddressModalOpen,
        addressModalTab,
        setAddressModalTab,
        subsidyLedger,
        calculateBookSubsidy,
        orders,
        currentOrder,
        setCurrentOrder,
        processPayment,
        cancelOrder,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        selectedOrderForReceipt,
        setSelectedOrderForReceipt,
        isEstimateModalOpen,
        setIsEstimateModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
