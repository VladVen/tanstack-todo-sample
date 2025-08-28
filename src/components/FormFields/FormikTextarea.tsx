import React from 'react';

import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/formik-form';

type Props = React.ComponentProps<'textarea'> & {
  name: string;
  label?: string;
  description?: string;
  wrapperClassName?: string;
  rows?: number;
};

const FormikTextarea = ({
  name,
  label,
  description,
  placeholder,
  className,
  wrapperClassName,
  rows,
  ...rest
}: Props) => {
  return (
    <FormField name={name}>
      <FormItem className={wrapperClassName}>
        {!!label && <FormLabel>{label}</FormLabel>}
        <FormControl
          render={({ field }) => (
            <Textarea
              value={field.value as string}
              onChange={field.onChange}
              name={field.name}
              onBlur={field.onBlur}
              placeholder={placeholder}
              className={className}
              rows={rows}
              {...rest}
            />
          )}
        />
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    </FormField>
  );
};

export default React.memo(FormikTextarea);
