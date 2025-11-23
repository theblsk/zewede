'use client';

import { Spinner } from '@heroui/react';

type LoadingOverlayProps = {
  isLoading: boolean;
};

export const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Spinner color="primary" size="lg" />
    </div>
  );
};
