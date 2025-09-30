export interface PresetFile {
  id: string;
  file: File;
}

export interface ConversionResult {
  id: string;
  presetName: string;
  json?: string;
  error?: string;
}

export type AppStatus = 'idle' | 'converting' | 'done';
