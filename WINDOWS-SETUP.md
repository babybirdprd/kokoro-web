# Running Kokoro Web on Windows Without Docker

This guide will help you set up and run Kokoro Web on Windows without using Docker or WSL.

## Prerequisites

1. **Install Node.js**:
   - Download and install the latest LTS version of Node.js from [nodejs.org](https://nodejs.org/)
   - Make sure to check the option to install necessary tools during installation

2. **Install pnpm**:
   - Open PowerShell as Administrator and run:
   ```
   npm install -g pnpm
   ```

3. **Install FFmpeg**:
   - Download the FFmpeg build for Windows from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) (get the "ffmpeg-git-full.7z" package)
   - Extract the archive to a location like `C:\ffmpeg`
   - Add the `C:\ffmpeg\bin` directory to your system PATH:
     - Right-click on "This PC" > Properties > Advanced system settings > Environment Variables
     - Under "System variables", find the "Path" variable, select it and click "Edit"
     - Click "New" and add the path to the bin directory (e.g., `C:\ffmpeg\bin`)
     - Click "OK" to close all dialogs

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/eduardolat/kokoro-web.git
   cd kokoro-web
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Create a `.env` file in the root directory with your configuration:
   ```
   # Kokoro Web Environment Variables

   # API Key for authentication
   # This is your own API key for accessing Kokoro Web's API functionalities.
   # Ensure this key is kept secure and not shared publicly.
   # If left blank, authentication will not be activated.
   KW_SECRET_API_KEY=your-secret-key-here

   # Optional
   # Set to 'true' to opt out of analytics
   # Default is 'false'
   KW_PUBLIC_NO_TRACK=true
   ```

## Building and Running

### Option 1: Using the Windows Batch File

1. Build the application using the provided batch file:
   ```
   build-windows.bat
   ```

2. Start the application:
   ```
   node build/index.js
   ```

### Option 2: Using npm Scripts

1. Build the application:
   ```
   pnpm run build:windows
   ```

2. Start the application:
   ```
   node build/index.js
   ```

### Development Mode

If you want to run the application in development mode (with hot reloading):

```
pnpm run dev
```

## Accessing the Application

- Web UI: http://localhost:3000
- API Documentation: http://localhost:3000/api/v1/index.html

## API Documentation

For detailed information about the OpenAI-compatible API, please refer to the [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) file. This documentation includes:

- Available endpoints
- Request and response formats
- Available models and voices
- Example code in JavaScript and Python
- Error handling

## Using the OpenAI-Compatible API

You can use the Kokoro TTS API as a drop-in replacement for OpenAI's text-to-speech API. Here's an example in JavaScript:

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'http://localhost:3000/api/v1',
  apiKey: 'your-secret-key-here', // Use the same key you set in .env
});

const mp3 = await openai.audio.speech.create({
  model: "model_q8f16",
  voice: "af_bella", // Available voices: af_bella, af_sarah, am_adam, am_michael, bf_emma, bf_isabella, bm_george, bm_lewis, af_nicole, af_sky
  input: "Hello, this is a test of Kokoro TTS!",
});

// Save or play the audio as needed
```

## Troubleshooting

1. **FFmpeg Issues**: Make sure FFmpeg is correctly installed and added to your PATH.

2. **Node.js Version**: Ensure you're using a compatible Node.js version (v16 or higher).

3. **Port Conflicts**: If port 3000 is already in use, you can modify the port in the start command:
   ```
   set PORT=3001 && node build/index.js
   ```

4. **Build Errors**: If you encounter build errors, try running the commands manually:
   ```
   if exist build rmdir /s /q build
   node ./scripts/generate-openapi.mjs
   npx vite build
   ```

5. **Missing Dependencies**: If you encounter errors about missing dependencies, try running `pnpm install` again.

## Creating a Windows Service (Optional)

To run kokoro-web as a Windows service, you can use a tool like [nssm (Non-Sucking Service Manager)](https://nssm.cc/):

1. Download and extract nssm
2. Open Command Prompt as Administrator
3. Navigate to the nssm directory
4. Run: `nssm install KokoroTTS`
5. In the dialog that appears:
   - Set the Path to: `C:\Program Files\nodejs\node.exe` (or wherever node.exe is installed)
   - Set Arguments to: `build/index.js`
   - Set Startup directory to: the full path to your kokoro-web directory
   - Configure other options as needed
6. Click "Install service"

This will create a Windows service that starts automatically when your computer boots. 