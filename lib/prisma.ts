import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

// This type should match the actual D1Database binding type from Cloudflare
// For now, using `any` as a placeholder. In a real CF Worker/Pages env, this would be D1Database.
type D1DatabaseBinding = any;

// Store for the Node.js Prisma Client singleton
declare global {
  // eslint-disable-next-line no-var
  var __prismaNodeClient: PrismaClient | undefined;
}

let prismaNode: PrismaClient;

// Heuristic: Initialize prismaNode only if not in an Edge-like build/runtime context.
// process.env.NEXT_RUNTIME === 'edge' is set by Next.js when building/running for Edge.
// process.env.CF_PAGES is an example of a Cloudflare-specific build variable.
if (process.env.NEXT_RUNTIME !== 'edge' && !process.env.CF_PAGES) {
  if (!global.__prismaNodeClient) {
    console.log("Initializing PrismaClient for Node.js environment (e.g., local SQLite via DATABASE_URL).");
    global.__prismaNodeClient = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
    });
  }
  prismaNode = global.__prismaNodeClient;
} else {
  // In an Edge build/runtime, prismaNode should not be used by Edge functions.
  // Assign a proxy that throws an error if accessed, to catch incorrect usage by Edge code.
  // @ts-ignore
  prismaNode = new Proxy({}, {
    get: (target, prop) => {
      // Allow specific introspection properties often used by Next.js build or dev tools
      if (typeof prop === 'string' && (prop === 'then' || prop === 'constructor' || prop === 'toString' || prop === 'valueOf' || prop.startsWith('_') || prop.startsWith('$'))) {
        return undefined;
      }
      console.warn(`Attempted to access prismaNode.${String(prop)} in an Edge environment. Edge functions should use getPrismaEdgeClient().`);
      throw new Error("Default prismaNode client (from default export) cannot be used in Edge. Use getPrismaEdgeClient().");
    }
  }) as PrismaClient;
}

export { prismaNode }; // Export for non-Edge use cases (e.g., seeding, local scripts).

/**
 * Creates a new Prisma Client instance specifically for Edge environments (e.g., Cloudflare Workers/Pages).
 * This client is configured with the PrismaD1 adapter and requires the D1 database binding.
 * @param d1Binding The D1 Database binding from the Cloudflare environment (e.g., env.DB).
 * @returns A new PrismaClient instance configured for D1.
 */
export function getPrismaEdgeClient(d1Binding: D1DatabaseBinding): PrismaClient {
  if (!d1Binding) {
    // This check is crucial for runtime.
    console.error("D1 Database binding is undefined. Cannot initialize PrismaClient for Edge.");
    throw new Error("D1 Database binding is required to initialize PrismaClient for Edge.");
  }
  const adapter = new PrismaD1(d1Binding);
  return new PrismaClient({ adapter });
}