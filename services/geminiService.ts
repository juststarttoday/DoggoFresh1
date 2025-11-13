
import type { GenerateContentResponse } from "@google/genai";
import type { DogProfile, MealPlan } from '../types';

// Helper function to call our secure serverless function
async function callApi(action: string, payload: object): Promise<any> {
    try {
        const response = await fetch('/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, ...payload }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `Server responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error calling API for action '${action}':`, error);
        throw error;
    }
}


export async function generateMealPlan(profile: DogProfile): Promise<MealPlan> {
    try {
        const result = await callApi('generateMealPlan', { profile });
        return result as MealPlan;
    } catch (error) {
         throw new Error("Hubo un error al generar el plan de comidas. Por favor, inténtalo de nuevo.");
    }
}

export async function getChatResponse(message: string, history: any[]): Promise<string> {
    try {
        const result = await callApi('getChatResponse', { message, history });
        return result.text;
    } catch (error) {
        return "Lo siento, estoy teniendo problemas para conectarme. Intenta de nuevo en un momento.";
    }
}


export async function analyzeImage(base64Image: string, mimeType: string): Promise<string> {
    try {
        const result = await callApi('analyzeImage', { base64Image, mimeType });
        return result.text;
    } catch (error) {
        return "No pude analizar la imagen. Por favor, asegúrate de que sea una imagen válida.";
    }
}

export async function analyzeVideo(base64Video: string, mimeType: string): Promise<string> {
     try {
        const result = await callApi('analyzeVideo', { base64Video, mimeType });
        return result.text;
    } catch (error) {
        return "No pude analizar el video. Por favor, intenta con un video más corto o en otro formato.";
    }
}


export async function searchWithGrounding(query: string): Promise<GenerateContentResponse> {
    try {
        const result = await callApi('searchWithGrounding', { query });
        return result as GenerateContentResponse;
    } catch (error) {
         throw new Error("Hubo un error al realizar la búsqueda. Intenta de nuevo.");
    }
}

export async function findNearbyPlaces(query: string, location: { latitude: number, longitude: number }): Promise<GenerateContentResponse> {
    try {
        const result = await callApi('findNearbyPlaces', { query, location });
        return result as GenerateContentResponse;
    } catch (error) {
         throw new Error("Hubo un error al buscar veterinarias. Intenta de nuevo.");
    }
}
