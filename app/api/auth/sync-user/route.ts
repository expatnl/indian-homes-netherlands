import { NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth/server";
import { syncUserRecord } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const MAX_NAME_LENGTH = 200;

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);

    // Section 7.2d pattern, established here: email is taken only from the
    // verified token (never client-supplied, to prevent spoofing a
    // different address than the authenticated account); name is
    // length-capped and trimmed server-side regardless of any client-side
    // check.
    const body = await request.json().catch(() => ({}));
    const rawName = typeof body?.name === "string" ? body.name : user.name;
    const name = (rawName ?? "").trim().slice(0, MAX_NAME_LENGTH);
    const email = user.email;

    if (!email) {
      return NextResponse.json(
        { error: "Authenticated token has no email claim" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    await syncUserRecord({ id: user.uid, email, name });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
