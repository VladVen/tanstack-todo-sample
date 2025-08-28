import * as Yup from 'yup';

export const validationSchema = Yup.object({
  executor: Yup.string().nullable(),
});

export type FormValues = Yup.InferType<typeof validationSchema>;
