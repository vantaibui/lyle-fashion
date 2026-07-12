import { notFound } from 'next/navigation';

import { RoutePlaceholder } from '@/components/layout/route-placeholder';
import { journalParamsSchema } from '@/lib/validation/route-params';

export const revalidate = 3600;

export function generateStaticParams() {
  // Populate from the approved CMS source when it exists.
  return [];
}

type PageProps = { params: Promise<{ slug: string }> };

export default async function Page({ params }: PageProps) {
  const result = journalParamsSchema.safeParse(await params);
  if (!result.success) notFound();

  return (
    <RoutePlaceholder
      description="Bài viết sẽ được hiển thị sau khi tích hợp CMS và quy trình xuất bản."
      title="Bài viết"
    />
  );
}
