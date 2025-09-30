
import React from 'react';
import { AppStatus, ConversionResult } from '../types';
import { PresetCard } from './PresetCard';

interface ResultsDisplayProps {
    status: AppStatus;
    results: ConversionResult[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ status, results }) => {
    if (status === 'idle') {
        return null;
    }

    if (status === 'converting' && results.length === 0) {
        return (
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-cyan mx-auto"></div>
                <p className="mt-4 text-xl font-display">Initiating Alchemy...</p>
            </div>
        );
    }
    
    return (
        <div className="mt-12">
             <h2 className="text-3xl font-display text-center mb-8 text-brand-cyan">Conversion Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {results.map(result => (
                    <PresetCard key={result.id} result={result} />
                ))}
            </div>
        </div>
    );
};
