# Kokoro TTS API Documentation

Kokoro Web provides an OpenAI-compatible API that works as a drop-in replacement for applications using OpenAI's text-to-speech service. This documentation outlines the available endpoints, request formats, and response structures.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Authentication is handled via Bearer token in the Authorization header:

```
Authorization: Bearer your-secret-key-here
```

The API key is configured in the `.env` file with the `KW_SECRET_API_KEY` variable. If this variable is left blank, authentication will not be activated.

## Endpoints

### 1. Generate Speech

Converts text to speech using the specified model and voice.

**Endpoint:** `POST /audio/speech`

**Request Body:**

```json
{
  "model": "model_q8f16",
  "voice": "af_bella",
  "input": "Hello, this is a test of Kokoro TTS!",
  "response_format": "mp3",
  "speed": 1.0
}
```

**Parameters:**

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| model | string | Yes | Model to use for synthesis | - |
| voice | string | Yes | Voice formula to use for synthesis | - |
| input | string | Yes | Text to convert to speech | - |
| response_format | string | No | Output format, either "mp3" or "wav" | "mp3" |
| speed | number | No | Speed of speech (0.25 to 5.0) | 1.0 |

**Voice Formula:**

The `voice` parameter accepts a voice formula that follows this pattern:
- Single voice: `"af_bella"`
- Voice with weight: `"af_bella*0.7"`
- Multiple voices: `"af_bella*0.7+am_adam*0.3"`

Rules:
- Voice IDs must be one of those returned by the voices endpoint
- Each weight must be a number between 0 and 1, rounded to the nearest 0.1
- If a single voice is provided without an asterisk, it is assumed to have weight 1
- The language of the first voice in the formula is used for the phonemizer

**Response:**

Binary audio data in the requested format (mp3 or wav).

**Example Usage (JavaScript):**

```javascript
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'http://localhost:3000/api/v1',
  apiKey: 'your-secret-key-here',
});
const speechFile = path.resolve("./speech.mp3");

const mp3 = await openai.audio.speech.create({
  model: "model_q8f16",
  voice: "af_bella",
  input: "Hello, this is a test of Kokoro TTS!",
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile(speechFile, buffer);
```

**Example Usage (Python):**

```python
from pathlib import Path
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3000/api/v1",
    api_key="your-secret-key-here",
)

speech_file_path = Path("./speech.mp3")
response = client.audio.speech.create(
    model="model_q8f16",
    voice="af_bella",
    input="Hello, this is a test of Kokoro TTS!",
)

response.stream_to_file(speech_file_path)
```

### 2. List Available Models

Returns a list of available models for speech synthesis.

**Endpoint:** `GET /audio/models`

**Response:**

```json
[
  {
    "id": "model",
    "quantization": "fp32",
    "size": "326 MB"
  },
  {
    "id": "model_q4",
    "quantization": "4-bit matmul",
    "size": "305 MB"
  },
  {
    "id": "model_uint8",
    "quantization": "8-bit & mixed precision",
    "size": "177 MB"
  },
  {
    "id": "model_fp16",
    "quantization": "fp16",
    "size": "163 MB"
  },
  {
    "id": "model_q4f16",
    "quantization": "4-bit matmul & fp16 weights",
    "size": "154 MB"
  },
  {
    "id": "model_uint8f16",
    "quantization": "Mixed precision",
    "size": "114 MB"
  },
  {
    "id": "model_quantized",
    "quantization": "8-bit",
    "size": "92.4 MB"
  },
  {
    "id": "model_q8f16",
    "quantization": "Mixed precision",
    "size": "86 MB"
  }
]
```

### 3. List Available Voices

Returns a list of available voices for speech synthesis.

**Endpoint:** `GET /audio/voices`

**Response:**

```json
[
  {
    "id": "af_heart",
    "name": "Heart",
    "gender": "Female",
    "targetQuality": "A",
    "overallGrade": "A",
    "lang": {
      "id": "en-us",
      "name": "English (US)"
    }
  },
  {
    "id": "af_bella",
    "name": "Bella",
    "gender": "Female",
    "targetQuality": "A",
    "overallGrade": "A-",
    "lang": {
      "id": "en-us",
      "name": "English (US)"
    }
  },
  // ... more voices
]
```

### 4. List Available Languages

Returns a list of available languages for speech synthesis.

**Endpoint:** `GET /audio/langs`

**Response:**

```json
[
  {
    "id": "en-us",
    "name": "English (US)"
  },
  {
    "id": "en-gb",
    "name": "English (GB)"
  },
  // ... more languages
]
```

### 5. Generate Text Phonemes

Converts text to phonemes for a specific language.

**Endpoint:** `POST /text/phonemize`

**Request Body:**

```json
{
  "lang": "en-us",
  "input": "Hello, world!"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lang | string | Yes | Language ID |
| input | string | Yes | Text to convert to phonemes |

**Response:**

```json
{
  "phonemes": "..."
}
```

## Available Models

Kokoro Web provides several models with different quantization levels and sizes:

| Model ID | Quantization | Size |
|----------|--------------|------|
| model | fp32 | 326 MB |
| model_q4 | 4-bit matmul | 305 MB |
| model_uint8 | 8-bit & mixed precision | 177 MB |
| model_fp16 | fp16 | 163 MB |
| model_q4f16 | 4-bit matmul & fp16 weights | 154 MB |
| model_uint8f16 | Mixed precision | 114 MB |
| model_quantized | 8-bit | 92.4 MB |
| model_q8f16 | Mixed precision | 86 MB |

For most use cases, `model_q8f16` provides a good balance between quality and size.

## Available Voices

Kokoro Web provides a wide range of voices across multiple languages. Here are some of the most commonly used voices:

### American English (en-us)

| Voice ID | Name | Gender | Quality |
|----------|------|--------|---------|
| af_bella | Bella | Female | A- |
| af_sarah | Sarah | Female | C+ |
| am_adam | Adam | Male | F+ |
| am_michael | Michael | Male | C+ |
| af_nicole | Nicole | Female | B- |
| af_sky | Sky | Female | C- |

### British English (en-gb)

| Voice ID | Name | Gender | Quality |
|----------|------|--------|---------|
| bf_emma | Emma | Female | B- |
| bf_isabella | Isabella | Female | C |
| bm_george | George | Male | C |
| bm_lewis | Lewis | Male | D+ |

Many other voices are available for languages including Spanish, Japanese, Chinese, Hindi, Italian, and Portuguese.

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid or missing API key)
- 500: Internal Server Error

Error responses include a message field with details about the error:

```json
{
  "message": "Validation error: Model not found, use one of: model, model_q4, model_uint8, model_fp16, model_q4f16, model_uint8f16, model_quantized, model_q8f16"
}
```

## OpenAI Compatibility

This API is designed to be a drop-in replacement for OpenAI's text-to-speech API. If you're already using OpenAI's API, you can switch to Kokoro TTS by simply changing the base URL and API key:

```javascript
// From OpenAI
const openai = new OpenAI({
  apiKey: 'your-openai-api-key',
});

// To Kokoro TTS
const openai = new OpenAI({
  baseURL: 'http://localhost:3000/api/v1',
  apiKey: 'your-kokoro-api-key',
});
```

The request and response formats are compatible, allowing for seamless integration with existing applications. 