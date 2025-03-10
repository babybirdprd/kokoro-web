@echo off
echo Removing build directory...
if exist build\ rmdir /s /q build

echo Running openapigen...
node ./scripts/generate-openapi.mjs

echo Running vite build...
npx vite build

echo Build completed successfully! 