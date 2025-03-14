import React from 'react';
import { useRouter } from 'next/router';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/profile'); // Navigate to the profile page
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">Welcome, {userName}</h1>
      <div>
        <button onClick={handleProfileClick} className="mr-4">
          Profile
        </button>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;