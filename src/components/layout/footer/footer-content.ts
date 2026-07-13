/** Presentational footer content for the elise.vn-styled storefront (academic demo). */

export type TrustBadge = {
  icon: string;
  text: string;
  title: string;
};

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterColumn = {
  links: FooterLink[];
  title: string;
};

export type SocialLink = {
  href: string;
  label: string;
};

export const trustBadges: TrustBadge[] = [
  {
    icon: '/elise/footer/return.png',
    text: '7 ngày đổi sản phẩm nguyên giá',
    title: 'Đổi trả dễ dàng',
  },
  {
    icon: '/elise/footer/support.png',
    text: 'Hotline 1900 3060 (8h–17h, T2–T7)',
    title: 'Hỗ trợ khách hàng',
  },
  {
    icon: '/elise/footer/store.png',
    text: '120 cửa hàng trên toàn quốc',
    title: 'Hệ thống cửa hàng',
  },
  {
    icon: '/elise/footer/shipping.png',
    text: 'Giao hàng toàn quốc 30k đồng giá',
    title: 'Giao hàng nhanh',
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Liên hệ',
    links: [
      { href: '/contact', label: 'Giới thiệu' },
      { href: '/journal', label: 'Tin tức' },
      { href: '/stores', label: 'Hệ thống cửa hàng' },
      { href: '/contact', label: 'Trợ giúp' },
    ],
  },
  {
    title: 'Hỗ trợ khách hàng',
    links: [
      { href: '/contact', label: 'Hướng dẫn mua hàng' },
      { href: '/login', label: 'Đăng ký tài khoản' },
      { href: '/shipping-policy', label: 'Chính sách giao hàng' },
      { href: '/return-policy', label: 'Chính sách đổi trả' },
      { href: '/contact', label: 'Ưu đãi sinh nhật' },
    ],
  },
];

// Placeholder social links for the demo — not real brand accounts.
export const socialLinks: SocialLink[] = [
  { href: '#', label: 'Facebook' },
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'YouTube' },
  { href: '#', label: 'TikTok' },
];

export const companyInfo = {
  address: 'Tầng 8 - Số 2 Tôn Thất Tùng - Đống Đa - Hà Nội',
  email: 'cskh@lyle.vn',
  name: 'CÔNG TY TNHH THỜI TRANG LYLE',
  phone: '1900 3060',
  taxId: '0108393204',
} as const;
