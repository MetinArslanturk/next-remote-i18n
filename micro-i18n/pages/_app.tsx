import "../styles/globals.css";
import type { AppProps } from "next/app";
import Router from 'next/router'
import { appWithTranslation, i18n } from "../next-i18next";
import i18nConfig from "../next-i18next.config";
import Head from "next/head";
import { useEffect, useRef } from "react";

function MyApp({ Component, pageProps, router }: AppProps) {
  const { locale } = router;

  const scriptTargeti18NID = useRef(pageProps?.translationDeployId);
  const initialLocale = useRef(locale);

  useEffect(() => {
    if (pageProps?.translationDeployId !== window.commoni18nID) {
      Router.reload()
    }
  }, [router, router.asPath, pageProps?.translationDeployId]);

  if (
    pageProps?._nextI18Next?.initialI18nStore &&
    i18n &&
    typeof window !== "undefined"
  ) {

    i18n.services.resourceStore.data[locale as string].common = window.commoni18n;
  }

  return (
    <>
      <Head>
        {scriptTargeti18NID && (
          <script
            src={`${process.env.NEXT_PUBLIC_TRANSLATIONS_HOST}/${scriptTargeti18NID.current}/${initialLocale.current}/${process.env.NEXT_PUBLIC_COMMON_I18N_LOADER_SCRIPT}`}
            defer={true}
          />
        )}
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp, i18nConfig);
