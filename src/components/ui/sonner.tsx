'use client';

import type { ComponentProps } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

type ToasterProps = ComponentProps<typeof SonnerToaster>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      theme="system"
      position="top-center"
      richColors
      closeButton
      className="toaster group"
      toastOptions={{
        className: 'group toast',
        descriptionClassName: 'toast-description',
        actionButtonClassName: 'toast-action',
        cancelButtonClassName: 'toast-cancel',
      }}
      {...props}
    />
  );
}
