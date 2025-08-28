import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <Sonner
      dir={isRTL ? 'rtl' : 'ltr'}
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          success: '!bg-green-700 !text-green-100 !border-green-700',
          info: '!bg-blue-700 !text-blue-100 !border-blue-700',
          warning: '!bg-yellow-700 !text-yellow-100 !border-yellow-700',
          error: '!bg-red-700 !text-red-100 !border-red-700',
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
