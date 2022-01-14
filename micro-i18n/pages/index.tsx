import type { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import LocaleChanger from "../components/locale-changer";
import { serverSideTranslations, useTranslation } from "../next-i18next";
import i18nConfig from "../next-i18next.config";

const i18nNamespaces = ["common", "second"];

const Home: NextPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "3rem" }}>
      Hello world! Here: {t('test text', {ns: 'common'})} <br />
      Second page text: {t("second text", {ns: 'second'})} <br />
      <br /><br />
      {'-> '}<Link href={"/second"}>Second</Link>
      <br /><br />

      <LocaleChanger currentPath={"/"} />
    </div>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  console.log('EXECUTE getStaticProps');
  return {
    props: {
      ...(await serverSideTranslations(locale as string, i18nConfig, i18nNamespaces)),
    },
    revalidate: 10,
  };
}

export default Home;
