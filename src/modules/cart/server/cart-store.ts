import 'server-only';

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import type {
  CheckoutInput,
  CheckoutResult,
} from '@/modules/checkout/contracts/checkout';
import type { ShippingAddress } from '@/modules/customer/contracts/address';
import type { PublicOrder } from '@/modules/order/contracts/order';
import {
  type PaymentAttempt,
  type PaymentMethodOption,
  type PaymentMethodType,
} from '@/modules/payment/contracts/payment';
import type {
  AppliedPromotion,
  PromotionAttemptResult,
} from '@/modules/promotion/contracts/promotion';
import type {
  BundleCartLineInput,
  CartLineIntentInput,
  SimpleCartLineInput,
} from '@/modules/cart/contracts/cart-intent';
import type {
  Cart,
  CartLine,
  CartLineBuildComponent,
  CartValidationMessage,
  ShippingEstimate,
} from '@/modules/cart/contracts/cart';
import { ApiError } from '@/lib/api/error';
import { getMockProductById } from '@/modules/product/api/mock-product-adapter';

const CART_COOKIE_NAME = 'lyle_cart';
const CUSTOMER_COOKIE_NAME = 'lyle_customer';
const ORDER_ACCESS_COOKIE_NAME = 'lyle_order_access';
const CART_TTL_MS = 1000 * 60 * 60 * 24 * 14;
const FREE_SHIPPING_THRESHOLD = 1_200_000;

const carts = new Map<string, Cart>();
const cartIdsByCustomer = new Map<string, string>();
const orders = new Map<string, PublicOrder>();
const orderAccess = new Map<string, string>();
const idempotentCheckoutResults = new Map<string, CheckoutResult>();

type CartCookieIntent = {
  cartId?: string;
  customerId?: string;
};

type CartMutationResult = {
  cart: Cart;
  mergeSummary?: Cart['mergeSummary'];
  order?: PublicOrder;
  paymentAttempt?: PaymentAttempt;
  setCartCookie?: string;
  setOrderAccessCookie?: string;
};

function nowIso() {
  return new Date().toISOString();
}

function nextExpiryIso() {
  return new Date(Date.now() + CART_TTL_MS).toISOString();
}

function createEmptyCart(id: string, customerId?: string): Cart {
  return {
    currency: 'VND',
    customerId,
    expiresAt: nextExpiryIso(),
    id,
    lines: [],
    promotionCodes: [],
    status: 'active',
    totals: {
      discountTotal: 0,
      grandTotal: 0,
      shippingEstimate: 0,
      subtotal: 0,
      taxTotal: 0,
    },
    validationMessages: [],
    version: 1,
  };
}

function cloneCart(cart: Cart): Cart {
  return structuredClone(cart);
}

function incrementVersion(cart: Cart) {
  cart.version += 1;
  cart.expiresAt = nextExpiryIso();
}

function recalculateCart(cart: Cart): Cart {
  const validationMessages: CartValidationMessage[] = [];
  let subtotal = 0;

  cart.lines = cart.lines.map((line) => {
    const nextLine = { ...line, lineTotal: line.price * line.quantity };
    subtotal += nextLine.lineTotal;
    if (nextLine.validationMessages.length > 0) {
      validationMessages.push(...nextLine.validationMessages);
    }
    return nextLine;
  });

  let discountTotal = 0;
  const promotionAllocations = new Map<string, number>();

  for (const promotion of cart.promotionCodes) {
    if (promotion.code === 'DEV10') {
      const amount = Math.min(Math.round(subtotal * 0.1), 150_000);
      discountTotal += amount;
      if (cart.lines[0]) {
        promotionAllocations.set(
          cart.lines[0].lineId,
          (promotionAllocations.get(cart.lines[0].lineId) ?? 0) + amount,
        );
      }
      promotion.amount = amount;
      continue;
    }

    if (promotion.code === 'DEVSHIP') {
      promotion.amount = 0;
      continue;
    }
  }

  cart.lines = cart.lines.map((line) => ({
    ...line,
    promotionAllocations: promotionAllocations.has(line.lineId)
      ? [
          {
            amount: promotionAllocations.get(line.lineId) ?? 0,
            code: 'DEV10',
            lineId: line.lineId,
          },
        ]
      : [],
  }));

  const shippingAmount =
    cart.shippingEstimate?.amount ??
    (subtotal >= FREE_SHIPPING_THRESHOLD ||
    cart.promotionCodes.some((promotion) => promotion.code === 'DEVSHIP')
      ? 0
      : subtotal > 0
        ? 30_000
        : 0);

  cart.totals = {
    discountTotal,
    grandTotal: Math.max(0, subtotal - discountTotal + shippingAmount),
    shippingEstimate: shippingAmount,
    subtotal,
    taxTotal: 0,
  };
  cart.validationMessages = validationMessages;
  return cart;
}

function normalizeSimpleLine(input: SimpleCartLineInput): CartLine {
  const product = getMockProductById(input.productId);
  if (!product || product.kind !== 'simple' || product.status !== 'published') {
    throw new ApiError('Sản phẩm không còn khả năng mua.', {
      code: 'NOT_FOUND',
      status: 404,
    });
  }

  const sku = product.skus.find((candidate) => candidate.skuId === input.skuId);
  if (!sku) {
    throw new ApiError('SKU không khớp với sản phẩm đã chọn.', {
      code: 'VALIDATION_ERROR',
      status: 400,
    });
  }

  if (!sku.available) {
    throw new ApiError('SKU vừa hết hàng.', {
      code: 'INVENTORY_CONFLICT',
      status: 409,
    });
  }

  const color = product.colors.find((item) => item.colorId === sku.colorId);
  const size = product.sizes.find((item) => item.sizeId === sku.sizeId);
  const image = sku.images[0];
  if (!color || !size || !image) {
    throw new ApiError('Dữ liệu SKU chưa đầy đủ.', {
      code: 'UNEXPECTED_SERVER_ERROR',
      status: 500,
    });
  }

  return {
    availability: 'available',
    compareAtPrice: sku.compareAtPrice,
    imageAlt: image.alt,
    imageSrc: image.src,
    lineId: `line-${crypto.randomUUID()}`,
    lineTotal: sku.price * input.quantity,
    lineType: 'simple',
    price: sku.price,
    productId: product.id,
    productName: product.name,
    promotionAllocations: [],
    quantity: Math.min(input.quantity, 5),
    selectedColor: color.label,
    selectedSize: size.label,
    skuId: sku.skuId,
    validationMessages: [],
    variantId: `${sku.colorId}-${sku.sizeId}`,
  };
}

function normalizeBundleLine(input: BundleCartLineInput): CartLine {
  const product = getMockProductById(input.productId);
  if (!product || !product.bundle || product.status !== 'published') {
    throw new ApiError('Set không còn khả năng mua.', {
      code: 'NOT_FOUND',
      status: 404,
    });
  }

  if (input.components.length !== product.bundle.components.length) {
    throw new ApiError('Thiếu thành phần bắt buộc trong set.', {
      code: 'VALIDATION_ERROR',
      status: 400,
    });
  }

  const components: CartLineBuildComponent[] = input.components.map(
    (selected) => {
      const component = product.bundle?.components.find(
        (item) => item.componentId === selected.componentId,
      );
      if (!component) {
        throw new ApiError('Thành phần set không hợp lệ.', {
          code: 'VALIDATION_ERROR',
          status: 400,
        });
      }

      const option = component.sizeOptions.find(
        (item) =>
          item.sizeId === selected.sizeId && item.skuId === selected.skuId,
      );
      if (!option) {
        throw new ApiError('Cấu hình set không hợp lệ.', {
          code: 'VALIDATION_ERROR',
          status: 400,
        });
      }

      if (!option.available) {
        throw new ApiError('Một thành phần trong set vừa hết hàng.', {
          code: 'INVENTORY_CONFLICT',
          status: 409,
        });
      }

      return {
        componentId: component.componentId,
        productId: component.productId,
        productName: component.productName,
        quantity: component.quantity,
        selectedColor: component.fixedColor.label,
        selectedSize: option.label,
        skuId: option.skuId,
        title: component.title,
      };
    },
  );

  const image = product.bundle.components[0]?.image;
  if (!image) {
    throw new ApiError('Set thiếu hình ảnh hiển thị.', {
      code: 'UNEXPECTED_SERVER_ERROR',
      status: 500,
    });
  }

  return {
    availability: 'available',
    bundleComponentData: components,
    bundleGroupId: product.bundle.bundleId,
    compareAtPrice: product.bundle.compareAtPrice,
    imageAlt: image.alt,
    imageSrc: image.src,
    lineId: `line-${crypto.randomUUID()}`,
    lineTotal: product.bundle.price,
    lineType: 'bundle',
    price: product.bundle.price,
    productId: product.id,
    productName: product.name,
    promotionAllocations: [],
    quantity: 1,
    skuId: product.bundle.bundleId,
    validationMessages: [],
    variantId: product.bundle.bundleId,
  };
}

function isExpired(cart: Cart) {
  return new Date(cart.expiresAt).getTime() < Date.now();
}

function parseCartCookie(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
): CartCookieIntent {
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  const customerId = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;

  return { cartId, customerId };
}

function buildCartCookie(id: string) {
  return `${CART_COOKIE_NAME}=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(CART_TTL_MS / 1000)}`;
}

function buildOrderAccessCookie(code: string) {
  const token = crypto.randomUUID();
  orderAccess.set(code, token);
  return `${ORDER_ACCESS_COOKIE_NAME}=${code}.${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}`;
}

function getOrCreateCartForContext(context: CartCookieIntent) {
  const { cartId, customerId } = context;
  const existingCustomerCartId = customerId
    ? cartIdsByCustomer.get(customerId)
    : undefined;

  const guestCart = cartId && carts.has(cartId) ? carts.get(cartId) : undefined;
  const customerCart =
    existingCustomerCartId && carts.has(existingCustomerCartId)
      ? carts.get(existingCustomerCartId)
      : undefined;

  if (customerCart && guestCart && guestCart.id !== customerCart.id) {
    const merged = mergeCarts(customerCart, guestCart);
    carts.set(merged.cart.id, merged.cart);
    carts.delete(guestCart.id);
    return {
      cart: merged.cart,
      mergeSummary: merged.mergeSummary,
      setCartCookie: buildCartCookie(merged.cart.id),
    };
  }

  const base = customerCart ?? guestCart;
  if (base && !isExpired(base)) {
    return {
      cart: base,
      setCartCookie: buildCartCookie(base.id),
    };
  }

  if (base?.id) carts.delete(base.id);
  const nextId = crypto.randomUUID();
  const nextCart = createEmptyCart(nextId, customerId);
  carts.set(nextId, nextCart);
  if (customerId) cartIdsByCustomer.set(customerId, nextId);
  return { cart: nextCart, setCartCookie: buildCartCookie(nextId) };
}

function mergeCarts(primary: Cart, secondary: Cart) {
  const merged = cloneCart(primary);
  const messages: string[] = [];

  for (const line of secondary.lines) {
    const existing = merged.lines.find(
      (candidate) =>
        candidate.lineType === line.lineType &&
        candidate.productId === line.productId &&
        candidate.variantId === line.variantId &&
        candidate.bundleGroupId === line.bundleGroupId,
    );
    if (existing) {
      const nextQuantity = Math.min(
        existing.quantity + line.quantity,
        existing.lineType === 'bundle' ? 1 : 5,
      );
      if (nextQuantity < existing.quantity + line.quantity) {
        messages.push(
          `Số lượng của ${existing.productName} được giữ ở giới hạn hiện có.`,
        );
      }
      existing.quantity = nextQuantity;
      existing.lineTotal = existing.quantity * existing.price;
      continue;
    }
    merged.lines.push({ ...line, lineId: `line-${crypto.randomUUID()}` });
  }

  incrementVersion(merged);
  recalculateCart(merged);

  return {
    cart: {
      ...merged,
      mergeSummary: {
        mergedLineCount: secondary.lines.length,
        messages:
          messages.length > 0
            ? messages
            : ['Giỏ khách đã được nhập vào giỏ tài khoản hiện tại.'],
      },
    },
    mergeSummary: {
      mergedLineCount: secondary.lines.length,
      messages:
        messages.length > 0
          ? messages
          : ['Giỏ khách đã được nhập vào giỏ tài khoản hiện tại.'],
    },
  };
}

function createPromotion(code: string): AppliedPromotion {
  if (code === 'DEV10') {
    return {
      amount: 0,
      code,
      description: 'Giảm 10% tối đa 150.000đ cho kiểm thử nội bộ.',
      isDevelopmentMock: true,
      title: 'Khuyến mãi nội bộ 10%',
    };
  }

  return {
    amount: 0,
    code,
    description: 'Miễn phí vận chuyển trong chế độ phát triển.',
    isDevelopmentMock: true,
    title: 'Miễn phí vận chuyển nội bộ',
  };
}

export function getPaymentMethodOptions(): PaymentMethodOption[] {
  return [
    {
      code: 'cod',
      description:
        'Thanh toán khi nhận hàng. Chỉ là foundation, chưa gắn giới hạn COD thật.',
      developmentOnly: false,
      label: 'Thanh toán khi nhận hàng',
      supported: true,
    },
    {
      code: 'mock_vnpay',
      description:
        'Luồng chuyển hướng mô phỏng cho phát triển. Không đại diện tích hợp VNPay production.',
      developmentOnly: true,
      label: 'Thanh toán online mô phỏng',
      statusMessage: 'Chỉ dùng để kiểm tra UI và idempotency nội bộ.',
      supported: true,
    },
  ];
}

function createPaymentAttempt(
  method: PaymentMethodType,
  orderCode: string,
): PaymentAttempt {
  if (method === 'mock_vnpay') {
    return {
      method,
      paymentStatus: 'REQUIRES_ACTION',
      redirectUrl: `/order-success?order=${encodeURIComponent(orderCode)}`,
    };
  }

  return {
    method,
    paymentStatus: 'PENDING',
    redirectUrl: `/order-success?order=${encodeURIComponent(orderCode)}`,
  };
}

function ensureCartCanCheckout(cart: Cart) {
  if (cart.lines.length === 0) {
    throw new ApiError('Giỏ hàng đang trống.', {
      code: 'CONFLICT',
      status: 409,
    });
  }

  if (cart.validationMessages.length > 0) {
    throw new ApiError('Giỏ hàng cần được xác nhận lại trước khi thanh toán.', {
      code: 'CONFLICT',
      status: 409,
    });
  }
}

function createPublicOrder(
  cart: Cart,
  input: CheckoutInput,
  paymentAttempt: PaymentAttempt,
): PublicOrder {
  const code = `LYLE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return {
    code,
    createdAt: nowIso(),
    fulfillmentStatus: 'UNFULFILLED',
    lines: cart.lines.map((line) => ({
      compareAtPrice: line.compareAtPrice,
      imageAlt: line.imageAlt,
      imageSrc: line.imageSrc,
      lineId: line.lineId,
      lineTotal: line.lineTotal,
      price: line.price,
      productId: line.productId,
      productName: line.productName,
      quantity: line.quantity,
      selectedColor: line.selectedColor,
      selectedSize: line.selectedSize,
      skuId: line.skuId,
    })),
    orderStatus: 'CONFIRMED',
    paymentMethod: input.paymentMethod,
    paymentStatus: paymentAttempt.paymentStatus,
    shippingAddress: input.address,
    shippingAmount: cart.totals.shippingEstimate,
    subtotal: cart.totals.subtotal,
    total: cart.totals.grandTotal,
  };
}

export function getCartForCookies(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
): CartMutationResult {
  const context = parseCartCookie(cookieStore);
  const { cart, mergeSummary, setCartCookie } =
    getOrCreateCartForContext(context);
  recalculateCart(cart);
  return { cart: cloneCart(cart), mergeSummary, setCartCookie };
}

export function addLineToCart(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  input: CartLineIntentInput,
): CartMutationResult {
  const current = getCartForCookies(cookieStore);
  const cart = carts.get(current.cart.id) ?? current.cart;
  const nextLine =
    input.lineType === 'bundle'
      ? normalizeBundleLine(input)
      : normalizeSimpleLine(input);
  const existing = cart.lines.find(
    (line) =>
      line.lineType === nextLine.lineType &&
      line.productId === nextLine.productId &&
      line.variantId === nextLine.variantId &&
      line.bundleGroupId === nextLine.bundleGroupId,
  );

  if (existing) {
    const max = existing.lineType === 'bundle' ? 1 : 5;
    existing.quantity = Math.min(max, existing.quantity + nextLine.quantity);
    existing.lineTotal = existing.quantity * existing.price;
  } else {
    cart.lines.push(nextLine);
  }

  incrementVersion(cart);
  recalculateCart(cart);
  carts.set(cart.id, cart);

  return { cart: cloneCart(cart), setCartCookie: current.setCartCookie };
}

export function updateCartLineQuantity(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  lineId: string,
  quantity: number,
): CartMutationResult {
  const current = getCartForCookies(cookieStore);
  const cart = carts.get(current.cart.id) ?? current.cart;
  const line = cart.lines.find((item) => item.lineId === lineId);
  if (!line) {
    throw new ApiError('Không tìm thấy dòng giỏ hàng.', {
      code: 'NOT_FOUND',
      status: 404,
    });
  }
  line.quantity = Math.max(
    1,
    Math.min(line.lineType === 'bundle' ? 1 : 5, quantity),
  );
  incrementVersion(cart);
  recalculateCart(cart);
  carts.set(cart.id, cart);
  return { cart: cloneCart(cart), setCartCookie: current.setCartCookie };
}

export function removeCartLine(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  lineId: string,
): CartMutationResult {
  const current = getCartForCookies(cookieStore);
  const cart = carts.get(current.cart.id) ?? current.cart;
  cart.lines = cart.lines.filter((item) => item.lineId !== lineId);
  incrementVersion(cart);
  recalculateCart(cart);
  carts.set(cart.id, cart);
  return { cart: cloneCart(cart), setCartCookie: current.setCartCookie };
}

export function moveCartLineToWishlist(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  lineId: string,
) {
  return removeCartLine(cookieStore, lineId);
}

export function applyPromotionCode(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  rawCode: string,
): CartMutationResult & { promotionResult: PromotionAttemptResult } {
  const code = rawCode.trim().toUpperCase();
  const current = getCartForCookies(cookieStore);
  const cart = carts.get(current.cart.id) ?? current.cart;

  if (!['DEV10', 'DEVSHIP', 'DEVEXPIRED', 'DEVMIN'].includes(code)) {
    return {
      cart: cloneCart(cart),
      promotionResult: {
        code: 'INVALID_CODE',
        message: 'Mã khuyến mãi không hợp lệ.',
      },
      setCartCookie: current.setCartCookie,
    };
  }

  if (code === 'DEVEXPIRED') {
    return {
      cart: cloneCart(cart),
      promotionResult: {
        code: 'EXPIRED',
        message: 'Mã khuyến mãi mô phỏng này đã hết hạn.',
      },
      setCartCookie: current.setCartCookie,
    };
  }

  if (code === 'DEVMIN' && cart.totals.subtotal < 800_000) {
    return {
      cart: cloneCart(cart),
      promotionResult: {
        code: 'MINIMUM_SPEND',
        message: 'Giỏ hàng chưa đạt mức tối thiểu cho mã mô phỏng này.',
      },
      setCartCookie: current.setCartCookie,
    };
  }

  if (cart.promotionCodes.some((promotion) => promotion.code === code)) {
    return {
      cart: cloneCart(cart),
      promotionResult: {
        code: 'APPLIED',
        message: 'Mã đã được áp dụng trước đó.',
      },
      setCartCookie: current.setCartCookie,
    };
  }

  if (
    cart.promotionCodes.some((promotion) => promotion.code === 'DEV10') &&
    code === 'DEVSHIP'
  ) {
    return {
      cart: cloneCart(cart),
      promotionResult: {
        code: 'NON_STACKABLE_CONFLICT',
        message: 'DEVSHIP không cộng dồn với DEV10 trong foundation hiện tại.',
      },
      setCartCookie: current.setCartCookie,
    };
  }

  const promotion = createPromotion(code);
  cart.promotionCodes.push(promotion);
  incrementVersion(cart);
  recalculateCart(cart);
  carts.set(cart.id, cart);
  return {
    cart: cloneCart(cart),
    promotionResult: {
      code: 'APPLIED',
      message: 'Đã áp dụng mã khuyến mãi phát triển.',
      promotion,
    },
    setCartCookie: current.setCartCookie,
  };
}

export function removePromotionCode(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  rawCode: string,
): CartMutationResult {
  const code = rawCode.trim().toUpperCase();
  const current = getCartForCookies(cookieStore);
  const cart = carts.get(current.cart.id) ?? current.cart;
  cart.promotionCodes = cart.promotionCodes.filter(
    (promotion) => promotion.code !== code,
  );
  incrementVersion(cart);
  recalculateCart(cart);
  carts.set(cart.id, cart);
  return { cart: cloneCart(cart), setCartCookie: current.setCartCookie };
}

export function applyShippingEstimate(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  input: Pick<
    ShippingAddress,
    'districtCode' | 'districtName' | 'provinceCode' | 'provinceName'
  > & { method: ShippingEstimate['method'] },
): CartMutationResult {
  const current = getCartForCookies(cookieStore);
  const cart = carts.get(current.cart.id) ?? current.cart;
  const amount =
    input.method === 'pickup'
      ? 0
      : input.method === 'express'
        ? 55_000
        : 30_000;
  cart.shippingEstimate = {
    amount,
    districtCode: input.districtCode,
    districtName: input.districtName,
    method: input.method,
    provinceCode: input.provinceCode,
    provinceName: input.provinceName,
    source: 'development-mock',
  };
  incrementVersion(cart);
  recalculateCart(cart);
  carts.set(cart.id, cart);
  return { cart: cloneCart(cart), setCartCookie: current.setCartCookie };
}

export function submitCheckout(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  idempotencyKey: string,
  input: CheckoutInput,
): CartMutationResult & { checkout: CheckoutResult } {
  if (idempotentCheckoutResults.has(idempotencyKey)) {
    const checkout = idempotentCheckoutResults.get(idempotencyKey);
    if (!checkout) {
      throw new ApiError('Không thể khôi phục kết quả thanh toán.', {
        code: 'UNEXPECTED_SERVER_ERROR',
        status: 500,
      });
    }
    return {
      cart: createEmptyCart('replayed'),
      checkout,
      order: checkout.order,
      paymentAttempt: {
        method: checkout.order.paymentMethod,
        paymentStatus: checkout.order.paymentStatus,
        redirectUrl: checkout.redirectUrl,
      },
      setOrderAccessCookie: buildOrderAccessCookie(checkout.order.code),
    };
  }

  const current = getCartForCookies(cookieStore);
  const cart = carts.get(current.cart.id) ?? current.cart;
  ensureCartCanCheckout(cart);

  if (
    !cart.shippingEstimate ||
    cart.shippingEstimate.method !== input.shippingMethod
  ) {
    throw new ApiError('Cần xác nhận lại phí giao hàng trước khi đặt đơn.', {
      code: 'CONFLICT',
      status: 409,
    });
  }

  const paymentAttempt = createPaymentAttempt(input.paymentMethod, 'pending');
  const order = createPublicOrder(cart, input, paymentAttempt);
  paymentAttempt.redirectUrl = `/order-success?order=${encodeURIComponent(order.code)}`;
  orders.set(order.code, order);

  const checkout = {
    order,
    redirectUrl: paymentAttempt.redirectUrl ?? '/order-success',
  };
  idempotentCheckoutResults.set(idempotencyKey, checkout);

  cart.status = 'converted';
  cart.lines = [];
  cart.promotionCodes = [];
  cart.shippingEstimate = undefined;
  incrementVersion(cart);
  recalculateCart(cart);
  carts.set(cart.id, cart);

  return {
    cart: cloneCart(cart),
    checkout,
    order,
    paymentAttempt,
    setCartCookie: current.setCartCookie,
    setOrderAccessCookie: buildOrderAccessCookie(order.code),
  };
}

export function getOrderForCookies(
  cookieStore:
    | Pick<ReadonlyRequestCookies, 'get'>
    | { get: (name: string) => { value: string } | undefined },
  orderCode: string,
) {
  const accessCookie = cookieStore.get(ORDER_ACCESS_COOKIE_NAME)?.value;
  const [codeFromCookie, token] = accessCookie?.split('.') ?? [];
  if (!accessCookie || codeFromCookie !== orderCode) return null;
  if (orderAccess.get(orderCode) !== token) return null;
  return orders.get(orderCode) ?? null;
}

export function getFreeShippingProgress(cart: Cart) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cart.totals.subtotal);
  return {
    current: cart.totals.subtotal,
    remaining,
    threshold: FREE_SHIPPING_THRESHOLD,
  };
}

export function resetCommerceState() {
  carts.clear();
  cartIdsByCustomer.clear();
  orders.clear();
  orderAccess.clear();
  idempotentCheckoutResults.clear();
}

export const cartCookieName = CART_COOKIE_NAME;
export const customerCookieName = CUSTOMER_COOKIE_NAME;
