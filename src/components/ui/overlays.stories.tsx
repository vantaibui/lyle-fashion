import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Accordion } from './accordion';
import { Button } from './button';
import { Dialog } from './dialog';
import { Drawer } from './drawer';
import { Popover } from './popover';
import { Skeleton } from './skeleton';
import { Tabs } from './tabs';
import { Toast } from './toast';
import { Tooltip } from './tooltip';

function OverlaysShowcase({ reducedMotion = false }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      className="grid w-[min(38rem,calc(100vw-2rem))] gap-6"
      style={
        reducedMotion
          ? ({
              '--duration-fast': '0.01ms',
              '--duration-normal': '0.01ms',
              '--duration-slow': '0.01ms',
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setDialogOpen(true)}>Mở hộp thoại</Button>
        <Button onClick={() => setDrawerOpen(true)} variant="secondary">
          Mở ngăn kéo
        </Button>
        <Popover label="Xem chất liệu">
          <p className="max-w-64 text-sm text-pretty">
            Thông tin chất liệu được tải từ nguồn nội dung đã phê duyệt.
          </p>
        </Popover>
        <Tooltip content="Hướng dẫn chọn kích thước">
          <span className="inline-flex min-h-11 items-center underline underline-offset-4">
            Trợ giúp
          </span>
        </Tooltip>
      </div>
      <Accordion title="Cách bảo quản sản phẩm">
        Nội dung chăm sóc chỉ là cấu trúc mẫu, không phải hướng dẫn sản phẩm đã
        phê duyệt.
      </Accordion>
      <Tabs
        label="Thông tin nền tảng"
        tabs={[
          {
            content: <p>Nội dung sản phẩm.</p>,
            label: 'Chi tiết',
            value: 'details',
          },
          {
            content: <p>Thông tin chất liệu.</p>,
            label: 'Chất liệu',
            value: 'material',
          },
        ]}
      />
      <Toast title="Đã lưu lựa chọn">
        Thông tin sẽ được máy chủ xác nhận lại.
      </Toast>
      <Skeleton className="h-20 w-full" />
      <Dialog
        description="Nội dung mô tả dài phải xuống dòng tự nhiên trên màn hình nhỏ."
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Xác nhận lựa chọn"
      >
        <p>Đây là nền tảng hộp thoại, không phải luồng nghiệp vụ hoàn chỉnh.</p>
      </Dialog>
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Bộ lọc"
      >
        <p>Đây là nền tảng ngăn kéo, không phải bộ lọc PLP hoàn chỉnh.</p>
      </Drawer>
    </div>
  );
}

const meta = {
  title: 'UI/Overlays/Foundation',
  component: OverlaysShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof OverlaysShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'responsive' } },
};
export const ReducedMotion: Story = { args: { reducedMotion: true } };
