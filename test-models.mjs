import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  try {
    console.log("Fetching models with key:", process.env.GEMINI_API_KEY ? "EXISTS (starts with " + process.env.GEMINI_API_KEY.substring(0, 5) + ")" : "MISSING");
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    console.log(data.models.map(m => m.name).join('\n'));
  } catch (e) {
    console.error(e);
  }
}
run();
