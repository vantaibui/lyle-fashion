/**
 * Shared demo product imagery for the elise.vn-styled storefront (academic demo).
 * Real elise.vn photos downloaded into `public/elise/products/`. Two angles per
 * product (`-NN.jpg` primary, `-NNb.jpg` alternate) so PDP galleries and PLP hover
 * states use genuine garment images instead of abstract placeholders.
 *
 * Indexed 0..11 to line up with the twelve mock product seeds. `demoProductImages`
 * wraps the index so any product number resolves to a stable image pair.
 */

export type DemoImagePair = {
  alt: string;
  alternate: string;
  primary: string;
};

const pad = (value: number) => String(value + 1).padStart(2, '0');

const demoImageAlts = [
  'Đầm thô phối cổ đai eo',
  'Đầm linen đai eo chạy dây hoa',
  'Đầm linen be ghi sát nách',
  'Quần sooc trắng túi chéo',
  'Đầm xòe tay phồng',
  'Áo sơ mi tay ngắn cotton',
  'Áo kiểu tay bồng trắng',
  'Đầm đen cổ vuông',
  'Đầm hoa nhí be',
  'Chân váy bút chì nâu',
  'Áo vest nâu dáng eo',
  'Đầm suông trắng tay ngắn',
] as const;

const IMAGE_COUNT = demoImageAlts.length;

export function demoProductImages(index: number): DemoImagePair {
  const safeIndex = ((index % IMAGE_COUNT) + IMAGE_COUNT) % IMAGE_COUNT;
  const slot = pad(safeIndex);
  return {
    alt: demoImageAlts[safeIndex] ?? 'Sản phẩm minh hoạ',
    alternate: `/elise/products/product-${slot}b.jpg`,
    primary: `/elise/products/product-${slot}.jpg`,
  };
}
