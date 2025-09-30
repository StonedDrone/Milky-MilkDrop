import React, { useState, useCallback } from 'react';
import { ConversionOptions, ConversionResult, PresetFile, AppStatus } from './types';
import { generateGLSL, generateJSON, generateImagePreview } from './services/geminiService';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { OptionsPanel } from './components/OptionsPanel';
import { ResultsDisplay } from './components/ResultsDisplay';

declare var JSZip: any;

const App: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<PresetFile[]>([]);
    const [conversionOptions, setConversionOptions] = useState<ConversionOptions>({
        glsl: true,
        json: true,
        video: true,
        webp: false,
    });
    const [status, setStatus] = useState<AppStatus>('idle');
    const [results, setResults] = useState<ConversionResult[]>([]);

    const handleFilesSelected = (files: File[]) => {
        const presetFiles = files
            .filter(file => file.name.endsWith('.milk'))
            .map(file => ({
                id: `${file.name}-${file.lastModified}`,
                file,
            }));
        setSelectedFiles(presetFiles);
        setResults([]);
        setStatus('idle');
    };

    const handleConvert = useCallback(async () => {
        if (selectedFiles.length === 0) return;
        setStatus('converting');
        setResults([]);

        const newResults: ConversionResult[] = selectedFiles.map(pf => ({
            id: pf.id,
            presetName: pf.file.name.replace('.milk', ''),
        }));
        setResults(newResults);

        for (const presetFile of selectedFiles) {
            const presetName = presetFile.file.name.replace('.milk', '');
            try {
                const promises = [];
                if (conversionOptions.glsl) {
                    promises.push(generateGLSL(presetName).then(glsl => ({ type: 'glsl', data: glsl })));
                }
                if (conversionOptions.json) {
                    promises.push(generateJSON(presetName, "AI Alchemist").then(json => ({ type: 'json', data: json })));
                }
                if (conversionOptions.video) {
                    promises.push(generateImagePreview(presetName, "video").then(img => ({ type: 'video', data: img })));
                }
                if (conversionOptions.webp) {
                     promises.push(generateImagePreview(presetName, "webp").then(img => ({ type: 'webp', data: img })));
                }

                const settledPromises = await Promise.allSettled(promises);
                
                setResults(prev => prev.map(r => {
                    if (r.id === presetFile.id) {
                        const updatedResult = { ...r };
                        settledPromises.forEach(p => {
                            if (p.status === 'fulfilled') {
                                const { type, data } = p.value;
                                if (type === 'glsl') updatedResult.glsl = data;
                                if (type === 'json') updatedResult.json = data;
                                if (type === 'video') updatedResult.videoUrl = data;
                                if (type === 'webp') updatedResult.webpUrl = data;
                            } else {
                                updatedResult.error = `Error generating asset: ${p.reason}`;
                            }
                        });
                        return updatedResult;
                    }
                    return r;
                }));

            } catch (error) {
                console.error(`Failed to convert ${presetName}:`, error);
                setResults(prev => prev.map(r => r.id === presetFile.id ? { ...r, error: 'A critical error occurred during conversion.' } : r));
            }
        }
        setStatus('done');
    }, [selectedFiles, conversionOptions]);

    const handleDownloadAll = useCallback(async () => {
        if (typeof JSZip === 'undefined') {
            alert('Could not create zip file. JSZip library not found.');
            return;
        }

        const zip = new JSZip();

        const dataURLtoBlob = (dataurl: string): Blob | null => {
            const arr = dataurl.split(',');
            if (arr.length < 2) return null;
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch) return null;
            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        };

        for (const result of results) {
            if (result.error) continue;

            const folder = zip.folder(result.presetName);
            if (!folder) continue;

            if (result.glsl) {
                folder.file(`${result.presetName}.frag`, result.glsl);
            }
            if (result.json) {
                folder.file(`${result.presetName}.json`, result.json);
            }
            if (result.videoUrl) {
                const blob = dataURLtoBlob(result.videoUrl);
                if (blob) folder.file(`${result.presetName}_video.jpeg`, blob);
            }
            if (result.webpUrl) {
                const blob = dataURLtoBlob(result.webpUrl);
                if (blob) folder.file(`${result.presetName}_webp.jpeg`, blob);
            }
        }

        zip.generateAsync({ type: 'blob' }).then(content => {
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'MilkDrop_Alchemy_Export.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }, [results]);

    return (
        <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />

                <main className="mt-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                             <h2 className="text-2xl font-display text-brand-cyan">1. Upload Presets</h2>
                            <FileUpload onFilesSelected={handleFilesSelected} />
                            {selectedFiles.length > 0 && (
                                <div className="text-slate-300">
                                    <h3 className="font-bold text-lg mb-2">Selected Files:</h3>
                                    <ul className="space-y-1 text-sm list-disc list-inside">
                                        {selectedFiles.map(f => <li key={f.id}>{f.file.name}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                             <h2 className="text-2xl font-display text-brand-cyan">2. Choose Outputs</h2>
                            <OptionsPanel options={conversionOptions} setOptions={setConversionOptions} />
                        </div>
                    </div>
                    
                    <div className="text-center flex justify-center items-center gap-4 flex-wrap">
                        <button
                            onClick={handleConvert}
                            disabled={selectedFiles.length === 0 || status === 'converting'}
                            className="font-display text-2xl font-bold px-12 py-4 rounded-md transition-all duration-300 ease-in-out
                                       bg-brand-purple text-white
                                       hover:bg-brand-pink hover:shadow-lg hover:shadow-brand-pink/50
                                       disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none
                                       animate-pulse-glow"
                        >
                            {status === 'converting' ? 'Summoning Visuals...' : 'Start Alchemy'}
                        </button>
                         {status === 'done' && results.some(r => !r.error && (r.glsl || r.json || r.videoUrl || r.webpUrl)) && (
                            <button
                                onClick={handleDownloadAll}
                                className="font-display text-xl font-bold px-8 py-3 rounded-md transition-all duration-300 ease-in-out
                                           bg-brand-cyan text-slate-900
                                           hover:bg-white hover:shadow-lg hover:shadow-brand-cyan/50"
                            >
                                Download All (.zip)
                            </button>
                        )}
                    </div>

                    <ResultsDisplay status={status} results={results} />
                </main>
            </div>
        </div>
    );
};

export default App;