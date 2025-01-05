import React from 'react';
import { Link } from 'react-router-dom';
import { Vote } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8" />
            <span className="font-bold text-xl">Everybody Polls</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/privacy" className="hover:text-blue-200 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}