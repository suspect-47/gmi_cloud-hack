import OpenAI from "openai";

let _gmi: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_gmi) {
    _gmi = new OpenAI({
      apiKey: process.env.GMI_CLOUD_API_KEY || "missing",
      baseURL: process.env.GMI_BASE_URL || "https://api.gmi-serving.com/v1",
    });
  }
  return _gmi;
}

export const MODELS = {
  CREATIVE_DIRECTOR: "deepseek-ai/DeepSeek-V3.2",
  CREATIVE_FALLBACK: "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
  FAST_CHAT: "deepseek-ai/DeepSeek-V4-Flash",
} as const;

export async function gmiChat(
  model: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const gmi = getClient();
  const response = await gmi.chat.completions.create({
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function gmiChatWithFallback(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  try {
    return await gmiChat(MODELS.CREATIVE_DIRECTOR, messages, options);
  } catch (err: any) {
    console.warn("Primary model failed, trying fallback:", err.message);
    return await gmiChat(MODELS.CREATIVE_FALLBACK, messages, options);
  }
}

export async function gmiExtractIntent(
  transcript: string
): Promise<{ team: string | null; players: string[]; emotion: string }> {
  const response = await gmiChat(
    MODELS.FAST_CHAT,
    [
      {
        role: "system",
        content:
          'Extract the FIFA World Cup team name, any player names mentioned, and fan emotion level from this message. Return ONLY valid JSON: {"team": "Country Name" or null, "players": ["name1"], "emotion": "casual"|"passionate"|"die-hard"}',
      },
      { role: "user", content: transcript },
    ],
    { temperature: 0, maxTokens: 200 }
  );

  try {
    const cleaned = response.replace(/```json\n?|```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { team: null, players: [], emotion: "passionate" };
  }
}
