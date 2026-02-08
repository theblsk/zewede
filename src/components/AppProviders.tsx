'use client';

import { HeroUIProvider } from '@heroui/react';

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
