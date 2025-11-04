import React, { useState, useEffect, useContext } from 'react';
import type { Page } from '../../App';
import type { PaymentMethod } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '../../services/firestoreService';


interface BillingPageProps {
  setCurrentPage: (page: Page) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ setCurrentPage }) => {
  const { user } = useContext(AuthContext);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);
  const [methodFormData, setMethodFormData] = useState<Omit<PaymentMethod, 'id'>>({ type: 'Visa', last4: '', expiry: '' });

  useEffect(() => {
      if(user) {
          const fetchMethods = async () => {
              setIsLoading(true);
              const methods = await getPaymentMethods(user.id);
              setPaymentMethods(methods);
              setIsLoading(false);
          };
          fetchMethods();
      }
  }, [user]);

  const handleEdit = (pm: PaymentMethod) => {
    setEditingMethodId(pm.id);
    setMethodFormData(pm);
  };

  const handleAddNew = () => {
      setMethodFormData({ type: 'Visa', last4: '', expiry: '' });
      setIsAdding(true);
  }
  
  const handleCancel = () => {
    setEditingMethodId(null);
    setIsAdding(false);
    setMethodFormData({ type: 'Visa', last4: '', expiry: '' });
  };

  const handleSave = async () => {
    if (!user || !methodFormData) return;
    setIsSubmitting(true);
    if (editingMethodId) {
        await updatePaymentMethod(user.id, editingMethodId, methodFormData as PaymentMethod);
    } else if (isAdding) {
        await addPaymentMethod(user.id, methodFormData);
    }
    const methods = await getPaymentMethods(user.id);
    setPaymentMethods(methods);
    setIsSubmitting(false);
    handleCancel();
  };
  
  const handleDelete = async (pmId: string) => {
      if (!user) return;
      if (window.confirm("¿Estás seguro de que quieres eliminar este método de pago?")) {
        setIsSubmitting(true);
        await deletePaymentMethod(user.id, pmId);
        const methods = await getPaymentMethods(user.id);
        setPaymentMethods(methods);
        setIsSubmitting(false);
      }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!methodFormData) return;
    setMethodFormData({ ...methodFormData, [e.target.name]: e.target.value });
  };

  const renderForm = () => (
     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-brown">{isAdding ? 'Añadir Nuevo Método' : 'Editando Tarjeta'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                     <select name="type" value={methodFormData.type} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown">
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Últimos 4 dígitos</label>
                    <input type="text" name="last4" value={methodFormData.last4} onChange={handleInputChange} maxLength={4} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Expiración (MM/AA)</label>
                    <input type="text" name="expiry" value={methodFormData.expiry} placeholder="12/26" onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md bg-white text-brand-brown"/>
                </div>
            </div>
            <div className="flex gap-4 pt-4">
                <button onClick={handleSave} disabled={isSubmitting} className="bg-brand-green text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 disabled:opacity-50">
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
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
            <h1 className="text-4xl md:text-5xl font-serif text-brand-brown">Métodos de Pago</h1>
            {!isAdding && !editingMethodId && (
                <button onClick={handleAddNew} className="bg-brand-green text-white font-semibold py-2 px-5 rounded-md hover:bg-opacity-90">
                    Añadir Nuevo Método
                </button>
            )}
        </div>
        
        {isLoading ? (
            <p>Cargando métodos de pago...</p>
        ) : isAdding || editingMethodId ? (
            renderForm()
        ) : (
            <div className="space-y-6">
                {paymentMethods.length > 0 ? paymentMethods.map(pm => (
                    <div key={pm.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-brand-brown">{pm.type} terminada en {pm.last4}</h2>
                                <p className="text-gray-600">Expira: {pm.expiry}</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleEdit(pm)} className="text-sm font-semibold text-brand-green hover:underline">Editar</button>
                                <button onClick={() => handleDelete(pm.id)} disabled={isSubmitting} className="text-sm text-red-600 hover:underline disabled:opacity-50">Eliminar</button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No tienes métodos de pago guardados.</p>
                    </div>
                )}
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