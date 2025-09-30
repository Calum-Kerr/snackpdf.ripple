# SnackPDF Setup Guide

## Prerequisites

### 1. Install Ghostscript (Required for PDF Processing)

Ghostscript is required for all PDF operations. Follow these steps:

#### Windows:
1. Go to https://ghostscript.com/releases/gsdnld.html
2. Download "Ghostscript 10.x.x for Windows (64 bit)" (or 32 bit if needed)
3. Run the installer
4. **Important**: During installation, note the installation directory (usually `C:\Program Files\gs\gs10.xx.x\bin`)
5. Add Ghostscript to your PATH:
   - Open "Environment Variables" (search in Windows)
   - Under "System Variables", find "Path" and click "Edit"
   - Click "New" and add the Ghostscript bin directory (e.g., `C:\Program Files\gs\gs10.02.1\bin`)
   - Click "OK" to save

#### macOS:
```bash
brew install ghostscript
```

#### Linux:
```bash
sudo apt-get install ghostscript  # Ubuntu/Debian
sudo yum install ghostscript      # CentOS/RHEL
```

### 2. Verify Ghostscript Installation

Open a **new** terminal/command prompt and run:
```bash
gs --version
```
or on Windows, try:
```bash
gswin64c --version
```

You should see the Ghostscript version number. If not, restart your computer and try again.

## Running the Application

### Development Mode (Two Terminals Required)

You need to run both the frontend (Vite) and backend (Express) servers:

#### Terminal 1 - Frontend (Vite Dev Server):
```bash
npm run dev
```
This runs on http://localhost:5173

#### Terminal 2 - Backend (Express Server):
```bash
npm run dev:server
```
This runs on http://localhost:3000

The Vite dev server is configured to proxy all `/api/*` requests to the Express server.

### Production Mode (Single Command)

Build and run the production version:
```bash
npm run build
npm start
```
This runs on http://localhost:3000

## Features

### Extract Pages Tool

The Extract Pages tool now supports:

1. **Single Range Extraction**: Extract a continuous range of pages (e.g., pages 5-10)
2. **Multiple Range Extraction**: Extract multiple non-contiguous ranges (e.g., pages 1-3, 10-15, 20-25)

#### How to Use:
1. Click on "Extract Pages" tool
2. Upload a PDF file
3. The first range (1 to total pages) is added automatically
4. Click "+ Add Another Range" to add more ranges
5. Adjust each range's from/to values
6. Remove unwanted ranges with the × button
7. Click "Extract Pages" to download the result

## Troubleshooting

### "Ghostscript not found" Error
- Make sure Ghostscript is installed
- Verify it's in your PATH by running `gs --version` or `gswin64c --version`
- Restart your terminal/command prompt after installation
- On Windows, you may need to restart your computer

### "Failed to load resource: 404" for /api/pdf/info
- Make sure the Express server is running (`npm run dev:server`)
- Check that it's running on port 3000
- Verify the Vite proxy is configured (should be automatic)

### "Temp file not found" Error
- This should be fixed now with the Windows path updates
- If it persists, check the server logs for the actual temp path being used

### Page Count is Wrong
- This can happen if Ghostscript has trouble reading the PDF
- The server will fall back to estimating based on file size
- Try re-uploading the PDF or using a different PDF

## Project Structure

```
snackpdf.ripple/
├── src/                    # Frontend source code
│   ├── components/         # UI components
│   │   └── ExtractPages.ts # Extract pages component
│   ├── styles/            # CSS styles
│   └── index.ts           # Entry point
├── server.js              # Express backend server
├── vite.config.ts         # Vite configuration (includes proxy)
└── package.json           # Dependencies and scripts
```

## Environment Variables

The server uses these environment variables (with defaults):
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (default: development)

## Notes

- The application uses OS-appropriate temp directories for file processing
- Uploaded files are automatically cleaned up after processing
- Maximum file size: 100MB
- Supported format: PDF only

