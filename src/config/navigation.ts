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

export const storefrontNavigation = storefrontNavigationSchema.parse({
  announcement: {
    href: '/material-guide',
    label: 'Khám phá hướng dẫn chất liệu Linen và Lyocell',
  },
  groups: [
    {
      id: 'men',
      label: 'Nam',
      items: [
        { href: '/men?category=t-shirts', label: 'Áo thun' },
        { href: '/men?category=shirts', label: 'Áo sơ mi' },
        { href: '/men?category=pants', label: 'Quần dài' },
        { href: '/men?category=shorts', label: 'Quần short' },
        { href: '/men?category=casual-sets', label: 'Bộ thường ngày' },
        { href: '/men?category=premium-sets', label: 'Bộ cao cấp' },
        { href: '/men', label: 'Xem tất cả' },
      ],
    },
    {
      id: 'women',
      label: 'Nữ',
      items: [
        { href: '/women?category=t-shirts', label: 'Áo thun' },
        { href: '/women?category=shirts', label: 'Áo sơ mi' },
        { href: '/women?category=pants', label: 'Quần dài' },
        { href: '/women?category=skirts', label: 'Chân váy' },
        { href: '/women?category=dresses', label: 'Đầm' },
        { href: '/women?category=casual-sets', label: 'Bộ thường ngày' },
        { href: '/women?category=premium-sets', label: 'Bộ cao cấp' },
        { href: '/women', label: 'Xem tất cả' },
      ],
    },
    {
      id: 'collections',
      label: 'Bộ sưu tập',
      items: [
        { href: '/collections/new-arrival', label: 'Hàng mới' },
        { href: '/collections/best-seller', label: 'Bán chạy' },
        { href: '/collections/eco-collection', label: 'Bộ sưu tập Eco' },
        {
          href: '/collections/premium-collection',
          label: 'Bộ sưu tập cao cấp',
        },
        { href: '/collections/linen-collection', label: 'Bộ sưu tập Linen' },
        {
          href: '/collections/lyocell-collection',
          label: 'Bộ sưu tập Lyocell',
        },
      ],
    },
    {
      id: 'discover',
      label: 'Khám phá',
      items: [
        { href: '/lookbook', label: 'Lookbook' },
        { href: '/lookbook?view=shop-the-look', label: 'Shop the Look' },
        { href: '/material-guide', label: 'Hướng dẫn chất liệu' },
        { href: '/sustainability', label: 'Phát triển bền vững' },
        { href: '/journal', label: 'Tạp chí' },
        { href: '/stores', label: 'Cửa hàng' },
      ],
    },
  ],
});
