import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from './button';
import { IconButton } from './icon-button';

const meta = {
  title: 'UI/Actions/Button',
  component: Button,
  args: { children: 'Thêm vào giỏ', variant: 'primary' },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { isLoading: true } };
export const Error: Story = {
  args: { children: 'Xóa sản phẩm', variant: 'danger' },
};
export const LongVietnameseText: Story = {
  args: {
    children: 'Xác nhận lựa chọn sản phẩm thủ công từ chất liệu Lyocell',
  },
};
export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button'));
  },
};
export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button')).toHaveFocus();
  },
};
export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button')).toHaveFocus();
  },
};
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'responsive' } },
};

export function IconButtonExamples() {
  return (
    <div className="flex gap-3">
      <IconButton label="Thêm vào danh sách yêu thích">
        <span aria-hidden="true">♡</span>
      </IconButton>
      <IconButton disabled label="Không thể thêm vào danh sách yêu thích">
        <span aria-hidden="true">♡</span>
      </IconButton>
      <IconButton isLoading label="Đang lưu vào danh sách yêu thích" />
    </div>
  );
}
