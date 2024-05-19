import Image from 'next/image';
import LoginPage from './LoginPage';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import privateRouter from '@/components/privateRouter';

const Home = () => {
  const router = useRouter();
  const [user] = useCurrentUser();

  useEffect(() => {
    if (!user) {
      router.push('/LoginPage');
    }
  }, []);

  return (
    <main>
      <div className="flex justify-center text-gray-700 mb-3">Welcome</div>
    </main>
  );
};

export default Home;
