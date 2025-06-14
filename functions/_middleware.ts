// Cloudflare Pages middleware for D1 database access
export async function onRequest(context: any) {
  // Add D1 database to the request context
  context.env.DB = context.env.DB;
  
  // Continue to the next middleware or page
  return await context.next();
}