// app/api/gemini/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { contractId, normalizedModulesJson } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }
    if (!contractId || !normalizedModulesJson) {
      return NextResponse.json(
        { error: "contractId and normalizedModulesJson are required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a Sui Move smart-contract auditor and educator.
Given the contract packageId and the normalized modules (ABI-like metadata), do:
1) High-level summary of what this package likely does.
2) List exposed entry functions with their purposes and key parameters.
3) Note potential risks or footguns (e.g., unchecked transfers, missing capabilities, invariant assumptions).
4) Mention any notable structs/resources and access-control implications.
5) Suggest 2–3 tests or invariants to verify.

IMPORTANT:
- You don't have the raw Move source; infer only from function names, visibility, and types.
- If information is not present, say "unknown".
- Keep it concise and actionable.

packageId: ${contractId}

normalizedModules (truncated if long):
${normalizedModulesJson}
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Gemini error" }, { status: 500 });
  }
}
