import { RocketRideClient } from "rocketride";

let client: RocketRideClient | null = null;
let pipelineToken: string | null = null;

export async function getRocketRideClient(): Promise<RocketRideClient> {
  if (client?.isConnected()) return client;

  client = new RocketRideClient({
    uri: `http://${process.env.ROCKETRIDE_HOST || "localhost"}:${process.env.ROCKETRIDE_PORT || "5565"}`,
    auth: process.env.ROCKETRIDE_APIKEY || "",
  });

  await client.connect();
  return client;
}

export async function startPipeline(pipeFilePath: string): Promise<string> {
  const c = await getRocketRideClient();
  const result = await c.use({ filepath: pipeFilePath, useExisting: true });
  pipelineToken = result.token;
  return pipelineToken;
}

export async function sendToPipeline(
  token: string,
  data: string,
  mimetype = "application/json"
) {
  const c = await getRocketRideClient();
  return c.send(token, data, {}, mimetype);
}

export async function getPipelineStatus(token: string) {
  const c = await getRocketRideClient();
  return c.getTaskStatus(token);
}

export async function disconnectRocketRide() {
  if (client) {
    await client.disconnect();
    client = null;
    pipelineToken = null;
  }
}
