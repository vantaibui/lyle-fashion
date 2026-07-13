/**
 * Demo homepage content for the elise.vn-styled storefront (academic demo).
 * Imagery is downloaded from elise.vn into `public/elise/**`. Commerce data here
 * is presentational demo content only and is never treated as cart/price authority.
 */

export type HeroSlide = {
  alt: string;
  desktopImage: string;
  eyebrow: string;
  href: string;
  mobileImage: string;
  title: string;
};

export type PromoTile = {
  alt: string;
  href: string;
  image: string;
  label: string;
};

export type NewArrivalProduct = {
  href: string;
  id: string;
  image: string;
  name: string;
  originalPrice: number;
  salePrice: number;
};

export type SnapEntry = {
  height: string;
  image: string;
  name: string;
  store: string;
};

export const heroSlides: HeroSlide[] = [
  {
    alt: 'Bộ sưu tập mới LYLE',
    desktopImage: '/elise/banners/cv-0607.jpg',
    eyebrow: 'New Collection',
    href: '/women',
    mobileImage: '/elise/banners/mb-0607.jpg',
    title: 'Bộ sưu tập mùa mới',
  },
  {
    alt: 'Sale up to 50%',
    desktopImage: '/elise/banners/cv-sale.jpg',
    eyebrow: 'Sale Up To 50%',
    href: '/collections/sale',
    mobileImage: '/elise/banners/mb-sale.jpg',
    title: 'Ưu đãi mùa hè',
  },
  {
    alt: 'Shop the look LYLE',
    desktopImage: '/elise/banners/cv-stl.jpg',
    eyebrow: 'Shop The Look',
    href: '/lookbook?view=shop-the-look',
    mobileImage: '/elise/banners/cv-stl.jpg',
    title: 'Gợi ý phối đồ',
  },
];

export const promoTiles: PromoTile[] = [
  {
    alt: 'Shop the look',
    href: '/lookbook?view=shop-the-look',
    image: '/elise/banners/cv-stl.jpg',
    label: 'Shop The Look',
  },
  {
    alt: 'Sale up to 50%',
    href: '/collections/sale',
    image: '/elise/banners/cv-sale.jpg',
    label: 'Sale Up To 50%',
  },
  {
    alt: 'May đo đồng phục',
    href: '/contact',
    image: '/elise/banners/cv-uniform.jpg',
    label: 'May Đo Đồng Phục',
  },
];

export const newArrivals: NewArrivalProduct[] = [
  {
    href: '/product/dam-tho-phoi-co-dai-eo',
    id: 'ff2604043jlwobr',
    image: '/elise/products/product-01.jpg',
    name: 'Đầm thô phối cổ đai eo',
    originalPrice: 2_498_000,
    salePrice: 1_249_000,
  },
  {
    href: '/product/dam-linen-dai-eo-chay-day-hoa',
    id: 'fs2512156bkdebr1',
    image: '/elise/products/product-02.jpg',
    name: 'Đầm linen đai eo chạy dây hoa',
    originalPrice: 2_298_000,
    salePrice: 1_149_000,
  },
  {
    href: '/product/dam-linen-be-ghi-sat-nach',
    id: 'fs2601084bkwokk1',
    image: '/elise/products/product-03.jpg',
    name: 'Đầm linen be ghi sát nách đai eo',
    originalPrice: 2_098_000,
    salePrice: 1_049_000,
  },
  {
    href: '/product/quan-sooc-trang-tui-cheo',
    id: 'fs2601210dxwobe',
    image: '/elise/products/product-04.jpg',
    name: 'Quần sooc trắng túi chéo',
    originalPrice: 1_098_000,
    salePrice: 549_000,
  },
  {
    href: '/product/dam-xoe-tay-phong',
    id: 'fs2601282dxwobe',
    image: '/elise/products/product-05.jpg',
    name: 'Đầm xòe tay phồng',
    originalPrice: 2_398_000,
    salePrice: 1_199_000,
  },
  {
    href: '/product/ao-so-mi-tay-ngan-cotton',
    id: 'fs2601333tswocr3',
    image: '/elise/products/product-06.jpg',
    name: 'Áo sơ mi tay ngắn cotton',
    originalPrice: 998_000,
    salePrice: 499_000,
  },
  {
    href: '/product/ao-kieu-tay-bong',
    id: 'fs2602112tswowh3',
    image: '/elise/products/product-07.jpg',
    name: 'Áo kiểu tay bồng trắng',
    originalPrice: 1_298_000,
    salePrice: 649_000,
  },
  {
    href: '/product/dam-den-co-vuong',
    id: 'fs2602113bkwowh1',
    image: '/elise/products/product-08.jpg',
    name: 'Đầm đen cổ vuông',
    originalPrice: 2_598_000,
    salePrice: 1_299_000,
  },
  {
    href: '/product/dam-hoa-nhi-be',
    id: 'fs2602205diwobe4',
    image: '/elise/products/product-09.jpg',
    name: 'Đầm hoa nhí be',
    originalPrice: 2_198_000,
    salePrice: 1_099_000,
  },
  {
    href: '/product/chan-vay-but-chi-nau',
    id: 'fs2604064tskcbr2',
    image: '/elise/products/product-10.jpg',
    name: 'Chân váy bút chì nâu',
    originalPrice: 1_198_000,
    salePrice: 599_000,
  },
  {
    href: '/product/ao-vest-nau-da-eo',
    id: 'fs2605141tskcbr3',
    image: '/elise/products/product-11.jpg',
    name: 'Áo vest nâu dáng eo',
    originalPrice: 2_998_000,
    salePrice: 1_499_000,
  },
  {
    href: '/product/dam-suong-trang-tay-ngan',
    id: 'fs2605284bswowh1',
    image: '/elise/products/product-12.jpg',
    name: 'Đầm suông trắng tay ngắn',
    originalPrice: 2_298_000,
    salePrice: 1_149_000,
  },
];

export const snapEntries: SnapEntry[] = [
  {
    height: '165cm',
    image: '/elise/products/product-01.jpg',
    name: 'Huỳnh Thị Thu Nhung',
    store: 'LYLE Thanh Hoá 1',
  },
  {
    height: '162cm',
    image: '/elise/products/product-05.jpg',
    name: 'Nguyễn Thị Mai',
    store: 'LYLE Vincom Bà Triệu',
  },
  {
    height: '168cm',
    image: '/elise/products/product-08.jpg',
    name: 'Trần Khánh Linh',
    store: 'LYLE Aeon Long Biên',
  },
  {
    height: '160cm',
    image: '/elise/products/product-09.jpg',
    name: 'Phạm Thu Hà',
    store: 'LYLE Nguyễn Trãi',
  },
];
