import { useContext, useEffect, useRef } from "react";
import { I18nUpdaterContext } from "../next-i18next/lib/appWithTranslation";

const fetchMetadataJSON = () => {
  return fetch(`${process.env.NEXT_PUBLIC_TRANSLATIONS_HOST}/metadata.json`).then((res) => res.json());
};

const fetchCommonJSON = (locale?: string, translationDeployId?: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_TRANSLATIONS_HOST}/${translationDeployId}/${locale}/${process.env.NEXT_PUBLIC_I18N_COMMON_JSON_NAME}`
  ).then((res) => res.json());
};

export const useTrackCommonI18n = (
  locale?: string,
  translationDeployId?: string,
  translationLastUpdateDate?: number
) => {
  const scriptTargeti18NID = useRef(translationDeployId);
  const currentLastDate = useRef(translationLastUpdateDate);
  const initialLocale = useRef(locale);
  const immutableInitialLocale = useRef(locale);


  const [, setI18nUpdater] = useContext(I18nUpdaterContext);

  useEffect(() => {
    if (initialLocale.current === locale) {
      if (
        !translationLastUpdateDate ||
        !currentLastDate.current ||
        currentLastDate.current < translationLastUpdateDate
      ) {
          
        fetchCommonJSON(locale, translationDeployId).then((res) => {
          window.commoni18n = res;
          window.commoni18nID = translationDeployId;
          currentLastDate.current = translationLastUpdateDate;
          setI18nUpdater(Date.now());
        });
      }
    } else {
      initialLocale.current = locale;
    }
  }, [translationDeployId, locale, translationLastUpdateDate, setI18nUpdater]);

  
  useEffect(() => {      
      fetchMetadataJSON().then((res) => {
        if (
          !currentLastDate.current ||
          currentLastDate.current < res.last_update_date
        ) {
          fetchCommonJSON(initialLocale.current, res.last_deploy_id).then((response) => {
            window.commoni18n = response;
            window.commoni18nID = res.last_deploy_id;
            currentLastDate.current = res.last_update_date;
            setI18nUpdater(Date.now());
          });
        }
      });
  }, [setI18nUpdater]);

  return [scriptTargeti18NID.current, immutableInitialLocale.current];
};
