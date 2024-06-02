import { useRouter } from 'next/router';
import Navbar from './Navbar';
// import Footer from './footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  const disableNavbarPages = ['/LoginPage', '/SignupPage', '/'];
  const router = useRouter();

  return (
    <>
      {disableNavbarPages.includes(router.pathname) ? null : <Navbar />}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
