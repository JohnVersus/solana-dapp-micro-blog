import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { HelloWorld } from 'components/templates/helloWorld';

const HelloWorldPage: NextPage = () => {
  return (
    <Default pageName="HelloWorld">
      <HelloWorld />
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user.address) {
    return { props: { error: 'Connect your wallet first' } };
  }

  return {
    props: {},
  };
};

export default HelloWorldPage;
