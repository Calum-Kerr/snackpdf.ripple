const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const port = process.env.PORT || 3000;

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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = '/tmp/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
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
    
    // Use Ghostscript to get PDF info - simpler approach
    const command = `gs -q -dNOPAUSE -dBATCH -sDEVICE=nullpage "${filePath}" 2>&1 | grep -c "showpage" || gs -q -dNOPAUSE -dBATCH -sDEVICE=nullpage -c "(\\"${filePath}\\") (r) file runpdfbegin pdfpagecount = quit" 2>/dev/null || echo "1"`;

    try {
      const { stdout } = await execAsync(command);
      let pageCount = parseInt(stdout.trim()) || 1;

      // Fallback: if we can't get page count, assume 1 page for demo
      if (isNaN(pageCount) || pageCount <= 0) {
        pageCount = 1;
      }

      res.json({
        filename: req.file.originalname,
        size: req.file.size,
        pages: pageCount,
        tempPath: filePath
      });
    } catch (error) {
      console.error('Ghostscript error:', error);
      // Fallback response for demo purposes
      res.json({
        filename: req.file.originalname,
        size: req.file.size,
        pages: 1, // Default to 1 page if we can't determine
        tempPath: filePath
      });
    }
  } catch (error) {
    console.error('PDF info error:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

// Extract pages endpoint
app.post('/api/pdf/extract', async (req, res) => {
  try {
    const { tempPath, pages, filename } = req.body;
    
    if (!tempPath || !pages || !Array.isArray(pages)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Create output filename
    const outputDir = '/tmp/outputs';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFilename = filename.replace('.pdf', '_extracted.pdf');
    const outputPath = path.join(outputDir, `${Date.now()}-${outputFilename}`);
    
    // Convert page numbers to Ghostscript format
    const pageList = pages.join(',');
    
    // Use Ghostscript to extract pages
    const command = `gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -dFirstPage=${Math.min(...pages)} -dLastPage=${Math.max(...pages)} -sOutputFile="${outputPath}" "${tempPath}"`;
    
    try {
      await execAsync(command);
      
      // Check if output file was created
      if (fs.existsSync(outputPath)) {
        // Send file to client
        res.download(outputPath, outputFilename, (err) => {
          if (err) {
            console.error('Download error:', err);
          }
          
          // Clean up files
          setTimeout(() => {
            try {
              if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
              if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError);
            }
          }, 5000);
        });
      } else {
        res.status(500).json({ error: 'Failed to create extracted PDF' });
      }
    } catch (error) {
      console.error('Ghostscript extraction error:', error);
      res.status(500).json({ error: 'Failed to extract pages' });
    }
  } catch (error) {
    console.error('Extract pages error:', error);
    res.status(500).json({ error: 'Failed to process extraction request' });
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
