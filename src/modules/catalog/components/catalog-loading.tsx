import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export function CatalogLoading() {
  return (
    <main aria-busy="true" aria-label="Đang tải danh sách sản phẩm">
      <Container className="py-8 md:py-12">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-6 h-12 w-72 max-w-full" />
        <Skeleton className="mt-4 h-6 w-[min(38rem,100%)]" />
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-[15rem_repeat(3,minmax(0,1fr))] xl:grid-cols-[15rem_repeat(4,minmax(0,1fr))]">
          <Skeleton className="hidden h-96 lg:block" />
          {Array.from({ length: 8 }, (_, index) => (
            <div className="grid gap-3" key={index}>
              <Skeleton className="aspect-[4/5]" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-2/5" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
