import { useContext } from 'react';
import { I18nContext } from '@/i18n/I18nProvider';

export const useI18n = () => useContext(I18nContext);