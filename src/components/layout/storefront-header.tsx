import { AnnouncementBar } from '@/components/layout/header/announcement-bar';
import { BrandMark } from '@/components/layout/header/brand-mark';
import { HeaderInteractive } from '@/components/layout/header/header-interactive';
import { Container } from '@/components/layout/container';
import { storefrontNavigation } from '@/config/navigation';

export function StorefrontHeader() {
  return (
    <header className="bg-background relative z-[var(--z-sticky)]">
      <a
        className="bg-action text-text-inverse fixed top-2 left-2 z-[var(--z-tooltip)] -translate-y-20 px-4 py-3 focus:translate-y-0"
        href="#main-content"
      >
        Bỏ qua điều hướng
      </a>
      <AnnouncementBar announcement={storefrontNavigation.announcement} />
      <div className="border-border-subtle bg-surface border-b">
        <Container className="flex min-h-18 items-center gap-5 xl:grid xl:grid-cols-[auto_1fr_auto]">
          <BrandMark />
          <HeaderInteractive groups={storefrontNavigation.groups} />
        </Container>
      </div>
    </header>
  );
}
