'use client';

import type { SizeOption } from '@/components/ui/size-selector';
import { SizeSelector } from '@/components/ui/size-selector';

export type ProductSizeSelectorProps = {
  className?: string;
  errorMessage?: string;
  label?: string;
  name?: string;
  onChange: (value: string) => void;
  options: SizeOption[];
  value?: string;
};

export function ProductSizeSelector({
  label = 'Kích thước',
  name = 'product-size',
  ...props
}: ProductSizeSelectorProps) {
  return <SizeSelector label={label} name={name} {...props} />;
}
