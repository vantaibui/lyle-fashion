import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StorefrontHeader } from '@/components/layout/storefront-header';

const meta = {
  title: 'Layout/StorefrontHeader',
  component: StorefrontHeader,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof StorefrontHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'responsive' } },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const ReducedMotion: Story = {
  decorators: [
    (Story) => (
      <div
        style={
          {
            '--duration-fast': '0.01ms',
            '--duration-normal': '0.01ms',
            '--duration-slow': '0.01ms',
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
