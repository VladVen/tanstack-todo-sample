import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik, FormikProvider } from 'formik';

import FormikInput from '@/components/FormFields/FormikInput.tsx';
import FormikTextarea from '@/components/FormFields/FormikTextarea.tsx';
import FormikSelect from '@/components/FormFields/FormikSelect.tsx';
import FormikDatePicker from '@/components/FormFields/FormikDatePicker.tsx';
import Modal from '@/components/Modal';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/api/storage.ts';
import { PriorityEnum, StatusEnum, type TodoItemType } from '@/api/types.ts';
import { useCreateTodo, useUpdateTodo } from '@/queries/todoQueries.ts';
import {
  type FormValues,
  validationSchema,
} from '@/validations/todoItemForm.ts';
import { type FormValues as BaseExecutorFormValues } from '@/validations/executorForm.ts';
import useModal from '@/hooks/useModal';

import ExecutorModal from '../ExecutorModal';

// Extended form values to include executor name
interface ExecutorFormValues extends BaseExecutorFormValues {
  executorName?: string;
}

type TodoFormProps = {
  initialData?: TodoItemType;
  onCloseModal: () => void;
};

const TodoFormModal = (props: TodoFormProps) => {
  const { initialData, onCloseModal } = props;

  const { t } = useTranslation();
  const { mutate: createTodoMutate } = useCreateTodo();
  const { mutate: updateTodoMutate } = useUpdateTodo();

  const [executorLabel, setExecutorLabel] = useState<string>(
    initialData?.user?.name || '',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(
    initialData?.file || null,
  );

  const executorModal = useModal(ExecutorModal);

  const handleModalClose = useCallback(() => {
    if (!executorModal.isOpen) {
      onCloseModal();
    }
  }, [executorModal.isOpen, onCloseModal]);

  // Ensure file preview is updated when initialData changes
  useEffect(() => {
    if (initialData?.file) {
      setFilePreview(initialData.file);
    }
  }, [initialData?.file]);

  // Initialize form with default values or initial data
  const initialValues: FormValues = initialData
    ? {
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority,
        deadline: initialData.deadline,
        executor: initialData.executor,
      }
    : {
        title: '',
        description: '',
        status: StatusEnum.TO_DO,
        priority: PriorityEnum.MEDIUM,
        deadline: new Date().toISOString(),
        executor: null,
      };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
      }
    },
    [setSelectedFile, setFilePreview],
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        let fileUrl = initialData?.file || null;

        // Upload file if selected
        if (selectedFile) {
          fileUrl = await uploadFile(selectedFile);
        }

        const todoData = {
          ...values,
          file: fileUrl,
          deadline: new Date(values.deadline).toISOString(),
        };

        if (initialData) {
          // Update existing todo
          updateTodoMutate({
            ...todoData,
            id: initialData.id,
            orderInColumn: initialData.orderInColumn,
            status: values.status,
          });
        } else {
          // Add new todo
          createTodoMutate({
            todo: todoData,
            status: values.status,
          });
        }

        handleModalClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    [
      initialData,
      selectedFile,
      updateTodoMutate,
      createTodoMutate,
      handleModalClose,
    ],
  );

  const form = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: true,
  });

  const { isSubmitting, handleSubmit, setFieldValue, values, isValid, dirty } =
    form;

  const setExecutor = useCallback(
    (values: ExecutorFormValues) => {
      const executorId = values.executor;
      setFieldValue('executor', executorId);

      // Use the executor name provided by the ExecutorModal
      setExecutorLabel(values.executorName || '');
    },
    [setFieldValue, setExecutorLabel],
  );

  const handleExecutorModalOpen = useCallback(() => {
    executorModal.show({
      executor: values.executor,
      onSubmit: setExecutor,
      registerCloseModal: executorModal.hide,
    });
  }, [executorModal, values.executor, setExecutor]);

  const isSubmitDisabled = useMemo(
    () => isSubmitting || !isValid || !dirty,
    [isSubmitting, isValid, dirty],
  );

  const statusOptions = useMemo(
    () =>
      Object.values(StatusEnum).map(status => ({
        value: status,
        label: t(`todo:status.${status.toLowerCase()}`),
      })),
    [t],
  );

  const priorityOptions = useMemo(
    () =>
      Object.values(PriorityEnum).map(priority => ({
        value: priority,
        label: t(`todo:priority.${priority.toLowerCase()}`),
      })),
    [t],
  );

  return (
    <Modal
      title={initialData ? t('todo:editTodo') : t('todo:addTodo')}
      clickSubmit={handleSubmit}
      onCloseModal={handleModalClose}
      disabled={isSubmitDisabled}
    >
      <FormikProvider value={form}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormikInput
            name="title"
            label={t('todo:form.title.label')}
            placeholder={t('todo:form.title.placeholder')}
            disabled={isSubmitting}
          />

          <FormikTextarea
            name="description"
            label={t('todo:form.description.label')}
            placeholder={t('todo:form.description.placeholder')}
            disabled={isSubmitting}
          />

          <FormikSelect
            name="status"
            label={t('todo:form.status.label')}
            placeholder={t('todo:form.status.placeholder')}
            disabled={isSubmitting}
            options={statusOptions}
          />

          <FormikSelect
            name="priority"
            label={t('todo:form.priority.label')}
            placeholder={t('todo:form.select.placeholder')}
            disabled={isSubmitting}
            options={priorityOptions}
          />

          <FormikDatePicker
            name="deadline"
            label={t('todo:form.deadline.label')}
            placeholder={t('todo:form.deadline.placeholder')}
            disabled={isSubmitting}
          />

          <div className="flex items-center gap-2">
            <Input
              disabled
              value={executorLabel}
              placeholder={t('todo:form.executor.placeholder')}
            />

            <Button onClick={handleExecutorModalOpen} disabled={isSubmitting}>
              {t('todo:addExecutor')}
            </Button>
          </div>

          {/* File upload field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('todo:form.file')}
            </label>

            <Input
              type="file"
              disabled={isSubmitting}
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />

            {/* Image preview */}
            {filePreview && (
              <div className="mt-2">
                <p className="text-sm mb-1">{t('todo:form.preview')}</p>
                <img
                  src={filePreview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-40 rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
        </form>
      </FormikProvider>
    </Modal>
  );
};

export default TodoFormModal;
