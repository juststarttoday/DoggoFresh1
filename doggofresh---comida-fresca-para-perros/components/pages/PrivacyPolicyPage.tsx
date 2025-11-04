
import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-4xl mx-auto prose lg:prose-lg text-brand-brown">
        <h1 className="text-5xl font-serif text-brand-brown mb-8">Política de Privacidad y Tratamiento de Datos</h1>
        
        <h2>1. Introducción</h2>
        <p>
          Bienvenido a DoggoFresh. Nos comprometemos a proteger la privacidad de nuestros usuarios y sus mascotas. Esta política describe cómo recopilamos, usamos, y protegemos tu información personal y los datos de tu mascota cuando utilizas nuestro sitio web y servicios.
        </p>

        <h2>2. Información que Recopilamos</h2>
        <p>
          Recopilamos información para poder ofrecerte un plan de alimentación personalizado y mejorar nuestros servicios. Esto incluye:
        </p>
        <ul>
          <li><strong>Datos del Dueño:</strong> Nombre, dirección de correo electrónico, y en el futuro, dirección de entrega y datos de pago.</li>
          <li><strong>Datos de la Mascota:</strong> Nombre, edad, raza, peso, nivel de actividad, alergias, condiciones médicas, y fotos o documentos que decidas compartir.</li>
          <li><strong>Datos de Uso:</strong> Información sobre cómo interactúas con nuestro sitio web.</li>
        </ul>

        <h2>3. Cómo Usamos tu Información</h2>
        <p>
          Utilizamos la información recopilada para:
        </p>
        <ul>
            <li>Generar perfiles y planes de alimentación personalizados para tu mascota.</li>
            <li>Comunicarnos contigo sobre tu cuenta, nuestros servicios y ofertas especiales.</li>
            <li>Procesar futuras suscripciones y entregas.</li>
            <li>Mejorar nuestro sitio web y desarrollar nuevos productos y servicios.</li>
            <li>Cumplir con nuestras obligaciones legales.</li>
        </ul>

        <h2>4. Cómo Compartimos tu Información</h2>
        <p>
          No vendemos ni alquilamos tu información personal a terceros. Podemos compartir tu información con proveedores de servicios de confianza que nos ayudan a operar nuestro negocio (como procesadores de pago o servicios de entrega), siempre bajo estrictos acuerdos de confidencialidad.
        </p>

        <h2>5. Seguridad de los Datos</h2>
        <p>
          Tomamos medidas de seguridad razonables para proteger tu información contra el acceso no autorizado, la alteración o la destrucción. Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro.
        </p>

        <h2>6. Tus Derechos</h2>
        <p>
          Tienes derecho a acceder, corregir o eliminar tu información personal. Una vez que nuestro portal de cliente esté activo, podrás gestionar gran parte de esta información directamente. Mientras tanto, puedes contactarnos en [correo electrónico de contacto] para ejercer tus derechos.
        </p>

        <h2>7. Cambios a esta Política</h2>
        <p>
          Podemos actualizar esta política de privacidad de vez en cuando. Te notificaremos de cualquier cambio publicando la nueva política en esta página.
        </p>
        
        <p className="mt-8">
            <em>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
        </p>
      </div>
    </div>
  );
};
