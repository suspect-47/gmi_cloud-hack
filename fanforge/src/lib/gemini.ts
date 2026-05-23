import { GoogleGenerativeAI } from "@google/generative-ai";

let _model: any = null;

function getModel() {
  if (!_model) {
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_AI_STUDIO_KEY || "missing"
    );
    _model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} } as any],
    });
  }
  return _model;
}

export async function askGemini(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function getTeamProfile(
  teamName: string,
  playerMentions: string[]
) {
  const prompt = `
You are a World Cup 2026 data assistant. Return ONLY valid JSON, no markdown.

For the team "${teamName}", provide:
{
  "team": "${teamName}",
  "group": "letter",
  "group_opponents": ["team1", "team2", "team3"],
  "next_match": {
    "opponent": "...",
    "date": "...",
    "time": "... ET",
    "venue": "...",
    "city": "..."
  },
  "colors": { "primary": "#hex", "secondary": "#hex", "accent": "#hex" },
  "nickname": "...",
  "cultural_keywords": ["word1", "word2", "word3"],
  "key_players": [
    { "name": "...", "position": "...", "club": "..." }
  ],
  "fifa_ranking": number,
  "fun_fact": "one-sentence interesting fact"
}

${playerMentions.length > 0 ? `The fan specifically mentioned: ${playerMentions.join(", ")}. Include these players in key_players.` : ""}

Search for the latest 2026 World Cup schedule and group assignments. The tournament runs June 11 - July 19, 2026 across USA, Canada, and Mexico.
`;

  const text = await askGemini(prompt);
  const cleaned = text.replace(/```json\n?|```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse Gemini response:", cleaned);
    return null;
  }
}
