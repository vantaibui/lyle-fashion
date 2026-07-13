import 'server-only';

import { ApiError } from '@/lib/api/error';
import type { CustomerSession } from '@/modules/auth/contracts/session';
import type {
  CustomerAddress,
  CustomerProfile,
} from '@/modules/customer/contracts/customer';
import type { PublicOrder } from '@/modules/order/contracts/order';
import type { ReturnRequest } from '@/modules/return/contracts/return';

export const SESSION_COOKIE_NAME = 'lyle_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const DEVELOPMENT_SESSION_TOKEN = 'development-customer-demo';

type CookieReader = { get(name: string): { value: string } | undefined };

type AccountRecord = {
  addresses: CustomerAddress[];
  profile: CustomerProfile;
};

type ProfileUpdate = Pick<CustomerProfile, 'fullName' | 'phone'> & {
  preferences: Omit<CustomerProfile['preferences'], 'orderCommunication'>;
};

const demoCustomer: AccountRecord = {
  addresses: [
    {
      districtCode: 'q1',
      districtName: 'Quận 1',
      fullName: 'Khách hàng LYLE',
      id: 'addr_demo_1',
      isDefaultShipping: true,
      phone: '0901234567',
      provinceCode: 'hcm',
      provinceName: 'Thành phố Hồ Chí Minh',
      streetAddress: '12 Nguyễn Huệ',
      wardCode: 'ben-nghe',
      wardName: 'Phường Bến Nghé',
    },
  ],
  profile: {
    email: 'demo@lyle.vn',
    fullName: 'Khách hàng LYLE',
    id: 'customer_demo',
    phone: '0901234567',
    preferences: {
      marketingEmail: false,
      marketingSms: false,
      newCollections: false,
      orderCommunication: true,
    },
  },
};

const accounts = new Map([[demoCustomer.profile.id, demoCustomer]]);
const sessions = new Map<string, CustomerSession>();
const returns = new Map<string, ReturnRequest[]>();

const demoOrders: PublicOrder[] = [
  {
    code: 'LYLE-DEMO-2401',
    createdAt: '2026-07-01T02:30:00.000Z',
    fulfillmentStatus: 'DELIVERED',
    lines: [
      {
        imageAlt: 'Áo sơ mi Linen màu tự nhiên',
        imageSrc: '/elise/products/product-06.jpg',
        lineId: 'order-line-1',
        lineTotal: 399000,
        price: 399000,
        productId: 'product-linen-shirt',
        productName: 'Áo sơ mi Linen',
        quantity: 1,
        selectedColor: 'Tự nhiên',
        selectedSize: 'M',
        skuId: 'sku-linen-natural-m',
      },
    ],
    orderStatus: 'CONFIRMED',
    paymentMethod: 'cod',
    paymentStatus: 'PAID',
    shippingAddress: {
      districtCode: 'q1',
      districtName: 'Quận 1',
      email: 'demo@lyle.vn',
      fullName: 'Khách hàng LYLE',
      phone: '0901234567',
      provinceCode: 'hcm',
      provinceName: 'Thành phố Hồ Chí Minh',
      streetAddress: '12 Nguyễn Huệ',
      wardCode: 'ben-nghe',
      wardName: 'Phường Bến Nghé',
    },
    shippingAmount: 30000,
    subtotal: 399000,
    total: 429000,
  },
];

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function authenticateDemoAccount(email: string, password: string) {
  // Development reference adapter only. Production must delegate credential
  // verification, lockout, rate limits, refresh, and revocation to identity.
  if (email.toLowerCase() !== 'demo@lyle.vn' || password !== 'LyleDemo!2026') {
    throw new ApiError('Không thể đăng nhập với thông tin đã cung cấp.', {
      code: 'AUTHENTICATION_ERROR',
      status: 401,
    });
  }

  const token = DEVELOPMENT_SESSION_TOKEN;
  const session = {
    customerId: demoCustomer.profile.id,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
  sessions.set(token, session);
  return {
    cookie: buildSessionCookie(token),
    profile: clone(demoCustomer.profile),
  };
}

export function buildSessionCookie(token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}${secure}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function endSession(cookies: CookieReader) {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) sessions.delete(token);
}

export function getSession(cookies: CookieReader) {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  const session =
    token === DEVELOPMENT_SESSION_TOKEN
      ? {
          customerId: demoCustomer.profile.id,
          expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
        }
      : token
        ? sessions.get(token)
        : undefined;
  if (!session) return null;
  if (Date.parse(session.expiresAt) <= Date.now()) {
    sessions.delete(token!);
    return null;
  }
  return clone(session);
}

export function requireCustomer(cookies: CookieReader) {
  const session = getSession(cookies);
  const account = session ? accounts.get(session.customerId) : undefined;
  if (!session || !account) {
    throw new ApiError('Phiên đăng nhập không còn hiệu lực.', {
      code: 'AUTHENTICATION_ERROR',
      status: 401,
    });
  }
  return { account, customerId: session.customerId };
}

export function getAccountSnapshot(cookies: CookieReader) {
  const { account, customerId } = requireCustomer(cookies);
  return {
    addresses: clone(account.addresses),
    orders: clone(demoOrders),
    profile: clone(account.profile),
    returns: clone(returns.get(customerId) ?? []),
  };
}

export function updateProfile(cookies: CookieReader, input: ProfileUpdate) {
  const { account } = requireCustomer(cookies);
  account.profile = {
    ...account.profile,
    ...clone(input),
    preferences: { ...input.preferences, orderCommunication: true },
  };
  return clone(account.profile);
}

export function addAddress(
  cookies: CookieReader,
  input: Omit<CustomerAddress, 'id'>,
) {
  const { account } = requireCustomer(cookies);
  if (input.isDefaultShipping) {
    account.addresses = account.addresses.map((address) => ({
      ...address,
      isDefaultShipping: false,
    }));
  }
  const address = { ...clone(input), id: `addr_${crypto.randomUUID()}` };
  if (account.addresses.length === 0) address.isDefaultShipping = true;
  account.addresses.push(address);
  return clone(address);
}

export function deleteAddress(cookies: CookieReader, addressId: string) {
  const { account } = requireCustomer(cookies);
  const address = account.addresses.find((item) => item.id === addressId);
  if (!address)
    throw new ApiError('Không tìm thấy địa chỉ.', {
      code: 'NOT_FOUND',
      status: 404,
    });
  account.addresses = account.addresses.filter((item) => item.id !== addressId);
  if (address.isDefaultShipping && account.addresses[0])
    account.addresses[0].isDefaultShipping = true;
}

export function getOrders(cookies: CookieReader, page = 1) {
  requireCustomer(cookies);
  const pageSize = 10;
  return {
    items: clone(demoOrders.slice((page - 1) * pageSize, page * pageSize)),
    page,
    pageSize,
    total: demoOrders.length,
  };
}

export function getOrder(cookies: CookieReader, orderId: string) {
  requireCustomer(cookies);
  const order = demoOrders.find((item) => item.code === orderId);
  if (!order)
    throw new ApiError('Không tìm thấy đơn hàng.', {
      code: 'NOT_FOUND',
      status: 404,
    });
  return clone(order);
}

export function trackGuestOrder(code: string, contact: string) {
  const normalized = contact.trim().toLowerCase();
  const order = demoOrders.find(
    (item) => item.code === code.trim().toUpperCase(),
  );
  if (
    !order ||
    ![
      order.shippingAddress.email.toLowerCase(),
      order.shippingAddress.phone,
    ].includes(normalized)
  ) {
    throw new ApiError('Không thể xác minh thông tin tra cứu.', {
      code: 'NOT_FOUND',
      status: 404,
    });
  }
  return {
    carrier: 'Đơn vị vận chuyển thử nghiệm',
    code: order.code,
    fulfillmentStatus: order.fulfillmentStatus,
    trackingCode: 'DEMO-TRACKING',
  };
}

export function createReturn(
  cookies: CookieReader,
  input: {
    orderId: string;
    quantity: number;
    reasonCode: string;
    skuId: string;
  },
) {
  const { customerId } = requireCustomer(cookies);
  const order = getOrder(cookies, input.orderId);
  const line = order.lines.find((item) => item.skuId === input.skuId);
  if (
    order.fulfillmentStatus !== 'DELIVERED' ||
    !line ||
    input.quantity > line.quantity
  ) {
    throw new ApiError('Sản phẩm chưa đủ điều kiện gửi yêu cầu đổi trả.', {
      code: 'VALIDATION_ERROR',
      status: 409,
    });
  }
  const existing = returns.get(customerId) ?? [];
  const duplicate = existing.find((item) => item.orderId === input.orderId);
  if (duplicate) return clone(duplicate);
  const request: ReturnRequest = {
    id: `return_${crypto.randomUUID()}`,
    orderCode: order.code,
    orderId: input.orderId,
    reasonCode: input.reasonCode,
    status: 'REQUESTED',
    submittedAt: new Date().toISOString(),
  };
  existing.push(request);
  returns.set(customerId, existing);
  return clone(request);
}
