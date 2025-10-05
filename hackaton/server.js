// server.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // <--- LÍNEA NUEVA
import { fileURLToPath } from 'url'; // <--- LÍNEA NUEVA

// Configuración inicial
dotenv.config();
const app = express();
const port = 3000;

// --- NUEVO: Configuración para servir archivos estáticos ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname)); // Sirve los archivos de la carpeta actual

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de la API de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
//const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
// La ruta de la API que tu frontend llamará
app.post('/ask', async (req, res) => {
    const { question, context } = req.body;
    if (!question || !context) {
        return res.status(400).json({ error: 'Falta la pregunta o el contexto.' });
    }
    const prompt = `
        Basándote estricta y únicamente en el siguiente contexto científico, responde a la pregunta del usuario. 
        No uses ninguna información externa. Si la respuesta no está en el texto, di "La información no se encuentra en este resumen".
        Contexto: --- ${context} ---
        Pregunta del usuario: "${question}"
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ answer: text });
    } catch (error) {
        console.error("Error al llamar a la API de Gemini:", error);
        res.status(500).json({ error: "Hubo un error al procesar la respuesta de la IA." });
    }
});

app.listen(port, () => {
    console.log(`Servidor y aplicación web escuchando en http://localhost:${port}`);
});