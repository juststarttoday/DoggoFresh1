
import React, { useState } from 'react';
import { Chatbot } from './Chatbot';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { CloseIcon } from './icons/CloseIcon';

export const FloatingChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 w-full max-w-sm h-[65vh] max-h-[550px] flex flex-col bg-white rounded-lg shadow-2xl z-50 transform transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <div className="flex justify-between items-center p-3 bg-brand-green text-white rounded-t-lg flex-shrink-0">
                    <h3 className="font-bold text-lg">Habla con Paco</h3>
                    <button onClick={toggleChat} aria-label="Cerrar chat" className="p-1 rounded-full hover:bg-green-700 transition-colors">
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-4 flex-grow overflow-hidden">
                    <Chatbot />
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-brand-green text-white p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-transform transform hover:scale-110 z-40"
                aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
            >
                <div className="transition-transform duration-300 ease-in-out">
                    {isOpen ? <CloseIcon className="h-8 w-8" /> : <ChatBubbleIcon className="h-8 w-8" />}
                </div>
            </button>
        </>
    );
};
