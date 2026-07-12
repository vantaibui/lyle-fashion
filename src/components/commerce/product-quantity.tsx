'use client';

import type { QuantitySelectorProps } from '@/components/ui/quantity-selector';
import { QuantitySelector } from '@/components/ui/quantity-selector';

export type ProductQuantityProps = QuantitySelectorProps;

export function ProductQuantity(props: ProductQuantityProps) {
  return <QuantitySelector {...props} />;
}
