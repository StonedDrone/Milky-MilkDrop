import React from 'react';
import { ConversionResult } from '../types';

interface PresetCardProps {
    result: ConversionResult;
}

const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const CodeViewer: React.FC<{ code: string; language: string }> = ({ code, language }) => (
    <pre className="bg-slate-900/70 p-4 rounded-b-md text-sm text-slate-200 overflow-x-auto max-h-96">
        <code className={`language-${language}`}>{code}</code>
    </pre>
);

const Loader: React.FC = () => (
    <div className="flex items-center justify-center h-full min-h-[200px] bg-slate-800/50 rounded-b-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
    </div>
);


export const PresetCard: React.FC<PresetCardProps> = ({ result }) => {
    const renderContent = () => {
        if (result.error) {
            return <div className="p-4 bg-red-800 text-white text-sm">{result.error}</div>
        }
        if (result.json) {
            return <CodeViewer code={result.json} language="json" />;
        }
        return <Loader />;
    };

    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg shadow-black/30">
            <div className="p-4 bg-slate-900 flex justify-between items-center">
                <h3 className="font-display font-bold text-lg text-brand-cyan truncate">{result.presetName}</h3>
                <div>
                    {result.json && (
                        <button 
                            onClick={() => downloadFile(result.json!, `${result.presetName}.json`, 'application/json')} 
                            className="text-sm bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded font-bold"
                        >
                            Download .json
                        </button>
                    )}
                </div>
            </div>
            
            <div className="p-1 bg-slate-700/50">
                {renderContent()}
            </div>
        </div>
    );
};