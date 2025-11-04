import React, { useContext, useState, useEffect } from 'react';
import { HeartIcon } from './icons/HeartIcon';
import type { Page } from '../App';
import { AuthContext } from '../contexts/AuthContext';
import { MenuIcon } from './icons/MenuIcon';
import { CloseIcon } from './icons/CloseIcon';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const navLinks: { page: Page, label: string }[] = [
    { page: 'home', label: 'Inicio' },
    { page: 'about', label: 'Quiénes Somos' },
    { page: 'whatwedo', label: 'Qué Hacemos' },
    { page: 'contact', label: 'Contacto' },
];

export const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu on page change
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  const handleLogout = async () => {
    await logout();
    setCurrentPage('home');
  };

  const MobileNav = () => (
    <div className="absolute top-full left-0 w-full bg-brand-cream shadow-lg md:hidden">
      <nav className="flex flex-col p-4 space-y-4">
        {navLinks.map(link => (
          <a
            key={link.page}
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentPage(link.page); }}
            className={`text-lg font-medium tracking-wider ${currentPage === link.page ? 'text-brand-green' : 'text-brand-brown'}`}
          >
            {link.label}
          </a>
        ))}
        <hr className="border-gray-200" />
        {user ? (
          <>
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('account'); }} className="text-lg font-medium tracking-wider text-brand-brown">
              Mi Cuenta
            </a>
            <button onClick={handleLogout} className="text-lg font-medium tracking-wider text-brand-brown text-left">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('login'); }} className="text-lg font-medium tracking-wider text-brand-brown">
            Iniciar Sesión
          </a>
        )}
      </nav>
    </div>
  );

  return (
    <header className="bg-brand-cream sticky top-0 z-30 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home');}} className="flex items-center space-x-2 text-3xl font-bold text-brand-brown">
            <HeartIcon className="h-8 w-8 text-brand-green" />
            <span className="font-serif">DoggoFresh</span>
          </a>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a
                key={link.page}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(link.page); }}
                className={`text-base font-medium tracking-wider ${currentPage === link.page ? 'text-brand-green' : 'text-brand-brown hover:text-brand-green transition-colors'}`}
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <>
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('account'); }}
                    className={`text-base font-medium tracking-wider ${currentPage === 'account' ? 'text-brand-green' : 'text-brand-brown hover:text-brand-green transition-colors'}`}
                  >
                    Mi Cuenta
                </a>
                <button
                    onClick={handleLogout}
                    className="text-base font-medium tracking-wider text-brand-brown hover:text-brand-green transition-colors"
                  >
                    Cerrar Sesión
                </button>
              </>
            ) : (
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage('login'); }}
                className={`bg-brand-green text-white text-base font-medium tracking-wider px-5 py-2 rounded-md hover:bg-opacity-90 transition-colors`}
              >
                Iniciar Sesión
              </a>
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