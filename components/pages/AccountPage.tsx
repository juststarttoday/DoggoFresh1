import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export const AccountPage: React.FC = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return null; // Should be handled by router
  }

  const menuItems = [
    { title: 'Mis Suscripciones', description: 'Ve y gestiona tus planes de comida activos.', path: '/account/subscriptions' },
    { title: 'Mis Mascotas', description: 'Actualiza los perfiles y necesidades de tus perros.', path: '/account/pets' },
    { title: 'Mis Datos', description: 'Actualiza tu información de contacto y direcciones.', path: '/account/profile' },
    { title: 'Métodos de Pago', description: 'Gestiona tus tarjetas de crédito de forma segura.', path: '/account/billing' },
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-brown mb-4">
          ¡Hola, {user.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Bienvenido a tu portal DoggoFresh. Aquí podrás gestionar todo lo relacionado con tus mascotas y suscripciones. Recuerda que en este momento estamos validando la idea. Así se va a ver tu perfil en el futúro.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-left hover:shadow-xl hover:border-brand-green transition-all duration-300 transform hover:-translate-y-1 block"
            >
              <h2 className="text-2xl font-serif text-brand-green mb-4">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};