import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { ProductColorSelector } from '@/components/commerce/product-color-selector';
import { ProductSizeSelector } from '@/components/commerce/product-size-selector';

import { QuantitySelector } from './quantity-selector';

function SelectionShowcase({ error = false, loading = false }) {
  const [color, setColor] = useState('natural');
  const [size, setSize] = useState('m');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="grid w-[min(30rem,calc(100vw-2rem))] gap-8">
      <ProductColorSelector
        errorMessage={error ? 'Chọn màu sắc để tiếp tục.' : undefined}
        onChange={setColor}
        options={[
          {
            color: 'var(--palette-brand-bone)',
            label: 'Màu tự nhiên',
            value: 'natural',
          },
          {
            color: 'var(--palette-brand-moss)',
            label: 'Xanh rêu',
            value: 'moss',
          },
          {
            color: 'var(--palette-brand-clay)',
            label: 'Nâu đất',
            value: 'clay',
          },
        ]}
        value={color}
      />
      <ProductSizeSelector
        errorMessage={error ? 'Chọn kích thước còn hàng.' : undefined}
        onChange={setSize}
        options={[
          { label: 'S', value: 's' },
          { label: 'M', value: 'm' },
          { disabled: true, label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
        ]}
        value={size}
      />
      <QuantitySelector
        isLoading={loading}
        onChange={setQuantity}
        value={quantity}
      />
    </div>
  );
}

const meta = {
  title: 'UI/Selection/Foundation',
  component: SelectionShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof SelectionShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: { error: true } };
export const Loading: Story = { args: { loading: true } };
export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'M' })).toBeChecked();
  },
};
