import { useEffect, useState } from 'react';

export default function useCurrentUser() {
  const [user, setUser] = useState('');

  const getUserData = async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return [user];
}
