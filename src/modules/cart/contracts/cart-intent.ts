export type SimpleCartLineInput = {
  lineType?: 'simple';
  productId: string;
  quantity: number;
  skuId: string;
};

export type BundleCartLineComponentInput = {
  componentId: string;
  productId: string;
  sizeId: string;
  skuId: string;
};

export type BundleCartLineInput = {
  bundleId: string;
  components: BundleCartLineComponentInput[];
  lineType: 'bundle';
  productId: string;
  quantity: number;
};

export type CartLineIntentInput = SimpleCartLineInput | BundleCartLineInput;

export type CartLineIntentResult = {
  lineId: string;
  lineType: 'bundle' | 'simple';
  quantity: number;
  requestId: string;
};
