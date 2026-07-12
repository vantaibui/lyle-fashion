import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { ProductBadge } from '@/components/ui/product-badge';

import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { LoadingState } from './loading-state';
import { ProductBadgeGroup } from './product-badge-group';
import { ProductCardShell } from './product-card-shell';
import { ProductGridItem, ProductGridShell } from './product-grid-shell';
import { ProductImage } from './product-image';
import { ProductPrice } from './product-price';

const imageData =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"%3E%3Crect width="800" height="1000" fill="%23e5e0d5"/%3E%3Cpath d="M250 250h300v500H250z" fill="%23d9cfb8"/%3E%3C/svg%3E';

function ProductFixture({ long = false }) {
  return (
    <ProductCardShell
      actions={
        <IconButton label="Lưu sản phẩm mẫu">
          <span aria-hidden="true">♡</span>
        </IconButton>
      }
      badges={
        <ProductBadgeGroup>
          <ProductBadge>Chất liệu tự nhiên</ProductBadge>
        </ProductBadgeGroup>
      }
      details={
        <div className="grid gap-2">
          <h3 className="font-display text-lg leading-snug text-pretty">
            {long
              ? 'Tên sản phẩm thời trang tối giản bằng chất liệu tự nhiên có độ dài đặc biệt để kiểm tra khả năng xuống dòng'
              : 'Sản phẩm nền tảng'}
          </h3>
          <ProductPrice amount={399000} />
        </div>
      }
      media={
        <ProductImage
          alt="Hình minh họa tỷ lệ sản phẩm, không phải hàng hóa thực tế"
          src={imageData}
        />
      }
    />
  );
}

function CommerceShowcase({
  state = 'default',
}: {
  state?: 'default' | 'empty' | 'error' | 'loading' | 'long';
}) {
  if (state === 'loading') return <LoadingState />;
  if (state === 'empty') {
    return (
      <EmptyState
        action={<Button variant="secondary">Tiếp tục khám phá</Button>}
        description="Hãy thay đổi lựa chọn hoặc quay lại danh mục đã được phê duyệt."
        title="Chưa có sản phẩm phù hợp"
      />
    );
  }
  if (state === 'error') {
    return (
      <ErrorState
        action={<Button variant="secondary">Thử tải lại</Button>}
        description="Kiểm tra kết nối rồi thử lại. Giá và tình trạng hàng sẽ không được phỏng đoán."
      />
    );
  }

  return (
    <ProductGridShell>
      {Array.from({ length: 4 }, (_, index) => (
        <ProductGridItem key={index}>
          <ProductFixture long={state === 'long'} />
        </ProductGridItem>
      ))}
    </ProductGridShell>
  );
}

const meta = {
  title: 'Commerce/Foundations',
  component: CommerceShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof CommerceShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const Empty: Story = { args: { state: 'empty' } };
export const Error: Story = { args: { state: 'error' } };
export const LongVietnameseText: Story = { args: { state: 'long' } };
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'responsive' } },
};
