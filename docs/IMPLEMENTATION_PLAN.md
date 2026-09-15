# 장바구니 B2B 지원금 계산 로직 수정 및 수량별 실시간 재계산 구현 계획

현재 장바구니 화면의 B2B 기업 지원금 계산 및 표시 로직상의 3가지 문제를 해결하고, 동일 상품 2개 이상 주문 시 "월 1권 지원" 정책에 맞춘 수량별 실시간 지원금 분할 계산 로직 및 UI를 구현합니다.

## User Review Required

> [!IMPORTANT]
> **주요 변경 사항 및 지원금 계산 규칙 정리**
> 1. **추천도서**: 1권에 대해 판매금액의 **100% 전액 지원** (직원 부담금 0원).
> 2. **개인도서**: 1권에 대해 **`MIN(판매금액 × 50%, 10,000원)` 지원**. (47,790원 도서의 경우 50%=23,895원이나 상한선 10,000원 적용, 직원 부담 37,790원).
> 3. **수량 2개 이상 선택 시**: B2B 지원금은 **"1권"에만 적용**되며, 2권째 이후 수량은 **직원 전액 부담**으로 자동 분할 계산됩니다.
>    - 예시 (개인도서, 단가 20,000원, 수량 2개):
>      - 1권째 (지원금 적용): 20,000원 → 회사지원 -10,000원 → 직원부담 10,000원
>      - 2권째 이후 (지원금 미적용, 1권): 20,000원 × 1권 → 직원 전액부담 20,000원
>      - 해당 상품 직원부담 합계: 30,000원

---

## Proposed Changes

### Context & Logic Layer

#### [MODIFY] [ShopContext.tsx](file:///c:/Users/JSK/OneDrive/Ai_PM%EA%B3%BC%EC%A0%95%28share%29/01_%EC%98%81%ED%92%8D%EB%AC%B8%EA%B3%A0/YP_PAYMENTS/src/context/ShopContext.tsx)
- `recalculateCartItem` 함수 수정:
  - 단가(`singlePrice = item.book.sellingPrice`) 기준 1권당 지원금(`singleSubsidy`) 산출:
    - 추천도서: `singlePrice` (100%)
    - 개인도서: `Math.min(Math.floor(singlePrice * 0.5), 10000)` (50% 최대 1만원)
  - 상품 전체 회사 지원금(`itemCompanySubsidy`) = 수량이 1개 이상이면 **오직 1권 분량(`singleSubsidy`)만 적용**.
  - 상품 전체 직원 부담금(`itemEmployeePayment`) = `(singlePrice × quantity) - itemCompanySubsidy`.
- `calculateBookSubsidy` 함수 수정 (47,790원 등 단가별 상한 10,000원 정확 계산).
- `localStorage` 장바구니 로드시 저장된 아이템을 최신 계산 로직으로 재계산(`recalculateCartItem`)하도록 처리.
- 기본 장바구니 Mock 데이터를 요구사항 테스트 케이스에 맞게 설정:
  - 추천도서 1권 (18,000원)
  - 개인도서 2권 (단가 20,000원, 수량 2)

---

### Component Layer & UI

#### [MODIFY] [CartPage.tsx](file:///c:/Users/JSK/OneDrive/Ai_PM%EA%B3%BC%EC%A0%95%28share%29/01_%EC%98%81%ED%92%8D%EB%AC%B8%EA%B3%A0/YP_PAYMENTS/src/pages/CartPage.tsx)
1. **뱃지 문구 수정**:
   - 추천도서: `"B2B 추천도서 (100% 지원)"`
   - 개인도서: `"B2B 개인도서 (50% 지원, 최대 1만원)"`
2. **수량 2개 이상 시 지원금 분할 내역 표시**:
   - 상품 카드 내에 지원금 적용 1권째와 지원금 미적용 2권째 이후 수량 및 금액을 직관적으로 구분 표시.
3. **실시간 수량 조절 반영**:
   - `+`, `-` 수량 변경 시 `updateQuantity`를 통해 즉시 1권 지원 + 나머지 전액 부담금으로 실시간 재계산.
   - 수량을 1개로 줄일 경우 즉시 1권 지원금 적용 상태로 복귀.
4. **우측 주문 요약 순서 및 합계 검증**:
   - 총 도서정가 → 도서 기본 할인 → 도서 실판매가 합계 → B2B 회사 지원금(추천+개인 합산) → 배송비 → 직원 실결제금액 순으로 명확한 흐름 제공.

#### [MODIFY] [PaymentPage.tsx](file:///c:/Users/JSK/OneDrive/Ai_PM%EA%B3%BC%EC%A0%95%28share%29/01_%EC%98%81%ED%92%8D%EB%AC%B8%EA%B3%A0/YP_PAYMENTS/src/pages/PaymentPage.tsx)
- 결제 확인 테이블에서도 수량별 분할 계산된 회사 지원금과 직원 실결제액이 장바구니와 일치하도록 반영.

---

## Verification Plan

### Automated Tests
- TypeScript 타입 체킹: `npx tsc --noEmit`

### Manual Verification & Test Cases

1. **개인도서 단가별 1권 지원금 검증**:
   - 10,000원 도서 → 회사지원 5,000원 / 직원부담 5,000원
   - 20,000원 도서 → 회사지원 10,000원 / 직원부담 10,000원
   - 30,000원 도서 → 회사지원 10,000원 / 직원부담 20,000원
   - 47,790원 도서 → 회사지원 10,000원 / 직원부담 37,790원

2. **종합 테스트 케이스 (추천도서 1권 18,000원 + 개인도서 2권 단가 20,000원)**:
   - 추천도서 1권: 회사지원 18,000원 / 직원부담 0원
   - 개인도서 1권째: 회사지원 10,000원 / 직원부담 10,000원
   - 개인도서 2권째: 회사지원 0원 / 직원부담 20,000원
   - **종합 합계**:
     - 도서 실판매가 합계: 58,000원
     - B2B 회사 지원금 합계: 28,000원
     - 배송비: 0원 (3만원 이상)
     - **직원 실결제금액: 30,000원**
