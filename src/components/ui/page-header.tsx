import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

import { cn } from '@/lib/cn.ts';

type Props = {
  title: string;
  description?: string;
  count?: number | string;
  children?: React.ReactNode;
  withGoBack?: boolean;
  withTitleOverflow?: boolean;
};

const PageHeader = (props: Props) => {
  const {
    count,
    children,
    title,
    description,
    withGoBack = false,
    withTitleOverflow,
  } = props;

  const router = useRouter();
  const onBack = () => router.history.back();

  return (
    <header className="sticky top-[-1px] group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b pb-2 transition-[width,height] ease-linear bg-background z-20">
      <div className="flex w-full items-center gap-1 lg:gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            {withGoBack && (
              <ArrowLeft className="cursor-pointer mt-[2px]" onClick={onBack} />
            )}

            <div>
              <h1
                className={cn('font-bold text-xl', {
                  'lg:max-w-fit sm:max-w-[310px] max-w-[240px] text-ellipsis overflow-hidden whitespace-nowrap':
                    withTitleOverflow,
                })}
              >
                {title}
              </h1>

              {description && (
                <h3 className="text-m text-muted-foreground">{description}</h3>
              )}
            </div>
          </div>

          {!!count && (
            <span className="font-small bg-primary text-primary-foreground rounded-full py-[2px] px-[4px] min-w-[30px] h-fit inline-flex items-center justify-center z-20">
              {count}
            </span>
          )}
        </div>

        <div className="flex gap-2">{children}</div>
      </div>
    </header>
  );
};

export default React.memo(PageHeader);
