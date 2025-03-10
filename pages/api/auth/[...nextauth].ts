import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: MongoDBAdapter({ promise: connectDB() }),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        await connectDB();
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Signup flow: Create new user if role is provided
        if (credentials.role) {
          const existingUser = await User.findOne({ email: credentials.email });
          if (existingUser) {
            throw new Error('User already exists. Please sign in instead.');
          }
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const user = new User({
            email: credentials.email,
            password: hashedPassword,
            role: credentials.role,
          });
          await user.save();
          return { id: user._id, email: user.email, role: user.role };
        }

        // Sign-in flow: Verify existing user
        const user = await User.findOne({ email: credentials.email });
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user._id, email: user.email, role: user.role };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/signup', // Redirect to /signup for both flows
    error: '/signup',  // Redirect errors back to /signup
  },
};

export default NextAuth(authOptions);