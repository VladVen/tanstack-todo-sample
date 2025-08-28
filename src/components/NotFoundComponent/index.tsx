import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCanGoBack, useRouter } from '@tanstack/react-router';

import { Button } from '@/components/ui/button.tsx';

import NotFoundImg from './img/not-fount-content.svg';

const NotFoundComponent = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const onNavigate = () =>
    canGoBack ? router.history.back() : router.navigate({ to: '/' });

  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-background text-center px-6">
      <img
        src={NotFoundImg}
        width="400"
        height="300"
        alt="Illustration"
        className="rounded-xl object-cover"
        style={{ aspectRatio: '400/300', objectFit: 'contain' }}
      />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-2">
        {t('notFound:title')}
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">
        {t('notFound:description')}
      </p>

      <Button onClick={onNavigate}>{t('notFound:goBack')}</Button>
    </section>
  );
};

export default memo(NotFoundComponent);
