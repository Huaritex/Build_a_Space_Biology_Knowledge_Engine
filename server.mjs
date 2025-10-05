import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Papers dataset endpoint (reads the existing hackaton JSON file)
app.get('/api/papers', async (_req, res) => {
  try {
    const datasetPath = path.join(__dirname, 'hackaton', 'nasa_publications_data.json');
    const raw = await fs.readFile(datasetPath, 'utf-8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (error) {
    console.error('Failed to load papers dataset:', error);
    res.status(500).json({ error: 'Failed to load papers dataset' });
  }
});

// Gemini endpoint
const apiKey = process.env.GEMINI_API_KEY;
let model;
if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
}

app.post('/api/ask', async (req, res) => {
  try {
    const { question, context } = req.body || {};
    if (!question || !context) {
      return res.status(400).json({ error: 'Missing question or context' });
    }
    if (!model) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const prompt = `Basándote estricta y únicamente en el siguiente contexto científico, responde a la pregunta del usuario. No uses información externa. Si la respuesta no está en el texto, di "La información no se encuentra en este resumen".\nContexto: --- ${context} ---\nPregunta del usuario: "${question}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ answer: text });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});


