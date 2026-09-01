'use client';

import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
