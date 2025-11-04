
import React, { useState } from 'react';
import type { GenerateContentResponse } from "@google/genai";
import { searchWithGrounding } from '../services/geminiService';

export const GroundedSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError('');
        setResponse(null);
        try {
            const res = await searchWithGrounding(`En español: ${query}`);
            setResponse(res);
        } catch (err) {
            setError('Hubo un error al realizar la búsqueda. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const sources = response?.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter(Boolean);

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 text-brand-green text-center">Preguntas de Nutrición</h3>
            <p className="mb-4 text-gray-600 text-center">¿Tienes dudas sobre la alimentación canina? Pregúntale a nuestra IA, que utiliza Google Search para darte la información más reciente.</p>
            
            <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm rounded-r-lg">
                <strong>Aviso:</strong> La información proporcionada por la IA es para fines informativos y puede contener errores. Consulta siempre a un veterinario profesional para cualquier decisión sobre la salud de tu mascota.
            </div>

            <div className="flex">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ej: ¿Los perros pueden comer arándanos?"
                    className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white text-brand-brown"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-brand-green text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                >
                    Buscar
                </button>
            </div>

            <div className="mt-6">
                {isLoading && <p className="text-center text-brand-brown animate-pulse">Buscando la mejor respuesta...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {response && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="prose max-w-none text-brand-brown">{response.text}</div>
                        {sources && sources.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-bold text-sm text-gray-500 border-t pt-4">FUENTES:</h4>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    {sources.map((source, index) => (
                                        <li key={index} className="text-sm">
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {source.title || source.uri}
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
