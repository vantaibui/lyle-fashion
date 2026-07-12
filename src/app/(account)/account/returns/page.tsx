import { cookies } from 'next/headers';
import { metadataForRoute } from '@/app/route-foundation';
import { AccountShell } from '@/modules/account/components/account-shell';
import { getAccountSnapshot } from '@/modules/account/server/account-store';
import { requireAuth } from '@/modules/auth/server/require-auth';
import { ReturnRequestForm } from '@/modules/return/components/return-request-form';
import { Badge } from '@/components/ui/badge';
export const metadata = metadataForRoute('returns');
export const dynamic = 'force-dynamic';
export default async function Page() {
  await requireAuth('/account/returns');
  const data = getAccountSnapshot(await cookies());
  return (
    <AccountShell title="Đổi trả">
      <div className="grid gap-8">
        {data.returns.length > 0 && (
          <section>
            <h2 className="font-display mb-4 text-2xl">Yêu cầu của bạn</h2>
            <ul className="grid gap-3">
              {data.returns.map((item) => (
                <li
                  className="border-border flex flex-wrap justify-between gap-3 border p-4"
                  key={item.id}
                >
                  <span>Đơn {item.orderCode}</span>
                  <Badge>{item.status}</Badge>
                </li>
              ))}
            </ul>
          </section>
        )}
        <ReturnRequestForm orders={data.orders} />
      </div>
    </AccountShell>
  );
}
