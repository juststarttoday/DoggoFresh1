import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-6">Contacto</h1>
      <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
        ¿Preguntas, sugerencias o simplemente quieres saludar? Aquí encontrarás nuestro formulario de contacto, correo electrónico y redes sociales. ¡Nos encantaría saber de ti!
      </p>
    </div>
  );
};
