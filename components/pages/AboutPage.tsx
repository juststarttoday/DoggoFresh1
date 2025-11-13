import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-brand-cream">
      <div className="container mx-auto py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-6">Nuestra Historia: Por Amor a los Perros</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-12">
            DoggoFresh nació de una cocina casera, una tonelada de amor y un Cocker Spaniel muy, pero muy terco. No somos una corporación gigante; somos amantes de los perros, igual que tú, que descubrimos que la mejor comida para nuestros compañeros no viene en una bolsa, sino en un plato preparado con ingredientes frescos y reales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-serif text-brand-green mb-4">El Dilema de un Paladar Exigente</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Todo comenzó con Milo, mi Springer Spaniel. A pesar de su tamaño, tenía el apetito de un pajarito. Probé todas las marcas de comida seca ("pepas") del mercado, desde las más económicas hasta las "súper premium". El resultado siempre era el mismo: olfateaba su plato y se alejaba con desinterés. Ver a mi perro sin ganas de comer era frustrante y preocupante. ¿Estaba enfermo? ¿Simplemente no le gustaba nada?
            </p>
            <h2 className="text-3xl font-serif text-brand-green mb-4 mt-8">La Solución Estaba en la Cocina</h2>
            <p className="text-gray-700 leading-relaxed">
              Desesperado, empecé a cocinar para él. Investigué, consulté con expertos y preparé lotes de comida con pollo, carne, arroz, camote y vegetales frescos. La transformación fue inmediata. Milo no solo limpió su plato, ¡lo lamió hasta dejarlo brillante! En el proceso, me di cuenta de dos cosas: cocinarle era más barato que muchas opciones comerciales y, sobre todo, era infinitamente más saludable. Su pelaje se volvió más brillante, su energía aumentó y se veía más feliz que nunca.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://cdn.pixabay.com/photo/2019/11/22/21/45/spaniel-4645837_1280.jpg" 
              alt="Un adorable Cocker Spaniel disfrutando al aire libre"
              className="rounded-lg shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center mt-16 sm:mt-24">
            <h2 className="text-4xl font-serif text-brand-brown mb-6">Nuestra Promesa: Comida Real para Amigos Reales</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
             Esa experiencia se convirtió en la misión de DoggoFresh. Todos sabemos que la comida altamente procesada no es buena para nuestra salud. Entonces, ¿por qué se la daríamos a los miembros más leales y cariñosos de nuestra familia? Nuestros perros merecen algo mejor que una bola seca y sin sabor día tras día.
            </p>
             <p className="text-xl font-semibold text-brand-brown mt-6 italic">
             Creemos que cada comida debe ser un momento de alegría y nutrición. Porque la vida es muy corta para comer feo.
            </p>
        </div>

      </div>
    </div>
  );
};