import React from 'react';
import type { ErrorComponentProps } from '@tanstack/router-core';

import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import i18n from '@/i18n';

const ErrorBoundary = (props: ErrorComponentProps) => {
  const { error } = props;

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md p-6 text-center shadow-lg border border-border">
          <h1 className="text-xl font-semibold text-foreground">
            {i18n.t('errorBoundary:title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {i18n.t('errorBoundary:description')}
          </p>

          <Button className="mt-4" onClick={() => window.location.reload()}>
            {i18n.t('reload')}
          </Button>

          {error.message && (
            <div className="mt-4 max-h-40 overflow-auto rounded bg-muted p-2 text-sm text-red-500">
              <pre>{error.message}</pre>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default React.memo(ErrorBoundary);
