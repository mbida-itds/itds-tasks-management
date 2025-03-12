import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('developer');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error state
    try {
      const res = await fetch('/api/auth/auth', { // Updated endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }), // Include role for sign-up
      });

      if (res.ok) {
        const { token } = await res.json(); // Get the token from the response
        localStorage.setItem('token', token); // Store the token in local storage
        router.push('/dashboard'); // Redirect to dashboard
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
        <h2 className="text-2xl font-bold text-center text-foreground">Sign Up</h2>
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
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="tester">Tester</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}