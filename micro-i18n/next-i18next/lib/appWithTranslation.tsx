import React, { useMemo, createContext, useContext, useState, useRef, SetStateAction, Dispatch } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { I18nextProvider } from 'react-i18next'
import type { AppProps as NextJsAppProps } from 'next/app'

import { createConfig } from './config/createConfig'
import createClientNode from './createClient/node'
import createClientBrowser from './createClient/browser'

import { SSRConfig, UserConfig } from './types'

import i18nModule, { i18n as I18NextClient } from 'i18next'

export { Trans, useTranslation, withTranslation } from 'react-i18next'


type AppProps = NextJsAppProps & {
  pageProps: SSRConfig
}

export const I18nUpdaterContext = createContext<any>([0, () => {}]);

export let globalI18n: I18NextClient | null = null

export const appWithTranslation = (
  WrappedComponent: React.ComponentType<AppProps> | React.ElementType<AppProps>,
  i18nConfig: UserConfig,
  configOverride: UserConfig | null = null,
) => {
  const AppWithTranslation = (props: AppProps) => {

    const { _nextI18Next } = props.pageProps
    const { locale } = props.router

    const i18nConf = (configOverride && configOverride.i18n) ? configOverride.i18n : i18nConfig.i18n;
    const [i18nUpdater, setI18nUpdater] = useState(0);


    // Memoize the instance and only re-initialize when either:
    // 1. The route changes (non-shallowly)
    // 2. Router locale changes
    const i18n: I18NextClient | null = useMemo(() => {
      if (!locale) return null

      if (!_nextI18Next) {
        return i18nModule.createInstance({ lng: locale, ...i18nConf });
      }

      let userConfig = i18nConfig
      const { initialI18nStore } = _nextI18Next


      if (userConfig === null && configOverride === null) {
        throw new Error('appWithTranslation was called without a next-i18next config')
      }

      if (configOverride !== null) {
        userConfig = configOverride
      }

      if (!userConfig?.i18n) {
        throw new Error('appWithTranslation was called without config.i18n')
      }

      const createClient = typeof window === 'undefined' ? createClientNode : createClientBrowser;

      const instance = createClient({
        ...createConfig({
          ...userConfig,
          lng: locale,
        }),
        lng: locale,
        resources: initialI18nStore,
      }).i18n

      globalI18n = instance

      return instance
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [_nextI18Next, locale, i18nUpdater])

    const updaterContextValue = useMemo(() => {
      return [i18nUpdater, setI18nUpdater]
    }, [i18nUpdater])

    return i18n !== null ? (
      <I18nUpdaterContext.Provider value={updaterContextValue}>
        <I18nextProvider i18n={i18n}>
          <WrappedComponent {...props} />
        </I18nextProvider>
      </I18nUpdaterContext.Provider>
    ) : (
      <I18nUpdaterContext.Provider value={updaterContextValue}>
        <WrappedComponent {...props} />
      </I18nUpdaterContext.Provider>
    );
  }

  return hoistNonReactStatics(
    AppWithTranslation,
    WrappedComponent,
  )
}
