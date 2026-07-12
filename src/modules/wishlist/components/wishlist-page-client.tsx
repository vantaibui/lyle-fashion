'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/commerce/empty-state';
import { Button } from '@/components/ui/button';
import {
  GUEST_WISHLIST_KEY,
  parseGuestWishlist,
  type GuestWishlistItem,
} from '@/modules/wishlist/utils/guest-wishlist';

export function WishlistPageClient() {
  const [items, setItems] = useState<GuestWishlistItem[] | null>(null);
  useEffect(() => {
    const read = () =>
      setItems(
        parseGuestWishlist(window.localStorage.getItem(GUEST_WISHLIST_KEY)),
      );
    read();
    window.addEventListener('lyle:wishlist-change', read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('lyle:wishlist-change', read);
      window.removeEventListener('storage', read);
    };
  }, []);
  if (items === null)
    return <p aria-live="polite">Đang tải danh sách yêu thích…</p>;
  if (items.length === 0)
    return (
      <EmptyState
        action={
          <Link className="underline underline-offset-4" href="/shop">
            Khám phá sản phẩm
          </Link>
        }
        description="Lưu sản phẩm để xem lại trên thiết bị này."
        title="Danh sách yêu thích đang trống"
      />
    );
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <li
          className="border-border grid gap-3 border p-5"
          key={item.productId}
        >
          <strong>
            Mã sản phẩm: <span translate="no">{item.productId}</span>
          </strong>
          <p className="text-text-muted">
            Giá và tình trạng sẽ được xác minh lại khi dịch vụ wishlist được kết
            nối.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button disabled>Chọn phiên bản & chuyển vào giỏ</Button>
            <Button
              onClick={() => {
                const next = items.filter(
                  (candidate) => candidate.productId !== item.productId,
                );
                window.localStorage.setItem(
                  GUEST_WISHLIST_KEY,
                  JSON.stringify(next),
                );
                setItems(next);
              }}
              variant="quiet"
            >
              Xóa
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
