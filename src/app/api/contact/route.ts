import { legalReady } from "@/config/site";
import { createContactHandler } from "@/lib/contact-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return createContactHandler({ env: process.env, legalIsReady: legalReady() })(request);
}
