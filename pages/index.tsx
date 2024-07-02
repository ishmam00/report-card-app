import Image from 'next/image';
import LoginPage from './LoginPage';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PrivateRouter from '@/components/privateRouter';

const Home = () => {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  // useEffect(() => {
  //   console.log(isLoading);
  //   console.log('User:', user);
  //   if (!user && !isLoading) {
  //     console.log('Hello World');
  //     router.push('/LoginPage');
  //   }
  // }, []);

  return (
    <PrivateRouter>
      <main>
        <div className="flex justify-center text-gray-700 mb-3">Loading...</div>
      </main>
    </PrivateRouter>
  );
};

export default Home;
