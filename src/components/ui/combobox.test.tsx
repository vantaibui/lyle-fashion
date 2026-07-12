import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Combobox } from './combobox';

describe('Combobox', () => {
  it('filters and selects an option with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Combobox
        label="Chất liệu"
        name="material"
        onChange={onChange}
        options={[
          { label: 'Linen', value: 'linen' },
          { label: 'Lyocell', value: 'lyocell' },
          { label: 'Tencel', value: 'tencel' },
        ]}
      />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Chất liệu' });
    await user.type(combobox, 'Lyo');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith('lyocell');
    expect(combobox).toHaveValue('Lyocell');
  });

  it('announces an error next to the control', () => {
    render(
      <Combobox
        errorMessage="Chọn một chất liệu."
        label="Chất liệu"
        name="material"
        onChange={() => undefined}
        options={[]}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Chọn một chất liệu.');
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
