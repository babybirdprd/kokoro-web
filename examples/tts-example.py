#!/usr/bin/env python3
"""
Example of using Kokoro TTS API with OpenAI compatibility in Python
"""

import os
from pathlib import Path
from openai import OpenAI

# Configuration
API_BASE_URL = "http://localhost:3000/api/v1"
API_KEY = "your-secret-key-here"  # Use the same key you set in .env

# Create output directory if it doesn't exist
output_dir = Path(__file__).parent / "output"
output_dir.mkdir(exist_ok=True)

# Initialize OpenAI client with Kokoro TTS API
client = OpenAI(
    base_url=API_BASE_URL,
    api_key=API_KEY,
)

def generate_speech(text, voice, model, output_file):
    """Generate speech using Kokoro TTS API"""
    try:
        print(f"Generating speech with voice: {voice}")
        
        # Create full path for output file
        speech_file_path = output_dir / output_file
        
        # Generate speech
        response = client.audio.speech.create(
            model=model,
            voice=voice,
            input=text,
        )
        
        # Save to file
        response.stream_to_file(speech_file_path)
        print(f"Speech generated successfully and saved to {speech_file_path}")
        
        return speech_file_path
    
    except Exception as e:
        print(f"Error generating speech: {str(e)}")
        return None

def main():
    """Main function"""
    text = "Hello! This is a test of Kokoro TTS with an OpenAI-compatible API. It sounds quite natural, doesn't it?"
    
    # Generate speech with different voices
    generate_speech(text, "af_bella", "model_q8f16", "bella.mp3")
    generate_speech(text, "am_adam", "model_q8f16", "adam.mp3")
    generate_speech(text, "bf_emma", "model_q8f16", "emma.mp3")
    
    # Example of voice mixing
    generate_speech(
        "Voice mixing allows for creative combinations of different voices.",
        "af_bella*0.7+am_adam*0.3", 
        "model_q8f16", 
        "mixed_voice.mp3"
    )
    
    print("Done! Check the output directory for the generated audio files.")

if __name__ == "__main__":
    main() 