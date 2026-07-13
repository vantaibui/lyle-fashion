import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/commerce/error-state';
import { createRouteMetadata } from '@/lib/seo/metadata';
import { AdminProductForm } from '@/modules/admin-product/components/product-form/admin-product-form';
import { adminProductParamsSchema } from '@/modules/admin-product/schemas/admin-product-params';
import { getAdminProductDetail } from '@/modules/admin-product/services/admin-product-detail-page';
import { hasAdminPermission } from '@/modules/admin-auth/contracts/session';
import { requireAdminAuth } from '@/modules/admin-auth/server/require-admin-auth';
import { requirePagePermission } from '@/modules/admin-auth/server/require-admin-permission';
import { AdminShell } from '@/modules/admin-shell/components/admin-shell';

export const dynamic = 'force-dynamic';
export const metadata = createRouteMetadata({
  description: 'Chỉnh sửa sản phẩm LYLE Fashion.',
  pathname: '/admin/products',
  title: 'Chỉnh sửa sản phẩm',
});

export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const session = await requireAdminAuth('/admin/products');
  requirePagePermission(session, 'product.read');
  const canUpdate = hasAdminPermission(session, 'product.update');

  const parsedParams = adminProductParamsSchema.safeParse(await params);
  if (!parsedParams.success) notFound();

  const { data: product, error } = await getAdminProductDetail(
    parsedParams.data.productId,
  );
  if (!error && !product) notFound();

  return (
    <AdminShell
      activePath="/admin/products"
      breadcrumbs={[
        { href: '/admin', label: 'Tổng quan' },
        { href: '/admin/products', label: 'Sản phẩm' },
        { current: true, label: product?.basicInfo.name ?? 'Sản phẩm' },
      ]}
      session={session}
      title={product?.basicInfo.name ?? 'Sản phẩm'}
    >
      {error || !product ? (
        <ErrorState description="Không thể tải thông tin sản phẩm. Vui lòng thử lại sau." />
      ) : (
        <AdminProductForm canUpdate={canUpdate} product={product} />
      )}
    </AdminShell>
  );
}
