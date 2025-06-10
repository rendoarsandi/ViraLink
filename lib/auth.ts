import { betterAuth } from "better-auth"; // Reverted to main export

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  // socialProviders: {
  //   oidc: {
  //     name: "OIDC Provider", // Often a display name is good practice
  //     clientId: process.env.BETTER_AUTH_CLIENT_ID,
  //     clientSecret: process.env.BETTER_AUTH_CLIENT_SECRET,
  //     issuer: process.env.BETTER_AUTH_ISSUER,
  //     scope: "openid profile email", // Common OIDC scopes
  //   }
  // }
  // Note: Database configuration is mentioned as required in docs,
  // but not part of this specific subtask. This might need addressing later.
  // Also, BetterAuth might require at least one auth method (e.g. email/password)
  // or specific flags if no social providers are defined. This simplification is for testing the TypeError.
});
