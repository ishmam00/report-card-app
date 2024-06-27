import useCurrentUser from '@/hooks/useCurrentUser';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const [user] = useCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/LoginPage');
  };

  return (
    <nav className="flex justify-between items-center bg-gray-200">
      <div className="flex items-center justify-end w-full gap-3">
        <div>
          <p className="text-gray-700">
            <strong>{user.name}</strong>
          </p>
        </div>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
