const MEDIA_BASE = "https://console.gmicloud.ai/api/v1/ie/requestqueue/apikey/requests";

const MODELS = {
  IMAGE: "seedream-5.0-lite",
  TTS_FAST: "inworld-tts-2",
  TTS_QUALITY: "minimax-tts-speech-2.6-hd",
} as const;

function getApiKey(): string {
  return process.env.GMI_CLOUD_API_KEY || "missing";
}

interface MediaResponse {
  request_id: string;
  model: string;
  status: "created" | "queued" | "dispatched" | "processing" | "success" | "failed" | "cancelled";
  outcome?: {
    audio_url?: string;
    media_urls?: { id: string; url: string }[];
    media?: { type: string; url: string }[];
  };
}

async function submitMediaRequest(
  model: string,
  payload: Record<string, unknown>
): Promise<MediaResponse> {
  const res = await fetch(MEDIA_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({ model, payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GMI media ${res.status}: ${text}`);
  }

  return res.json();
}

async function pollMediaRequest(
  requestId: string,
  timeoutMs = 120_000,
  intervalMs = 2000
): Promise<MediaResponse> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const res = await fetch(`${MEDIA_BASE}/${requestId}`, {
      headers: { Authorization: `Bearer ${getApiKey()}` },
    });

    if (!res.ok) throw new Error(`GMI poll ${res.status}`);

    const data: MediaResponse = await res.json();

    if (data.status === "success") return data;
    if (data.status === "failed" || data.status === "cancelled") {
      throw new Error(`Media request ${data.status}`);
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error("Media request timed out");
}

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const data = await submitMediaRequest(MODELS.IMAGE, {
      prompt,
      width: 1024,
      height: 1024,
    });

    if (data.status === "success") {
      return data.outcome?.media_urls?.[0]?.url ?? null;
    }

    const result = await pollMediaRequest(data.request_id, 90_000);
    return result.outcome?.media_urls?.[0]?.url ?? null;
  } catch (err: any) {
    console.error("Image gen failed:", err.message);
    return null;
  }
}

export async function generateTTS(
  text: string,
  voiceId = "Carter"
): Promise<string | null> {
  try {
    const data = await submitMediaRequest(MODELS.TTS_FAST, {
      text,
      voice_id: voiceId,
      audio_encoding: "MP3",
      sample_rate_hertz: 48000,
      speaking_rate: 1.0,
      temperature: 1.1,
    });

    if (data.status === "success") {
      return data.outcome?.audio_url ?? null;
    }

    const result = await pollMediaRequest(data.request_id, 30_000);
    return result.outcome?.audio_url ?? null;
  } catch (err: any) {
    console.error("TTS failed:", err.message);
    return null;
  }
}
