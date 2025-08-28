import { initReactI18next } from 'react-i18next';
import i18n, { type ParseKeys } from 'i18next';

import { useLangStore } from '@/store';

import en from './locales/en';
import uk from './locales/uk';

export const resources = {
  en,
  uk,
} as const;

const NS = ['common', 'notFound', 'todo', 'validation'] as const;

i18n.use(initReactI18next).init({
  resources,
  lng: useLangStore.getState().lang,
  fallbackLng: 'en',
  ns: NS,
  interpolation: {
    escapeValue: false,
  },
});

type DefaultNS = ['common'];

export type i18nKey =
  | ParseKeys<typeof NS, { [key: string]: unknown }, DefaultNS>
  | TemplateStringsArray;

export default i18n;
