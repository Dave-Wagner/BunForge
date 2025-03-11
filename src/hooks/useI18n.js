import { useContext } from 'react';
import { I18nContext } from '@/i18n/I18nContext';

/**
 * Custom hook to access the internationalization (i18n) context.
 *
 * This hook uses React's useContext to retrieve the current value of I18nContext,
 * providing components with access to localization methods, language settings,
 * and translation utilities.
 *
 * @returns {object} The value provided by I18nContext, typically including methods and data
 *                   for internationalization.
 *
 * @example
 * import React from 'react';
 * import { useI18n } from '@/hooks/useI18n';
 *
 * const MyComponent = () => {
 *   const { translate } = useI18n();
 *
 *   return (
 *     <div>
 *       {translate('welcome_message')}
 *     </div>
 *   );
 * };
 *
 * export default MyComponent;
 */
export const useI18n = () => useContext(I18nContext);
