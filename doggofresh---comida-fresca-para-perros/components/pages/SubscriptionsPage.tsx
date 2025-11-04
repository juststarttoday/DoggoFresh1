import React, { useState, useEffect, useContext } from 'react';
import type { Page } from '../../App';
import type { Subscription } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { getSubscriptions, updateSubscription } from '../../services/firestoreService';

interface SubscriptionsPageProps {
  setCurrentPage: (page: Page) => void;
}

const PRICE_PER_MEAL = 4.285; 
const WEEKS_IN_MONTH = 4.33;

export const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({ setCurrentPage }) => {
  const { user } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editedMeals, setEditedMeals] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      const fetchSubs = async () => {
        setIsLoading(true);
        const userSubs = await getSubscriptions(user.id);
        setSubscriptions(userSubs);
        setIsLoading(false);
      };
      fetchSubs();
    }
  }, [user]);

  const calculatePrice = (meals: number) => {
    return (meals * PRICE_PER_MEAL).toFixed(2);
  };

  const calculateMonthlyPrice = (meals: number) => {
    const weeklyPrice = parseFloat(calculatePrice(meals));
    return (weeklyPrice * WEEKS_IN_MONTH).toFixed(2);
  };

  const handleModify = (sub: Subscription) => {
    setEditingSubId(sub.id);
    setEditedMeals(sub.mealsPerWeek);
  };

  const handleCancelEdit = () => {
    setEditingSubId(null);
  };

  const handleSave = async (subId: string) => {
    if (!user) return;
    
    const originalSub = subscriptions.find(s => s.id === subId);
    if (!originalSub) return;

    const newPrice = parseFloat(calculatePrice(editedMeals));
    const updatedSubData = { 
        ...originalSub, 
        mealsPerWeek: editedMeals, 
        price: newPrice 
    };
    
    await updateSubscription(user.id, subId, updatedSubData);
    
    setSubscriptions(subs => subs.map(s => s.id === subId ? updatedSubData : s));
    setEditingSubId(null);
  };

  const handleFeedback = (subId: string) => {
    // In a real app, this would trigger an API call to change the next delivery's recipe
    setFeedbackGiven(prev => new Set(prev).add(subId));
  };

  const handleCancelSubscription = async (subId: string) => {
     if (!user) return;

     const originalSub = subscriptions.find(s => s.id === subId);
     if (!originalSub) return;

     const updatedSubData = { ...originalSub, status: 'Cancelada' as const };

     await updateSubscription(user.id, subId, updatedSubData);

     setSubscriptions(subs => subs.map(s => s.id === subId ? updatedSubData : s));

     if (editingSubId === subId) {
        setEditingSubId(null);
    }
  };

  if (isLoading) {
    return (
        <div className="container mx-auto py-16 px-4 text-center">
            <p>Cargando tus suscripciones...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-brown mb-8">Mis Suscripciones</h1>
        
        {subscriptions.length > 0 ? (
            <div className="space-y-6">
                {subscriptions.map(sub => (
                    <div key={sub.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-serif text-brand-green">{sub.planName}</h2>
                                    <p className="text-gray-600 font-semibold">Para: {sub.petName}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    sub.status === 'Activa' ? 'bg-green-100 text-green-800' :
                                    sub.status === 'Cancelada' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {sub.status}
                                </span>
                            </div>

                            <div className="mt-4 border-t pt-4">
                                <p className="text-gray-700"><strong>Comidas por semana:</strong> {editingSubId === sub.id ? editedMeals : sub.mealsPerWeek}</p>
                                <p className="text-gray-700"><strong>Próxima entrega:</strong> {sub.nextDelivery}</p>
                                <p className="text-gray-700"><strong>Precio semanal:</strong> ${sub.price.toFixed(2)}</p>
                                {editingSubId === sub.id && (
                                    <p className="text-gray-700 font-bold mt-2"><strong>Nuevo Precio semanal:</strong> <span className="text-brand-green">${calculatePrice(editedMeals)}</span></p>
                                )}
                            </div>

                            {editingSubId === sub.id && (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ajustar comidas por semana: <span className="font-bold text-brand-green">{editedMeals}</span></label>
                                        <input 
                                            type="range" 
                                            min="4" 
                                            max="14" 
                                            step="2" 
                                            value={editedMeals}
                                            onChange={(e) => setEditedMeals(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>4</span>
                                            <span>14</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-dashed">
                                        <p className="text-lg font-semibold text-brand-brown">Próximo cargo mensual estimado: <span className="text-2xl font-bold text-brand-green">${calculateMonthlyPrice(editedMeals)}</span></p>
                                    </div>
                                </div>
                            )}
                            
                            {sub.status === 'Activa' && (
                                <div className="mt-6 border-t pt-4">
                                    {feedbackGiven.has(sub.id) ? (
                                        <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
                                            <p className="font-semibold">¡Entendido! Barriga contenta, corazón feliz.</p>
                                            <p className="text-sm">Enviaremos una nueva combinación de sabores para {sub.petName} en el próximo pedido.</p>
                                        </div>
                                    ) : editingSubId === sub.id ? (
                                        <div className="flex gap-4">
                                            <button onClick={() => handleSave(sub.id)} className="bg-brand-green text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90">Guardar Cambios</button>
                                            <button onClick={handleCancelEdit} className="bg-gray-200 text-brand-brown font-semibold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-4 items-center">
                                            <button onClick={() => handleModify(sub)} className="text-sm bg-brand-green text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                                                Modificar Plan
                                            </button>
                                            <button onClick={() => handleFeedback(sub.id)} className="text-sm bg-gray-100 text-brand-brown font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                                                A mi perro no le gustó
                                            </button>
                                            <button onClick={() => handleCancelSubscription(sub.id)} className="text-sm text-red-600 hover:underline ml-auto font-semibold">
                                                Cancelar Suscripción
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Aún no tienes suscripciones activas.</p>
                <p className="text-gray-500 text-sm mt-1">Crea un plan personalizado para empezar.</p>
            </div>
        )}

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