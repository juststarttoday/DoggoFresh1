
import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

export const ImageAnalyzer: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setAnalysis('');
            setError('');
            setIsLoading(true);
            try {
                const base64String = await toBase64(file);
                const result = await analyzeImage(base64String, file.type);
                setAnalysis(result);
            } catch (err) {
                setError('Error al analizar la imagen. Intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-brand-green">Analizador de Fotos con IA</h3>
            <p className="mb-6 text-gray-600">Sube una foto de tu perro y nuestra IA te dará una descripción amigable.</p>
            <div className="flex justify-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-brand-green hover:file:bg-green-100"
                />
            </div>

            {isLoading && <p className="text-brand-brown animate-pulse">Analizando...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {image && (
                    <div className="flex justify-center">
                        <img src={image} alt="Perro subido" className="rounded-lg shadow-md max-h-80" />
                    </div>
                )}
                {analysis && (
                    <div className="bg-green-50 p-6 rounded-lg border-l-4 border-brand-green">
                        <h4 className="font-bold text-lg mb-2 text-brand-brown flex items-center"><SparklesIcon className="h-6 w-6 mr-2 text-brand-green" /> Análisis de la IA</h4>
                        <p className="text-brand-brown text-left">{analysis}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
