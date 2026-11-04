import type { Env } from "./contact-security";

export type RateResult = { allowed: boolean; retryAfter: number };
export type RateLimiter = (key: string, limit: number) => Promise<RateResult>;

export function createMemoryLimiter(now: () => number = Date.now): RateLimiter {
  const entries = new Map<string, { count: number; end: number }>();
  return async (key, limit) => {
    const time = now();
    if (entries.size >= 10_000) {
      for (const [id, entry] of entries) if (entry.end <= time) entries.delete(id);
      if (entries.size >= 10_000 && !entries.has(key)) return { allowed: false, retryAfter: 3600 };
    }
    let entry = entries.get(key);
    if (!entry || entry.end <= time) { entry = { count: 0, end: time + 3_600_000 }; entries.set(key, entry); }
    entry.count++;
    return { allowed: entry.count <= limit, retryAfter: Math.max(1, Math.ceil((entry.end - time) / 1000)) };
  };
}

const memoryLimiter = createMemoryLimiter();
const redisScript = "local c = redis.call('INCR', KEYS[1]); if c == 1 then redis.call('EXPIRE', KEYS[1], 3600) end; return {c, redis.call('TTL', KEYS[1])}";

export function createRateLimiter(env: Env, fetcher: typeof fetch = fetch): RateLimiter {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (env.NODE_ENV === "production" && env.CONTACT_MODE === "resend") return async () => { throw new Error("Shared rate limit unavailable"); };
    return memoryLimiter;
  }
  if (!url.startsWith("https://")) return async () => { throw new Error("Redis requires HTTPS"); };
  return async (key, limit) => {
    const response = await fetcher(url.replace(/\/$/, ""), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", redisScript, "1", key]),
      signal: AbortSignal.timeout(4_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Rate limit unavailable");
    const data = await response.json() as { result?: unknown; error?: string };
    if (data.error || !Array.isArray(data.result) || data.result.length !== 2 || !data.result.every(x => typeof x === "number" && Number.isFinite(x)) || data.result[0] < 1 || data.result[1] < 0) throw new Error("Invalid rate limit response");
    return { allowed: data.result[0] <= limit, retryAfter: Math.max(1, data.result[1]) };
  };
}
