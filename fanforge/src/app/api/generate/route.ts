import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { gmiChatWithFallback, gmiExtractIntent } from "@/lib/gmi";
import { runFanforgePipeline } from "@/lib/rocketride";
import { getTeamProfile } from "@/lib/gemini";
import { generateImage, generateTTS } from "@/lib/gmi-media";
import { kitStore } from "@/lib/store";
import { TEAMS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const kitId = uuid();

    /* ── Node 1: Extract team + intent ──────────────────────── */
    let teamName: string;
    let playerMentions: string[] = [];
    let fanEmotion: string = "passionate";

    if (body.transcript) {
      const intent = await gmiExtractIntent(body.transcript);
      teamName = intent.team || body.team || "";
      playerMentions = intent.players;
      fanEmotion = intent.emotion;
    } else if (body.team) {
      teamName = body.team;
      if (body.message) {
        const intent = await gmiExtractIntent(body.message);
        playerMentions = intent.players;
        fanEmotion = intent.emotion;
      }
    } else {
      return NextResponse.json(
        { error: "Provide a team name or voice transcript." },
        { status: 400 }
      );
    }

    const matched = TEAMS.find(
      (t) => t.toLowerCase() === teamName.toLowerCase()
    );
    if (!matched) {
      return NextResponse.json(
        { error: `"${teamName}" is not a recognized World Cup 2026 team.` },
        { status: 400 }
      );
    }
    teamName = matched;

    /* ── Node 2: Knowledge enrichment (Gemini + Search) ─────── */
    let teamProfile: any = null;
    try {
      teamProfile = await getTeamProfile(teamName, playerMentions);
    } catch (err: any) {
      console.warn("Gemini enrichment failed, using minimal profile:", err.message);
      teamProfile = {
        team: teamName,
        group: "TBD",
        group_opponents: [],
        colors: { primary: "#000000", secondary: "#FFFFFF", accent: "#FFD700" },
        nickname: teamName,
        cultural_keywords: [],
        key_players: [],
        fifa_ranking: 0,
        fun_fact: "",
      };
    }

    /* ── Node 3+4: Multi-stage RocketRide pipeline ───────────
       Single chat call branches into two parallel prompt→LLM
       branches inside the pipeline (creative director +
       sports analyst) and merges back into response_answers. */
    let creativeKit: any = null;
    let groupAnalysis: any = null;
    try {
      const piped = await runFanforgePipeline(teamProfile, {
        emotion: fanEmotion,
        players: playerMentions,
      });
      creativeKit = piped.creative;
      groupAnalysis = piped.analyst;
    } catch {
      // RocketRide unreachable — run both LLM calls directly against GMI
      [creativeKit, groupAnalysis] = await Promise.all([
        directCreative(teamName, teamProfile, fanEmotion, playerMentions),
        directGroupAnalysis(teamName, teamProfile),
      ]);
    }

    /* ── Nodes 5A/5B/5C: Parallel media generation ──────────── */
    const imagePrompts = creativeKit?.image_prompts;
    const voiceScript = creativeKit?.voice_script;

    const [posterImg, hypeImg, coverImg, voiceAudio] =
      await Promise.allSettled([
        imagePrompts?.matchday_poster
          ? generateImage(imagePrompts.matchday_poster)
          : Promise.resolve(null),
        imagePrompts?.fan_hype_card
          ? generateImage(imagePrompts.fan_hype_card)
          : Promise.resolve(null),
        imagePrompts?.social_cover
          ? generateImage(imagePrompts.social_cover)
          : Promise.resolve(null),
        voiceScript
          ? generateTTS(voiceScript, "Carter")
          : Promise.resolve(null),
      ]);

    const val = <T,>(r: PromiseSettledResult<T>, fallback: T): T =>
      r.status === "fulfilled" ? r.value : fallback;

    /* ── Node 6: Composer — assemble final kit ──────────────── */
    const kit = {
      kit_id: kitId,
      team: teamName,
      created_at: new Date().toISOString(),
      status: "complete" as const,
      team_profile: teamProfile,
      creative: creativeKit,
      assets: {
        matchday_poster: {
          prompt: imagePrompts?.matchday_poster ?? null,
          url: val(posterImg, null),
        },
        fan_hype_card: {
          prompt: imagePrompts?.fan_hype_card ?? null,
          url: val(hypeImg, null),
        },
        social_cover: {
          prompt: imagePrompts?.social_cover ?? null,
          url: val(coverImg, null),
        },
        voice_hype: {
          script: voiceScript ?? null,
          url: val(voiceAudio, null),
        },
        social_copy: creativeKit?.social_copy ?? {},
        group_breakdown: groupAnalysis ?? {
          group: teamProfile?.group,
          opponents: teamProfile?.group_opponents,
          next_match: teamProfile?.next_match,
          ai_prediction: `${teamName} are contenders to advance from the group stage.`,
        },
        watch_party: creativeKit?.watch_party ?? {},
      },
    };

    kitStore.set(kitId, kit);

    return NextResponse.json({ kit_id: kitId, status: "complete", kit });
  } catch (error: any) {
    console.error("Pipeline error:", error);
    return NextResponse.json(
      {
        error: "Pipeline failed: " + (error.message || "Check API keys and try again."),
      },
      { status: 500 }
    );
  }
}

/* ── Direct-GMI fallbacks (used when RocketRide is unreachable) ── */

async function directCreative(
  team: string,
  profile: any,
  emotion: string,
  players: string[]
) {
  const prompt = `You are a world-class sports creative director. Given this team profile and fan context, generate a content kit.

Team profile:
${JSON.stringify(profile, null, 2)}

Fan emotion level: ${emotion}
Players mentioned: ${players.join(", ") || "none specifically"}

Return ONLY valid JSON with this exact structure:
{
  "image_prompts": {
    "matchday_poster": "detailed image prompt for a cinematic matchday poster — specify lighting, camera angle, hex colors from team profile, atmosphere, composition. NO real player likenesses, use jersey numbers and silhouettes.",
    "fan_hype_card": "detailed image prompt for a personalized fan hype card — vibrant, social-media ready, team colors dominant.",
    "social_cover": "detailed image prompt for a social media cover/banner — wide format, stadium atmosphere, team identity."
  },
  "social_copy": {
    "instagram_caption": "engaging Instagram caption with personality, 2-3 sentences",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "twitter_post": "punchy tweet under 280 chars",
    "hot_take": "spicy but fun hot take about the team's chances"
  },
  "voice_script": "30-second narration script that builds tension then releases — should give chills. Start quiet, build to crescendo.",
  "watch_party": {
    "dishes": [
      { "name": "dish name", "description": "short appetizing description", "emoji": "🍽️" },
      { "name": "dish name", "description": "short appetizing description", "emoji": "🍽️" },
      { "name": "dish name", "description": "short appetizing description", "emoji": "🍽️" }
    ],
    "drink": "signature drink pairing with description"
  }
}`;

  const raw = await gmiChatWithFallback(
    [
      {
        role: "system",
        content:
          "You are a sports creative director. Respond only in valid JSON. No markdown fences.",
      },
      { role: "user", content: prompt },
    ],
    { temperature: 0.8, maxTokens: 3000 }
  );

  try {
    return JSON.parse(raw.replace(/```json\n?|```\n?/g, "").trim());
  } catch {
    console.error("Failed to parse creative output, raw:", raw.slice(0, 500));
    return null;
  }
}

async function directGroupAnalysis(team: string, profile: any) {
  const prompt = `For FIFA World Cup 2026 team ${team}:
- Group: ${profile?.group || "unknown"}
- Opponents: ${(profile?.group_opponents || []).join(", ")}
- FIFA ranking: ${profile?.fifa_ranking || "N/A"}

Provide a brief, punchy group stage analysis. Return ONLY JSON:
{
  "group": "letter",
  "opponents": ["team1", "team2", "team3"],
  "next_match": ${JSON.stringify(profile?.next_match || {})},
  "difficulty_rating": "Easy|Medium|Hard|Group of Death",
  "ai_prediction": "2-3 sentence prediction with confidence",
  "key_matchup": "Which group game matters most and why (1 sentence)"
}`;

  const raw = await gmiChatWithFallback(
    [
      { role: "system", content: "Sports analyst. JSON only. No markdown." },
      { role: "user", content: prompt },
    ],
    { temperature: 0.6, maxTokens: 500 }
  );

  try {
    return JSON.parse(raw.replace(/```json\n?|```\n?/g, "").trim());
  } catch {
    return null;
  }
}
