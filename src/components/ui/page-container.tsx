import React, { memo, type ReactNode } from 'react';

import PageHeader from '@/components/ui/page-header.tsx';
import { Spinner } from '@/components/ui/spinner.tsx';

type Props = {
  children: ReactNode;
  isLoading?: boolean;
  header: {
    title: string;
    description?: string;
    count?: number | string;
    withGoBack?: boolean;
    disableBalance?: boolean;
    balance?: string;
    withTitleOverflow?: boolean;
    actions?: React.ReactNode;
  };
};

const PageContainer = (props: Props) => {
  const {
    children,
    isLoading,
    header: { actions, ...rest },
  } = props;
  return (
    <section className="relative px-4 gap-2 lg:px-6 pb-4 flex flex-col">
      <PageHeader {...rest}>{actions}</PageHeader>

      {isLoading ? <Spinner size="large" /> : children}
    </section>
  );
};

export default memo(PageContainer);
