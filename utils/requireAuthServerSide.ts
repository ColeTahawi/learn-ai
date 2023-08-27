// utils/requireAuthServerSide.js
import { getSession } from '@auth0/nextjs-auth0';

export const requireAuthServerSide = async (context) => {
  const session = await getSession(context.req, context.res);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: false,
      },
    };
  }

  return { props: {} }; // return empty props, so the page will continue to render
};
