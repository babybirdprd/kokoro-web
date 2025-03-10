# Kokoro TTS API Examples

This directory contains example scripts that demonstrate how to use the Kokoro TTS API with OpenAI compatibility.

## Prerequisites

Before running these examples, make sure:

1. Kokoro TTS is running on your local machine (see [WINDOWS-SETUP.md](../WINDOWS-SETUP.md))
2. You have set the correct API key in the example scripts (the same key as in your `.env` file)

## JavaScript Example

The `tts-example.js` file demonstrates how to use the Kokoro TTS API with JavaScript and the OpenAI client library.

### Running the JavaScript Example

1. Install dependencies:
   ```
   npm install openai
   ```

2. Run the example:
   ```
   node tts-example.js
   ```

## Python Example

The `tts-example.py` file demonstrates how to use the Kokoro TTS API with Python and the OpenAI client library.

### Running the Python Example

1. Install dependencies:
   ```
   pip install openai
   ```

2. Run the example:
   ```
   python tts-example.py
   ```

## What These Examples Demonstrate

1. **Basic Text-to-Speech**: Converting text to speech using different voices
2. **Voice Mixing**: Combining multiple voices with different weights
3. **Error Handling**: Proper error handling for API requests
4. **File Management**: Saving the generated audio to files

## Output

The examples will create an `output` directory containing the generated audio files:
- `bella.mp3`: Speech using the "Bella" voice (American English, Female)
- `adam.mp3`: Speech using the "Adam" voice (American English, Male)
- `emma.mp3`: Speech using the "Emma" voice (British English, Female)
- `mixed_voice.mp3`: Speech using a mix of "Bella" and "Adam" voices

## Further Information

For more details about the API, please refer to the [API-DOCUMENTATION.md](../API-DOCUMENTATION.md) file. 