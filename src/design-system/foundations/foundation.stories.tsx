import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const palette = [
  { label: 'Ink', value: 'var(--palette-brand-ink)' },
  { label: 'Bone', value: 'var(--palette-brand-bone)' },
  { label: 'Flax', value: 'var(--palette-brand-flax)' },
  { label: 'Moss', value: 'var(--palette-brand-moss)' },
  { label: 'Clay', value: 'var(--palette-brand-clay)' },
] as const;

function FoundationStatus() {
  return (
    <section className="border-border bg-background text-text w-[min(52rem,calc(100vw-2rem))] border-y py-10">
      <p className="tracking-caps text-text-muted text-xs font-semibold uppercase">
        LYLE Quiet Premium
      </p>
      <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight">
        Chất liệu lên tiếng trong khoảng lặng
      </h1>
      <p className="text-text-muted mt-4 max-w-[var(--container-reading)] text-lg text-pretty">
        Ink, Bone, Flax, Moss và Clay tạo nền ấm, tự nhiên và trung tính giới.
        Đây là bản xem trước token, không phải trang kinh doanh.
      </p>
      <ul
        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5"
        aria-label="Bảng màu thương hiệu"
      >
        {palette.map((item) => (
          <li className="min-w-0" key={item.label}>
            <span
              aria-hidden="true"
              className="border-border block aspect-square border"
              style={{ backgroundColor: item.value }}
            />
            <span className="mt-2 block text-sm">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const meta = {
  title: 'Foundations/Quiet Premium',
  component: FoundationStatus,
  tags: ['autodocs'],
} satisfies Meta<typeof FoundationStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'responsive' } },
};
