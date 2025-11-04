import React, { useState } from 'react';
import { AITool } from '../types';
import { ImageAnalyzer } from './ImageAnalyzer';
import { VideoAnalyzer } from './VideoAnalyzer';
import { GroundedSearch } from './GroundedSearch';
import { MapSearch } from './MapSearch';
import { ImageIcon } from './icons/ImageIcon';
import { VideoIcon } from './icons/VideoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { MapIcon } from './icons/MapIcon';


const toolIcons: { [key in AITool]: React.ReactNode } = {
  [AITool.ImageAnalyzer]: <ImageIcon className="h-5 w-5 mr-2" />,
  [AITool.VideoAnalyzer]: <VideoIcon className="h-5 w-5 mr-2" />,
  [AITool.NutritionQA]: <SearchIcon className="h-5 w-5 mr-2" />,
  [AITool.VetFinder]: <MapIcon className="h-5 w-5 mr-2" />,
};


export const AITools: React.FC = () => {
    const [activeTool, setActiveTool] = useState<AITool>(AITool.ImageAnalyzer);

    const renderTool = () => {
        switch (activeTool) {
            case AITool.ImageAnalyzer:
                return <ImageAnalyzer />;
            case AITool.VideoAnalyzer:
                return <VideoAnalyzer />;
            case AITool.NutritionQA:
                return <GroundedSearch />;
            case AITool.VetFinder:
                return <MapSearch />;
            default:
                return null;
        }
    };
    
    return (
        <section className="py-24 px-4 bg-gray-50">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-5xl font-serif text-center text-brand-brown mb-12">Herramientas IA para tu Mascota</h2>
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {Object.values(AITool).map(tool => (
                        <button
                            key={tool}
                            onClick={() => setActiveTool(tool)}
                            className={`flex items-center px-5 py-2 text-sm sm:text-base font-semibold rounded-md transition-colors duration-300 ${activeTool === tool ? 'bg-brand-green text-white shadow-md' : 'bg-white text-brand-brown hover:bg-gray-200 border border-gray-200'}`}
                        >
                           {toolIcons[tool]}
                           {tool}
                        </button>
                    ))}
                </div>
                <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg min-h-[400px]">
                    {renderTool()}
                </div>
            </div>
        </section>
    );
};
