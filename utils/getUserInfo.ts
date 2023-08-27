/* 
returns user data. first retrieves client token, 
then goes to auth0 to trade token for user info.
*/

import axios from 'axios';
import { getAccessToken } from '@auth0/nextjs-auth0';

export const getUserInfo = async (req, res) => {
    try {
      const { accessToken } = await getAccessToken(req, res);
      console.log("got access token");
      if (!accessToken) {
        return null;
      }
  
      const auth0Domain = process.env.AUTH0_DOMAIN;
  
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      
      console.log('url: ' + `https://${auth0Domain}/userinfo`);

      const response = await axios.get(`https://${auth0Domain}/userinfo`, config);
      return response.data;
      console.log("got user info");
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };
  
