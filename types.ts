
export interface PresetFile {
  id: string;
  file: File;
}

export interface ConversionOptions {
  glsl: boolean;
  json: boolean;
}

export interface ConversionResult {
  id: string;
  presetName: string;
  glsl?: string;
  json?: string;
  error?: string;
}

export type AppStatus = 'idle' | 'converting' | 'done';

export type OutputFormat = 'glsl' | 'json';