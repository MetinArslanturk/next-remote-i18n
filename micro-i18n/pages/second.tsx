import type { NextPage, GetServerSidePropsContext } from "next";
import Link from "next/link";
import LocaleChanger from "../components/locale-changer";
import { serverSideTranslations, useTranslation } from "../next-i18next";
import i18nConfig from "../next-i18next.config";

const Second: NextPage = () => {
  const { t } = useTranslation("second");
  
  
  return (
    <div style={{ padding: "3rem" }}>
      Second page! Here: {t("second text")} <br />
      This comes from common: {t('test text', {ns: 'common'})}
      <br /><br />
      {'-> '} <Link href={"/"}>Home</Link>
      <br /><br />

      <LocaleChanger currentPath={"/second"} />
    </div>
  );
};

export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, i18nConfig, ["second"])),
    },
  };
}

export default Second;
