import type {
  CatalogFilterFacet,
  CatalogGender,
  CatalogLandingContent,
  CatalogLandingProvider,
  CatalogQuery,
  CatalogResultProvider,
  ProductCardColorOption,
  ProductSummary,
} from '@/modules/catalog/contracts/catalog';

type MockProduct = ProductSummary & {
  filterValues: {
    category: string;
    collections: string[];
    materials: string[];
    priceTier: string;
    styles: string[];
  };
  rank: number;
  salesRank: number;
};

const image = (file: string, alt: string) => ({
  alt,
  height: 1500,
  src: `/images/catalog/${file}`,
  width: 1200,
});

const colors = {
  bone: {
    colorId: 'bone',
    image: image(
      'linen-bone.svg',
      'Trang phục Linen màu ngà trên nền trung tính',
    ),
    label: 'Ngà',
    swatchHex: '#E5E0D5',
  },
  ink: {
    colorId: 'ink',
    image: image(
      'linen-ink.svg',
      'Trang phục Linen màu mực trên nền trung tính',
    ),
    label: 'Mực',
    swatchHex: '#20211D',
  },
  moss: {
    colorId: 'moss',
    image: image(
      'linen-moss.svg',
      'Trang phục Linen màu rêu trên nền trung tính',
    ),
    label: 'Rêu',
    swatchHex: '#4E5A42',
  },
  clay: {
    colorId: 'clay',
    image: image(
      'linen-clay.svg',
      'Trang phục Linen màu đất trên nền trung tính',
    ),
    label: 'Đất',
    swatchHex: '#8A5A44',
  },
} as const;

const standardSizes = ['S', 'M', 'L', 'XL'].map((label, index) => ({
  available: index !== 3,
  label,
  sizeId: label.toLowerCase(),
  skuId: `mock-size-${label.toLowerCase()}`,
}));

type MockProductSeed = readonly [
  name: string,
  gender: CatalogGender,
  category: string,
  price: number,
  primaryColor: ProductCardColorOption,
  materials: string[],
  styles: string[],
];

const mockProductSeeds: MockProductSeed[] = [
  [
    'Áo sơ mi Linen tối giản',
    'men',
    'shirts',
    399000,
    colors.bone,
    ['linen'],
    ['minimal', 'office'],
  ],
  [
    'Quần Linen ống thẳng',
    'women',
    'pants',
    499000,
    colors.ink,
    ['linen'],
    ['minimal', 'office'],
  ],
  [
    'Áo Lyocell cổ tròn',
    'women',
    't-shirts',
    399000,
    colors.moss,
    ['lyocell'],
    ['everyday', 'minimal'],
  ],
  [
    'Quần short Linen thư thái',
    'men',
    'shorts',
    399000,
    colors.clay,
    ['linen'],
    ['casual', 'everyday'],
  ],
  [
    'Đầm Lyocell dáng suông',
    'women',
    'dresses',
    699000,
    colors.ink,
    ['lyocell'],
    ['minimal', 'premium'],
  ],
  [
    'Chân váy Linen midi',
    'women',
    'skirts',
    499000,
    colors.bone,
    ['linen'],
    ['office', 'minimal'],
  ],
  [
    'Bộ Linen thường ngày nam',
    'men',
    'casual-sets',
    699000,
    colors.moss,
    ['linen'],
    ['casual'],
  ],
  [
    'Bộ Lyocell cao cấp nữ',
    'women',
    'premium-sets',
    1099000,
    colors.clay,
    ['lyocell'],
    ['premium'],
  ],
  [
    'Áo sơ mi Lyocell mềm nhẹ',
    'women',
    'shirts',
    499000,
    colors.bone,
    ['lyocell'],
    ['office', 'minimal'],
  ],
  [
    'Quần Linen thường ngày',
    'men',
    'pants',
    499000,
    colors.ink,
    ['linen'],
    ['casual', 'everyday'],
  ],
  [
    'Áo thun Linen cổ tròn',
    'men',
    't-shirts',
    399000,
    colors.clay,
    ['linen'],
    ['everyday', 'minimal'],
  ],
  [
    'Bộ Linen cao cấp nam',
    'men',
    'premium-sets',
    1099000,
    colors.moss,
    ['linen'],
    ['premium'],
  ],
];

const mockProducts: MockProduct[] = mockProductSeeds.map((entry, index) => {
  const [name, gender, category, price, primaryColor, materials, styles] =
    entry;
  const id = `mock-product-${index + 1}`;
  const slug = `san-pham-minh-hoa-${index + 1}`;
  const compareAtPrice = index === 4 ? 799000 : undefined;
  return {
    badges: index < 2 ? [{ id: `${id}-badge`, kind: 'new', label: 'Mới' }] : [],
    categoryId: category,
    colors: [primaryColor, colors.bone, colors.ink].filter(
      (color, colorIndex, all) =>
        all.findIndex((candidate) => candidate.colorId === color.colorId) ===
        colorIndex,
    ),
    compareAtPrice,
    discountPercentageAllowed: compareAtPrice !== undefined,
    filterValues: {
      category,
      collections:
        index < 4 ? ['new-arrival'] : index < 8 ? ['linen-collection'] : [],
      materials,
      priceTier:
        price < 500000 ? 'under-500' : price < 900000 ? '500-900' : 'over-900',
      styles,
    },
    gender,
    hoverImage: image('linen-detail.svg', `Chi tiết chất liệu của ${name}`),
    id,
    lowStockThreshold: index === 5 ? 3 : undefined,
    name,
    price,
    primaryImage: primaryColor.image,
    rank: index,
    requiresSizeSelection: true,
    salesRank: (index * 7) % 12,
    sizes: standardSizes.map((size) => ({
      ...size,
      skuId: `${id}-${size.sizeId}`,
    })),
    slug,
    stockLevel:
      index === 10 ? 'out-of-stock' : index === 5 ? 'low-stock' : 'in-stock',
  } satisfies MockProduct;
});

const facetDefinitions: Array<{
  key: CatalogFilterFacet['key'];
  label: string;
  options: Array<{ label: string; value: string }>;
}> = [
  {
    key: 'gender',
    label: 'Giới tính',
    options: [
      { label: 'Nam', value: 'men' },
      { label: 'Nữ', value: 'women' },
    ],
  },
  {
    key: 'category',
    label: 'Danh mục',
    options: [
      { label: 'Áo thun', value: 't-shirts' },
      { label: 'Áo sơ mi', value: 'shirts' },
      { label: 'Quần dài', value: 'pants' },
      { label: 'Quần short', value: 'shorts' },
      { label: 'Chân váy', value: 'skirts' },
      { label: 'Đầm', value: 'dresses' },
      { label: 'Bộ thường ngày', value: 'casual-sets' },
      { label: 'Bộ cao cấp', value: 'premium-sets' },
    ],
  },
  {
    key: 'collection',
    label: 'Bộ sưu tập',
    options: [
      { label: 'Hàng mới', value: 'new-arrival' },
      { label: 'Bộ sưu tập Linen', value: 'linen-collection' },
    ],
  },
  {
    key: 'material',
    label: 'Chất liệu',
    options: [
      { label: 'Linen', value: 'linen' },
      { label: 'Lyocell', value: 'lyocell' },
    ],
  },
  {
    key: 'style',
    label: 'Phong cách',
    options: [
      { label: 'Tối giản', value: 'minimal' },
      { label: 'Thường ngày', value: 'casual' },
      { label: 'Công sở', value: 'office' },
      { label: 'Cao cấp', value: 'premium' },
      { label: 'Hằng ngày', value: 'everyday' },
    ],
  },
  {
    key: 'color',
    label: 'Màu sắc',
    options: [
      { label: 'Ngà', value: 'bone' },
      { label: 'Mực', value: 'ink' },
      { label: 'Rêu', value: 'moss' },
      { label: 'Đất', value: 'clay' },
    ],
  },
  {
    key: 'size',
    label: 'Kích thước',
    options: standardSizes.map(({ label, sizeId }) => ({
      label,
      value: sizeId,
    })),
  },
  {
    key: 'availability',
    label: 'Tình trạng',
    options: [
      { label: 'Còn hàng', value: 'in-stock' },
      { label: 'Sắp hết', value: 'low-stock' },
      { label: 'Hết hàng', value: 'out-of-stock' },
    ],
  },
  {
    key: 'priceTier',
    label: 'Khoảng giá',
    options: [
      { label: 'Dưới 500.000 ₫', value: 'under-500' },
      { label: '500.000–900.000 ₫', value: '500-900' },
      { label: 'Trên 900.000 ₫', value: 'over-900' },
    ],
  },
  {
    key: 'promotion',
    label: 'Ưu đãi',
    options: [{ label: 'Đang có ưu đãi', value: 'active' }],
  },
];

function matches(product: MockProduct, query: CatalogQuery) {
  const includes = (values: string[] | undefined, candidates: string[]) =>
    !values?.length || values.some((value) => candidates.includes(value));
  return (
    includes(query.gender, [product.gender]) &&
    includes(query.category, [product.filterValues.category]) &&
    includes(query.collection, product.filterValues.collections) &&
    includes(query.material, product.filterValues.materials) &&
    includes(query.style, product.filterValues.styles) &&
    includes(
      query.color,
      product.colors.map((color) => color.colorId),
    ) &&
    includes(
      query.size,
      product.sizes.filter((size) => size.available).map((size) => size.sizeId),
    ) &&
    includes(query.availability, [product.stockLevel]) &&
    includes(query.priceTier, [product.filterValues.priceTier]) &&
    !query.promotion?.length
  );
}

function sortProducts(products: MockProduct[], sort: CatalogQuery['sort']) {
  return [...products].sort((left, right) => {
    if (sort === 'price-asc') return left.price - right.price;
    if (sort === 'price-desc') return right.price - left.price;
    if (sort === 'newest') return right.rank - left.rank;
    if (sort === 'best-selling') return left.salesRank - right.salesRank;
    return left.rank - right.rank;
  });
}

function buildFacets(products: MockProduct[]): CatalogFilterFacet[] {
  return facetDefinitions.map((facet) => ({
    key: facet.key,
    label: facet.label,
    options: facet.options.map((option) => {
      const count = products.filter((product) => {
        const query = {
          page: 1,
          pageSize: 100,
          sort: 'recommended',
          [facet.key]: [option.value],
        } as CatalogQuery;
        return matches(product, query);
      }).length;
      return { ...option, count, disabled: count === 0 };
    }),
  }));
}

export const mockCatalogAdapter: CatalogResultProvider = async (query) => {
  const filtered = sortProducts(
    mockProducts.filter((product) => matches(product, query)),
    query.sort,
  );
  const start = (query.page - 1) * query.pageSize;
  const products = filtered.slice(start, start + query.pageSize);
  return {
    data: {
      facets: buildFacets(mockProducts),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / query.pageSize),
      },
      products,
      sortOptions: [
        { label: 'Đề xuất', value: 'recommended' },
        { label: 'Mới nhất', value: 'newest' },
        { label: 'Giá thấp đến cao', value: 'price-asc' },
        { label: 'Giá cao đến thấp', value: 'price-desc' },
        { label: 'Bán chạy', value: 'best-selling' },
      ],
    },
    error: null,
  };
};

const landings: Record<string, CatalogLandingContent> = {
  shop: {
    id: 'shop',
    slug: 'shop',
    breadcrumbLabel: 'Cửa hàng',
    title: 'Cửa hàng',
    description:
      'Khám phá các thiết kế tối giản theo chất liệu, phom dáng và nhịp sống.',
    seoDescription:
      'Khám phá thời trang tối giản LYLE Fashion dành cho khách hàng Việt Nam.',
  },
  men: {
    id: 'men',
    slug: 'men',
    breadcrumbLabel: 'Nam',
    title: 'Thời trang nam',
    description:
      'Những phom dáng gọn gàng cho công việc, cuối tuần và nhịp sống hằng ngày.',
    seoDescription: 'Khám phá thời trang nam tối giản từ LYLE Fashion.',
  },
  women: {
    id: 'women',
    slug: 'women',
    breadcrumbLabel: 'Nữ',
    title: 'Thời trang nữ',
    description:
      'Thiết kế nhẹ nhàng, linh hoạt và chú trọng cảm giác mặc trong ngày.',
    seoDescription: 'Khám phá thời trang nữ tối giản từ LYLE Fashion.',
  },
  'new-arrival': {
    id: 'new-arrival',
    slug: 'new-arrival',
    breadcrumbLabel: 'Hàng mới',
    title: 'Hàng mới',
    seoDescription: 'Khám phá các thiết kế mới trong bộ sưu tập LYLE Fashion.',
  },
  'best-seller': {
    id: 'best-seller',
    slug: 'best-seller',
    breadcrumbLabel: 'Bán chạy',
    title: 'Bán chạy',
    seoDescription: 'Khám phá danh sách sản phẩm bán chạy của LYLE Fashion.',
  },
  'eco-collection': {
    id: 'eco-collection',
    slug: 'eco-collection',
    breadcrumbLabel: 'Bộ sưu tập Eco',
    title: 'Bộ sưu tập Eco',
    seoDescription: 'Khám phá bộ sưu tập Eco của LYLE Fashion.',
  },
  'premium-collection': {
    id: 'premium-collection',
    slug: 'premium-collection',
    breadcrumbLabel: 'Bộ sưu tập cao cấp',
    title: 'Bộ sưu tập cao cấp',
    seoDescription: 'Khám phá bộ sưu tập cao cấp của LYLE Fashion.',
  },
  'linen-collection': {
    id: 'linen-collection',
    slug: 'linen-collection',
    breadcrumbLabel: 'Bộ sưu tập Linen',
    title: 'Bộ sưu tập Linen',
    description:
      'Khám phá các thiết kế sử dụng Linen trong bộ dữ liệu minh họa của storefront.',
    seoDescription: 'Khám phá bộ sưu tập Linen của LYLE Fashion.',
  },
  'lyocell-collection': {
    id: 'lyocell-collection',
    slug: 'lyocell-collection',
    breadcrumbLabel: 'Bộ sưu tập Lyocell',
    title: 'Bộ sưu tập Lyocell',
    seoDescription: 'Khám phá bộ sưu tập Lyocell của LYLE Fashion.',
  },
};

export const mockCatalogLandingAdapter: CatalogLandingProvider = async (
  identifier,
) => {
  const key =
    'shop' in identifier && identifier.shop
      ? 'shop'
      : (identifier.gender ?? identifier.collectionSlug ?? '');
  return { data: landings[key] ?? null, error: null };
};
