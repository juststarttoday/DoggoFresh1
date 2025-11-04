
import React from 'react';
import { ClipboardIcon } from '../icons/ClipboardIcon';
import { RecipeIcon } from '../icons/RecipeIcon';
import { ChefHatIcon } from '../icons/ChefHatIcon';
import { DeliveryTruckIcon } from '../icons/DeliveryTruckIcon';

interface WhatWeDoPageProps {
  onStartQuiz: () => void;
}

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center flex flex-col items-center">
    <div className="bg-brand-green text-white rounded-full p-4 mb-4 inline-flex">
      {icon}
    </div>
    <h3 className="text-xl font-serif text-brand-brown mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed flex-grow">{description}</p>
  </div>
);


export const WhatWeDoPage: React.FC<WhatWeDoPageProps> = ({ onStartQuiz }) => {
  return (
    <div className="bg-brand-cream">
      <div className="container mx-auto py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-6">La Receta de la Felicidad</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-12">
            En DoggoFresh, hemos simplificado la nutrición canina para que sea deliciosa, saludable y increíblemente fácil para ti. Transformamos ingredientes frescos y de grado humano en comidas personalizadas que a tu perro le encantarán, y las entregamos directamente en tu puerta en Quito.
          </p>
        </div>

        {/* How it works section */}
        <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif text-brand-brown text-center mb-12">Nuestro Proceso: 4 Pasos Hacia un Perro Más Feliz</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <Step 
                    icon={<ClipboardIcon className="h-8 w-8" />} 
                    title="1. Crea su Perfil"
                    description="Responde nuestro sencillo cuestionario en línea. Nos contarás todo sobre tu perro: su edad, raza, peso, nivel de actividad y cualquier necesidad especial. ¡Es el primer paso para conocer a nuestro nuevo mejor amigo!"
                />
                 <Step 
                    icon={<RecipeIcon className="h-8 w-8" />} 
                    title="2. Diseñamos su Plan"
                    description="Nuestro equipo de expertos analiza el perfil de tu perro para crear un plan de comidas perfectamente balanceado y porcionado, diseñado para satisfacer sus necesidades nutricionales únicas."
                />
                 <Step 
                    icon={<ChefHatIcon className="h-8 w-8" />} 
                    title="3. Cocinamos con Amor"
                    description="En nuestra cocina, preparamos las comidas en lotes pequeños, utilizando solo ingredientes frescos y naturales. Cocinamos suavemente para preservar los nutrientes y maximizar el sabor. ¡Sin conservantes ni rellenos!"
                />
                 <Step 
                    icon={<DeliveryTruckIcon className="h-8 w-8" />} 
                    title="4. Entregamos en tu Puerta"
                    description="Empacamos las comidas en porciones convenientes y las entregamos congeladas en tu casa en Quito, en un horario flexible que se adapta a tu vida. Solo descongela y sirve."
                />
            </div>
        </div>
        
        {/* Ingredients section */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto mt-16 sm:mt-24">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-serif text-brand-brown mb-6">Ingredientes en los que Puedes Confiar</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Creemos que si no es lo suficientemente bueno para que nosotros lo comamos, tampoco lo es para ellos. Por eso, todas nuestras recetas utilizan ingredientes de grado humano, provenientes de proveedores locales siempre que es posible.
            </p>
             <p className="text-gray-700 leading-relaxed font-semibold">
              Pollo real, carne de res magra, vegetales frescos y granos saludables. Es simple, es real, es bueno.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.pexels.com/photos/128402/pexels-photo-128402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Ingredientes frescos como vegetales y carne sobre una tabla de cortar"
              className="rounded-lg shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mt-16 sm:mt-24">
            <h2 className="text-4xl font-serif text-brand-brown mb-6">¿Listo para ver la diferencia que hace la comida real?</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
             Dale a tu perro la nutrición que se merece. Comienza creando su perfil y descubre el plan perfecto para él.
            </p>
            <button
                onClick={onStartQuiz}
                className="bg-brand-green hover:bg-opacity-90 text-white font-semibold uppercase tracking-widest py-4 px-10 rounded-md text-base transition duration-300 shadow-lg"
              >
                Crear un Plan
            </button>
        </div>

      </div>
    </div>
  );
};