import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useFormik, FormikProvider } from 'formik';

import FormikSelect from '@/components/FormFields/FormikSelect.tsx';
import Modal from '@/components/Modal';
import { useExecutors } from '@/queries/executorQueries.ts';
import {
  type FormValues,
  validationSchema,
} from '@/validations/executorForm.ts';

// Extended form values to include executor name
interface ExtendedFormValues extends FormValues {
  executorName?: string;
}

type TodoFormProps = {
  executor?: string | null;
  onCloseModal: () => void;
  registerCloseModal: () => void;
  onSubmit: (values: ExtendedFormValues) => void;
};

const ExecutorModal = (props: TodoFormProps) => {
  const { executor, onCloseModal, onSubmit, registerCloseModal } = props;
  const { t } = useTranslation();
  const { data: executors, isLoading } = useExecutors();

  const handleCloseModal = useCallback(() => {
    registerCloseModal();
    onCloseModal();
  }, [onCloseModal, registerCloseModal]);

  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      const executorId = values.executor;
      let executorName = '';

      // Look up the executor name if an executor is selected
      if (executorId && executors) {
        const executor = executors.find(item => item.id === executorId);
        executorName = executor?.name || '';
      }

      // Pass both the executor ID and name to the parent component
      onSubmit({
        ...values,
        executorName,
      });

      handleCloseModal();
    },
    [executors, handleCloseModal, onSubmit],
  );

  const form = useFormik({
    initialValues: {
      executor,
    },
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  const { isSubmitting: formikSubmitting, handleSubmit } = form;

  return (
    <Modal
      title={t('todo:addExecutor')}
      clickSubmit={handleSubmit}
      onCloseModal={handleCloseModal}
      disabled={formikSubmitting || isLoading}
    >
      <FormikProvider value={form}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormikSelect
            name="executor"
            label={t('todo:form.executor.label')}
            placeholder={t('todo:form.executor.placeholder')}
            options={
              executors?.map(executor => ({
                value: executor.id,
                label: executor.name,
              })) || []
            }
          />
        </form>
      </FormikProvider>
    </Modal>
  );
};

export default ExecutorModal;
