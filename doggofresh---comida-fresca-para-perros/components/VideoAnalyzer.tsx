
import React, { useState } from 'react';
import { analyzeVideo } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

export const VideoAnalyzer: React.FC = () => {
    const [video, setVideo] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if(file.size > 20 * 1024 * 1024) { // 20MB limit
                setError('El archivo es muy grande. Por favor, sube un video de menos de 20MB.');
                return;
            }
            const videoUrl = URL.createObjectURL(file);
            setVideo(videoUrl);
            setAnalysis('');
            setError('');
            setIsLoading(true);
            try {
                const base64String = await toBase64(file);
                const result = await analyzeVideo(base64String, file.type);
                setAnalysis(result);
            } catch (err) {
                setError('Error al analizar el video. Intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-brand-green">Análisis de Comportamiento en Video</h3>
            <p className="mb-6 text-gray-600">Sube un video corto (máx 20MB) de tu perro jugando o caminando para un análisis de su actividad por Gemini Pro.</p>
            <div className="flex justify-center">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="mb-4 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-brand-green hover:file:bg-green-100"
                />
            </div>

            {isLoading && <p className="text-brand-brown animate-pulse">Analizando video... Esto puede tomar un momento.</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {video && (
                    <div className="flex justify-center">
                        <video src={video} controls className="rounded-lg shadow-md max-h-80" />
                    </div>
                )}
                {analysis && (
                    <div className="bg-green-50 p-6 rounded-lg border-l-4 border-brand-green">
                        <h4 className="font-bold text-lg mb-2 text-brand-brown flex items-center"><SparklesIcon className="h-6 w-6 mr-2 text-brand-green" /> Observaciones de la IA</h4>
                        <p className="text-brand-brown text-left">{analysis}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
