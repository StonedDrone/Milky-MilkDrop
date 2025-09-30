
export interface PresetFile {
  id: string;
  file: File;
}

export interface ConversionOptions {
  glsl: boolean;
  json: boolean;
  video: boolean;
  webp: boolean;
}

export interface ConversionResult {
  id: string;
  presetName: string;
  glsl?: string;
  json?: string;
  videoUrl?: string; // base64 data URL
  webpUrl?: string; // base64 data URL
  error?: string;
}

export type AppStatus = 'idle' | 'converting' | 'done';

export type OutputFormat = 'glsl' | 'json' | 'video' | 'webp';
