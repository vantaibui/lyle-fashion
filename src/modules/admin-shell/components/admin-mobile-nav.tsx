'use client';

import { useRef, useState } from 'react';

import { AdminNav } from '@/modules/admin-shell/components/admin-nav';
import type { AdminSession } from '@/modules/admin-auth/contracts/session';
import { Drawer } from '@/components/ui/drawer';
import { IconButton } from '@/components/ui/icon-button';

export function AdminMobileNav({
  activePath,
  session,
}: {
  activePath: string;
  session: AdminSession;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="border-border-subtle border-b px-4 py-3 lg:hidden">
      <IconButton
        className="w-auto rounded-xs px-4"
        label="Menu quản trị"
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
      >
        <span className="text-sm font-medium">Menu quản trị</span>
      </IconButton>
      <Drawer isOpen={isOpen} onClose={close} side="left" title="Menu quản trị">
        <AdminNav activePath={activePath} session={session} />
      </Drawer>
    </div>
  );
}
