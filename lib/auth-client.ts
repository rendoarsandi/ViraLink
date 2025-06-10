import { createAuthClient } from "better-auth/react";

// baseURL can be omitted if the auth server is on the same domain
// and uses the default /api/auth path, which is our case.
export const authClient = createAuthClient({});

// Export convenience methods
export const { signIn, signUp, useSession, signOut } = authClient;

// For more specific social sign-in, it's often clearer to call via authClient directly
// e.g., authClient.signIn.social({ provider: "oidc", ... })
// or authClient.signIn.email({ ... }) if email/password were enabled.
