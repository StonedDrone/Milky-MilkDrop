import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateGLSL(presetName: string): Promise<string> {
    const prompt = `You are a MilkDrop to GLSL conversion expert specializing in audio-reactive shaders. Given the MilkDrop preset name "${presetName}", generate a plausible GLSL fragment shader (.frag) that captures its visual essence and reacts to audio input.

The shader MUST include the following uniforms for audio reactivity:
- uniform float audio_level; // Overall audio volume (0.0 to 1.0)
- uniform vec3 audio_spectrum[256]; // Audio frequency data (x=bass, y=mids, z=treble)

The shader should also include standard uniforms:
- uniform float time;
- uniform vec2 resolution;
- uniform sampler2D tex_prev_frame;

The generated GLSL code must:
1. Utilize 'audio_level' and 'audio_spectrum' to create dynamic, audio-reactive visual effects (e.g., pulsing, color changes, movement based on bass/treble).
2. Be well-commented, with specific comments explaining how the audio uniforms are being used and how a developer could further integrate them.
3. Be abstract, colorful, and dynamic.
4. The output must be ONLY the GLSL code block, without any additional explanation or markdown formatting.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating GLSL:", error);
        throw new Error("Failed to generate GLSL shader.");
    }
}

export async function generateJSON(presetName: string, author: string): Promise<string> {
    const prompt = `You are a metadata generator. For a MilkDrop preset named "${presetName}" by "${author}", create a JSON object containing its metadata. The JSON should include "presetName", "author", and a "parameters" object with at least 5 plausible-looking parameters (like "decay", "gamma", "wave_speed", "blur_amount", "hue_shift") and their corresponding float values between 0.0 and 1.0. The output must be only the raw JSON string, without any surrounding markdown.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        // Let's ensure the response is a clean JSON string, even if Gemini adds ```json
        const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.stringify(JSON.parse(cleanText), null, 2);
    } catch (error) {
        console.error("Error generating JSON:", error);
        throw new Error("Failed to generate JSON metadata.");
    }
}

export async function generateImagePreview(presetName: string, type: 'video' | 'webp'): Promise<string> {
    const prompt = type === 'video' 
        ? `Generate a high-quality, visually stunning image that represents a MilkDrop music visualization for a preset called "${presetName}". The image should be abstract, colorful, psychedelic, and dynamic, capturing the essence of audio-reactive visuals. Focus on flowing colors, geometric patterns, and a sense of motion. A dark background is preferred.`
        : `Generate a simple, abstract, looping animated visual that could be a WebP or GIF. The style should be inspired by MilkDrop visualizations for a preset named "${presetName}". It should be visually interesting but lightweight. A single, clear frame representing the animation is sufficient.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error(`Error generating ${type} preview:`, error);
        throw new Error(`Failed to generate ${type} preview.`);
    }
}