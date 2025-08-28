import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/formik-form';
import { cn } from '@/lib/cn.ts';

type Props = {
  name: string;
  description?: string;
  label?: string;
  wrapperClassName?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

const FormikDatePicker = (props: Props) => {
  const {
    name,
    label,
    description,
    wrapperClassName,
    className,
    placeholder,
    disabled,
  } = props;

  return (
    <FormField name={name}>
      <FormItem className={wrapperClassName}>
        {!!label && <FormLabel>{label}</FormLabel>}

        <FormControl
          render={({ field }) => {
            const date = field.value
              ? new Date(field.value as string)
              : undefined;

            return (
              <Popover>
                <PopoverTrigger asChild disabled={disabled}>
                  <Button
                    disabled={disabled}
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                      className,
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, 'yyyy-MM-dd')
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={newDate => {
                      field.onChange({
                        target: {
                          name: field.name,
                          value: newDate ? format(newDate, 'yyyy-MM-dd') : '',
                        },
                      });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />

        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    </FormField>
  );
};

export default React.memo(FormikDatePicker);
