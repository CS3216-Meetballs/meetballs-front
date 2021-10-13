import React, { createContext, useState, useEffect } from 'react';
import { accessTokenKey, loginTypeKey } from '../common/CommonValues';
import { FullLoadingIndicator } from '../components/FullLoadingIndicator';
import { refresh, zoomRefresh } from '../services/auth';
import { getUser } from '../services/user';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // init connection with background and maintain synced data
  useEffect(() => {
    const updateUser = async () => {
      const token = sessionStorage.getItem(accessTokenKey);
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const user = await getUser();
        setUser(user.data);
      } catch (err) {
        console.log('Error getting user', err);
      }
    };
    document.addEventListener(accessTokenKey, updateUser, false);

    const type = localStorage.getItem(loginTypeKey);
    const refFun = type === 'zoom' ? zoomRefresh : refresh;
    refFun()
      .catch((_) => console.log('No refresh token'))
      .finally(() => {
        setLoading(false);
      });

    return () => {
      document.removeEventListener(accessTokenKey, updateUser, false);
    };
  }, []);

  if (loading) {
    return <FullLoadingIndicator />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
