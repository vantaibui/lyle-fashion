import type { AdminProductVariant } from '@/modules/admin-product/contracts/admin-product-detail';

export type VariantValidationIssue = {
  message: string;
  variantId: string;
};

/**
 * Client-side hint only. The server remains authoritative for uniqueness
 * per docs/BUSINESS-RULES.md; this exists so staff see the conflict before
 * attempting to save, not so the UI can skip revalidation.
 */
export function findVariantValidationIssues(
  variants: AdminProductVariant[],
): VariantValidationIssue[] {
  const issues: VariantValidationIssue[] = [];
  const seenSku = new Map<string, string>();
  const seenCombination = new Map<string, string>();

  for (const variant of variants) {
    const skuKey = variant.skuCode.trim().toUpperCase();
    if (skuKey) {
      const existing = seenSku.get(skuKey);
      if (existing) {
        issues.push({
          message: `Mã SKU "${variant.skuCode}" bị trùng.`,
          variantId: variant.id,
        });
      } else {
        seenSku.set(skuKey, variant.id);
      }
    }

    const combinationKey = `${variant.colorId}::${variant.sizeId}`;
    const existingCombination = seenCombination.get(combinationKey);
    if (existingCombination) {
      issues.push({
        message: `Biến thể màu "${variant.colorLabel}" và kích thước "${variant.sizeLabel}" bị trùng.`,
        variantId: variant.id,
      });
    } else {
      seenCombination.set(combinationKey, variant.id);
    }
  }

  return issues;
}
