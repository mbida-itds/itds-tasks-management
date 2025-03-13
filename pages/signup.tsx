import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link'; // Import Link from next/link

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('developer');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('token', token);
        router.push('/dashboard');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Sign up failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Sign-up error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="p-6 bg-card rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full text-gray-800"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full text-gray-800"
        />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full text-gray-800">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="developer" className='text-gray-800'>Developer</SelectItem>
            <SelectItem value="tester" className='text-gray-800'>Tester</SelectItem>
            <SelectItem value="viewer" className='text-gray-800'>Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full">
          Submit
        </Button>
        <p className="text-center text-gray-800">
          Already have an account? <Link href="/signin" className="text-gray-800 font-bold">Sign In</Link>
        </p>
      </form>
    </div>
  );
}