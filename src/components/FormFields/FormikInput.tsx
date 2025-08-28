import React from 'react';

import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/formik-form';

type Props = React.ComponentProps<'input'> & {
  name: string;
  description?: string;
  label?: string;
  wrapperClassName?: string;
};

const FormikInput = (props: Props) => {
  const {
    name,
    label,
    description,
    wrapperClassName,
    type = 'text',
    className,
    placeholder,
    ...rest
  } = props;

  return (
    <FormField name={name}>
      <FormItem className={wrapperClassName}>
        {!!label && <FormLabel>{label}</FormLabel>}

        <FormControl
          render={({ field }) => {
            return (
              <Input
                value={field.value as string}
                onChange={field.onChange}
                name={field.name}
                onBlur={field.onBlur}
                type={type}
                className={className}
                placeholder={placeholder}
                {...rest}
              />
            );
          }}
        />

        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    </FormField>
  );
};

export default React.memo(FormikInput);
