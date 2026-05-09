export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export const isGoogleOAuthReady =
  googleClientId.endsWith(".apps.googleusercontent.com") &&
  !googleClientId.startsWith("your_") &&
  !googleClientId.includes("your-client-id");
