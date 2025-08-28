import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { useLangStore } from '@/store';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const { lang, setLang } = useLangStore();

  const isUkrainian = lang === 'uk';

  const toggleLanguage = () => {
    const newLang = isUkrainian ? 'en' : 'uk';

    setLang({ lang: newLang });

    window.location.reload();
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
    window.document.dir = 'ltr'; // Both English and Ukrainian are LTR
    window.document.documentElement.lang = lang;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {!isUkrainian ? 'Українська' : 'English'}
    </Button>
  );
}
