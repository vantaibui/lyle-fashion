import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import {
  companyInfo,
  footerColumns,
  socialLinks,
  trustBadges,
} from '@/components/layout/footer/footer-content';

export function StorefrontFooter() {
  return (
    <footer className="border-border-subtle mt-8 border-t">
      {/* Trust badges */}
      <div className="border-border-subtle border-b">
        <Container className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {trustBadges.map((badge) => (
            <div className="flex items-center gap-3" key={badge.title}>
              <Image
                alt=""
                className="h-10 w-10 shrink-0 object-contain"
                height={40}
                src={badge.icon}
                width={40}
              />
              <div>
                <p className="text-text-strong text-sm font-semibold">
                  {badge.title}
                </p>
                <p className="text-text-subtle text-xs">{badge.text}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      {/* Columns */}
      <Container className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-text-strong font-display text-xl font-semibold tracking-[0.18em]">
            LYLE
          </p>
          <p className="text-text-strong mt-4 text-sm font-medium">
            {companyInfo.name}
          </p>
          <p className="text-text-subtle mt-1 text-xs">{companyInfo.address}</p>
          <p className="text-text-subtle mt-1 text-xs">
            Hotline: {companyInfo.phone} · Email: {companyInfo.email}
          </p>
          <p className="text-text-subtle mt-1 text-xs">
            Mã số thuế: {companyInfo.taxId}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a
              aria-label="Tải trên App Store"
              href="https://apps.apple.com/"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt="App Store"
                className="h-10 w-auto"
                height={40}
                src="/elise/footer/apple-download.jpg"
                width={135}
              />
            </a>
            <a
              aria-label="Tải trên Google Play"
              href="https://play.google.com/"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt="Google Play"
                className="h-10 w-auto"
                height={40}
                src="/elise/footer/chplay-download.jpg"
                width={135}
              />
            </a>
          </div>
        </div>

        {footerColumns.map((column) => (
          <nav aria-label={column.title} key={column.title}>
            <p className="text-text-strong mb-4 text-sm font-semibold tracking-wide uppercase">
              {column.title}
            </p>
            <ul className="space-y-2" role="list">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link
                    className="text-text-subtle hover:text-action-muted text-sm transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      {/* Social + certification + copyright */}
      <div className="border-border-subtle border-t">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <ul className="flex items-center gap-4" role="list">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  className="text-text-subtle hover:text-action-muted text-sm transition-colors"
                  href={social.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-text-subtle text-xs">
            © LYLE Fashion. All rights reserved
          </p>
        </Container>
      </div>
    </footer>
  );
}
