import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Reports', path: '/admin/reports' },
    { name: 'Customers', path: '/admin/customers' },
  ];

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear auth token, redirect)
    console.log('Logout clicked');
    setIsLogoutOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-xl font-bold">Lords Admin Panel</h2>
        
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="relative">
            <Avatar
              className="cursor-pointer"
              onClick={() => setIsLogoutOpen(!isLogoutOpen)}
            >
              <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            
            {isLogoutOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Button
                  variant="ghost"
                  className="w-full text-left text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;