import { randomBytes } from "crypto"

/**
 * Generate a cryptographically secure tracking code
 * @param length - Length of the tracking code (default: 12)
 * @returns A secure random tracking code
 */
export function generateTrackingCode(length: number = 12): string {
  const bytes = randomBytes(Math.ceil(length / 2))
  return bytes.toString('hex').substring(0, length)
}

/**
 * Generate a complete tracking link
 * @param baseUrl - Base URL of the application
 * @param trackingCode - Optional tracking code (will generate if not provided)
 * @returns Complete tracking link
 */
export function generateTrackingLink(baseUrl: string, trackingCode?: string): string {
  const code = trackingCode || generateTrackingCode()
  return `${baseUrl}/track/${code}`
}