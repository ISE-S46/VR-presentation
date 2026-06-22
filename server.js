import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

// Import API handlers
import gptHandler from './api/gpt.js';
import sttHandler from './api/stt.js';
import ttsHandler from './api/tts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 20356;

// Middleware
app.use(cors());
// Parse JSON bodies except for STT which uses formidable
app.use((req, res, next) => {
  if (req.path === '/api/stt') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// API Routes
app.post('/api/gpt', (req, res) => gptHandler(req, res));
app.post('/api/stt', (req, res) => sttHandler(req, res));
app.post('/api/tts', (req, res) => ttsHandler(req, res));

// Admin Authentication Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'password';

  if (username === expectedUsername && password === expectedPassword) {
    return res.json({ success: true, token: 'admin-session-token' });
  }
  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// Admin Save Projects Endpoint
app.post('/api/projects', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-session-token') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }

  const { projects } = req.body;
  if (!Array.isArray(projects)) {
    return res.status(400).json({ success: false, message: 'Invalid projects data format' });
  }

  try {
    const dataString = JSON.stringify(projects, null, 2);
    
    // Save to public/projects.json (source code)
    const publicPath = path.join(__dirname, 'public', 'projects.json');
    await fs.writeFile(publicPath, dataString, 'utf8');

    // Save to dist/projects.json if dist directory exists (served output)
    const distPath = path.join(__dirname, 'dist', 'projects.json');
    try {
      await fs.writeFile(distPath, dataString, 'utf8');
    } catch (err) {
      // Ignore if dist doesn't exist yet
    }

    return res.json({ success: true, message: 'Projects saved successfully' });
  } catch (error) {
    console.error('Error saving projects:', error);
    return res.status(500).json({ success: false, message: 'Failed to write projects file to disk' });
  }
});

// Serve Static Files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
