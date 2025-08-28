import * as Yup from 'yup';
import i18n from 'i18next';

import { PriorityEnum, StatusEnum } from '@/api/types.ts';

export const validationSchema = Yup.object({
  title: Yup.string().required(
    i18n.t('validation:isRequired', { field: i18n.t('todo:form.title.label') }),
  ),
  description: Yup.string(),
  status: Yup.string()
    .oneOf(Object.values(StatusEnum))
    .required(
      i18n.t('validation:isRequired', {
        field: i18n.t('todo:form.status.label'),
      }),
    ),
  priority: Yup.string()
    .oneOf(Object.values(PriorityEnum))
    .required(
      i18n.t('validation:isRequired', {
        field: i18n.t('todo:form.priority.label'),
      }),
    ),
  deadline: Yup.string().required(
    i18n.t('validation:isRequired', {
      field: i18n.t('todo:form.deadline.label'),
    }),
  ),
  executor: Yup.string().nullable(),
});

export type FormValues = Yup.InferType<typeof validationSchema>;
