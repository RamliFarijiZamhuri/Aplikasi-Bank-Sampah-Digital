import { GetServerSideProps } from 'next';
import { getSessionUser } from '../lib/session';

export default function IndexPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSessionUser(context.req);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const role = user.role;
  let destination = '/login';
  if (role === 'Nasabah') destination = '/dashboard/nasabah';
  else if (role === 'Petugas') destination = '/dashboard/petugas';
  else if (role === 'Pengepul') destination = '/dashboard/pengepul';

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};
