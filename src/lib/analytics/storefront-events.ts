export const storefrontEventNames = [
  'navigation_click',
  'mega_menu_open',
  'search_open',
  'search_submit',
  'search_suggestion_view',
  'search_suggestion_select',
  'view_item_list',
  'select_item',
  'filter_products',
  'sort_products',
  'add_to_wishlist',
  'quick_add',
  'view_more_products',
  'view_item',
  'select_item_variant',
  'add_to_cart',
  'view_cart',
  'remove_from_cart',
  'update_cart_quantity',
  'begin_checkout',
  'add_shipping_info',
  'add_payment_info',
  'apply_promotion',
  'remove_promotion',
  'purchase',
  'checkout_error',
  'payment_failure',
  'view_bundle',
  'select_bundle_component',
  'login',
  'logout',
  'account_view',
  'profile_update',
  'address_add',
  'address_update',
  'address_delete',
  'wishlist_view',
  'wishlist_remove',
  'move_to_cart',
  'order_history_view',
  'order_detail_view',
  'order_tracking_submit',
  'return_start',
  'return_submit',
] as const;

export type StorefrontEventName = (typeof storefrontEventNames)[number];

export type StorefrontEvent = {
  name: StorefrontEventName;
  properties?: Readonly<Record<string, boolean | number | string>>;
};

export type StorefrontAnalytics = (event: StorefrontEvent) => void;

// No vendor or consent policy is approved. Consumers may inject an approved adapter later.
export const noStorefrontAnalytics: StorefrontAnalytics = () => undefined;
