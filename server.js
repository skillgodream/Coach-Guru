import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3e3;
app.use(express.json({ limit: "15mb" }));
function getApiKey() {
  const rawKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || "").trim();
  const cleanKey = rawKey.replace(/^["']|["']$/g, "").trim();
  return cleanKey || void 0;
}
function getGeminiClient() {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api/health", (_req, res) => {
  const key = getApiKey();
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(key && key.length > 5),
    keyPrefix: key ? `${key.slice(0, 4)}...${key.slice(-4)}` : null,
    nodeEnv: process.env.NODE_ENV || "development",
    time: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/pdf/extract", async (req, res) => {
  try {
    const { fileBase64, mimeType = "application/pdf", filename = "uploaded_document.pdf" } = req.body;
    if (!fileBase64 || typeof fileBase64 !== "string") {
      return res.status(400).json({ success: false, error: "No fileBase64 data provided." });
    }
    const aiClient = getGeminiClient();
    if (!aiClient) {
      console.warn("[Server PDF Extract] No Gemini API key detected on server.");
      return res.json({ success: false, useLocal: true, reason: "GEMINI_API_KEY missing on server" });
    }
    let docPart;
    let textDirect = null;
    const lowerName = filename.toLowerCase();
    const isDocx = lowerName.endsWith(".docx") || lowerName.endsWith(".doc") || mimeType.includes("word") || mimeType.includes("openxmlformats");
    if (isDocx) {
      try {
        const decodedStr = Buffer.from(fileBase64, "base64").toString("utf-8");
        const xmlMatches = decodedStr.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
        if (xmlMatches && xmlMatches.length > 0) {
          textDirect = xmlMatches.map((node) => node.replace(/<[^>]+>/g, "")).join(" ");
        }
      } catch (e) {
        console.warn("[Server DOCX Extract] Direct buffer decode failed:", e);
      }
    }
    if (textDirect && textDirect.trim().length > 10) {
      const extractedText2 = textDirect.trim();
      const wordCount2 = extractedText2.split(/\s+/).filter(Boolean).length;
      const pageCount2 = Math.max(1, Math.ceil(wordCount2 / 220));
      console.log(`[Server /api/pdf/extract SUCCESS] Direct XML decoded ${wordCount2} words from '${filename}'`);
      return res.json({
        success: true,
        extractedText: extractedText2,
        wordCount: wordCount2,
        pageCount: pageCount2
      });
    }
    const cleanMime = mimeType.includes("image") ? mimeType : mimeType.includes("text") ? "text/plain" : "application/pdf";
    docPart = {
      inlineData: {
        mimeType: cleanMime,
        data: fileBase64
      }
    };
    const prompt = `You are a High-Fidelity Document & OCR Extraction Engine.
Extract the COMPLETE human-readable text from this document ("${filename}") word-for-word.
Preserve paragraph structure, headers, section numbers, bullet points, and original Unicode typography (curly quotes, dashes, accents, symbols).
Do NOT summarize. Return JSON:
{
  "extractedText": "Complete extracted text content here...",
  "pageCount": estimated total pages as integer,
  "wordCount": estimated total words as integer
}`;
    let response;
    try {
      response = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts: [docPart, { text: prompt }] },
        config: {
          responseMimeType: "application/json"
        }
      });
    } catch (primaryErr) {
      console.warn("[Server PDF Extract] Primary model gemini-3.8-flash failed, trying gemini-flash-latest:", primaryErr?.message);
      response = await aiClient.models.generateContent({
        model: "gemini-flash-latest",
        contents: { parts: [docPart, { text: prompt }] },
        config: {
          responseMimeType: "application/json"
        }
      });
    }
    const outputText = response.text || "";
    let cleanJson = outputText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    const parsed = JSON.parse(cleanJson);
    const extractedText = parsed.extractedText || "";
    const wordCount = parsed.wordCount || extractedText.split(/\s+/).filter(Boolean).length;
    const pageCount = parsed.pageCount || Math.max(1, Math.ceil(wordCount / 220));
    console.log(`[Server /api/pdf/extract SUCCESS] Extracted ${wordCount} words from '${filename}' (${pageCount} pages)`);
    return res.json({
      success: true,
      extractedText,
      wordCount,
      pageCount
    });
  } catch (err) {
    console.error("[Server /api/pdf/extract Error]:", err?.message || err);
    return res.json({ success: false, error: err?.message || "Server PDF extraction failed" });
  }
});
app.post("/api/gemini/generate-blueprint", async (req, res) => {
  try {
    const { rawText, fileBase64, mimeType, filename, fileHash, pageCount, wordCount } = req.body;
    const aiClient = getGeminiClient();
    if (!aiClient) {
      console.warn("[Server /api/gemini/generate-blueprint] No Gemini API key found in environment.");
      return res.json({
        success: false,
        useLocalGenerator: true,
        reason: "GEMINI_API_KEY is not configured on server. Fallback to local domain-neutral generator."
      });
    }
    const parts = [];
    const docText = rawText ? rawText.slice(0, 16e3) : "";
    if (docText && docText.length > 50) {
    } else if (fileBase64 && typeof fileBase64 === "string") {
      parts.push({
        inlineData: {
          mimeType: mimeType || "application/pdf",
          data: fileBase64
        }
      });
    }
    const systemInstruction = `You are a Lead Operational Intelligence Engineer and Instructional Designer.
Your task is to transform an uploaded Standard Operating Procedure (SOP) into a structured OPERATIONAL BLUEPRINT.

CRITICAL RULES:
1. DISTINGUISH METADATA VS OPERATIONAL CONTENT:
   - METADATA (DO NOT MAKE INTO STEPS): Document titles, REF codes ("DOCUMENT REF: SOP-HTL-101"), Version numbers ("VERSION 1.0"), Effective dates, Approvals, Section headers.
   - OPERATIONAL CONTENT (MUST DRIVE BLUEPRINT): Physical actions, system entries, verbal communications, verifications, decision points, exception handling, escalations.
2. BEHAVIOR CHANGE TEST: Ask: "If this item were removed from the SOP, would the worker's actual physical, verbal, system or decision-making behavior change?"
   - YES -> Candidate operational content
   - NO -> Metadata / background context
3. SOURCE GROUNDING: Ground ALL outputs strictly in the provided SOP text. Retain source quotes and references for EVERY operational step, decision, and rule.
4. ZERO DOMAIN FALLBACKS: Extract the REAL role and domain (e.g., Phlebotomy Technician, Retail Cashier, Hotel Front Office Agent). NEVER fall back to generic warehouse/picking terms unless in source text.
5. NO GENERIC TEMPLATE STRINGS: Do NOT output strings like "frontline specialist duties", "Follow written operational procedure guidelines carefully", "Approved Operational Rule", "Non-compliant action". Be specific to the SOP!`;
    const textPrompt = `Uploaded SOP Document: "${filename}" (${pageCount || 1} pages, ${wordCount || 100} words)
${docText ? `Document Text:
"""
${docText}
"""
` : ""}

Extract the complete OPERATIONAL BLUEPRINT as JSON with this exact schema:
{
  "document_identity": {
    "doc_title": "${filename ? filename.replace(/\.(txt|pdf|docx)$/i, "") : "Operational Procedure"}",
    "doc_ref": "Extracted document reference or empty",
    "version": "Extracted version or empty"
  },
  "role": "Exact worker role described in SOP (e.g., Phlebotomy Technician, Retail Cashier, Hotel Front Office Agent)",
  "process": "Exact core operational process (e.g., Patient Registration & Blood Collection, POS Return Processing, Guest Check-In)",
  "purpose": "1-2 sentence primary operational goal for the worker",
  "scope": "Applicable department or workspace boundaries",
  "prerequisites": [
    { "text": "Requirement before starting", "source_ref": "S1.pre1", "source_text": "Quote from text" }
  ],
  "tools_and_systems": [
    { "name": "Tool or system name", "purpose": "What it is used for", "never_do": "Key prohibition", "source_ref": "S1.tool1", "source_text": "Quote" }
  ],
  "terminology": [
    { "term": "Key term or code", "meaning": "Plain definition", "source_ref": "S1.term1", "source_text": "Quote" }
  ],
  "operational_steps": [
    {
      "instruction": "Specific, clear workplace action (e.g., Verify patient full name and date of birth against photo ID)",
      "category": "DO" | "CHECK" | "KNOW" | "DECIDE" | "RESPOND" | "RECOVER" | "ESCALATE",
      "why_it_matters": "Operational reason or consequence",
      "action_verb": "Action verb",
      "critical_control": true/false,
      "source": { "page_or_section": "Page 1 \xB7 Section 1", "source_ref": "S1.sec1", "source_text": "Exact quote from document" }
    }
  ],
  "decision_points": [
    { "situation": "Condition triggering decision", "decision": "Decision choice", "action": "Required action", "source_ref": "S1.dec1", "source_text": "Quote" }
  ],
  "exceptions": [
    { "trigger": "Unexpected scenario or error", "resolution": "Corrective resolution", "source_ref": "S1.exp1", "source_text": "Quote" }
  ],
  "escalations": [
    { "situation": "When stuck or anomaly occurs", "contact_or_action": "Who to notify or call", "source_ref": "S1.esc1", "source_text": "Quote" }
  ],
  "critical_controls": [
    { "rule": "Mandatory non-negotiable rule", "rationale": "Why it is critical", "source_ref": "S1.ctrl1", "source_text": "Quote" }
  ],
  "safety_rules": [
    { "rule": "Safety or compliance rule", "source_ref": "S1.safe1", "source_text": "Quote" }
  ],
  "quality_rules": [
    { "rule": "Quality standard rule", "source_ref": "S1.qual1", "source_text": "Quote" }
  ],
  "customer_or_business_impact": [
    { "impact": "Who depends and impact", "source_ref": "S1.imp1", "source_text": "Quote" }
  ],
  "common_mistakes": [
    { "mistake": "Potential worker error", "prevention": "How to avoid it", "source_ref": "S1.err1", "source_text": "Quote" }
  ],
  "source_evidence": [
    { "id": "E1", "page_or_section": "Page 1", "excerpt": "Document excerpt" }
  ],
  "confidence": 0.98
}`;
    parts.push({ text: textPrompt });
    let response;
    try {
      response = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          maxOutputTokens: 4e3,
          temperature: 0.2
        }
      });
    } catch (primaryErr) {
      console.warn("[Server LLM Blueprint] Primary model gemini-3.8-flash failed, trying gemini-flash-latest:", primaryErr?.message);
      response = await aiClient.models.generateContent({
        model: "gemini-flash-latest",
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          maxOutputTokens: 4e3,
          temperature: 0.2
        }
      });
    }
    const outputText = response.text || "";
    let cleanJson = outputText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    const parsedData = JSON.parse(cleanJson);
    console.log(`[Server /api/gemini/generate-blueprint SUCCESS] Extracted ${parsedData.operational_steps?.length || 0} operational steps from '${filename}'`);
    return res.json({
      success: true,
      blueprint: parsedData
    });
  } catch (err) {
    console.error("[Server /api/gemini/generate-blueprint Error]:", err?.message || err);
    if (err instanceof SyntaxError) {
      return res.status(502).json({
        success: false,
        useLocalGenerator: true,
        error: "JSON_PARSE_ERROR",
        message: "The model output was malformed or truncated.",
        details: err.message
      });
    }
    return res.json({
      success: false,
      useLocalGenerator: true,
      error: err?.message || "Server error, falling back to local generator."
    });
  }
});
app.post("/api/coach", async (req, res) => {
  const { prompt, systemInstruction, maxOutputTokens = 4e3, temperature = 0.3 } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }
  const aiClient = getGeminiClient();
  if (!aiClient) {
    console.error("[API Error] GEMINI_API_KEY is not defined in deployment environment variables.");
    return res.status(500).json({ error: "Server configuration error: Missing API Key" });
  }
  try {
    let response;
    try {
      response = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are an expert assistant. Respond strictly with valid JSON.",
          responseMimeType: "application/json",
          maxOutputTokens,
          temperature
        }
      });
    } catch (primaryErr) {
      console.warn("[Server /api/coach] Primary model failed, trying fallback gemini-flash-latest:", primaryErr?.message);
      response = await aiClient.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are an expert assistant. Respond strictly with valid JSON.",
          responseMimeType: "application/json",
          maxOutputTokens,
          temperature
        }
      });
    }
    const rawText = response.text || "";
    const cleanedText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    if (!cleanedText) {
      return res.status(502).json({ error: "Empty response received from LLM" });
    }
    const parsedData = JSON.parse(cleanedText);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error("[API Error] LLM generation failed:", error);
    if (error instanceof SyntaxError) {
      return res.status(502).json({
        error: "JSON_PARSE_ERROR",
        message: "The model output was malformed or truncated.",
        details: error.message
      });
    }
    return res.status(500).json({
      error: "LLM_PROVIDER_ERROR",
      message: error.message || "Failed to generate response"
    });
  }
});
app.all("/api/*", (req, res) => {
  res.status(404).json({
    error: "API_ENDPOINT_NOT_FOUND",
    message: `API endpoint ${req.method} ${req.path} not found on server`
  });
});
const distPath = path.resolve(process.cwd(), "dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa"
  });
  app.use(vite.middlewares);
}
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Express server running on http://0.0.0.0:${PORT}`);
});
