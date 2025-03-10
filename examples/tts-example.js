// Example of using Kokoro TTS API with OpenAI compatibility
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_BASE_URL = "http://localhost:3000/api/v1";
const API_KEY = "your-secret-key-here"; // Use the same key you set in .env

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Initialize OpenAI client with Kokoro TTS API
const openai = new OpenAI({
    baseURL: API_BASE_URL,
    apiKey: API_KEY,
});

// Function to generate speech
async function generateSpeech(text, voice, model, outputFile) {
    try {
        console.log(`Generating speech with voice: ${voice}`);

        const mp3 = await openai.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        const filePath = path.join(outputDir, outputFile);

        await fs.promises.writeFile(filePath, buffer);
        console.log(`Speech generated successfully and saved to ${filePath}`);

        return filePath;
    } catch (error) {
        console.error("Error generating speech:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        return null;
    }
}

// Main function
async function main() {
    const text = "Hello! This is a test of Kokoro TTS with an OpenAI-compatible API. It sounds quite natural, doesn't it?";

    // Generate speech with different voices
    await generateSpeech(text, "af_bella", "model_q8f16", "bella.mp3");
    await generateSpeech(text, "am_adam", "model_q8f16", "adam.mp3");
    await generateSpeech(text, "bf_emma", "model_q8f16", "emma.mp3");

    // Example of voice mixing
    await generateSpeech(
        "Voice mixing allows for creative combinations of different voices.",
        "af_bella*0.7+am_adam*0.3",
        "model_q8f16",
        "mixed_voice.mp3"
    );

    console.log("Done! Check the output directory for the generated audio files.");
}

// Run the main function
main().catch(console.error); 