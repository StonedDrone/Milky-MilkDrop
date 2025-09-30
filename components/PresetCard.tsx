
import React, { useState } from 'react';
import { ConversionResult, OutputFormat } from '../types';

interface PresetCardProps {
    result: ConversionResult;
}

type Tab = 'preview' | 'glsl' | 'json';

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
    <pre className="bg-slate-900/70 p-4 rounded-b-md text-sm text-slate-200 overflow-x-auto max-h-80">
        <code className={`language-${language}`}>{code}</code>
    </pre>
);

const Loader: React.FC = () => (
    <div className="flex items-center justify-center h-full min-h-[200px] bg-slate-800/50 rounded-b-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
    </div>
);


export const PresetCard: React.FC<PresetCardProps> = ({ result }) => {
    const [activeTab, setActiveTab] = useState<Tab>('preview');

    const renderContent = () => {
        switch (activeTab) {
            case 'preview':
                const imageUrl = result.videoUrl || result.webpUrl;
                return imageUrl ? (
                     <img src={imageUrl} alt={`${result.presetName} preview`} className="w-full h-auto object-cover rounded-b-md" />
                ) : (
                    <Loader />
                );
            case 'glsl':
                return result.glsl ? <CodeViewer code={result.glsl} language="glsl" /> : <Loader />;
            case 'json':
                return result.json ? <CodeViewer code={result.json} language="json" /> : <Loader />;
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{ tabId: Tab, children: React.ReactNode }> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === tabId
                    ? 'bg-brand-purple text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg shadow-black/30">
            <div className="p-4 bg-slate-900 flex justify-between items-center">
                <h3 className="font-display font-bold text-lg text-brand-cyan truncate">{result.presetName}</h3>
                <div className="flex gap-2">
                    {result.glsl && <button onClick={() => downloadFile(result.glsl!, `${result.presetName}.frag`, 'text/plain')} className="text-xs bg-cyan-600 hover:bg-cyan-500 px-2 py-1 rounded">.frag</button>}
                    {result.json && <button onClick={() => downloadFile(result.json!, `${result.presetName}.json`, 'application/json')} className="text-xs bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded">.json</button>}
                    {result.videoUrl && <a href={result.videoUrl} download={`${result.presetName}.jpeg`} className="text-xs bg-pink-600 hover:bg-pink-500 px-2 py-1 rounded">.mp4*</a>}
                    {result.webpUrl && <a href={result.webpUrl} download={`${result.presetName}.jpeg`} className="text-xs bg-green-600 hover:bg-green-500 px-2 py-1 rounded">.webp*</a>}
                </div>
            </div>
            {result.error && <div className="p-4 bg-red-800 text-white text-sm">{result.error}</div>}
            
            <div className="flex bg-slate-700/50">
                 {(result.videoUrl || result.webpUrl) && <TabButton tabId="preview">Preview</TabButton>}
                 {result.glsl !== undefined && <TabButton tabId="glsl">GLSL</TabButton>}
                 {result.json !== undefined && <TabButton tabId="json">JSON</TabButton>}
            </div>
            
            <div className="p-1 bg-slate-700/50">
                {renderContent()}
            </div>
             <p className="text-right text-xs text-slate-500 p-2">*Video/WebP downloads are representative JPEGs.</p>
        </div>
    );
};
