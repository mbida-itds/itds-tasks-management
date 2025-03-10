import { signIn, useSession } from 'next-auth/react'; // Add useSession to check status
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
  const { data: session, status } = useSession(); // Check session status
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error state
    try {
      const result = await signIn('credentials', {
        email,
        password,
        role: role || undefined, // Include role for signup, omit for sign-in
        redirect: false, // Handle redirect manually
      });

      if (result?.error) {
        setError(result.error); // Display error if sign-in fails
      } else if (result?.ok) {
        // Sign-in successful, manually redirect
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Sign-in error:', err);
    }
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="p-6 bg-card rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-foreground">Sign Up or Sign In</h2>
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
            <SelectValue placeholder="Select a role (for signup)" />
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