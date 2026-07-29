import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes for Sai Temple AI features
app.post("/api/sai-ai/generate", async (req, res) => {
  try {
    const { type, prompt, donorName, donationAmount, category, metrics } = req.body;

    let systemInstruction =
      "You are a spiritual, wise, and gracious temple AI assistant for Shri Sai Baba Sansthan Temple. " +
      "Your tone is humble, divine, respectful, and rooted in Shri Sai's core principles of Shraddha (Faith) & Saburi (Patience) and 'Sabka Malik Ek'.";
    let contents = prompt || "Provide an inspiring devotional quote from Shri Sai Satcharitra with a brief spiritual guidance for today's pilgrims and volunteers.";

    if (type === "donor-thankyou") {
      contents = `Draft a deeply heartfelt, sacred thank-you message and blessing for donor "${donorName || 'Devotee'}" who offered a generous contribution of ₹${donationAmount || '0'} towards "${category || 'General Fund'}". Wish them and their family Shri Sai's eternal grace, happiness, and peace.`;
    } else if (type === "daily-report-summary") {
      contents = `Create a formal, concise daily executive summary for the Temple Management Committee based on these metrics: ${JSON.stringify(
        metrics
      )}. Include total collection breakdown, visitor footfall insights, Annadanam meals served, and volunteer shift performance. Keep it clear, professional, and inspiring.`;
    } else if (type === "seva-advice") {
      contents = `Provide guidance for a temple volunteer (Sevak) assigned to duty "${category || 'General Service'}". Explain the spiritual importance of selfless service (Nishkama Seva) in Shri Sai Baba's path and give 3 practical tips for serving devotees with humility.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shri Sai Baba Temple Management server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
