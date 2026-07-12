import { RoutePlaceholder } from '@/components/layout/route-placeholder';
import { createRouteMetadata } from '@/lib/seo/metadata';

const routeFoundations = {
  home: [
    '/',
    'LYLE Fashion',
    'Trang chủ đang được chuẩn bị theo chiến lược nội dung đã duyệt.',
  ],
  shop: [
    '/shop',
    'Cửa hàng',
    'Danh mục sản phẩm sẽ kết nối với nguồn dữ liệu thương mại đã duyệt.',
  ],
  men: [
    '/men',
    'Thời trang nam',
    'Không gian mua sắm nam đang chờ taxonomy và dữ liệu danh mục.',
  ],
  women: [
    '/women',
    'Thời trang nữ',
    'Không gian mua sắm nữ đang chờ taxonomy và dữ liệu danh mục.',
  ],
  search: [
    '/search',
    'Tìm kiếm',
    'Tìm kiếm sẽ được triển khai sau khi hợp đồng dịch vụ được phê duyệt.',
  ],
  wishlist: [
    '/wishlist',
    'Danh sách yêu thích',
    'Trạng thái yêu thích và quy tắc danh tính chưa được triển khai.',
  ],
  cart: [
    '/cart',
    'Giỏ hàng',
    'Giỏ hàng sẽ sử dụng trạng thái phía máy chủ và kiểm tra thương mại có thẩm quyền.',
  ],
  checkout: [
    '/checkout',
    'Thanh toán',
    'Luồng thanh toán chưa được triển khai trong giai đoạn kiến trúc này.',
  ],
  orderSuccess: [
    '/order-success',
    'Xác nhận đơn hàng',
    'Thông tin xác nhận chỉ xuất hiện sau khi máy chủ tạo đơn hàng bền vững.',
  ],
  orderTracking: [
    '/order-tracking',
    'Theo dõi đơn hàng',
    'Tra cứu đơn hàng sẽ yêu cầu cơ chế xác minh riêng tư đã duyệt.',
  ],
  lookbook: [
    '/lookbook',
    'Lookbook',
    'Nội dung biên tập đang chờ mô hình CMS và phê duyệt hình ảnh.',
  ],
  journal: [
    '/journal',
    'Tạp chí LYLE',
    'Nội dung tạp chí đang chờ mô hình CMS và quy trình xuất bản.',
  ],
  materialGuide: [
    '/material-guide',
    'Hướng dẫn chất liệu',
    'Nội dung chất liệu cần được kiểm chứng và phê duyệt trước khi xuất bản.',
  ],
  sustainability: [
    '/sustainability',
    'Phát triển bền vững',
    'Các tuyên bố bền vững cần bằng chứng và phê duyệt nội dung.',
  ],
  stores: [
    '/stores',
    'Cửa hàng',
    'Dữ liệu địa điểm sẽ đến từ nguồn cửa hàng được phê duyệt.',
  ],
  contact: [
    '/contact',
    'Liên hệ',
    'Kênh liên hệ chính thức chưa được cấu hình.',
  ],
  shippingPolicy: [
    '/shipping-policy',
    'Chính sách giao hàng',
    'Chính sách giao hàng đang chờ phê duyệt vận hành.',
  ],
  returnPolicy: [
    '/return-policy',
    'Chính sách đổi trả',
    'Chính sách đổi trả đang chờ phê duyệt nghiệp vụ.',
  ],
  privacyPolicy: [
    '/privacy-policy',
    'Chính sách bảo mật',
    'Nội dung pháp lý và quyền riêng tư đang chờ phê duyệt.',
  ],
  terms: [
    '/terms',
    'Điều khoản sử dụng',
    'Nội dung điều khoản đang chờ phê duyệt pháp lý.',
  ],
  account: [
    '/account',
    'Tài khoản',
    'Khu vực tài khoản sẽ là tuyến riêng tư sau khi chọn giải pháp xác thực.',
  ],
  profile: ['/account/profile', 'Hồ sơ', 'Quản lý hồ sơ chưa được triển khai.'],
  addresses: [
    '/account/addresses',
    'Địa chỉ',
    'Quản lý địa chỉ chưa được triển khai.',
  ],
  orders: [
    '/account/orders',
    'Đơn hàng',
    'Lịch sử đơn hàng chưa được triển khai.',
  ],
  returns: [
    '/account/returns',
    'Đổi trả',
    'Quản lý yêu cầu đổi trả chưa được triển khai.',
  ],
} as const;

export type RouteFoundationKey = keyof typeof routeFoundations;

export function metadataForRoute(key: RouteFoundationKey) {
  const [pathname, title, description] = routeFoundations[key];
  return createRouteMetadata({ description, pathname, title });
}

export function StaticRouteFoundation({
  route,
}: {
  route: RouteFoundationKey;
}) {
  const [, title, description] = routeFoundations[route];
  return <RoutePlaceholder description={description} title={title} />;
}
