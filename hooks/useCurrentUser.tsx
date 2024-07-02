import { useEffect, useState } from 'react';

export interface IUser {
  id: number;
  name: string;
  contactNumber: string;
  department: string;
  role: string;
  fatherName: string;
  email: string;
  password: string;
}

export default function useCurrentUser() {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setLoading] = useState(false);

  const getUserData = async () => {
    setLoading(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return { user, isLoading };
}
