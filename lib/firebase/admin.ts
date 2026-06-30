import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let app: App | undefined;
let auth: Auth | undefined;

function getAdminApp(): App {
  if (!app) {
    app =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
              // .env files can't hold real newlines, so private keys are stored
              // with literal "\n" and unescaped here.
              privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
          });
  }
  return app;
}

/** Lazily initialized so importing this module never crashes when env vars are unset (e.g. in tests/build). */
export function getAdminAuth(): Auth {
  if (!auth) {
    auth = getAuth(getAdminApp());
  }
  return auth;
}
