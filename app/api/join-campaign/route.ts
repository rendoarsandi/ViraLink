export const runtime = 'edge';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPrismaEdgeClient } from '@/lib/prisma'; // Updated import
import { auth } from '@/lib/auth'; // Server-side auth instance
import { UserType, CampaignStatus, PromoterCampaignStatus } from '@prisma/client'; // Import enums

interface JoinCampaignRequestBody {
  campaignId: string;
}

export async function POST(request: NextRequest) {
  const DB_BINDING = process.env.DB;
  if (!DB_BINDING) {
    console.error('D1 Database binding (DB) not found in environment.');
    return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
  }
  // @ts-ignore Property 'DB' might not be on ProcessEnv if not polyfilled, but CF provides it.
  const prisma = getPrismaEdgeClient(DB_BINDING);

  try {
    // 1. Authentication and Authorization
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: session.user.id }, // Profile.id is User.id
    });

    if (!profile) {
      return NextResponse.json({ error: 'Forbidden: Profile not found for user' }, { status: 403 });
    }

    if (profile.user_type !== UserType.PROMOTER) {
      return NextResponse.json({ error: 'Forbidden: User is not a PROMOTER' }, { status: 403 });
    }

    // 2. Request Body Parsing and Validation
    const body = await request.json() as JoinCampaignRequestBody;
    const { campaignId } = body;

    if (!campaignId || typeof campaignId !== 'string') {
      return NextResponse.json({ error: 'Bad Request: campaignId is required and must be a string' }, { status: 400 });
    }

    // 3. Database Interaction
    // Check if campaign exists and is active
    const campaignToJoin = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaignToJoin) {
      return NextResponse.json({ error: 'Not Found: Campaign does not exist' }, { status: 404 });
    }

    if (campaignToJoin.status !== CampaignStatus.ACTIVE) {
      return NextResponse.json({ error: 'Conflict: Campaign is not active and cannot be joined' }, { status: 409 });
    }

    // Prevent creator from joining their own campaign as a promoter
    if (campaignToJoin.creator_id === profile.id) {
      return NextResponse.json({ error: 'Conflict: Creator cannot join their own campaign as a promoter' }, { status: 409 });
    }

    // Check if promoter already joined this campaign
    const existingPromoterCampaign = await prisma.promoterCampaign.findUnique({
      where: {
        promoter_id_campaign_id: { // This is the default name for the @@unique constraint
          promoter_id: profile.id,
          campaign_id: campaignId,
        },
      },
    });

    if (existingPromoterCampaign) {
      return NextResponse.json({ error: 'Conflict: Promoter has already joined this campaign' }, { status: 409 });
    }

    // Create PromoterCampaign record
    // For tracking_link, a unique link should be generated. For now, a placeholder.
    // In a real app, this would involve a link generation service or a more robust unique string.
    const uniqueTrackingCode = `${profile.id.substring(0, 4)}-${campaignId.substring(0, 4)}-${Date.now().toString().slice(-4)}`;
    const tracking_link = `https://example.com/track/${uniqueTrackingCode}`; // Placeholder

    const newPromoterCampaign = await prisma.promoterCampaign.create({
      data: {
        promoter_id: profile.id,
        campaign_id: campaignId,
        tracking_link: tracking_link, // Needs a robust unique generation strategy
        status: PromoterCampaignStatus.ACTIVE, // Or PENDING if approval is needed
        // clicks and earnings default to 0
      },
    });

    // Optionally, update campaign's promoters_count (application-level logic)
    // This was previously handled by a DB trigger, now needs to be done here.
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        promoters_count: {
          increment: 1,
        },
      },
    });


    // 4. Response
    return NextResponse.json(newPromoterCampaign, { status: 201 });

  } catch (error: any) {
    console.error('Error joining campaign:', error);
    if (error.name === 'SyntaxError') { // From request.json()
        return NextResponse.json({ error: 'Bad Request: Invalid JSON format' }, { status: 400 });
    }
    // Handle Prisma unique constraint violation if tracking_link wasn't unique (though unlikely with current placeholder)
    // if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    //   return NextResponse.json({ error: 'Conflict: Could not generate unique tracking link or record already exists.' }, { status: 409 });
    // }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
