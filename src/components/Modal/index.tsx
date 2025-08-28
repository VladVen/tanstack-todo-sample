import React, { type ReactNode, useEffect } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';
import type { VariantProps } from 'class-variance-authority';
import { X as XIcon } from 'lucide-react';

import { Button, type buttonVariants } from '@/components/ui/button.tsx';
import { cn } from '@/lib/cn.ts';

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type Props = {
  title: string | React.ReactNode; // Title of modal
  children: React.ReactNode; // Fields and all what can include modal in body
  buttonTitle?: string; // Text which we show in submit button
  disabled?: boolean; // Condition for disabling submit button
  className?: string;
  onCloseModal: () => void; // Action that works when we click to close
  clickSubmit?: () => void; // Action that works after click to submit button
  submitVariant?: ButtonVariantProps['variant']; // Variant of submit button
  headerAction?: ReactNode; // Action button to header
};

const Modal = (props: Props) => {
  const {
    title,
    children,
    onCloseModal,
    buttonTitle,
    clickSubmit,
    disabled,
    className,
    submitVariant = 'default',
    headerAction,
  } = props;

  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <ReactModal
      isOpen
      onRequestClose={onCloseModal}
      ariaHideApp={false}
      className={cn(
        'w-[480px] max-w-none mx-auto my-auto rounded-xl shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        className,
      )}
      overlayClassName="fixed inset-0 overflow-auto z-50 p-5 bg-black/30 transition-colors duration-150 h-[100vh] flex items-center justify-center"
    >
      <div className="border border-solid border-divider rounded-xl bg-card">
        <div className="relative flex justify-center p-[22px] rounded-t-xl border-b-border border-b-1">
          <div className="flex items-center justify-between gap-3 text-xl">
            {title} {headerAction}
          </div>

          <XIcon
            className="absolute top-0 right-[-48px] w-8 h-8 rounded-lg text-muted-foreground bg-card p-1 cursor-pointer"
            onClick={onCloseModal}
          />
        </div>

        <div className="p-4 px-6 pb-6">{children}</div>

        <div className="flex items-center justify-between p-4 px-6 pb-6 gap-4">
          <Button
            data-testid="Modal-cancelButton"
            onClick={onCloseModal}
            variant="ghost"
          >
            {t('cancel')}
          </Button>

          <Button
            variant={submitVariant}
            disabled={disabled}
            onClick={clickSubmit}
          >
            {buttonTitle || t('submit')}
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

export default React.memo(Modal);
