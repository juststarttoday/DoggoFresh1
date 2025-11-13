import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from './icons/HeartIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-brown text-white mt-auto">
      <div className="container mx-auto py-6 px-4 text-center">
        <div className="flex items-center justify-center mb-2">
            <HeartIcon className="h-6 w-6 mr-2" />
            <p className="font-bold">DoggoFresh</p>
        </div>
        <div className="text-sm text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} DoggoFresh. Todos los derechos reservados. Hecho con ❤️ en Quito.
          </p>
          <Link 
            to="/privacy"
            className="mt-2 inline-block hover:text-white underline"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
};