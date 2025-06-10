export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getPrismaEdgeClient } from '@/lib/prisma'; // Updated import
import { CampaignStatus } from '@prisma/client'; // Import enum

export async function GET(request: Request) { // NextRequest not strictly needed if not using its specific props
  const DB_BINDING = process.env.DB;
  if (!DB_BINDING) {
    console.error('D1 Database binding (DB) not found in environment.');
    return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
  }
  // @ts-ignore Property 'DB' might not be on ProcessEnv if not polyfilled, but CF provides it.
  const prisma = getPrismaEdgeClient(DB_BINDING);

  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: CampaignStatus.ACTIVE, // Only fetch active campaigns
      },
      include: {
        // Include creator's profile information, but select only non-sensitive fields
        creator: {
          select: {
            id: true,
            name: true,
            // Do not include email or other sensitive data unless necessary for discovery
          },
        },
      },
      orderBy: {
        created_at: 'desc', // Show newest campaigns first
      },
      // Basic pagination can be added here later if needed (e.g., using take/skip from URL query params)
      // take: 20,
    });

    return NextResponse.json(campaigns, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching discoverable campaigns:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
