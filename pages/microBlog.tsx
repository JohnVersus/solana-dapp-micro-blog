import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { MicroBlog } from 'components/templates/microBlog';

const MicroBlogPage: NextPage = () => {
  return (
    <Default pageName="Micro Blogger">
      <MicroBlog />
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

export default MicroBlogPage;
