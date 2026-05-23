import { RocketRideClient, Question } from "rocketride";
import path from "path";

let client: RocketRideClient | null = null;
let pipelineToken: string | null = null;
let initPromise: Promise<string> | null = null;
let rrDisabled = false;

async function ensurePipeline(): Promise<string> {
  if (pipelineToken && client?.isConnected()) return pipelineToken;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    client = new RocketRideClient({
      uri: `http://${process.env.ROCKETRIDE_HOST || "localhost"}:${process.env.ROCKETRIDE_PORT || "5565"}`,
      auth: process.env.ROCKETRIDE_APIKEY || "",
    });
    await client.connect();
    const pipeFile = path.join(process.cwd(), "fanforge.pipe");
    const result = await client.use({ filepath: pipeFile, useExisting: true });
    pipelineToken = result.token;
    return pipelineToken;
  })();

  try {
    return await initPromise;
  } finally {
    initPromise = null;
  }
}

function stripFences(s: string): string {
  return s.replace(/```json\n?|```\n?/g, "").trim();
}

function tryParseJSON(s: string): any | null {
  try {
    return JSON.parse(stripFences(s));
  } catch {
    return null;
  }
}

export interface PipelineKitResult {
  creative: any | null;
  analyst: any | null;
}

/**
 * Runs the full fanforge multi-stage pipeline in one shot.
 *
 * The pipeline branches the chat input into two parallel `prompt → llm_gmi_cloud`
 * branches (creative director + sports analyst) and merges them in
 * `response_answers`. Returns both parsed JSON outputs.
 *
 * Throws on any RocketRide failure — caller is responsible for fallback.
 */
export async function runFanforgePipeline(
  teamProfile: any,
  opts: { emotion: string; players: string[] }
): Promise<PipelineKitResult> {
  if (rrDisabled) {
    throw new Error("RocketRide disabled for this process (prior failure)");
  }

  try {
    const token = await ensurePipeline();

    const question = new Question();
    question.addContext({
      team_profile: teamProfile,
      fan_emotion: opts.emotion,
      players_mentioned: opts.players,
    });
    question.addQuestion(
      `Generate a FIFA World Cup 2026 fan content kit for ${teamProfile.team || "this team"}. Follow your role's JSON schema exactly.`
    );

    const response = await client!.chat({ token, question });
    const answers: any[] = Array.isArray((response as any).answers)
      ? (response as any).answers
      : [];

    // The pipeline returns one combined JSON: { creative, analysis }.
    // The chat source can emit duplicate questions, so multiple answers
    // may come back — pick the first ones matching the expected shape.
    let creative: any = null;
    let analyst: any = null;
    for (const a of answers) {
      const parsed = typeof a === "string" ? tryParseJSON(a) : a;
      if (!parsed) continue;
      if (parsed.creative || parsed.analysis) {
        creative = creative ?? parsed.creative ?? null;
        analyst = analyst ?? parsed.analysis ?? null;
      } else if (parsed.image_prompts || parsed.social_copy) {
        creative = creative ?? parsed;
      } else if (parsed.difficulty_rating || parsed.ai_prediction) {
        analyst = analyst ?? parsed;
      }
      if (creative && analyst) break;
    }

    return { creative, analyst };
  } catch (err: any) {
    console.warn(
      `[rocketride] Pipeline unavailable (${err?.message || err}); will fall back to direct GMI.`
    );
    rrDisabled = true;
    throw err;
  }
}

export async function disconnectRocketRide() {
  if (client) {
    try {
      await client.disconnect();
    } catch {
      /* ignore */
    }
    client = null;
    pipelineToken = null;
  }
}
