import { getAdminAuth } from "@/lib/firebase/admin";
import { isUserAdmin } from "@/lib/supabase/admin";

export class AuthError extends Error {
  status: 401 | 403;

  constructor(status: 401 | 403, message: string) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

/**
 * PRD §7.2c: "User must be authenticated (any valid Firebase JWT)".
 * Verifies the Bearer token server-side via the Firebase Admin SDK —
 * never trust a UID supplied by the client itself.
 */
export async function requireAuth(request: Request): Promise<AuthenticatedUser> {
  const token = extractBearerToken(request);
  if (!token) {
    throw new AuthError(401, "Missing or malformed Authorization header");
  }

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch {
    throw new AuthError(401, "Invalid or expired token");
  }

  return {
    uid: decoded.uid,
    email: decoded.email,
    name: typeof decoded.name === "string" ? decoded.name : undefined,
    picture: typeof decoded.picture === "string" ? decoded.picture : undefined,
  };
}

/**
 * PRD §7.2c: "listings.user_id must equal the authenticated user's UID" —
 * the IDOR check. Every mutating route must re-fetch the resource and call
 * this with the resource's *actual* owner id, never a client-supplied one.
 */
export function requireOwnership(resourceUserId: string, authenticatedUserId: string): void {
  if (resourceUserId !== authenticatedUserId) {
    throw new AuthError(403, "You do not have permission to perform this action");
  }
}

/** PRD §7.2c: "User must be authenticated AND users.is_admin = true". */
export async function requireAdmin(request: Request): Promise<AuthenticatedUser> {
  const user = await requireAuth(request);
  const admin = await isUserAdmin(user.uid);
  if (!admin) {
    throw new AuthError(403, "Admin access required");
  }
  return user;
}
