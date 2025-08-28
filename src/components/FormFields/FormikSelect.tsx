import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/formik-form';

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  options: Option[];
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const FormikSelect = ({
  name,
  options,
  label,
  description,
  placeholder,
  className,
  disabled,
}: Props) => {
  return (
    <FormField name={name}>
      <FormItem className={className}>
        {!!label && <FormLabel>{label}</FormLabel>}
        <FormControl
          render={({ field }) => (
            <Select
              disabled={disabled}
              onValueChange={value => {
                field.onChange({
                  target: {
                    name: field.name,
                    value,
                  },
                });
              }}
              value={field.value as string}
              name={field.name}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    </FormField>
  );
};

export default React.memo(FormikSelect);
