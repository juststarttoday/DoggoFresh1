import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HeartIcon } from './icons/HeartIcon';
import { AuthContext } from '../contexts/AuthContext';
import { MenuIcon } from './icons/MenuIcon';
import { CloseIcon } from './icons/CloseIcon';

const navLinks: { path: string, label: string }[] = [
    { path: '/', label: 'Inicio' },
    { path: '/about', label: 'Quiénes Somos' },
    { path: '/whatwedo', label: 'Qué Hacemos' },
    { path: '/contact', label: 'Contacto' },
];

const activeLinkStyle = { color: '#3C5B52' };

export const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Close mobile menu on page change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const NavLinksComponent: React.FC<{isMobile?: boolean}> = ({ isMobile = false }) => (
    <>
     {navLinks.map(link => (
      <NavLink
        key={link.path}
        to={link.path}
        style={({ isActive }) => isActive ? activeLinkStyle : {}}
        className={isMobile ? 'text-lg font-medium tracking-wider text-brand-brown' : 'text-base font-medium tracking-wider text-brand-brown hover:text-brand-green transition-colors'}
      >
        {link.label}
      </NavLink>
    ))}
    </>
  );


  const MobileNav = () => (
    <div className="absolute top-full left-0 w-full bg-brand-cream shadow-lg md:hidden">
      <nav className="flex flex-col p-4 space-y-4">
        <NavLinksComponent isMobile />
        <hr className="border-gray-200" />
        {user ? (
          <>
            <Link to="/account" className="text-lg font-medium tracking-wider text-brand-brown">
              Mi Cuenta
            </Link>
            <button onClick={handleLogout} className="text-lg font-medium tracking-wider text-brand-brown text-left">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="text-lg font-medium tracking-wider text-brand-brown">
            Iniciar Sesión
          </Link>
        )}
      </nav>
    </div>
  );

  return (
    <header className="bg-brand-cream sticky top-0 z-30 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 text-3xl font-bold text-brand-brown">
            <HeartIcon className="h-8 w-8 text-brand-green" />
            <span className="font-serif">DoggoFresh</span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinksComponent />
            {user ? (
              <>
                <NavLink
                    to="/account"
                    style={({ isActive }) => isActive ? activeLinkStyle : {}}
                    className='text-base font-medium tracking-wider text-brand-brown hover:text-brand-green transition-colors'
                  >
                    Mi Cuenta
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="text-base font-medium tracking-wider text-brand-brown hover:text-brand-green transition-colors"
                  >
                    Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`bg-brand-green text-white text-base font-medium tracking-wider px-5 py-2 rounded-md hover:bg-opacity-90 transition-colors`}
              >
                Iniciar Sesión
              </Link>
            )}
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <CloseIcon className="h-8 w-8 text-brand-brown" /> : <MenuIcon className="h-8 w-8 text-brand-brown" />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && <MobileNav />}
      </div>
    </header>
  );
};