import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/error';
import type { ProductSummary } from '@/modules/catalog/contracts/catalog';

import { ProductCard } from './product-card';

const { quickAdd, wishlist } = vi.hoisted(() => ({
  quickAdd: vi.fn(),
  wishlist: vi.fn(),
}));

vi.mock('@/modules/cart/api/quick-add-client', () => ({
  quickAddToCart: quickAdd,
}));
vi.mock('@/modules/wishlist/api/wishlist-client', () => ({
  setWishlistProduct: wishlist,
}));

const product: ProductSummary = {
  badges: [{ id: 'new', kind: 'new', label: 'Mới' }],
  categoryId: 'shirts',
  colors: [
    {
      colorId: 'bone',
      image: {
        alt: 'Áo màu ngà',
        height: 1500,
        src: '/images/catalog/linen-bone.svg',
        width: 1200,
      },
      label: 'Ngà',
      swatchHex: '#E5E0D5',
    },
  ],
  compareAtPrice: 799000,
  discountPercentageAllowed: true,
  gender: 'men',
  id: 'product-1',
  name: 'Áo sơ mi Linen',
  price: 699000,
  primaryImage: {
    alt: 'Áo Linen',
    height: 1500,
    src: '/images/catalog/linen-bone.svg',
    width: 1200,
  },
  requiresSizeSelection: true,
  sizes: [
    { available: true, label: 'M', sizeId: 'm', skuId: 'sku-m' },
    { available: false, label: 'L', sizeId: 'l', skuId: 'sku-l' },
  ],
  slug: 'ao-so-mi-linen',
  stockLevel: 'in-stock',
};

beforeEach(() => {
  quickAdd.mockReset();
  wishlist.mockReset();
  quickAdd.mockResolvedValue({ data: {}, error: null });
  wishlist.mockResolvedValue({ data: {}, error: null });
});

describe('ProductCard', () => {
  it('renders prices, discount, badge, swatch, and product links', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Giảm 13%')).toBeVisible();
    expect(screen.getByText('Mới')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Ngà, đã chọn' })).toBeVisible();
    expect(
      screen.getAllByRole('link', { name: /Áo sơ mi Linen/ }),
    ).toHaveLength(2);
  });

  it('blocks out-of-stock quick add', () => {
    render(
      <ProductCard product={{ ...product, stockLevel: 'out-of-stock' }} />,
    );
    expect(screen.getByRole('button', { name: 'Hết hàng' })).toBeDisabled();
  });

  it('requires an explicit available size before quick add', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={product} />);
    await user.click(screen.getByRole('button', { name: 'Thêm nhanh' }));
    await user.click(screen.getByRole('button', { name: 'Thêm vào giỏ' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Chọn kích thước trước khi thêm vào giỏ.',
    );
    expect(quickAdd).not.toHaveBeenCalled();
  });

  it('submits the selected SKU and handles API failure safely', async () => {
    quickAdd.mockResolvedValue({
      data: null,
      error: new ApiError('raw upstream', { code: 'INVENTORY_CONFLICT' }),
    });
    const user = userEvent.setup();
    render(<ProductCard product={product} />);
    await user.click(screen.getByRole('button', { name: 'Thêm nhanh' }));
    await user.click(screen.getByRole('radio', { name: 'M' }));
    await user.click(screen.getByRole('button', { name: 'Thêm vào giỏ' }));
    expect(quickAdd).toHaveBeenCalledWith({
      productId: 'product-1',
      quantity: 1,
      skuId: 'sku-m',
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Sản phẩm vừa thay đổi.',
    );
    expect(screen.queryByText('raw upstream')).not.toBeInTheDocument();
  });

  it('toggles favorite only after the wishlist boundary succeeds', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={product} />);
    await user.click(
      screen.getByRole('button', { name: 'Thêm Áo sơ mi Linen vào yêu thích' }),
    );
    expect(wishlist).toHaveBeenCalledWith('product-1', true);
    expect(
      await screen.findByRole('button', {
        name: 'Bỏ Áo sơ mi Linen khỏi yêu thích',
      }),
    ).toBeVisible();
  });
});
