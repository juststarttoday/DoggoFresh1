
import React, { useState } from 'react';
import type { GenerateContentResponse } from "@google/genai";
import { findNearbyPlaces } from '../services/geminiService';

export const MapSearch: React.FC = () => {
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState<{ latitude: number, longitude: number} | null>(null);

    const handleFindVets = () => {
        setIsLoading(true);
        setError('');
        setResponse(null);

        if(!location) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    fetchVets({ latitude, longitude });
                },
                () => {
                    setError('No se pudo obtener tu ubicación. Por favor, activa los permisos de geolocalización en tu navegador.');
                    setIsLoading(false);
                }
            );
        } else {
             fetchVets(location);
        }
    };

    const fetchVets = async (coords: { latitude: number, longitude: number}) => {
         try {
            const res = await findNearbyPlaces('Veterinarias y clínicas para mascotas cerca de mí en Quito', coords);
            setResponse(res);
        } catch (err) {
            setError('Hubo un error al buscar veterinarias. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }
    
    const places = response?.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.maps).filter(Boolean);

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-brand-green">Encuentra Veterinarias en Quito</h3>
            <p className="mb-6 text-gray-600">Encuentra clínicas veterinarias cercanas a ti con la ayuda de Google Maps y Gemini.</p>
            <button
                onClick={handleFindVets}
                disabled={isLoading}
                className="bg-brand-green text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-transform transform hover:scale-105"
            >
                {isLoading ? 'Buscando...' : 'Buscar Veterinarias Cercanas'}
            </button>

            <div className="mt-6">
                {error && <p className="text-center text-red-500">{error}</p>}
                {response && (
                    <div className="bg-gray-50 p-6 rounded-lg text-left">
                        <div className="prose max-w-none text-brand-brown mb-4">{response.text}</div>
                        {places && places.length > 0 && (
                            <div>
                                <h4 className="font-bold text-sm text-gray-500 border-t pt-4">LUGARES ENCONTRADOS:</h4>
                                <ul className="mt-2 space-y-2">
                                    {places.map((place, index) => (
                                        <li key={index} className="text-sm p-2 bg-white rounded shadow">
                                            <a href={place.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                                                {place.title || 'Ver en Google Maps'}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
