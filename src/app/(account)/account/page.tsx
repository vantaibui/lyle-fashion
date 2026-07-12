import Link from 'next/link';
import { cookies } from 'next/headers';
import { metadataForRoute } from '@/app/route-foundation';
import { AccountShell } from '@/modules/account/components/account-shell';
import { getAccountSnapshot } from '@/modules/account/server/account-store';
import { requireAuth } from '@/modules/auth/server/require-auth';
import { Price } from '@/components/ui/price';
export const metadata = metadataForRoute('account');
export const dynamic = 'force-dynamic';
export default async function Page() {
  await requireAuth('/account');
  const data = getAccountSnapshot(await cookies());
  const recent = data.orders[0];
  return (
    <AccountShell title={`Xin chào, ${data.profile.fullName}`}>
      <div className="grid gap-4 md:grid-cols-2">
        <Summary title="Hồ sơ">
          <p>{data.profile.email}</p>
          <p>{data.profile.phone}</p>
          <Link href="/account/profile">Chỉnh sửa hồ sơ</Link>
        </Summary>
        <Summary title="Địa chỉ mặc định">
          {data.addresses[0] ? (
            <p>
              {data.addresses[0].streetAddress},{' '}
              {data.addresses[0].districtName}
            </p>
          ) : (
            <p>Chưa có địa chỉ.</p>
          )}
          <Link href="/account/addresses">Quản lý địa chỉ</Link>
        </Summary>
        <Summary title="Đơn gần đây">
          {recent ? (
            <>
              <p>{recent.code}</p>
              <Price amount={recent.total} label="Tổng đơn" />
            </>
          ) : (
            <p>Chưa có đơn hàng.</p>
          )}
          <Link href="/account/orders">Xem đơn hàng</Link>
        </Summary>
        <Summary title="Đổi trả">
          <p>{data.returns.length} yêu cầu</p>
          <Link href="/account/returns">Quản lý đổi trả</Link>
        </Summary>
      </div>
    </AccountShell>
  );
}
function Summary({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="border-border grid gap-3 border p-5">
      <h2 className="font-display text-xl">{title}</h2>
      {children}
    </section>
  );
}
