var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
app.post("/api/sai-ai/generate", async (req, res) => {
  try {
    const { type, prompt, donorName, donationAmount, category, metrics } = req.body;
    let systemInstruction = "You are a spiritual, wise, and gracious temple AI assistant for Shri Sai Baba Sansthan Temple. Your tone is humble, divine, respectful, and rooted in Shri Sai's core principles of Shraddha (Faith) & Saburi (Patience) and 'Sabka Malik Ek'.";
    let contents = prompt || "Provide an inspiring devotional quote from Shri Sai Satcharitra with a brief spiritual guidance for today's pilgrims and volunteers.";
    if (type === "donor-thankyou") {
      contents = `Draft a deeply heartfelt, sacred thank-you message and blessing for donor "${donorName || "Devotee"}" who offered a generous contribution of \u20B9${donationAmount || "0"} towards "${category || "General Fund"}". Wish them and their family Shri Sai's eternal grace, happiness, and peace.`;
    } else if (type === "daily-report-summary") {
      contents = `Create a formal, concise daily executive summary for the Temple Management Committee based on these metrics: ${JSON.stringify(
        metrics
      )}. Include total collection breakdown, visitor footfall insights, Annadanam meals served, and volunteer shift performance. Keep it clear, professional, and inspiring.`;
    } else if (type === "seva-advice") {
      contents = `Provide guidance for a temple volunteer (Sevak) assigned to duty "${category || "General Service"}". Explain the spiritual importance of selfless service (Nishkama Seva) in Shri Sai Baba's path and give 3 practical tips for serving devotees with humility.`;
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shri Sai Baba Temple Management server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
