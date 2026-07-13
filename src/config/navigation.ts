import { z } from 'zod';

export const navigationItemSchema = z.object({
  href: z.string().startsWith('/'),
  label: z.string().trim().min(1).max(80),
});

export const navigationGroupSchema = z.object({
  campaign: z
    .object({
      alt: z.string().trim().min(1),
      href: z.string().startsWith('/'),
      image: z.string().startsWith('/'),
      label: z.string().trim().min(1),
    })
    .optional(),
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  items: z.array(navigationItemSchema).min(1),
  label: z.string().trim().min(1).max(80),
});

export const storefrontNavigationSchema = z.object({
  announcement: navigationItemSchema.optional(),
  groups: z.array(navigationGroupSchema).min(1),
});

export type NavigationItem = z.infer<typeof navigationItemSchema>;
export type NavigationGroup = z.infer<typeof navigationGroupSchema>;
export type StorefrontNavigation = z.infer<typeof storefrontNavigationSchema>;

// LYLE storefront navigation: women-first shopping groups plus a "Nam" group
// mapped to this project's /men route and men's catalog. Hrefs point to routes
// that already exist so no menu link 404s.
export const storefrontNavigation = storefrontNavigationSchema.parse({
  announcement: {
    href: '/material-guide',
    label: 'Khám phá hướng dẫn chất liệu Linen và Lyocell',
  },
  groups: [
    {
      id: 'men',
      label: 'Thời Trang Nam',
      items: [
        { href: '/men?category=t-shirts', label: 'Áo Thun' },
        { href: '/men?category=shirts', label: 'Áo Sơ Mi' },
        { href: '/men?category=pants', label: 'Quần Dài' },
        { href: '/men?category=shorts', label: 'Quần Short' },
        { href: '/men?category=casual-sets', label: 'Bộ Thường Ngày' },
        { href: '/men?category=premium-sets', label: 'Bộ Cao Cấp' },
        { href: '/men', label: 'Xem Tất Cả' },
      ],
    },
    {
      id: 'women',
      label: 'Thời Trang Nữ',
      items: [
        { href: '/women?category=dresses', label: 'Đầm' },
        { href: '/women?category=shirts', label: 'Áo' },
        { href: '/women?category=skirts', label: 'Chân Váy' },
        { href: '/women?category=pants', label: 'Quần' },
        { href: '/women', label: 'Xem Tất Cả' },
      ],
    },
    {
      id: 'accessories',
      label: 'Phụ Kiện',
      items: [
        { href: '/shop?category=shoes', label: 'Giày / Dép' },
        { href: '/shop?category=bags', label: 'Túi' },
        { href: '/shop?category=accessories', label: 'Phụ Kiện' },
      ],
    },
    {
      id: 'collections',
      label: 'Bộ Sưu Tập',
      items: [
        { href: '/collections/new-arrival', label: 'Hàng Mới' },
        { href: '/collections/best-seller', label: 'Bán Chạy' },
        { href: '/collections/eco-collection', label: 'Bộ Sưu Tập Eco' },
        {
          href: '/collections/premium-collection',
          label: 'Bộ Sưu Tập Cao Cấp',
        },
        { href: '/collections/linen-collection', label: 'Bộ Sưu Tập Linen' },
        {
          href: '/collections/lyocell-collection',
          label: 'Bộ Sưu Tập Lyocell',
        },
      ],
    },
    {
      id: 'shop-the-look',
      label: 'Shop The Look',
      items: [
        { href: '/lookbook', label: 'Lookbook' },
        { href: '/lookbook?view=shop-the-look', label: 'Shop The Look' },
        { href: '/collections/new-arrival', label: 'Online Exclusives' },
      ],
    },
    {
      id: 'discover',
      label: 'Khám Phá',
      items: [
        { href: '/lookbook', label: 'Gợi Ý Mua Sắm Từ Nhân Viên' },
        { href: '/journal', label: 'LYLE Story' },
        { href: '/account', label: 'Thẻ Thành Viên' },
        { href: '/material-guide', label: 'Hướng Dẫn Chất Liệu' },
        { href: '/sustainability', label: 'ESG - Phát Triển Bền Vững' },
        { href: '/stores', label: 'Hệ Thống Cửa Hàng' },
        { href: '/contact', label: 'Thông Tin' },
      ],
    },
  ],
});
