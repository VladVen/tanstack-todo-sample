import * as React from 'react';
import {
  useField,
  useFormikContext,
  type FieldInputProps,
  type FieldMetaProps,
} from 'formik';
import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn.ts';

// Context for form field
type FormFieldContextValue = {
  name: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

// FormField component that provides context for field components
interface FormFieldProps {
  name: string;
  children: React.ReactNode;
}

const FormField = ({ name, children }: FormFieldProps) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  );
};

// Custom hook to access field context and formik field
const useFormikField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const [field, meta] = useField(fieldContext.name);
  const { submitCount } = useFormikContext();

  if (!fieldContext) {
    throw new Error('useFormikField should be used within <FormField>');
  }

  const { id } = itemContext;
  const hasError = !!meta.error && (meta.touched || submitCount > 0);

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    field,
    meta,
    hasError,
    error: hasError ? meta.error : undefined,
  };
};

// Context for form item
type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

// FormItem component
function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

// FormLabel component
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormikField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

// FormControl component
interface FormControlProps extends React.ComponentProps<typeof Slot> {
  render?: (props: {
    field: FieldInputProps<unknown>;
    meta: FieldMetaProps<unknown>;
  }) => React.ReactNode;
}

function FormControl({ render, ...props }: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId, field, meta } =
    useFormikField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...field}
      {...props}
    >
      {render ? render({ field, meta }) : props.children}
    </Slot>
  );
}

// FormDescription component
function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormikField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

// FormMessage component
function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormikField();
  const body = error ? String(error) : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormikField,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
