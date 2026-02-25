import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
const CRON_SECRET = process.env.CRON_SECRET ?? "";

function isAuthorized(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization ?? "";
  return authHeader === `Bearer ${CRON_SECRET}`;
}

async function pingSupabase(): Promise<{ status: number; ok: boolean }> {
  const url = `${SUPABASE_URL}/rest/v1/jobs?limit=1&select=id`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  return { status: res.status, ok: res.ok };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!isAuthorized(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    res.status(500).json({ error: "Missing Supabase environment variables" });
    return;
  }

  const result = await pingSupabase();

  if (!result.ok) {
    res
      .status(502)
      .json({ error: "Supabase ping failed", status: result.status });
    return;
  }

  res.status(200).json({
    success: true,
    pingedAt: new Date().toISOString(),
    supabaseStatus: result.status,
  });
}
