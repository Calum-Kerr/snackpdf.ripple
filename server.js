const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');
const archiver = require('archiver');

const execAsync = promisify(exec);
const app = express();
const port = process.env.PORT || 3000;

// Use OS-appropriate temp directory
const tempDir = os.tmpdir();
const uploadDir = path.join(tempDir, 'snackpdf-uploads');
const outputDir = path.join(tempDir, 'snackpdf-outputs');

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created upload directory:', uploadDir);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('Created output directory:', outputDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Detect Ghostscript command (gs on Unix, gswin64c or gswin32c on Windows)
let gsCommand = 'gs';
try {
  const { execSync } = require('child_process');
  try {
    execSync('gs --version', { encoding: 'utf8' });
    gsCommand = 'gs';
    console.log('Using Ghostscript command: gs');
  } catch (e) {
    // Try Windows 64-bit version
    try {
      execSync('gswin64c --version', { encoding: 'utf8' });
      gsCommand = 'gswin64c';
      console.log('Using Ghostscript command: gswin64c');
    } catch (e2) {
      // Try Windows 32-bit version
      try {
        execSync('gswin32c --version', { encoding: 'utf8' });
        gsCommand = 'gswin32c';
        console.log('Using Ghostscript command: gswin32c');
      } catch (e3) {
        console.error('Ghostscript not found. Please install Ghostscript from https://ghostscript.com/releases/gsdnld.html');
        console.error('Make sure to add Ghostscript to your system PATH during installation.');
      }
    }
  }
} catch (error) {
  console.error('Error detecting Ghostscript:', error.message);
}

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get PDF info endpoint
app.post('/api/pdf/info', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    const filePath = req.file.path;
    console.log('Processing PDF:', filePath, 'Size:', req.file.size, 'bytes');

    // Check if file exists and is readable
    try {
      const stats = fs.statSync(filePath);
      console.log('File stats:', { size: stats.size, mode: stats.mode.toString(8) });
    } catch (fileError) {
      console.error('File access error:', fileError);
      return res.status(500).json({ error: 'Cannot access uploaded file' });
    }

    // Use Ghostscript to count pages - properly escape path for Windows
    const escapedPath = filePath.replace(/\\/g, '/');
    const command = `${gsCommand} -q -dNOPAUSE -dBATCH -sDEVICE=nullpage -c "(${escapedPath}) (r) file runpdfbegin pdfpagecount = quit"`;

    try {
      const { stdout, stderr } = await execAsync(command);
      console.log('Ghostscript stdout:', stdout);
      if (stderr) console.log('Ghostscript stderr:', stderr);

      let pageCount = parseInt(stdout.trim());

      // If the direct method fails, try alternative method
      if (isNaN(pageCount) || pageCount <= 0) {
        console.log('Trying alternative page count method...');
        const altCommand = `${gsCommand} -q -dNOPAUSE -dBATCH -sDEVICE=nullpage "${filePath}"`;
        try {
          await execAsync(altCommand);
          // If it processes without error, try to estimate pages
          const stats = require('fs').statSync(filePath);
          // Rough estimate: 1 page per 50KB (very rough approximation)
          pageCount = Math.max(1, Math.ceil(stats.size / 51200));
          console.log('Estimated page count based on file size:', pageCount);
        } catch (altError) {
          console.log('Alternative method also failed, defaulting to 1 page');
          pageCount = 1;
        }
      }

      console.log('Final page count:', pageCount);

      res.json({
        filename: req.file.originalname,
        size: req.file.size,
        pages: pageCount,
        tempPath: filePath
      });
    } catch (error) {
      console.error('Ghostscript error:', error);
      // Try one more fallback - just return a reasonable default
      const stats = require('fs').statSync(filePath);
      const estimatedPages = Math.max(1, Math.ceil(stats.size / 51200));

      res.json({
        filename: req.file.originalname,
        size: req.file.size,
        pages: estimatedPages,
        tempPath: filePath
      });
    }
  } catch (error) {
    console.error('PDF info error:', error);
    res.status(500).json({ error: 'Failed to process PDF: ' + error.message });
  }
});

// Helper function to merge adjacent or overlapping ranges
function mergeRanges(ranges) {
  if (ranges.length <= 1) return ranges;

  // Sort ranges by start page
  const sorted = [...ranges].sort((a, b) => a.from - b.from);

  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    // Check if current range overlaps or is adjacent to the last merged range
    // Adjacent means: current.from <= last.to + 1
    if (current.from <= last.to + 1) {
      // Merge: extend the last range to include current range
      last.to = Math.max(last.to, current.to);
    } else {
      // No overlap or adjacency: keep as separate range
      merged.push(current);
    }
  }

  return merged;
}

// Extract pages endpoint - now supports multiple ranges as separate files
app.post('/api/pdf/extract', async (req, res) => {
  try {
    const { tempPath, ranges, filename } = req.body;

    if (!tempPath || !ranges || !Array.isArray(ranges)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Verify the temp file exists
    if (!fs.existsSync(tempPath)) {
      console.error('Temp file not found:', tempPath);
      return res.status(400).json({ error: 'PDF file not found. Please upload the file again.' });
    }

    console.log('Extracting', ranges.length, 'range(s) from', tempPath);

    const extractedFiles = [];
    const timestamp = Date.now();

    try {
      // Smart merge: try to merge adjacent or overlapping ranges
      const mergedRanges = mergeRanges(ranges);
      console.log('After merging:', mergedRanges.length, 'range(s)');

      // Process each range separately
      for (let rangeIndex = 0; rangeIndex < mergedRanges.length; rangeIndex++) {
        const range = mergedRanges[rangeIndex];
        const pages = [];

        // Generate page numbers for this range
        for (let i = range.from; i <= range.to; i++) {
          pages.push(i);
        }

        console.log(`Range ${rangeIndex + 1}: Pages ${range.from}-${range.to} (${pages.length} pages)`);

        // Create output filename for this range
        const rangeFilename = filename.replace('.pdf', `_pages_${range.from}-${range.to}.pdf`);
        const outputPath = path.join(outputDir, `${timestamp}-range${rangeIndex}-${rangeFilename}`);

        // Check if pages are contiguous
        const sortedPages = [...pages].sort((a, b) => a - b);
        const isContiguous = sortedPages.every((page, index) =>
          index === 0 || page === sortedPages[index - 1] + 1
        );

        let command;

        if (isContiguous && sortedPages.length > 0) {
          // For contiguous pages, use simple FirstPage/LastPage approach
          const firstPage = sortedPages[0];
          const lastPage = sortedPages[sortedPages.length - 1];
          command = `${gsCommand} -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -dFirstPage=${firstPage} -dLastPage=${lastPage} -sOutputFile="${outputPath}" "${tempPath}"`;
          await execAsync(command);
        } else {
          // For non-contiguous pages, extract each page separately and merge
          const tempPagesDir = path.join(outputDir, `temp-${timestamp}-range${rangeIndex}`);
          fs.mkdirSync(tempPagesDir, { recursive: true });

          const tempPageFiles = [];

          // Extract each page individually
          for (let i = 0; i < sortedPages.length; i++) {
            const pageNum = sortedPages[i];
            const tempPagePath = path.join(tempPagesDir, `page-${i}.pdf`);
            const extractCmd = `${gsCommand} -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -dFirstPage=${pageNum} -dLastPage=${pageNum} -sOutputFile="${tempPagePath}" "${tempPath}"`;

            await execAsync(extractCmd);
            tempPageFiles.push(tempPagePath);
          }

          // Merge all extracted pages into one PDF
          const fileList = tempPageFiles.map(f => `"${f}"`).join(' ');
          command = `${gsCommand} -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -sOutputFile="${outputPath}" ${fileList}`;
          await execAsync(command);

          // Clean up temporary page files
          tempPageFiles.forEach(file => {
            try {
              if (fs.existsSync(file)) fs.unlinkSync(file);
            } catch (e) {
              console.error('Error deleting temp page file:', e);
            }
          });

          // Remove temp directory
          try {
            fs.rmdirSync(tempPagesDir);
          } catch (e) {
            console.error('Error removing temp directory:', e);
          }
        }

        // Verify the file was created
        if (fs.existsSync(outputPath)) {
          extractedFiles.push({
            path: outputPath,
            name: rangeFilename
          });
          console.log(`Range ${rangeIndex + 1} extracted successfully:`, outputPath);
        } else {
          throw new Error(`Failed to create PDF for range ${rangeIndex + 1}`);
        }
      }

      // If only one range, send the single PDF
      if (extractedFiles.length === 1) {
        const file = extractedFiles[0];
        res.download(file.path, file.name, (err) => {
          if (err) {
            console.error('Download error:', err);
          }

          // Clean up files
          setTimeout(() => {
            try {
              if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
              if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError);
            }
          }, 5000);
        });
      } else {
        // Multiple ranges - create a zip file
        const zipFilename = filename.replace('.pdf', '_extracted.zip');
        const zipPath = path.join(outputDir, `${timestamp}-${zipFilename}`);

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
          zlib: { level: 9 }
        });

        output.on('close', () => {
          console.log('Zip file created:', zipPath, '(' + archive.pointer() + ' bytes)');

          // Send zip file to client
          res.download(zipPath, zipFilename, (err) => {
            if (err) {
              console.error('Download error:', err);
            }

            // Clean up files
            setTimeout(() => {
              try {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
                extractedFiles.forEach(file => {
                  if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                });
              } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
              }
            }, 5000);
          });
        });

        archive.on('error', (err) => {
          throw err;
        });

        archive.pipe(output);

        // Add all extracted PDFs to the zip
        extractedFiles.forEach(file => {
          archive.file(file.path, { name: file.name });
        });

        await archive.finalize();
      }
    } catch (error) {
      console.error('Extraction error:', error);
      res.status(500).json({ error: 'Failed to extract pages: ' + error.message });
    }
  } catch (error) {
    console.error('Extract pages error:', error);
    res.status(500).json({ error: 'Failed to process extraction request: ' + error.message });
  }
});

// Cleanup endpoint for temporary files
app.delete('/api/cleanup/:tempPath', (req, res) => {
  try {
    const tempPath = decodeURIComponent(req.params.tempPath);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Failed to cleanup file' });
  }
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`SnackPDF server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
