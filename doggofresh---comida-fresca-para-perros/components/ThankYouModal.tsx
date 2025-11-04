import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ThankYouModalProps {
  email: string;
  onClose: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({ email, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full text-center p-8 relative transform transition-all duration-300 ease-in-out scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Cerrar"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        
        <img
          src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cachorro tierno"
          className="w-40 h-40 rounded-full object-cover mx-auto mb-6 border-4 border-brand-green"
        />

        <h2 className="text-3xl font-serif text-brand-brown mb-4">¡Gracias por unirte!</h2>
        <p className="text-gray-700 text-lg mb-6">
          Estás en nuestra lista de lanzamiento. Te enviaremos un correo a <strong>{email}</strong> con un cupón de descuento exclusivo tan pronto como DoggoFresh esté listo.
        </p>
        <button
          onClick={onClose}
          className="bg-brand-green hover:bg-opacity-90 text-white font-semibold uppercase tracking-widest py-3 px-8 rounded-md text-sm transition duration-300 shadow-lg"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
};