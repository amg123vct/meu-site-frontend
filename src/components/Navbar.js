import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Gamepad2, 
  User, 
  LogOut, 
  Menu, 
  X,
  Coins,
  Trophy
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Gamepad2 },
    { path: '/tigrinho', label: 'Tigrinho', icon: Gamepad2 },
    { path: '/doble', label: 'Doble', icon: Gamepad2 },
    { path: '/profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GameZone</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {navItems.slice(1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{user.credits}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{user.totalWins}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-white/20">
          <div className="px-4 py-2 space-y-1">
            {user ? (
              <>
                {/* User Info Mobile */}
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-white/70 text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Credits and Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{user.credits}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{user.totalWins}</span>
                  </div>
                </div>

                {/* Navigation Items */}
                {navItems.slice(1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 