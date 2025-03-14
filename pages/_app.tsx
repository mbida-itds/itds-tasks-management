import '../styles/globals.css';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app'; // Import AppProps for type definition

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/signin', '/signup']; // Define public paths

    if (!token && !publicPaths.includes(router.pathname)) {
      router.push('/signin'); // Redirect to sign-in if no token and not on public paths
    }
  }, [router]);
  const handleLogout = () => {
    // Logic to handle logout (e.g., clear token, redirect)
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const userName = 'User'; // Replace with actual user name from context or state


  return  (
    <>
      <Header userName={userName} onLogout={handleLogout} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;