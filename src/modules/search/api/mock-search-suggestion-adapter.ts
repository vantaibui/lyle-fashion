import { ApiError } from '@/lib/api/error';
import type {
  SearchSuggestion,
  SearchSuggestionProvider,
  SearchSuggestionResult,
} from '@/modules/search/contracts/search-suggestions';
import { normalizeSearchQuery } from '@/modules/search/utils/normalize-query';

// Temporary development adapter. These concepts are navigation/search fixtures,
// not authoritative products, prices, availability, or production search data.
const productHref = (name: string) =>
  `/search?${new URLSearchParams({ q: name })}`;

const mockSuggestions: SearchSuggestionResult = {
  products: [
    'Áo sơ mi Linen tối giản',
    'Áo Lyocell cổ tròn',
    'Quần Linen ống thẳng',
    'Đầm Lyocell dáng suông',
    'Chân váy Linen midi',
    'Áo thun Linen cổ tròn',
  ].map((label, index) => ({
    id: `product-${index}`,
    kind: 'product' as const,
    label,
    href: productHref(label),
  })),
  categories: [
    {
      id: 'category-men-shirts',
      kind: 'category',
      label: 'Áo sơ mi nam',
      href: '/men?category=shirts',
    },
    {
      id: 'category-women-dresses',
      kind: 'category',
      label: 'Đầm nữ',
      href: '/women?category=dresses',
    },
    {
      id: 'category-linen-pants',
      kind: 'category',
      label: 'Quần Linen',
      href: '/shop?material=linen&category=pants',
    },
    {
      id: 'material-linen',
      kind: 'category',
      label: 'Chất liệu Linen',
      href: '/shop?material=linen',
    },
    {
      id: 'material-lyocell',
      kind: 'category',
      label: 'Chất liệu Lyocell',
      href: '/shop?material=lyocell',
    },
    {
      id: 'color-moss',
      kind: 'category',
      label: 'Màu Rêu',
      href: '/shop?color=moss',
    },
    {
      id: 'color-clay',
      kind: 'category',
      label: 'Màu Đất',
      href: '/shop?color=clay',
    },
  ],
  collections: [
    {
      id: 'collection-linen',
      kind: 'collection',
      label: 'Bộ sưu tập Linen',
      href: '/collections/linen-collection',
    },
    {
      id: 'collection-premium',
      kind: 'collection',
      label: 'Bộ sưu tập cao cấp',
      href: '/collections/premium-collection',
    },
    {
      id: 'collection-new',
      kind: 'collection',
      label: 'Hàng mới',
      href: '/collections/new-arrival',
    },
    {
      id: 'collection-best',
      kind: 'collection',
      label: 'Bán chạy',
      href: '/collections/best-seller',
    },
    {
      id: 'collection-eco',
      kind: 'collection',
      label: 'Bộ sưu tập Eco',
      href: '/collections/eco-collection',
    },
  ],
  keywords: [
    'Áo sơ mi Linen',
    'Áo thun Linen',
    'Quần Linen',
    'Chân váy Linen',
    'Đầm Linen',
    'Bộ nữ thường ngày',
    'Bộ nữ cao cấp',
    'Bộ nam thường ngày',
    'Bộ nam cao cấp',
  ].map((label, index) => ({
    id: `keyword-${index}`,
    kind: 'keyword' as const,
    label,
    href: `/search?${new URLSearchParams({ q: label })}`,
  })),
};

function matchesQuery(item: SearchSuggestion, query: string) {
  return item.label.toLocaleLowerCase('vi-VN').includes(query);
}

function waitForMock(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, 120);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

export const mockSearchSuggestionAdapter: SearchSuggestionProvider = async (
  query,
  { signal },
) => {
  try {
    await waitForMock(signal);
    const normalized = normalizeSearchQuery(query).toLocaleLowerCase('vi-VN');
    const filter = (items: SearchSuggestion[]) =>
      items.filter((item) => matchesQuery(item, normalized)).slice(0, 5);
    return {
      data: {
        categories: filter(mockSuggestions.categories),
        collections: filter(mockSuggestions.collections),
        keywords: filter(mockSuggestions.keywords),
        products: filter(mockSuggestions.products),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: new ApiError('Yêu cầu gợi ý đã bị hủy.', {
        cause: error,
        code: 'NETWORK_ERROR',
        retryable: true,
      }),
    };
  }
};
