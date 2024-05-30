import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/LoginPage');
  };

  return (
    <nav className="flex justify-between items-center bg-gray-200">
      <div>{/* Other navbar items */}</div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
