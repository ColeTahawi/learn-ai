/*
returns true if client is authorized to hit api chat endpoint.
all users are authorized to chat.
*/

import { getSession } from '@auth0/nextjs-auth0';

export const requireAuthChat = async (req, res) => {
  const session = await getSession(req, res);
  if (!session || !session.user) {
    return false;
  }
  return true;
};

