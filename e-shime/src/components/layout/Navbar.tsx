import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Heart } from 'lucide-react';
import { Button } from '../ui/button';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAdmin?: boolean;
}

export function Navbar({ darkMode, toggleDarkMode,  isAdmin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const userData = localStorage.getItem('eshime_user');
      if (userData) {
        setIsAuthenticated(true);
      }
  })

  const handleLogout = () => {
    localStorage.removeItem('eshime_user');
    localStorage.removeItem('eshime_admin');
    navigate('/');
    setIsAuthenticated(false);
  };

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className={`h-8 w-8 ${darkMode ? 'text-beige' : 'text-black'} fill-current`} />
            <div>
              <h1 className={`${darkMode ? 'text-white' : 'text-black'}`}>E-SHIME</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Healing through Expression</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                  {isAdmin ? 'Admin' : 'Dashboard'}
                </Link>
                {!isAdmin && (
                  <>
                    <Link to="/mood" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                      Mood Tracker
                    </Link>
                    <Link to="/chat" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                      Chat
                    </Link>
                    <Link to="/creative" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                      Art & Therapy
                    </Link>
                    <Link to="/stories" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                      Stories
                    </Link>
                    <Link to="/booking" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                      Book Therapist
                    </Link>
                  </>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
                  Login
                </Link>
                <Link to="/register">
                  <Button size="sm" className={darkMode ? 'bg-beige text-black hover:bg-beige/90' : 'bg-black text-white hover:bg-black/90'}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${darkMode ? 'text-white' : 'text-black'}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                {!isAdmin && (
                  <>
                    <Link to="/mood" className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                      Mood Tracker
                    </Link>
                    <Link to="/chat" className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                      Chat
                    </Link>
                    <Link to="/creative" className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                      Art & Therapy
                    </Link>
                    <Link to="/stories" className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                      Stories
                    </Link>
                    <Link to="/booking" className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                      Book Therapist
                    </Link>
                  </>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
