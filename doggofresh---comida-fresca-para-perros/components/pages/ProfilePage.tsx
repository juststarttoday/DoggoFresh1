import React, { useState, useEffect, useContext } from 'react';
import type { Page } from '../../App';
import type { Address } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../../services/firestoreService';

interface ProfilePageProps {
  setCurrentPage: (page: Page) => void;
}

const defaultAddress: Address = {
  street: '', city: '', details: '',
  latitude: -0.1762, longitude: -78.4844, // Default to Quito center
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ setCurrentPage }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState<Address>(defaultAddress);
  
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setIsLoading(true);
        const profile = await getUserProfile(user.id);
        if (profile) {
            setName(profile.name || user.name);
            setEmail(profile.email || user.email);
            setAddress(profile.address || defaultAddress);
        } else {
            // First time user, use context data
            setName(user.name);
            setEmail(user.email);
        }
        setIsLoading(false);
      }
      fetchProfile();
    }
  }, [user]);
  
  if (!user) return null;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("La geolocalización no es soportada por tu navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddress(prev => ({
          ...prev, latitude, longitude,
          street: `Ubicación precisa guardada.`, city: 'Ecuador',
          details: 'Puedes añadir detalles como casa o apto.'
        }));
        setLocationError('');
      },
      () => {
        setLocationError("No se pudo obtener tu ubicación. Por favor, revisa los permisos.");
      }
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    await updateUserProfile(user.id, { name, email, address });
    setIsSaving(false);
    setIsEditing(false);
  };
  
  const handleCancel = async () => {
    setIsEditing(false);
    // Refetch data to discard changes
    const profile = await getUserProfile(user.id);
    if (profile) {
      setName(profile.name || user.name);
      setEmail(profile.email || user.email);
      setAddress(profile.address || defaultAddress);
    }
  }

  const mapSrc = `https://maps.google.com/maps?q=${address.latitude},${address.longitude}&z=15&output=embed`;

  if (isLoading) {
      return (
          <div className="container mx-auto py-16 px-4 text-center">
              <p>Cargando tu perfil...</p>
          </div>
      );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-brown">Mis Datos</h1>
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="bg-brand-green text-white font-semibold py-2 px-5 rounded-md hover:bg-opacity-90">
                    Editar Datos
                </button>
            )}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-6">
            {isEditing ? (
                <>
                    <div>
                        <h2 className="text-2xl font-serif text-brand-green border-b pb-2 mb-4">Información de Contacto</h2>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h2 className="text-2xl font-serif text-brand-green border-b pb-2 mb-4">Dirección de Envío</h2>
                        <div className="space-y-4">
                            <button
                              onClick={handleGetLocation}
                              type="button"
                              className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                            >
                                Usar mi ubicación actual (GPS)
                            </button>
                             {locationError && <p className="text-red-500 text-sm">{locationError}</p>}
                            
                            {address.latitude && (
                                <div className="h-64 w-full rounded-lg overflow-hidden border">
                                    <iframe width="100%" height="100%" loading="lazy" allowFullScreen src={mapSrc}></iframe>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Calle Principal y Secundaria</label>
                                <input type="text" name="street" value={address.street} onChange={handleAddressChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                                <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Detalles Adicionales (Edificio, Apto.)</label>
                                <input type="text" name="details" value={address.details} onChange={handleAddressChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={handleSave} disabled={isSaving} className="bg-brand-green text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 disabled:opacity-50">
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button onClick={handleCancel} className="bg-gray-200 text-brand-brown font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <h2 className="text-2xl font-serif text-brand-green border-b pb-2 mb-4">Información de Contacto</h2>
                        <p className="text-gray-700"><strong>Nombre:</strong> {name}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {email}</p>
                    </div>
                     <div>
                        <h2 className="text-2xl font-serif text-brand-green border-b pb-2 mb-4">Dirección de Envío</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {address && (address.street || address.city) ? (
                                <div>
                                    <p className="text-gray-700">{address.street}</p>
                                    <p className="text-gray-700">{address.city}</p>
                                    <p className="text-gray-700">{address.details}</p>
                                </div>
                           ) : (
                               <p className="text-gray-500">Aún no has añadido una dirección.</p>
                           )}
                           {address?.latitude && (
                                <div className="h-48 w-full rounded-lg overflow-hidden border">
                                    <iframe width="100%" height="100%" loading="lazy" allowFullScreen src={mapSrc}></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>

        <button 
          onClick={() => setCurrentPage('account')}
          className="mt-12 bg-gray-200 text-brand-brown font-semibold uppercase tracking-widest py-3 px-8 rounded-md text-sm transition duration-300 hover:bg-gray-300"
        >
          Volver al Panel
        </button>
      </div>
    </div>
  );
};