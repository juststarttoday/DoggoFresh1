

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';
import { HeartIcon } from './icons/HeartIcon';
import { UserIcon } from './icons/UserIcon';

export const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: '¡Hola! Soy Paco, tu asistente de DoggoFresh. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: ChatMessage = { sender: 'user', text: input };

        // Prepare history for the API call from the current state.
        // It should not include the initial greeting from the AI.
        const historyForAPI = messages.slice(1).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // FIX: Pass both the new message (input) and the conversation history to the chat service.
        const aiResponseText = await getChatResponse(input, historyForAPI);
        const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow bg-gray-50 p-4 rounded-lg overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 my-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="bg-brand-green p-2 rounded-full text-white flex-shrink-0"><HeartIcon className="h-5 w-5" /></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.sender === 'user' ? 'bg-white border border-gray-200 text-brand-brown' : 'bg-green-100 text-brand-brown'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                         {msg.sender === 'user' && <div className="bg-gray-200 p-2 rounded-full text-brand-brown flex-shrink-0"><UserIcon className="h-5 w-5" /></div>}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3 my-3 justify-start">
                        <div className="bg-brand-green p-2 rounded-full text-white flex-shrink-0"><HeartIcon className="h-5 w-5 animate-pulse" /></div>
                        <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-green-100 text-brand-brown">
                            <p className="text-sm">Paco está escribiendo...</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu pregunta..."
                    className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white text-brand-brown"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-brand-green text-white px-6 py-3 rounded-r-lg font-semibold uppercase tracking-wider text-sm hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};