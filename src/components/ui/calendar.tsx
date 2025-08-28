import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { uk } from 'date-fns/locale';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';

import { cn } from '@/lib/cn.ts';
import 'react-day-picker/style.css';
import { useLangStore } from '@/store';

const ChevronItems = {
  up: ChevronUp,
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const { lang } = useLangStore();

  return (
    <DayPicker
      locale={lang === 'uk' ? uk : undefined}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        month_caption: 'h-fit',
        dropdowns: 'h-fit gap-2 flex',
        chevron: 'fill-none inline',
        dropdown: 'bg-background text-primary rdp-dropdown',
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        caption: 'flex justify-center pt-1 relative items-center w-full h-fit',
        caption_label: 'text-sm font-medium',
        day: 'aria-selected:opacity-100 rounded-md',
        range_start:
          'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
        range_end:
          'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          const Icon = ChevronItems[orientation || 'right'];

          return (
            <Icon
              className={cn('size-4 rtl:rotate-[180deg]', className)}
              {...props}
            />
          );
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
