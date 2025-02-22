import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  BuildingIcon, 
  BriefcaseIcon, 
  WalletIcon, 
  UsersIcon,
  UserIcon,
  LogOutIcon
} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ isForDashboard = false }) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderNavLinks = () => (
    <nav className="flex gap-8">
      {isAuthenticated && (
        <>
          <Link to="/brand-assistant" className="flex flex-col items-center group cursor-pointer">
            <BuildingIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" fill="currentColor" strokeWidth={1.5} />
            <span className="text-xs mt-1 text-gray-700">Brand Assistant</span>
          </Link>
          <Link to="/job-assistant" className="flex flex-col items-center group cursor-pointer">
            <BriefcaseIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" fill="currentColor" strokeWidth={1.5} />
            <span className="text-xs mt-1 text-gray-700">Job Assistant</span>
          </Link>
          <Link to="/fund-finder" className="flex flex-col items-center group cursor-pointer">
            <WalletIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" fill="currentColor" strokeWidth={1.5} />
            <span className="text-xs mt-1 text-gray-700">Fund Finder</span>
          </Link>
          <Link to="/freelancer-hub" className="flex flex-col items-center group cursor-pointer">
            <UsersIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" fill="currentColor" strokeWidth={1.5} />
            <span className="text-xs mt-1 text-gray-700">FreeLancer Hub</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center group cursor-pointer">
            <UserIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
            <span className="text-xs mt-1 text-gray-700">Profile</span>
          </Link>
        </>
      )}
    </nav>
  );

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2"
          onClick={handleSignOut}
        >
          <LogOutIcon className="h-4 w-4" />
          Sign Out
        </Button>
      );
    }

    return (
      <div className="flex gap-4 ml-4">
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100" asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
          <Link to="/auth?signup=true">Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="bg-white text-gray-800 flex justify-between items-center px-6 py-4 border-b border-gray-200 shadow-sm">
      <div className="font-bold text-xl text-blue-600">
        <Link to="/">SkillXion</Link>
      </div>
      
      <div className="flex items-center justify-end gap-8 ml-auto">
        {renderNavLinks()}
        {!isForDashboard && renderAuthButtons()}
      </div>
    </header>
  );
};

export default Header;