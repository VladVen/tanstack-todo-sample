import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/cn.ts';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select.tsx';

type SelectItemType = {
  value: string;
  label: string;
  hidden?: boolean;
};

type Props = {
  placeholder?: string;
  value: string;
  items: SelectItemType[];
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

const SingleSelect = (props: Props) => {
  const { onChange, value, items, placeholder, className, disabled } = props;

  const { t } = useTranslation();

  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {items.length ? (
          items.map(item => (
            <SelectItem
              className={cn({ hidden: item.hidden })}
              value={item.value as string}
              key={item.value}
            >
              {item.label}
            </SelectItem>
          ))
        ) : (
          <div className="flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none">
            {t('noOptionsAvailable')}
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

export default memo(SingleSelect);
