import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/signin', '/signup']; // Define public paths

    if (!token && !publicPaths.includes(router.pathname)) {
      router.push('/signin'); // Redirect to sign-in if no token and not on public paths
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;