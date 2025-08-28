import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LangStateFields = {
  lang: 'en' | 'uk';
};

type LangState = LangStateFields & {
  setLang: (data: LangStateFields) => void;
  clearLang: () => void;
};

const initialState: LangStateFields = {
  lang: 'en',
};

export const useLangStore = create<LangState>()(
  persist(
    set => ({
      ...initialState,
      setLang: data =>
        set(state => ({
          ...state,
          ...data,
        })),
      clearLang: () => set({ ...initialState }),
    }),
    {
      name: 'lang-storage',
    },
  ),
);
