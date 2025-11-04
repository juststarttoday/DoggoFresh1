
import React, { useState } from 'react';
import type { DogProfile } from '../types';
import { generateMealPlan, analyzeImage } from '../services/geminiService';
import { saveQuizSubmission } from '../services/firestoreService';
import { SparklesIcon } from './icons/SparklesIcon';
import { SearchableDropdown } from './SearchableDropdown';
import { breeds } from './breeds';
import { ThankYouModal } from './ThankYouModal';

// Helper function to convert file to base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

interface PersonalizationQuizProps {
    onQuizComplete: () => void;
}

export const PersonalizationQuiz: React.FC<PersonalizationQuizProps> = ({ onQuizComplete }) => {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<DogProfile>({
        name: '', age: '', breed: '', weight: '', activityLevel: 'moderado', allergies: '', medicalDocs: undefined
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [lead, setLead] = useState({ name: '', email: '' });
    const [photoFileName, setPhotoFileName] = useState('');
    const [medicalDocFileName, setMedicalDocFileName] = useState('');
    const [photoAnalysis, setPhotoAnalysis] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showThankYouModal, setShowThankYouModal] = useState(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const handleBreedChange = (breed: string) => {
        setProfile(prev => ({ ...prev, breed }));
        if (validationErrors.breed) {
            setValidationErrors(prev => ({ ...prev, breed: '' }));
        }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFileName(file.name);
            setPhotoAnalysis('Analizando foto...');
            try {
                const base64String = await toBase64(file);
                setProfile(prev => ({ ...prev, photo: base64String }));
                const analysisResult = await analyzeImage(base64String, file.type);
                setPhotoAnalysis(analysisResult);
            } catch (err) {
                console.error(err);
                setPhotoAnalysis('No se pudo analizar la foto.');
            }
        }
    };

    const handleMedicalDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMedicalDocFileName(file.name);
            setProfile(prev => ({ ...prev, medicalDocs: file }));
        }
    };


    const validateStep1 = () => {
        const errors: Record<string, string> = {};
        if (!profile.name.trim()) errors.name = "El nombre es obligatorio.";
        if (!profile.age.trim()) errors.age = "La edad es obligatoria.";
        if (parseInt(profile.age, 10) < 0) errors.age = "La edad no puede ser negativa.";
        if (!profile.weight.trim()) errors.weight = "El peso es obligatorio.";
        if (parseInt(profile.weight, 10) <= 0) errors.weight = "El peso debe ser positivo.";
        if (!profile.breed) errors.breed = "Por favor, selecciona una raza.";
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (step === 1 && !validateStep1()) return;
        setStep(s => s < 3 ? s + 1 : s);
    };

    const prevStep = () => setStep(s => s > 1 ? s - 1 : s);

    const handleLeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLead({ ...lead, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lead.name.trim() || !lead.email.trim() || !lead.email.includes('@')) {
            setError('Por favor, completa tu nombre y un correo válido.');
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            // Await the submission to Firebase to catch potential errors.
            await saveQuizSubmission(lead, profile);
            
            // If submission is successful, show the thank you modal.
            setShowThankYouModal(true);
            
            // Start meal plan generation in the background.
            generateMealPlan(profile).catch(err => {
                console.error("Background meal plan generation failed:", err);
            });

        } catch (err) {
            console.error("Error saving quiz submission to Firebase:", err);
            setError("No se pudo guardar la información. Por favor, verifica que tu configuración de Firebase en 'services/firebase.ts' sea correcta.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowThankYouModal(false);
        onQuizComplete();
    };

    const totalSteps = 3;
    const progress = (step -1) / totalSteps * 100;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-3xl font-serif text-brand-brown mb-6 text-center">Cuéntanos sobre tu perro</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input type="text" name="name" value={profile.name} onChange={handleInputChange} placeholder="Ej: Rocky" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"/>
                                {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
                                    <input type="number" name="age" value={profile.age} onChange={handleInputChange} placeholder="Ej: 5" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"/>
                                    {validationErrors.age && <p className="text-red-500 text-sm mt-1">{validationErrors.age}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                                    <input type="number" name="weight" value={profile.weight} onChange={handleInputChange} placeholder="Ej: 12" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"/>
                                    {validationErrors.weight && <p className="text-red-500 text-sm mt-1">{validationErrors.weight}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                                <SearchableDropdown options={breeds} value={profile.breed} onChange={handleBreedChange} placeholder="Selecciona o busca una raza"/>
                                {validationErrors.breed && <p className="text-red-500 text-sm mt-1">{validationErrors.breed}</p>}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-3xl font-serif text-brand-brown mb-6 text-center">Un poco más de detalle</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Actividad</label>
                                <select name="activityLevel" value={profile.activityLevel} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white">
                                    <option value="sedentario">Sedentario (Paseos cortos, mucho descanso)</option>
                                    <option value="moderado">Moderado (Paseos diarios, algo de juego)</option>
                                    <option value="activo">Activo (Corre, juega intensamente a diario)</option>
                                    <option value="muy_activo">Muy Activo (Perro deportista o de trabajo)</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alergias Conocidas (opcional)</label>
                                <input type="text" name="allergies" value={profile.allergies} onChange={handleInputChange} placeholder="Ej: Pollo, granos..." className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sube una foto (opcional)</label>
                                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-brand-green hover:file:bg-green-100 cursor-pointer"/>
                                    {photoAnalysis && (
                                        <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                                            <SparklesIcon className="h-4 w-4 text-brand-green flex-shrink-0" /> 
                                            <span className="truncate">{photoAnalysis}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exámenes médicos (opcional)</label>
                                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleMedicalDocChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                                    {medicalDocFileName && <p className="mt-2 text-sm text-gray-600 truncate">Archivo: {medicalDocFileName}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                 return (
                    <div>
                        <h2 className="text-3xl font-serif text-brand-brown mb-6 text-center">¡Casi listo! Ahora tus datos</h2>
                         <p className="text-center text-gray-600 mb-6">Te avisaremos en cuanto lancemos y te enviaremos un cupón de descuento especial.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
                                <input type="text" name="name" value={lead.name} onChange={handleLeadChange} placeholder="Tu nombre completo" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white" required/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tu Correo Electrónico</label>
                                <input type="email" name="email" value={lead.email} onChange={handleLeadChange} placeholder="tu.correo@ejemplo.com" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white" required/>
                            </div>
                            {error && <p className="text-red-500 text-center">{error}</p>}
                        </form>
                    </div>
                );
        }
    };

    return (
        <>
        {showThankYouModal && <ThankYouModal email={lead.email} onClose={handleCloseModal} />}
        <section className="py-16 sm:py-24 bg-brand-cream">
            <div className="container mx-auto max-w-2xl px-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-12">
                     {step <= totalSteps && (
                        <div className="mb-8">
                            <div className="relative h-2 bg-gray-200 rounded-full">
                                <div 
                                    className="absolute top-0 left-0 h-2 bg-brand-green rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%`}}
                                ></div>
                            </div>
                            <p className="text-sm text-right mt-2 text-gray-500">Paso {step} de {totalSteps}</p>
                        </div>
                     )}

                    {renderStep()}

                    <div className={`mt-8 flex ${step === 1 ? 'justify-end' : 'justify-between'}`}>
                        {step > 1 && (
                            <button onClick={prevStep} className="bg-gray-200 text-brand-brown font-semibold uppercase tracking-widest py-3 px-8 rounded-md text-sm transition duration-300 hover:bg-gray-300">
                                Anterior
                            </button>
                        )}
                        {step < 3 ? (
                            <button onClick={nextStep} className="bg-brand-green hover:bg-opacity-90 text-white font-semibold uppercase tracking-widest py-3 px-8 rounded-md text-sm transition duration-300 shadow-lg">
                                Siguiente
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={isLoading} className="bg-brand-green hover:bg-opacity-90 text-white font-semibold uppercase tracking-widest py-3 px-8 rounded-md text-sm transition duration-300 shadow-lg disabled:opacity-50">
                                {isLoading ? 'Enviando...' : 'Finalizar'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
        </>
    );
};
