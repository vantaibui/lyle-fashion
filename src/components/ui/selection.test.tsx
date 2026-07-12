import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { QuantitySelector } from './quantity-selector';
import { SizeSelector } from './size-selector';

function SizeFixture() {
  const [value, setValue] = useState('s');
  return (
    <SizeSelector
      label="Kích thước"
      name="size"
      onChange={setValue}
      options={[
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { disabled: true, label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' },
      ]}
      value={value}
    />
  );
}

function QuantityFixture() {
  const [value, setValue] = useState(1);
  return <QuantitySelector max={2} onChange={setValue} value={value} />;
}

describe('selection controls', () => {
  it('moves size selection with arrow keys and skips unavailable options', async () => {
    const user = userEvent.setup();
    render(<SizeFixture />);

    const small = screen.getByRole('radio', { name: 'S' });
    small.focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');

    expect(screen.getByRole('radio', { name: 'XL' })).toBeChecked();
  });

  it('enforces quantity bounds through accessible controls', async () => {
    const user = userEvent.setup();
    render(<QuantityFixture />);

    const decrease = screen.getByRole('button', { name: 'Giảm số lượng' });
    const increase = screen.getByRole('button', { name: 'Tăng số lượng' });

    expect(decrease).toBeDisabled();
    await user.click(increase);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(increase).toBeDisabled();
  });
});
