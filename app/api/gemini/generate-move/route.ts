// app/api/gemini/generate-move/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

/**
 * POST body:
 * {
 *   "prompt": string,
 *   "normalizedModulesJson"?: string  // optional context from current package
 * }
 */
export async function POST(req: Request) {
  try {
    const { prompt, normalizedModulesJson } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(requireEnv("GOOGLE_API_KEY"));

    // Use a general capable model; “-pro” is better for code reasoning.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const system = [
      "You are an expert Move smart-contract generator for the Sui blockchain.",
      "When asked to generate code, return ONLY valid Move source code inside a single module.",
      "Target recent Sui Move idioms where possible. Include minimal comments.",
      "Avoid external dependencies except standard Sui framework modules (e.g., sui::coin, sui::object, sui::tx_context).",
      "If the user asks for a token/coin, implement a basic fungible token pattern and mint function gated by an admin.",
      "Do not include markdown backticks in the final output."
    ].join("\n");

    const userContext = normalizedModulesJson
      ? `\n\n/* Context from currently selected package (truncated): */\n${normalizedModulesJson.slice(0, 120_000)}`
      : "";

    const fullPrompt = [
      system,
      "\n\n# User Request",
      prompt,
      userContext,
      "\n\n# Output Requirements",
      "- Return ONE compilable .move source file (no markdown fences).",
      "- Include a single module with an appropriate name and address placeholders where needed.",
      "- Include entry functions only if explicitly useful.",
      "- For coin/token requests: define a struct token type, init, mint (restricted), and transfer usage example.",
    ].join("\n");

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      // Optional: provide a short stop sequence to avoid extra chatter
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        stopSequences: ["```"], // helps prevent fenced code
      },
    });

    const text = result.response.text() ?? "";
    // Basic sanitation: strip lingering code fences if any
    const move = text.replace(/```[\s\S]*?(\bmove\b)?/gi, "").trim();

    if (!move || move.length < 30) {
      return NextResponse.json({ error: "Model returned empty output." }, { status: 502 });
    }

    return NextResponse.json({ move });
  } catch (e: any) {
    // If you see 404 model errors, ensure GOOGLE_API_KEY is set and model name is correct for your API tier.
    return NextResponse.json({ error: e?.message || "Generation failed" }, { status: 500 });
  }
}
