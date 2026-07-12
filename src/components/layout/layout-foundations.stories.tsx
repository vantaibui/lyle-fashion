import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Link } from '@/components/ui/link';
import { Pagination } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';

import { Container } from './container';
import { Grid } from './grid';
import { Section } from './section';
import { Stack } from './stack';

function LayoutShowcase() {
  return (
    <Container>
      <Section spacing="compact">
        <Stack gap="lg">
          <Breadcrumb
            items={[
              { href: '#', label: 'Trang chủ' },
              { href: '#', label: 'Nữ' },
              { current: true, label: 'Chất liệu tự nhiên' },
            ]}
          />
          <div className="max-w-[var(--container-reading)]">
            <p className="tracking-caps text-text-muted text-xs font-semibold uppercase">
              LYLE Quiet Premium
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight">
              Nhịp điệu yên tĩnh cho chất liệu tự nhiên
            </h1>
            <p className="text-text-muted mt-4 text-lg text-pretty">
              Nền tảng bố cục ưu tiên hình ảnh, khoảng thở và nội dung tiếng
              Việt dễ đọc.
            </p>
          </div>
          <Separator />
          <Grid columns={12}>
            {Array.from({ length: 12 }, (_, index) => (
              <div className="bg-surface-muted min-h-20" key={index} />
            ))}
          </Grid>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="#">Đọc nguyên tắc thành phần</Link>
            <Pagination
              currentPage={2}
              getHref={(page) => `#page-${page}`}
              totalPages={4}
            />
          </div>
        </Stack>
      </Section>
    </Container>
  );
}

const meta = {
  title: 'Layout/Foundations',
  component: LayoutShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof LayoutShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'responsive' } },
};
