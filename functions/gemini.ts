


import { GoogleGenAI, GenerateContentResponse, Chat, Type, Content } from "https://aistudiocdn.com/@google/genai@^1.28.0";
import type { DogProfile, MealPlan } from '../types';

// This interface defines the expected environment variables for the function.
// Cloudflare Workers provides these via the 'env' parameter.
interface Env {
    API_KEY: string;
}

// FIX: Define the PagesFunction type locally to resolve the TypeScript error for Cloudflare Pages Functions.
type PagesFunction<E = unknown> = (context: {
    request: Request;
    env: E;
}) => Response | Promise<Response>;

// This is the main handler for the serverless function.
// It's an async function that receives the request and environment variables.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        // Initialize the Google AI client securely on the server with the API key from environment variables.
        const ai = new GoogleGenAI({ apiKey: env.API_KEY });
        
        // Parse the JSON body from the incoming request.
        const body = await request.json();
        const { action } = body;

        // Use a switch statement to handle different actions requested by the client.
        switch (action) {
            case 'generateMealPlan': {
                const { profile } = body as { profile: DogProfile };
                
                const model = 'gemini-2.5-pro';
                const systemInstruction = `Eres un nutricionista canino experto de clase mundial. Tu tarea es crear un plan de alimentación personalizado para un servicio de suscripción llamado 'DoggoFresh' que prepara y entrega comida fresca para perros en Quito, Ecuador. El plan debe describir las comidas que DoggoFresh preparará y entregará. NO proporciones instrucciones de cocina para el usuario. Describe el plato final que recibirá. Utiliza ingredientes frescos y de alta calidad disponibles en Quito. El plan debe ser para una semana, con dos comidas al día (desayuno y cena). Para cada comida, describe los ingredientes principales y sus beneficios. La respuesta debe estar en español y seguir estrictamente el esquema JSON proporcionado.`;
                const prompt = `Datos del Perro: - Nombre: ${profile.name} - Edad: ${profile.age} años - Raza: ${profile.breed} - Peso: ${profile.weight} kg - Nivel de Actividad: ${profile.activityLevel} - Alergias/Condiciones: ${profile.allergies || 'Ninguna especificada'}. Por favor, genera el plan de alimentación personalizado en formato JSON.`;
                
                const responseSchema = {
                    type: Type.OBJECT,
                    properties: {
                        profileSummary: { type: Type.STRING, description: `Un resumen breve y amigable del perfil del perro ${profile.name}.` },
                        weeklyPlan: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.STRING }, breakfast: { type: Type.STRING }, dinner: { type: Type.STRING } } } },
                        nutritionalJustification: { type: Type.STRING },
                        additionalTips: { type: Type.STRING }
                    },
                    required: ["profileSummary", "weeklyPlan", "nutritionalJustification", "additionalTips"]
                };

                const response = await ai.models.generateContent({
                    model,
                    contents: prompt,
                    config: { systemInstruction, thinkingConfig: { thinkingBudget: 32768 }, responseMimeType: "application/json", responseSchema }
                });
                
                const jsonText = response.text.trim();
                // We parse it here to ensure it's valid JSON before sending back.
                return new Response(JSON.stringify(JSON.parse(jsonText)), { headers: { 'Content-Type': 'application/json' } });
            }

            case 'getChatResponse': {
                // FIX: Destructure history from the request body to maintain conversation context.
                const { message, history } = body as { message: string, history: Content[] };
                 const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    // FIX: Pass the conversation history to the chat creation.
                    history: history,
                    config: { systemInstruction: "Eres 'Paco', el amigable y experto asistente de 'DoggoFresh', una startup de comida fresca para perros en Quito. Tu objetivo es responder preguntas de los usuarios sobre nuestros servicios, nutrición canina y el bienestar de sus mascotas. Sé amable, servicial y conciso en español. Si no sabes una respuesta, amablemente di que consultarás con el equipo de nutricionistas. No inventes información médica. Mantén el tono de la marca: natural, confiable y moderno." }
                });
                // FIX: Send the new message to the stateful chat session.
                // The chat.sendMessage method expects an object with a `message` property, not a plain string.
                const response = await chat.sendMessage({ message });
                return new Response(JSON.stringify({ text: response.text }), { headers: { 'Content-Type': 'application/json' } });
            }

            case 'analyzeImage': {
                const { base64Image, mimeType } = body as { base64Image: string, mimeType: string };
                const model = 'gemini-2.5-flash';
                const prompt = "Analiza esta imagen de un perro. Describe brevemente su posible raza o mezcla de razas, su estado de ánimo aparente y cualquier característica física notable. Termina con un comentario positivo y amigable. Responde en no más de 3 frases y en español.";
                
                const imagePart = { inlineData: { data: base64Image, mimeType } };
                const textPart = { text: prompt };

                const response = await ai.models.generateContent({ model, contents: { parts: [imagePart, textPart] } });
                return new Response(JSON.stringify({ text: response.text }), { headers: { 'Content-Type': 'application/json' } });
            }
            
            case 'analyzeVideo': {
                const { base64Video, mimeType } = body as { base64Video: string, mimeType: string };
                 const model = 'gemini-2.5-pro';
                 const prompt = "Analiza este breve video de un perro. Observa su movimiento, nivel de energía y comportamiento general. Proporciona un breve resumen de tus observaciones sobre su posible estado de agilidad y actividad. No des diagnósticos médicos. Tu análisis debe ser general y positivo. Por ejemplo: 'Este perro parece tener mucha energía y se mueve con agilidad, ¡ideal para juegos al aire libre!'. Responde en español.";
                 
                 const videoPart = { inlineData: { data: base64Video, mimeType } };
                 const textPart = { text: prompt };

                 const response = await ai.models.generateContent({ model, contents: { parts: [videoPart, textPart] } });
                 return new Response(JSON.stringify({ text: response.text }), { headers: { 'Content-Type': 'application/json' } });
            }

            case 'searchWithGrounding': {
                 const { query } = body as { query: string };
                 const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `En español: ${query}`,
                    config: { tools: [{googleSearch: {}}] },
                });
                // The entire response object needs to be sent back for grounding chunks
                 return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
            }

            case 'findNearbyPlaces': {
                 const { query, location } = body as { query: string, location: { latitude: number, longitude: number } };
                 const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: query,
                    config: {
                        tools: [{googleMaps: {}}],
                        toolConfig: { retrievalConfig: { latLng: location } }
                    },
                });
                // The entire response object needs to be sent back for map chunks
                 return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
            }

            default:
                return new Response(JSON.stringify({ error: 'Acción no válida' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error) {
        // Log the error on the server for debugging purposes.
        console.error('Error in serverless function:', error);
        
        // Return a generic error message to the client.
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error en el servidor.';
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};