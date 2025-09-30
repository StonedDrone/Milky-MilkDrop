
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateGLSL(presetName: string): Promise<string> {
    const prompt = `You are a MilkDrop to GLSL conversion expert. Given the MilkDrop preset name "${presetName}", generate a plausible GLSL fragment shader (.frag) that captures its visual essence. The shader should be well-commented and ready to use. Include standard uniforms like 'uniform float time;', 'uniform vec2 resolution;', and 'uniform sampler2D tex_prev_frame;'. The output must be only the GLSL code block, without any explanation or markdown formatting. The visual should be abstract, colorful, and dynamic.`;

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
