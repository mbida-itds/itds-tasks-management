import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link'; // Import Link from next/link

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('token', token);
        router.push('/dashboard');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Sign in failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Sign-in error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="p-6 bg-card rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-foreground">Sign In</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full"
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
        <p className="text-center">
  Don't have an account? <Link href="/signup" className="text-blue-500">Sign Up</Link>
</p>
      </form>
    </div>
  );
}