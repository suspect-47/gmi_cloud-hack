// Standalone diagnostic: connect to local RocketRide engine, start fanforge.pipe,
// send a chat question, log every event, time out after 90s.
// Run: node scripts/diag-rocketride.mjs

import { RocketRideClient, Question } from "rocketride";
import path from "path";
import fs from "fs";

const HOST = process.env.ROCKETRIDE_HOST || "localhost";
const PORT = process.env.ROCKETRIDE_PORT || "50188";
const KEY = process.env.ROCKETRIDE_APIKEY || "local-dev-key";

// Load .env.local manually since this is a plain node script
try {
  const env = fs.readFileSync(".env.local", "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const stamp = () => new Date().toISOString().slice(11, 23);
const log = (...a) => console.log(`[${stamp()}]`, ...a);

const client = new RocketRideClient({
  uri: `http://${HOST}:${process.env.ROCKETRIDE_PORT || PORT}`,
  auth: process.env.ROCKETRIDE_APIKEY || KEY,
  onEvent: (event) => {
    const body = event.body ?? {};
    const summary =
      typeof body === "object"
        ? Object.entries(body)
            .slice(0, 4)
            .map(([k, v]) => `${k}=${typeof v === "string" ? v.slice(0, 80) : JSON.stringify(v).slice(0, 80)}`)
            .join(" ")
        : String(body).slice(0, 200);
    log("EVENT", event.event || "?", summary);
  },
});

const timer = setTimeout(() => {
  log("TIMEOUT 90s — aborting");
  process.exit(1);
}, 90_000);

try {
  log("Connecting…");
  await client.connect();
  log("Connected");

  log("use() pipe…");
  const useRes = await client.use({
    filepath: path.resolve(process.env.PIPE || "fanforge.pipe"),
    useExisting: true,
    pipelineTraceLevel: "summary",
  });
  log("use() →", JSON.stringify(useRes).slice(0, 200));
  const token = useRes.token;

  log("Subscribing to all events…");
  await client.setEvents(token, [
    "apaevt_status_upload",
    "apaevt_status_processing",
    "apaevt_status",
    "apaevt_sse",
    "apaext_error",
    "summary",
    "task",
  ]);

  log("Building question…");
  const q = new Question();
  q.addContext({
    team_profile: {
      team: "Brazil",
      group: "TBD",
      group_opponents: [],
      colors: { primary: "#fedf00", secondary: "#009c3b", accent: "#002776" },
      nickname: "Seleção",
      cultural_keywords: ["samba", "joga bonito"],
      key_players: [],
      fifa_ranking: 5,
      fun_fact: "5-time World Cup champion",
    },
    fan_emotion: "passionate",
    players_mentioned: [],
  });
  q.addQuestion("Generate a FIFA World Cup 2026 fan content kit for Brazil. Follow your role's JSON schema exactly.");

  log("Sending chat()…");
  const t0 = Date.now();
  const response = await client.chat({ token, question: q });
  log(`chat() returned in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  log("response keys:", Object.keys(response || {}));
  log("response.answers count:", (response?.answers || []).length);
  if (response?.answers) {
    response.answers.forEach((a, i) => {
      const preview = typeof a === "string" ? a.slice(0, 200) : JSON.stringify(a).slice(0, 200);
      log(`  answer[${i}]:`, preview);
    });
  }
  if (response?._trace) {
    log("trace:", JSON.stringify(response._trace).slice(0, 600));
  }
} catch (err) {
  log("ERROR:", err?.message || err);
  if (err?.stack) log(err.stack);
} finally {
  clearTimeout(timer);
  try { await client.disconnect(); } catch {}
  log("Done");
  process.exit(0);
}
