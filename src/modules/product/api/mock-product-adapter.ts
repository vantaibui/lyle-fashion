import type { ProductSummary } from '@/modules/catalog/contracts/catalog';
import { demoImagesForSeed } from '@/modules/catalog/api/coolmate-demo-images';
import type {
  ProductDetail,
  ProductDetailProvider,
  ProductSku,
} from '@/modules/product/contracts/product';

// Real elise.vn garment photo (4:5) for the PDP gallery. See elise-demo-images.
const eliseImage = (src: string, alt: string) => ({
  alt,
  height: 750,
  src,
  width: 600,
});

/**
 * Resolve a product's demo image pair from its `mock-product-N` id (1-based).
 * Men's seeds resolve to coolmate.me, women's to elise.vn (see demoImagesForSeed).
 */
function demoImagesForId(id: string) {
  const parsed = Number.parseInt(id.replace(/^mock-product-/, ''), 10);
  const index = Number.isFinite(parsed) ? parsed - 1 : 0;
  return demoImagesForSeed(index);
}

const sharedColors = {
  bone: { colorId: 'bone', label: 'Ngà', swatchHex: '#E5E0D5' },
  ink: { colorId: 'ink', label: 'Mực', swatchHex: '#20211D' },
  moss: { colorId: 'moss', label: 'Rêu', swatchHex: '#4E5A42' },
  clay: { colorId: 'clay', label: 'Đất', swatchHex: '#8A5A44' },
} as const;

const sizeScale = [
  { label: 'S', sizeId: 's' },
  { label: 'M', sizeId: 'm' },
  { label: 'L', sizeId: 'l' },
  { label: 'XL', sizeId: 'xl' },
] as const;

type MockSeed = {
  badges?: ProductDetail['badges'];
  categoryHref: string;
  categoryLabel: string;
  colorOrder: Array<keyof typeof sharedColors>;
  description: string;
  fitNote: string;
  genderLabel: string;
  id: string;
  kind?: ProductDetail['kind'];
  materialLabel: string;
  materials: string[];
  name: string;
  price: number;
  recommendations: string[];
  sections: ProductDetail['sections'];
  slug: string;
  status?: ProductDetail['status'];
  sustainabilityNote: string;
};

function variantImages(id: string, name: string, colorLabel: string) {
  const demo = demoImagesForId(id);
  return [
    eliseImage(demo.primary, `${name} màu ${colorLabel} nhìn chính diện`),
    eliseImage(demo.alternate, `${name} màu ${colorLabel} — góc chụp khác`),
  ];
}

function buildSimpleSkus(seed: MockSeed): ProductSku[] {
  return seed.colorOrder.flatMap((colorKey, colorIndex) =>
    sizeScale.map((size) => {
      const available = !(colorIndex === 2 && size.sizeId === 'xl');
      const stockLevel = !available
        ? 'out-of-stock'
        : size.sizeId === 'l'
          ? 'low-stock'
          : 'in-stock';
      return {
        available,
        code: `${seed.id.toUpperCase()}-${colorKey.toUpperCase()}-${size.label}`,
        colorId: colorKey,
        compareAtPrice:
          seed.kind === 'bundle'
            ? seed.price + 120000
            : seed.price >= 699000
              ? seed.price + 90000
              : undefined,
        images: variantImages(seed.id, seed.name, sharedColors[colorKey].label),
        price: seed.price,
        sizeId: size.sizeId,
        skuId: `${seed.id}-${colorKey}-${size.sizeId}`,
        stockLabel:
          stockLevel === 'out-of-stock'
            ? 'Hết hàng'
            : stockLevel === 'low-stock'
              ? 'Còn ít hàng'
              : 'Sẵn sàng giao',
        stockLevel,
      } satisfies ProductSku;
    }),
  );
}

const baseSections = (name: string, materialLabel: string) => [
  {
    content: [
      `${name} được xây dựng cho nhịp mặc hằng ngày, với ưu tiên giữ phom gọn và bề mặt chất liệu tự nhiên.`,
      'Nội dung này là dữ liệu minh hoạ đã được chuẩn hoá cho giao diện PDP; backend thật sẽ thay thế bằng bản mô tả được duyệt.',
    ],
    id: 'description',
    title: 'Mô tả',
  },
  {
    content: [
      `Chất liệu chính: ${materialLabel}.`,
      'Giặt nhẹ, phơi ngang và tránh nhiệt cao để giữ bề mặt vải ổn định.',
    ],
    id: 'material-care',
    title: 'Chất liệu & chăm sóc',
  },
  {
    content: [
      'Phom vừa cơ thể, ưu tiên cảm giác thoáng và dễ phối lớp.',
      'Nếu thích mặc rộng hơn, cân nhắc tăng một cỡ sau khi xem bảng kích thước.',
    ],
    id: 'fit',
    title: 'Dáng mặc & kích thước',
  },
  {
    content: [
      'Phương thức giao hàng, chi phí và thời gian đến được hệ thống thương mại xác nhận lại khi có địa chỉ giao nhận hợp lệ.',
      'Chính sách đổi trả cuối cùng phụ thuộc quyết định vận hành đã được duyệt.',
    ],
    id: 'shipping-returns',
    title: 'Giao hàng & đổi trả',
  },
  {
    content: [
      'LYLE ưu tiên chất liệu thiên nhiên và bề mặt hoàn thiện bền theo thời gian.',
      'Mọi tuyên bố bền vững trong bản production cần nguồn chứng thực từ nội dung đã duyệt.',
    ],
    id: 'sustainability',
    title: 'Nguồn gốc & bền vững',
  },
];

const seeds: MockSeed[] = [
  {
    categoryHref: '/men',
    categoryLabel: 'Nam',
    colorOrder: ['bone', 'ink', 'moss'],
    description: 'Áo sơ mi Linen tối giản cho nhịp mặc hằng ngày và văn phòng.',
    fitNote: 'Dáng thẳng, vai vừa, phù hợp mặc đơn hoặc layering nhẹ.',
    genderLabel: 'Nam',
    id: 'mock-product-1',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Áo sơ mi Linen tối giản',
    price: 399000,
    recommendations: ['mock-product-10', 'mock-product-11', 'mock-product-7'],
    sections: baseSections('Áo sơ mi Linen tối giản', 'Linen'),
    slug: 'san-pham-minh-hoa-1',
    sustainabilityNote: 'Ưu tiên chất liệu tự nhiên, dễ mặc nhiều mùa.',
  },
  {
    categoryHref: '/women',
    categoryLabel: 'Nữ',
    colorOrder: ['ink', 'bone', 'clay'],
    description: 'Quần Linen ống thẳng cho phom tối giản, đứng dáng.',
    fitNote: 'Ống thẳng, lưng vừa, hợp đi làm và mặc thường ngày.',
    genderLabel: 'Nữ',
    id: 'mock-product-2',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Quần Linen ống thẳng',
    price: 499000,
    recommendations: ['mock-product-1', 'mock-product-5', 'mock-product-8'],
    sections: baseSections('Quần Linen ống thẳng', 'Linen'),
    slug: 'san-pham-minh-hoa-2',
    sustainabilityNote: 'Bề mặt vải nhẹ, giữ cảm giác mát và khô thoáng.',
  },
  {
    categoryHref: '/women',
    categoryLabel: 'Nữ',
    colorOrder: ['moss', 'bone', 'ink'],
    description: 'Áo Lyocell cổ tròn mềm nhẹ, ưu tiên cảm giác chạm mượt.',
    fitNote: 'Form ôm nhẹ thân trên, cân bằng với quần hoặc chân váy tối giản.',
    genderLabel: 'Nữ',
    id: 'mock-product-3',
    materialLabel: 'Lyocell',
    materials: ['Lyocell'],
    name: 'Áo Lyocell cổ tròn',
    price: 399000,
    recommendations: ['mock-product-5', 'mock-product-9', 'mock-product-8'],
    sections: baseSections('Áo Lyocell cổ tròn', 'Lyocell'),
    slug: 'san-pham-minh-hoa-3',
    sustainabilityNote: 'Chất liệu có độ rủ tự nhiên cho bề mặt mềm hơn.',
  },
  {
    categoryHref: '/men',
    categoryLabel: 'Nam',
    colorOrder: ['clay', 'bone', 'ink'],
    description:
      'Quần short Linen thư thái cho ngày nóng và trang phục du lịch.',
    fitNote:
      'Ống suông, chiều dài trên gối, dễ phối cùng áo sơ mi hoặc áo thun.',
    genderLabel: 'Nam',
    id: 'mock-product-4',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Quần short Linen thư thái',
    price: 399000,
    recommendations: ['mock-product-1', 'mock-product-7', 'mock-product-12'],
    sections: baseSections('Quần short Linen thư thái', 'Linen'),
    slug: 'san-pham-minh-hoa-4',
    sustainabilityNote: 'Thiết kế ưu tiên vòng đời mặc dài và ít lỗi mốt.',
  },
  {
    badges: [{ id: 'mock-product-5-new', kind: 'new', label: 'Mới' }],
    categoryHref: '/women',
    categoryLabel: 'Nữ',
    colorOrder: ['ink', 'bone', 'moss'],
    description: 'Đầm Lyocell dáng suông với tỷ lệ sạch và bề mặt mượt.',
    fitNote: 'Dáng suông thả nhẹ, hợp mặc đơn hoặc phối cùng layer mỏng.',
    genderLabel: 'Nữ',
    id: 'mock-product-5',
    materialLabel: 'Lyocell',
    materials: ['Lyocell'],
    name: 'Đầm Lyocell dáng suông',
    price: 699000,
    recommendations: ['mock-product-3', 'mock-product-8', 'mock-product-9'],
    sections: baseSections('Đầm Lyocell dáng suông', 'Lyocell'),
    slug: 'san-pham-minh-hoa-5',
    sustainabilityNote:
      'Bề mặt mềm, rủ tự nhiên, dễ dùng cho nhịp mặc dài ngày.',
  },
  {
    categoryHref: '/women',
    categoryLabel: 'Nữ',
    colorOrder: ['bone', 'ink', 'clay'],
    description: 'Chân váy Linen midi cho phối đồ tối giản và văn phòng.',
    fitNote: 'Lưng vừa, độ dài midi, cân bằng với sơ mi hoặc áo ôm nhẹ.',
    genderLabel: 'Nữ',
    id: 'mock-product-6',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Chân váy Linen midi',
    price: 499000,
    recommendations: ['mock-product-3', 'mock-product-5', 'mock-product-9'],
    sections: baseSections('Chân váy Linen midi', 'Linen'),
    slug: 'san-pham-minh-hoa-6',
    sustainabilityNote: 'Nhịp mặc linh hoạt giữa thường ngày và đi làm.',
  },
  {
    badges: [{ id: 'mock-product-7-set', kind: 'exclusive', label: 'Set' }],
    categoryHref: '/men',
    categoryLabel: 'Nam',
    colorOrder: ['moss'],
    description:
      'Bộ Linen thường ngày nam gồm áo và quần short, bán theo set cố định.',
    fitNote:
      'Bundle thiên về nhịp mặc thư giãn; từng thành phần cần chọn cỡ riêng.',
    genderLabel: 'Nam',
    id: 'mock-product-7',
    kind: 'bundle',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Bộ Linen thường ngày nam',
    price: 699000,
    recommendations: ['mock-product-4', 'mock-product-1', 'mock-product-12'],
    sections: baseSections('Bộ Linen thường ngày nam', 'Linen'),
    slug: 'san-pham-minh-hoa-7',
    sustainabilityNote:
      'Set cố định để giữ tính đồng bộ về chất liệu và tông màu.',
  },
  {
    badges: [{ id: 'mock-product-8-set', kind: 'exclusive', label: 'Set' }],
    categoryHref: '/women',
    categoryLabel: 'Nữ',
    colorOrder: ['clay'],
    description:
      'Bộ Lyocell cao cấp nữ gồm áo và chân váy, bán theo set cố định.',
    fitNote:
      'Mỗi thành phần cần chọn cỡ riêng để giữ cân bằng phom trên và dưới.',
    genderLabel: 'Nữ',
    id: 'mock-product-8',
    kind: 'bundle',
    materialLabel: 'Lyocell',
    materials: ['Lyocell'],
    name: 'Bộ Lyocell cao cấp nữ',
    price: 1099000,
    recommendations: ['mock-product-5', 'mock-product-6', 'mock-product-3'],
    sections: baseSections('Bộ Lyocell cao cấp nữ', 'Lyocell'),
    slug: 'san-pham-minh-hoa-8',
    sustainabilityNote:
      'Set được biên tập như một diện mạo hoàn chỉnh, không mix tự do.',
  },
  {
    categoryHref: '/women',
    categoryLabel: 'Nữ',
    colorOrder: ['bone', 'ink', 'moss'],
    description: 'Áo sơ mi Lyocell mềm nhẹ với độ rủ cao và bề mặt tinh gọn.',
    fitNote:
      'Vai mềm, thân vừa, phù hợp mặc đi làm hoặc mặc mở ngoài áo trong.',
    genderLabel: 'Nữ',
    id: 'mock-product-9',
    materialLabel: 'Lyocell',
    materials: ['Lyocell'],
    name: 'Áo sơ mi Lyocell mềm nhẹ',
    price: 499000,
    recommendations: ['mock-product-3', 'mock-product-5', 'mock-product-6'],
    sections: baseSections('Áo sơ mi Lyocell mềm nhẹ', 'Lyocell'),
    slug: 'san-pham-minh-hoa-9',
    sustainabilityNote:
      'Bề mặt mềm và ít nhăn tương đối cho nhịp mặc linh hoạt.',
  },
  {
    categoryHref: '/men',
    categoryLabel: 'Nam',
    colorOrder: ['ink', 'bone', 'clay'],
    description: 'Quần Linen thường ngày cho tủ đồ nam tối giản.',
    fitNote: 'Ống gọn vừa, thân trên sạch và dễ mặc quanh năm.',
    genderLabel: 'Nam',
    id: 'mock-product-10',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Quần Linen thường ngày',
    price: 499000,
    recommendations: ['mock-product-1', 'mock-product-4', 'mock-product-12'],
    sections: baseSections('Quần Linen thường ngày', 'Linen'),
    slug: 'san-pham-minh-hoa-10',
    sustainabilityNote:
      'Thiết kế ưu tiên khả năng phối lặp lại với ít chi tiết thừa.',
  },
  {
    categoryHref: '/men',
    categoryLabel: 'Nam',
    colorOrder: ['clay', 'bone', 'ink'],
    description: 'Áo thun Linen cổ tròn với cảm giác mộc, nhẹ và sạch.',
    fitNote: 'Phom vừa thân, vai thả nhẹ, hợp mặc đơn hoặc layer.',
    genderLabel: 'Nam',
    id: 'mock-product-11',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Áo thun Linen cổ tròn',
    price: 399000,
    recommendations: ['mock-product-1', 'mock-product-10', 'mock-product-7'],
    sections: baseSections('Áo thun Linen cổ tròn', 'Linen'),
    slug: 'san-pham-minh-hoa-11',
    sustainabilityNote: 'Giữ bề mặt tự nhiên và khả năng phối lặp nhiều mùa.',
  },
  {
    badges: [{ id: 'mock-product-12-set', kind: 'exclusive', label: 'Set' }],
    categoryHref: '/men',
    categoryLabel: 'Nam',
    colorOrder: ['moss'],
    description:
      'Bộ Linen cao cấp nam cho outfit hoàn chỉnh với cấu trúc set cố định.',
    fitNote:
      'Set ưu tiên phối sẵn; khách chọn kích thước riêng cho từng thành phần.',
    genderLabel: 'Nam',
    id: 'mock-product-12',
    kind: 'bundle',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Bộ Linen cao cấp nam',
    price: 1099000,
    recommendations: ['mock-product-1', 'mock-product-10', 'mock-product-7'],
    sections: baseSections('Bộ Linen cao cấp nam', 'Linen'),
    slug: 'san-pham-minh-hoa-12',
    sustainabilityNote:
      'Set biên tập sẵn nhằm giảm rủi ro phối sai chất liệu và tông màu.',
  },
  {
    categoryHref: '/shop',
    categoryLabel: 'Sản phẩm đã ngừng kinh doanh',
    colorOrder: ['ink'],
    description: 'Ví dụ dữ liệu cho sản phẩm đã ngừng kinh doanh.',
    fitNote: 'Dùng để kiểm tra giao diện trạng thái không thể mua.',
    genderLabel: 'Unisex',
    id: 'mock-product-discontinued',
    materialLabel: 'Linen',
    materials: ['Linen'],
    name: 'Sản phẩm minh hoạ đã ngừng kinh doanh',
    price: 399000,
    recommendations: ['mock-product-1', 'mock-product-3'],
    sections: baseSections('Sản phẩm minh hoạ đã ngừng kinh doanh', 'Linen'),
    slug: 'san-pham-ngung-kinh-doanh',
    status: 'discontinued',
    sustainabilityNote: 'Giữ lại route để không làm hỏng liên kết SEO cũ.',
  },
];

function toRecommendationSummary(product: ProductDetail): ProductSummary {
  const primaryColor = product.colors[0];
  if (!primaryColor) {
    throw new Error(
      `Product ${product.id} must expose at least one recommendation color.`,
    );
  }
  const fallbackImage = product.defaultGallery[0];
  if (!fallbackImage) {
    throw new Error(`Product ${product.id} must expose a primary image.`);
  }
  const primarySku = product.skus.find(
    (sku) => sku.colorId === primaryColor.colorId,
  );
  return {
    badges: product.badges,
    categoryId: product.category.label,
    colors: product.colors.map((color) => ({
      colorId: color.colorId,
      image:
        product.skus.find((sku) => sku.colorId === color.colorId)?.images[0] ??
        fallbackImage,
      label: color.label,
      swatchHex: color.swatchHex,
    })),
    compareAtPrice: primarySku?.compareAtPrice,
    discountPercentageAllowed: Boolean(primarySku?.compareAtPrice),
    gender:
      product.genderLabel === 'Nam'
        ? 'men'
        : product.genderLabel === 'Nữ'
          ? 'women'
          : 'unisex',
    id: product.id,
    lowStockThreshold: undefined,
    name: product.name,
    price:
      primarySku?.price ?? product.bundle?.price ?? product.skus[0]?.price ?? 0,
    primaryImage: fallbackImage,
    requiresSizeSelection: true,
    sizes: product.sizes.map((size) => {
      const sku = product.skus.find(
        (candidate) =>
          candidate.colorId === primaryColor.colorId &&
          candidate.sizeId === size.sizeId,
      );
      return {
        available: sku?.available ?? false,
        label: size.label,
        sizeId: size.sizeId,
        skuId: sku?.skuId ?? `${product.id}-${size.sizeId}`,
      };
    }),
    slug: product.slug,
    stockLevel: product.stockLevel,
  };
}

function buildBundle(seed: MockSeed) {
  if (seed.kind !== 'bundle') return undefined;

  if (seed.id === 'mock-product-7') {
    return {
      bundleId: 'bundle-men-casual-linen',
      compareAtPrice: 798000,
      components: [
        {
          componentId: 'bundle-7-top',
          description: 'Áo sơ mi Linen cùng tông, giữ bố cục set gọn và sáng.',
          fixedColor: sharedColors.moss,
          image: eliseImage(
            demoImagesForId('mock-product-1').primary,
            'Áo sơ mi trong bộ Linen thường ngày nam',
          ),
          productId: 'mock-product-1',
          productName: 'Áo sơ mi Linen tối giản',
          productSlug: 'san-pham-minh-hoa-1',
          quantity: 1,
          sizeOptions: sizeScale.map((size) => ({
            available: size.sizeId !== 'xl',
            label: size.label,
            sizeId: size.sizeId,
            skuId: `mock-product-1-moss-${size.sizeId}`,
            stockLabel: size.sizeId === 'l' ? 'Còn ít hàng' : 'Sẵn sàng giao',
          })),
          title: 'Áo sơ mi',
        },
        {
          componentId: 'bundle-7-bottom',
          description:
            'Quần short Linen đồng màu, ưu tiên cảm giác thoáng và đồng bộ.',
          fixedColor: sharedColors.moss,
          image: eliseImage(
            demoImagesForId('mock-product-4').primary,
            'Quần short trong bộ Linen thường ngày nam',
          ),
          productId: 'mock-product-4',
          productName: 'Quần short Linen thư thái',
          productSlug: 'san-pham-minh-hoa-4',
          quantity: 1,
          sizeOptions: sizeScale.map((size) => ({
            available: size.sizeId !== 'xl',
            label: size.label,
            sizeId: size.sizeId,
            skuId: `mock-product-4-moss-${size.sizeId}`,
            stockLabel: size.sizeId === 'l' ? 'Còn ít hàng' : 'Sẵn sàng giao',
          })),
          title: 'Quần short',
        },
      ],
      price: seed.price,
      selectionNote:
        'Chọn kích thước cho từng thành phần. Màu set đã được cố định theo bộ.',
      title: seed.name,
    } satisfies ProductDetail['bundle'];
  }

  if (seed.id === 'mock-product-8') {
    return {
      bundleId: 'bundle-women-premium-lyocell',
      compareAtPrice: 1198000,
      components: [
        {
          componentId: 'bundle-8-top',
          description: 'Áo Lyocell mềm nhẹ để giữ phần thân trên gọn và rủ.',
          fixedColor: sharedColors.clay,
          image: eliseImage(
            demoImagesForId('mock-product-3').primary,
            'Áo trong bộ Lyocell cao cấp nữ',
          ),
          productId: 'mock-product-3',
          productName: 'Áo Lyocell cổ tròn',
          productSlug: 'san-pham-minh-hoa-3',
          quantity: 1,
          sizeOptions: sizeScale.map((size) => ({
            available: size.sizeId !== 'xl',
            label: size.label,
            sizeId: size.sizeId,
            skuId: `mock-product-3-clay-${size.sizeId}`,
            stockLabel: size.sizeId === 'l' ? 'Còn ít hàng' : 'Sẵn sàng giao',
          })),
          title: 'Áo Lyocell',
        },
        {
          componentId: 'bundle-8-bottom',
          description:
            'Chân váy midi cùng tông để giữ cảm giác premium nhưng gần gũi.',
          fixedColor: sharedColors.clay,
          image: eliseImage(
            demoImagesForId('mock-product-6').primary,
            'Chân váy trong bộ Lyocell cao cấp nữ',
          ),
          productId: 'mock-product-6',
          productName: 'Chân váy Linen midi',
          productSlug: 'san-pham-minh-hoa-6',
          quantity: 1,
          sizeOptions: sizeScale.map((size) => ({
            available: size.sizeId !== 'xl',
            label: size.label,
            sizeId: size.sizeId,
            skuId: `mock-product-6-clay-${size.sizeId}`,
            stockLabel: size.sizeId === 'm' ? 'Còn ít hàng' : 'Sẵn sàng giao',
          })),
          title: 'Chân váy midi',
        },
      ],
      price: seed.price,
      selectionNote:
        'Bundle MVP hiện là set cố định: không đổi thành phần, không đổi màu, chỉ chọn cỡ.',
      title: seed.name,
    } satisfies ProductDetail['bundle'];
  }

  return {
    bundleId: 'bundle-men-premium-linen',
    compareAtPrice: 1198000,
    components: [
      {
        componentId: 'bundle-12-top',
        description: 'Áo sơ mi cùng tông giữ phần trên gọn và sáng.',
        fixedColor: sharedColors.moss,
        image: eliseImage(
          demoImagesForId('mock-product-1').primary,
          'Áo trong bộ Linen cao cấp nam',
        ),
        productId: 'mock-product-1',
        productName: 'Áo sơ mi Linen tối giản',
        productSlug: 'san-pham-minh-hoa-1',
        quantity: 1,
        sizeOptions: sizeScale.map((size) => ({
          available: size.sizeId !== 'xl',
          label: size.label,
          sizeId: size.sizeId,
          skuId: `mock-product-1-moss-${size.sizeId}`,
          stockLabel: size.sizeId === 'm' ? 'Còn ít hàng' : 'Sẵn sàng giao',
        })),
        title: 'Áo sơ mi',
      },
      {
        componentId: 'bundle-12-bottom',
        description: 'Quần Linen thường ngày đồng tông cho outfit hoàn chỉnh.',
        fixedColor: sharedColors.moss,
        image: eliseImage(
          demoImagesForId('mock-product-10').primary,
          'Quần trong bộ Linen cao cấp nam',
        ),
        productId: 'mock-product-10',
        productName: 'Quần Linen thường ngày',
        productSlug: 'san-pham-minh-hoa-10',
        quantity: 1,
        sizeOptions: sizeScale.map((size) => ({
          available: size.sizeId !== 'xl',
          label: size.label,
          sizeId: size.sizeId,
          skuId: `mock-product-10-moss-${size.sizeId}`,
          stockLabel: size.sizeId === 'l' ? 'Còn ít hàng' : 'Sẵn sàng giao',
        })),
        title: 'Quần Linen',
      },
    ],
    price: seed.price,
    selectionNote:
      'Bundle MVP giữ giá và thành phần cố định; hệ thống xác thực lại từng SKU khi thêm vào giỏ.',
    title: seed.name,
  } satisfies ProductDetail['bundle'];
}

const mockProducts: ProductDetail[] = seeds.map((seed) => {
  const colors = seed.colorOrder.map((colorKey) => sharedColors[colorKey]);
  const defaultColor = colors[0];
  if (!defaultColor) {
    throw new Error(`Seed ${seed.id} must define at least one color.`);
  }
  const skus = buildSimpleSkus(seed);
  const defaultGallery =
    skus.find((sku) => sku.colorId === defaultColor.colorId)?.images ??
    variantImages(seed.id, seed.name, defaultColor.label);
  const bundle = buildBundle(seed);
  return {
    badges: seed.badges ?? [],
    bundle,
    category: { href: seed.categoryHref, label: seed.categoryLabel },
    colorLabel: bundle ? `Màu set: ${defaultColor.label}` : 'Màu sắc',
    colors,
    defaultColorId: defaultColor.colorId,
    defaultGallery,
    description: seed.description,
    fitNote: seed.fitNote,
    genderLabel: seed.genderLabel,
    id: seed.id,
    kind: seed.kind ?? 'simple',
    materialLabel: seed.materialLabel,
    materials: seed.materials,
    name: seed.name,
    recommendations: [],
    sections: seed.sections,
    sizeGuide: [
      'Ngực / eo / hông đo theo cơ thể, không đo theo sản phẩm.',
      'Nếu bạn đứng giữa hai cỡ, ưu tiên cỡ lớn hơn cho phom rộng thoáng.',
      'Bảng kích thước chính thức sẽ được lấy từ hệ thống sản phẩm đã duyệt.',
    ],
    sizes: sizeScale.map((size) => ({
      label: size.label,
      sizeId: size.sizeId,
    })),
    skuLabel: 'Mã SKU',
    skus,
    slug: seed.slug,
    status: seed.status ?? 'published',
    stockLevel:
      seed.status === 'discontinued'
        ? 'out-of-stock'
        : skus.some((sku) => sku.stockLevel === 'low-stock')
          ? 'low-stock'
          : 'in-stock',
    stockNote:
      seed.status === 'discontinued'
        ? 'Sản phẩm này đã ngừng kinh doanh và không còn khả năng mua.'
        : seed.kind === 'bundle'
          ? 'Từng thành phần trong set được kiểm tra tồn kho riêng theo SKU.'
          : 'Tồn kho hiển thị theo SKU được chọn và sẽ được xác thực lại ở bước thêm vào giỏ.',
    sustainabilityNote: seed.sustainabilityNote,
  } satisfies ProductDetail;
});

const productMap = new Map(
  mockProducts.map((product) => [product.slug, product]),
);
const productMapById = new Map(
  mockProducts.map((product) => [product.id, product]),
);

for (const product of mockProducts) {
  product.recommendations = product.bundle
    ? product.bundle.components
        .map((component) => productMapById.get(component.productId))
        .filter((candidate): candidate is ProductDetail => Boolean(candidate))
        .slice(0, 2)
        .map(toRecommendationSummary)
    : (seeds
        .find((seed) => seed.id === product.id)
        ?.recommendations.map((id) => productMapById.get(id))
        .filter((candidate): candidate is ProductDetail => Boolean(candidate))
        .map(toRecommendationSummary) ?? []);
}

export const mockProductAdapter: ProductDetailProvider = async (slug) => {
  return { data: productMap.get(slug) ?? null, error: null };
};

export function getMockProductById(productId: string) {
  return productMapById.get(productId) ?? null;
}

export function getMockProductBySlug(slug: string) {
  return productMap.get(slug) ?? null;
}

export function getPublishedProductSlugs() {
  return mockProducts
    .filter(
      (product) =>
        product.status === 'published' || product.status === 'discontinued',
    )
    .map((product) => product.slug);
}
