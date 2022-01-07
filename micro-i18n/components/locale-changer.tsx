import { useRouter } from "next/router";
import i18NConfig from "../next-i18next.config";

const LocaleChanger = ({ currentPath }: any) => {
  const router = useRouter();
  return (
    <>
      <div>
        {i18NConfig.i18n.locales.map((item) => {
          return (
            <a
              key={item}
              style={{ marginLeft: "1rem" }}
              onClick={() => {
                fetch(
                  `${process.env.NEXT_PUBLIC_TRANSLATIONS_HOST}/${window.commoni18nID}/${item}/${process.env.NEXT_PUBLIC_I18N_COMMON_JSON_NAME}`
                )
                  .then((res) => res.json())
                  .then((res) => {
                    window.commoni18n = res;
                    router.push(currentPath, currentPath, { locale: item });
                  });
              }}
            >
              {item}
            </a>
          );
        })}
      </div>
    </>
  );
};

export default LocaleChanger;
