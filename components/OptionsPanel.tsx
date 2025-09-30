
import React from 'react';
import { ConversionOptions, OutputFormat } from '../types';

interface OptionsPanelProps {
    options: ConversionOptions;
    setOptions: React.Dispatch<React.SetStateAction<ConversionOptions>>;
}

interface OptionConfig {
    key: OutputFormat;
    label: string;
    description: string;
}

const optionConfigs: OptionConfig[] = [
    { key: 'glsl', label: 'GLSL Shader (.frag)', description: 'For real-time rendering pipelines.' },
    { key: 'json', label: 'JSON Metadata (.json)', description: 'Preset name, author, and parameters.' },
    { key: 'video', label: 'Video Loop (.mp4)', description: 'High-quality loop for VJing or video.' },
    { key: 'webp', label: 'Lightweight Asset (.webp)', description: 'Small preview for thumbnails or overlays.' },
];

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ options, setOptions }) => {
    const handleToggle = (optionKey: keyof ConversionOptions) => {
        setOptions(prev => ({ ...prev, [optionKey]: !prev[optionKey] }));
    };

    return (
        <div className="space-y-4">
            {optionConfigs.map(config => (
                <div 
                    key={config.key} 
                    className="flex items-center justify-between bg-slate-800/70 p-4 rounded-md border border-slate-700"
                >
                    <div>
                        <p className="font-semibold text-white">{config.label}</p>
                        <p className="text-sm text-slate-400">{config.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={options[config.key]}
                            onChange={() => handleToggle(config.key)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-cyan peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                    </label>
                </div>
            ))}
        </div>
    );
};
