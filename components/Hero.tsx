import React from 'react';

interface HeroProps {
  onStartQuiz: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartQuiz }) => {
  return (
    <section className="py-24 sm:py-32 px-4 bg-brand-cream">
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown leading-tight mb-6">
            Comida Real Para Tu Mejor Amigo.
          </h1>
          <p className="text-lg text-gray-700 mb-10 max-w-lg mx-auto md:mx-0">
            Planes de alimentación personalizados, creados por expertos y entregados en tu puerta en Quito. Nutrición superior, conveniencia total.
          </p>
          <button
            onClick={onStartQuiz}
            className="bg-brand-green hover:bg-opacity-90 text-white font-semibold uppercase tracking-widest py-4 px-10 rounded-md text-base transition duration-300 shadow-lg"
          >
            Crear Plan
          </button>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1559190394-df5a28aab5c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Perro feliz comiendo"
            className="rounded-lg shadow-2xl w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};