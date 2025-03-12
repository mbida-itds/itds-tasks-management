import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && router.pathname !== '/signin') {
      router.push('/signin'); // Redirect to sign-in if no token
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;