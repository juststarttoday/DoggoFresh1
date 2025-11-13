import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import type { Pet } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { getPets, addPet, updatePet, deletePet } from '../../services/firestoreService';

export const PetsPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petFormData, setPetFormData] = useState<Omit<Pet, 'id'>>({ name: '', breed: '', age: 0, weight: 0 });

  useEffect(() => {
    if (user) {
      const fetchPets = async () => {
        setIsLoading(true);
        const userPets = await getPets(user.id);
        setPets(userPets);
        setIsLoading(false);
      };
      fetchPets();
    }
  }, [user]);

  const handleEdit = (pet: Pet) => {
    setEditingPetId(pet.id);
    setPetFormData(pet);
  };

  const handleAddNew = () => {
      setPetFormData({ name: '', breed: '', age: 0, weight: 0 });
      setIsAdding(true);
  }

  const handleCancel = () => {
    setEditingPetId(null);
    setIsAdding(false);
    setPetFormData({ name: '', breed: '', age: 0, weight: 0 });
  };

  const handleSave = async () => {
    if (!user || !petFormData) return;
    
    setIsSubmitting(true);
    if (editingPetId) {
      await updatePet(user.id, editingPetId, petFormData as Pet);
    } else if (isAdding) {
      await addPet(user.id, petFormData);
    }
    
    const userPets = await getPets(user.id);
    setPets(userPets);
    setIsSubmitting(false);
    handleCancel();
  };

  const handleDelete = async (petId: string) => {
      if (!user) return;
      if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
        setIsSubmitting(true);
        await deletePet(user.id, petId);
        const userPets = await getPets(user.id);
        setPets(userPets);
        setIsSubmitting(false);
      }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!petFormData) return;
    const { name, value } = e.target;
    const parsedValue = name === 'age' || name === 'weight' ? parseInt(value, 10) || 0 : value;
    setPetFormData({ ...petFormData, [name]: parsedValue });
  };

  const renderForm = () => (
     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
        <div className="space-y-4">
            <h2 className="text-2xl font-serif text-brand-green mb-2">{isAdding ? 'Añadir Nueva Mascota' : `Editando a ${petFormData.name}`}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" name="name" value={petFormData.name} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Raza</label>
                    <input type="text" name="breed" value={petFormData.breed} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Edad (años)</label>
                    <input type="number" name="age" value={petFormData.age} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                    <input type="number" name="weight" value={petFormData.weight} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                </div>
            </div>
            <div className="flex gap-4 pt-4">
                <button onClick={handleSave} disabled={isSubmitting} className="bg-brand-green text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 disabled:opacity-50">
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button onClick={handleCancel} className="bg-gray-200 text-brand-brown font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-brown">Mis Mascotas</h1>
            {!isAdding && !editingPetId && (
                <button onClick={handleAddNew} className="bg-brand-green text-white font-semibold py-2 px-5 rounded-md hover:bg-opacity-90">
                    Añadir Mascota
                </button>
            )}
        </div>
        
        {isLoading ? (
            <p>Cargando mascotas...</p>
        ) : isAdding || editingPetId ? (
            renderForm()
        ) : (
            <div className="space-y-6">
                {pets.length > 0 ? pets.map(pet => (
                    <div key={pet.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div>
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-serif text-brand-green mb-2">{pet.name}</h2>
                                <div className="flex gap-4">
                                    <button onClick={() => handleEdit(pet)} className="text-sm font-semibold text-brand-green hover:underline">Editar</button>
                                    <button onClick={() => handleDelete(pet.id)} disabled={isSubmitting} className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50">Eliminar</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
                                <p><strong>Raza:</strong> {pet.breed}</p>
                                <p><strong>Edad:</strong> {pet.age} años</p>
                                <p><strong>Peso:</strong> {pet.weight} kg</p>
                            </div>
                        </div>
                    </div>
                )) : (
                     <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No tienes mascotas registradas.</p>
                        <p className="text-gray-500 text-sm mt-1">¡Añade a tu primera mascota para empezar!</p>
                    </div>
                )}
            </div>
        )}

        <Link
          to="/account"
          className="mt-12 inline-block bg-gray-200 text-brand-brown font-semibold uppercase tracking-widest py-3 px-8 rounded-md text-sm transition duration-300 hover:bg-gray-300"
        >
          Volver al Panel
        </Link>
      </div>
    </div>
  );
};