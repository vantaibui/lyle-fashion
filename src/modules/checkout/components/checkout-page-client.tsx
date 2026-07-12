'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ErrorState } from '@/components/commerce/error-state';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormMessage } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Radio } from '@/components/ui/radio';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';
import type { FreeShippingProgress } from '@/modules/cart/api/cart-client';
import {
  dispatchCartUpdated,
  estimateShipping,
  submitCheckout,
} from '@/modules/cart/api/cart-client';
import { CartSummaryCard } from '@/modules/cart/components/cart-summary-card';
import type { Cart } from '@/modules/cart/contracts/cart';
import type {
  ShippingAddress,
  VietnamProvince,
} from '@/modules/customer/contracts/address';
import type { PaymentMethodOption } from '@/modules/payment/contracts/payment';

type CheckoutFieldErrors = Partial<
  Record<keyof ShippingAddress | 'acceptedTerms', string>
>;

export function CheckoutPageClient({
  addressOptions,
  initialCart,
  initialFreeShippingProgress,
  paymentOptions,
}: {
  addressOptions: VietnamProvince[];
  initialCart: Cart;
  initialFreeShippingProgress: FreeShippingProgress;
  paymentOptions: PaymentMethodOption[];
}) {
  const router = useRouter();
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [cart, setCart] = useState(initialCart);
  const [freeShippingProgress, setFreeShippingProgress] = useState(
    initialFreeShippingProgress,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShippingPending, setIsShippingPending] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [form, setForm] = useState({
    acceptedTerms: false,
    deliveryNote: '',
    districtCode: '',
    districtName: '',
    email: '',
    fullName: '',
    paymentMethod: paymentOptions[0]?.code ?? 'cod',
    phone: '',
    provinceCode: '',
    provinceName: '',
    shippingMethod: 'standard' as 'express' | 'pickup' | 'standard',
    streetAddress: '',
    wardCode: '',
    wardName: '',
  });

  const province = addressOptions.find(
    (item) => item.code === form.provinceCode,
  );
  const district = province?.districts.find(
    (item) => item.code === form.districtCode,
  );

  const errorList = useMemo(
    () => Object.entries(fieldErrors).filter((entry) => Boolean(entry[1])),
    [fieldErrors],
  );

  useEffect(() => {
    noStorefrontAnalytics({
      name: 'begin_checkout',
      properties: {
        lineCount: cart.lines.length,
      },
    });
  }, [cart.lines.length]);

  function setField<K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateForm() {
    const nextErrors: CheckoutFieldErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Nhập họ tên người nhận.';
    if (!form.phone.trim()) nextErrors.phone = 'Nhập số điện thoại.';
    if (!form.email.trim()) nextErrors.email = 'Nhập email liên hệ.';
    if (!form.provinceCode)
      nextErrors.provinceCode = 'Chọn tỉnh hoặc thành phố.';
    if (!form.districtCode) nextErrors.districtCode = 'Chọn quận hoặc huyện.';
    if (!form.wardCode) nextErrors.wardCode = 'Chọn phường hoặc xã.';
    if (!form.streetAddress.trim())
      nextErrors.streetAddress = 'Nhập địa chỉ cụ thể.';
    if (!form.acceptedTerms)
      nextErrors.acceptedTerms = 'Bạn cần đồng ý điều khoản xử lý đơn hàng.';
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return false;
    }
    return true;
  }

  async function refreshShippingEstimate() {
    if (!province || !district) return;
    setIsShippingPending(true);
    const response = await estimateShipping({
      districtCode: district.code,
      districtName: district.name,
      method: form.shippingMethod,
      provinceCode: province.code,
      provinceName: province.name,
    });
    setIsShippingPending(false);
    if (response.error || !response.data) {
      setServerError('Không thể xác nhận lại phí giao hàng.');
      noStorefrontAnalytics({
        name: 'checkout_error',
        properties: { step: 'shipping' },
      });
      return false;
    }
    setCart(response.data.cart);
    setFreeShippingProgress(response.data.freeShippingProgress);
    noStorefrontAnalytics({
      name: 'add_shipping_info',
      properties: { method: form.shippingMethod },
    });
    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;
    const shippingReady = await refreshShippingEstimate();
    if (!shippingReady) return;

    setIsSubmitting(true);
    setServerError(undefined);
    const idempotencyKey = crypto.randomUUID();
    const response = await submitCheckout(
      {
        acceptedTerms: form.acceptedTerms,
        address: {
          districtCode: form.districtCode,
          districtName: district?.name ?? form.districtName,
          email: form.email,
          fullName: form.fullName,
          phone: form.phone,
          provinceCode: form.provinceCode,
          provinceName: province?.name ?? form.provinceName,
          streetAddress: form.streetAddress,
          wardCode: form.wardCode,
          wardName:
            district?.wards.find((item) => item.code === form.wardCode)?.name ??
            form.wardName,
        },
        contact: {
          email: form.email,
          fullName: form.fullName,
          phone: form.phone,
        },
        deliveryNote: form.deliveryNote,
        paymentMethod: form.paymentMethod,
        shippingMethod: form.shippingMethod,
      },
      idempotencyKey,
    );
    setIsSubmitting(false);

    if (response.error || !response.data) {
      setServerError(
        response.error?.code === 'CONFLICT'
          ? 'Giỏ hàng vừa thay đổi. Hãy kiểm tra lại tổng tiền và phí giao hàng.'
          : 'Không thể tạo đơn hàng lúc này. Vui lòng thử lại.',
      );
      noStorefrontAnalytics({
        name: 'checkout_error',
        properties: { code: response.error?.code ?? 'UNKNOWN' },
      });
      return;
    }

    noStorefrontAnalytics({
      name: 'add_payment_info',
      properties: { method: form.paymentMethod },
    });
    noStorefrontAnalytics({
      name: 'purchase',
      properties: { orderCode: response.data.checkout.order.code },
    });
    dispatchCartUpdated({ source: 'checkout' });
    router.push(response.data.checkout.redirectUrl);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-8">
        <header className="grid gap-2">
          <p className="text-text-subtle text-sm tracking-[0.18em] uppercase">
            Thanh toán
          </p>
          <h1 className="font-display text-3xl">Hoàn tất đơn hàng</h1>
        </header>
        {errorList.length > 0 ? (
          <div
            className="border-danger bg-danger-surface grid gap-2 border p-4"
            ref={errorSummaryRef}
            role="alert"
            tabIndex={-1}
          >
            <h2 className="font-medium">Kiểm tra lại thông tin</h2>
            <ul className="grid gap-1 text-sm">
              {errorList.map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {serverError ? <ErrorState description={serverError} /> : null}
        <section className="grid gap-5">
          <h2 className="font-display text-xl">Thông tin liên hệ</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField htmlFor="fullName" label="Họ và tên" required>
              <Input
                autoComplete="name"
                id="fullName"
                isInvalid={Boolean(fieldErrors.fullName)}
                onChange={(event) => setField('fullName', event.target.value)}
                value={form.fullName}
              />
              {fieldErrors.fullName ? (
                <FormMessage tone="error">{fieldErrors.fullName}</FormMessage>
              ) : null}
            </FormField>
            <FormField htmlFor="phone" label="Số điện thoại" required>
              <Input
                autoComplete="tel"
                id="phone"
                inputMode="tel"
                isInvalid={Boolean(fieldErrors.phone)}
                onChange={(event) => setField('phone', event.target.value)}
                type="tel"
                value={form.phone}
              />
              {fieldErrors.phone ? (
                <FormMessage tone="error">{fieldErrors.phone}</FormMessage>
              ) : null}
            </FormField>
          </div>
          <FormField htmlFor="email" label="Email" required>
            <Input
              autoComplete="email"
              id="email"
              isInvalid={Boolean(fieldErrors.email)}
              onChange={(event) => setField('email', event.target.value)}
              spellCheck={false}
              type="email"
              value={form.email}
            />
            {fieldErrors.email ? (
              <FormMessage tone="error">{fieldErrors.email}</FormMessage>
            ) : null}
          </FormField>
        </section>
        <section className="grid gap-5">
          <h2 className="font-display text-xl">Địa chỉ giao hàng</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField htmlFor="province" label="Tỉnh hoặc thành phố" required>
              <Select
                autoComplete="address-level1"
                id="province"
                isInvalid={Boolean(fieldErrors.provinceCode)}
                onChange={(event) => {
                  const nextProvince =
                    addressOptions.find(
                      (item) => item.code === event.target.value,
                    ) ?? null;
                  setForm((current) => ({
                    ...current,
                    districtCode: '',
                    provinceCode: event.target.value,
                    provinceName: nextProvince?.name ?? '',
                    wardCode: '',
                  }));
                }}
                value={form.provinceCode}
              >
                <option value="">Chọn tỉnh hoặc thành phố</option>
                {addressOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {fieldErrors.provinceCode ? (
                <FormMessage tone="error">
                  {fieldErrors.provinceCode}
                </FormMessage>
              ) : null}
            </FormField>
            <FormField htmlFor="district" label="Quận hoặc huyện" required>
              <Select
                autoComplete="address-level2"
                disabled={!province}
                id="district"
                isInvalid={Boolean(fieldErrors.districtCode)}
                onChange={(event) => {
                  const nextDistrict =
                    province?.districts.find(
                      (item) => item.code === event.target.value,
                    ) ?? null;
                  setForm((current) => ({
                    ...current,
                    districtCode: event.target.value,
                    districtName: nextDistrict?.name ?? '',
                    wardCode: '',
                  }));
                }}
                value={form.districtCode}
              >
                <option value="">Chọn quận hoặc huyện</option>
                {province?.districts.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {fieldErrors.districtCode ? (
                <FormMessage tone="error">
                  {fieldErrors.districtCode}
                </FormMessage>
              ) : null}
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField htmlFor="ward" label="Phường hoặc xã" required>
              <Select
                autoComplete="address-level3"
                disabled={!district}
                id="ward"
                isInvalid={Boolean(fieldErrors.wardCode)}
                onChange={(event) => {
                  const ward =
                    district?.wards.find(
                      (item) => item.code === event.target.value,
                    ) ?? null;
                  setForm((current) => ({
                    ...current,
                    wardCode: event.target.value,
                    wardName: ward?.name ?? '',
                  }));
                }}
                value={form.wardCode}
              >
                <option value="">Chọn phường hoặc xã</option>
                {district?.wards.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {fieldErrors.wardCode ? (
                <FormMessage tone="error">{fieldErrors.wardCode}</FormMessage>
              ) : null}
            </FormField>
            <FormField htmlFor="streetAddress" label="Địa chỉ cụ thể" required>
              <Input
                autoComplete="street-address"
                id="streetAddress"
                isInvalid={Boolean(fieldErrors.streetAddress)}
                onChange={(event) =>
                  setField('streetAddress', event.target.value)
                }
                value={form.streetAddress}
              />
              {fieldErrors.streetAddress ? (
                <FormMessage tone="error">
                  {fieldErrors.streetAddress}
                </FormMessage>
              ) : null}
            </FormField>
          </div>
          <FormField htmlFor="deliveryNote" label="Ghi chú giao hàng">
            <Textarea
              id="deliveryNote"
              onChange={(event) => setField('deliveryNote', event.target.value)}
              rows={4}
              value={form.deliveryNote}
            />
          </FormField>
        </section>
        <section className="grid gap-5">
          <h2 className="font-display text-xl">Phương thức giao hàng</h2>
          <div className="grid gap-2">
            <Radio
              checked={form.shippingMethod === 'standard'}
              label="Giao hàng tiêu chuẩn"
              name="shippingMethod"
              onChange={() => setField('shippingMethod', 'standard')}
            />
            <Radio
              checked={form.shippingMethod === 'express'}
              label="Giao hàng nhanh"
              name="shippingMethod"
              onChange={() => setField('shippingMethod', 'express')}
            />
            <Radio
              checked={form.shippingMethod === 'pickup'}
              label="Nhận tại cửa hàng"
              name="shippingMethod"
              onChange={() => setField('shippingMethod', 'pickup')}
            />
            <Button
              isLoading={isShippingPending}
              onClick={() => void refreshShippingEstimate()}
              variant="secondary"
            >
              Cập nhật phí giao hàng
            </Button>
          </div>
        </section>
        <section className="grid gap-5">
          <h2 className="font-display text-xl">Phương thức thanh toán</h2>
          <div className="grid gap-2">
            {paymentOptions.map((method) => (
              <Radio
                checked={form.paymentMethod === method.code}
                description={method.statusMessage ?? method.description}
                key={method.code}
                label={method.label}
                name="paymentMethod"
                onChange={() => setField('paymentMethod', method.code)}
              />
            ))}
          </div>
        </section>
        <Checkbox
          checked={form.acceptedTerms}
          description="Foundation này chưa thay thế văn bản pháp lý đã duyệt."
          isInvalid={Boolean(fieldErrors.acceptedTerms)}
          label="Tôi đồng ý để LYLE xử lý đơn hàng và thông tin giao nhận."
          onChange={(event) => setField('acceptedTerms', event.target.checked)}
        />
      </div>
      <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
        <CartSummaryCard
          cart={cart}
          freeShippingProgress={freeShippingProgress}
        />
        <Button
          className="w-full"
          isLoading={isSubmitting}
          onClick={() => void handleSubmit()}
        >
          Đặt hàng
        </Button>
      </aside>
    </div>
  );
}
