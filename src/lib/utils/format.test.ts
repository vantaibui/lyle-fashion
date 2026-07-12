import { describe, expect, it } from 'vitest';

import { formatVnd } from './format';

describe('formatVnd', () => {
  it('formats whole VND amounts using the Vietnamese locale', () => {
    expect(formatVnd(1250000)).toMatch(/1[.\u00a0]250[.\u00a0]000/);
  });
});
