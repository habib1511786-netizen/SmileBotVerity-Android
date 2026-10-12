require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_req, res) => res.json({ ok: true, service: "SmileBot: Verity", aiConfigured: Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY !== "put_your_api_key_here") }));
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, mode } = req.body || {};
    const key = process.env.AI_API_KEY;
    if (!key || key === "put_your_api_key_here") return res.status(503).json({ error: "AI server is running, but AI_API_KEY is not configured in server/.env." });
    if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: "messages must be a non-empty array." });
    const safeMessages = messages.slice(-20).map(m => ({ role: m && m.role === "assistant" ? "assistant" : "user", content: String((m && m.content) || "").slice(0, 12000) }));
    const systemPrompt = mode === "code" ? "You are SmileBot, a helpful coding assistant. Explain code clearly and provide secure, correct solutions." : "You are SmileBot, a friendly, helpful AI assistant. Be clear, warm, and honest.";
    const base = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
    const upstream = await fetch(base + "/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.AI_MODEL || "gpt-4o-mini", messages: [{ role: "system", content: systemPrompt }, ...safeMessages], temperature: 0.7 }) });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return res.status(502).json({ error: payload.error?.message || `AI provider returned HTTP ${upstream.status}` });
    const reply = payload.choices?.[0]?.message?.content;
    if (typeof reply !== "string") return res.status(502).json({ error: "AI provider returned an unexpected response." });
    res.json({ reply });
  } catch (err) { console.error("Chat request failed:", err.message); res.status(500).json({ error: "Server error while contacting the AI provider." }); }
});
const port = Number(process.env.PORT || 3000);
app.listen(port, "0.0.0.0", () => { console.log(`SmileBot server listening on port ${port}`); console.log(`Health check: http://127.0.0.1:${port}/health`); });
