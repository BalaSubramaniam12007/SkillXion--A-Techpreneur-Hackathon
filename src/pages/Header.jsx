import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  BuildingIcon, 
  BriefcaseIcon, 
  WalletIcon, 
  UsersIcon,
  UserIcon,
  LogOutIcon,
  FileTextIcon,
  MenuIcon,
} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Header = ({ isForDashboard = false }) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: "/brand-assistant", icon: BuildingIcon, label: "Brand Assistant" },
    { to: "/job-assistant", icon: BriefcaseIcon, label: "Job Assistant" },
    { to: "/fund-finder", icon: WalletIcon, label: "Fund Finder" },
    { to: "/freelancer-hub", icon: UsersIcon, label: "Freelancer Hub" },
    { to: "/resume-assistant", icon: FileTextIcon, label: "Resume Assistant" },
    { to: "/profile", icon: UserIcon, label: "Profile" },
  ];

  return (
    <header className="bg-white text-gray-800 flex justify-between items-center px-6 py-4 border-b border-blue-200 shadow-lg sticky top-0 z-20">
      <div className="font-extrabold text-2xl text-blue-600 tracking-tight">
        <Link to="/" className="flex items-center gap-2">
          <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 7v11l10-5V7l-10 5z" />
          </svg>
          SkillXion
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8">
          {isAuthenticated && navLinks.map(({ to, icon: Icon, label }, index) => (
            <Link 
              key={index} 
              to={to} 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 px-4 py-2 rounded-md hover:bg-blue-50"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Authentication Buttons or Sign Out */}
        {!isForDashboard && (
          <div className="hidden md:flex gap-4">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-2 transition-all duration-300"
                onClick={handleSignOut}
              >
                <LogOutIcon className="h-4 w-4" />
                <span className="font-semibold">Sign Out</span>
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold transition-all duration-300" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-semibold shadow-md" asChild>
                  <Link to="/auth?signup=true">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          className="md:hidden text-blue-600 hover:text-blue-800" 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-blue-900 bg-opacity-95 z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-end p-4">
              <Button variant="ghost" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-blue-200">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <nav className="flex flex-col items-center gap-6 py-8">
              {isAuthenticated && navLinks.map(({ to, icon: Icon, label }, index) => (
                <Link 
                  key={index} 
                  to={to} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white hover:text-blue-200 transition-colors duration-300"
                >
                  <Icon className="h-6 w-6" fill="currentColor" strokeWidth={1.5} />
                  <span className="text-lg font-semibold">{label}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 text-white hover:text-blue-200 text-lg font-semibold mt-4"
                  onClick={handleSignOut}
                >
                  <LogOutIcon className="h-6 w-6" />
                  Sign Out
                </Button>
              )}
              {!isAuthenticated && !isForDashboard && (
                <>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-blue-200 text-lg font-semibold">Sign In</Link>
                  <Link to="/auth?signup=true" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 text-lg font-semibold">Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;