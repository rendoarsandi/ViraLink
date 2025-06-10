export const runtime = 'edge';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPrismaEdgeClient } from '@/lib/prisma'; // Updated import
import { auth } from '@/lib/auth'; // Server-side auth instance from lib/auth.ts
import { CampaignStatus, RewardModel, UserType } from '@prisma/client'; // Import enums

// Define a more specific type for the expected request body
interface CreateCampaignRequestBody {
  title: string;
  description?: string;
  objective?: string;
  budget?: number;
  reward_model?: RewardModel; // Use the Prisma enum
  reward_rate?: number;
  content_link?: string;
  instructions?: string;
  // status will be defaulted to ACTIVE or PENDING internally
  // creator_id will be derived from the session
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

    // Fetch user's profile to get profile.id (as creator_id) and check user_type
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.id }, // Profile.id is User.id
    });

    if (!profile) {
      return NextResponse.json({ error: 'Forbidden: Profile not found for user' }, { status: 403 });
    }

    if (profile.user_type !== UserType.CREATOR) {
      return NextResponse.json({ error: 'Forbidden: User is not a CREATOR' }, { status: 403 });
    }

    // 2. Request Body Parsing and Validation
    const body = await request.json() as CreateCampaignRequestBody;

    // Basic validation (more comprehensive validation should be added)
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Bad Request: title is required and must be a string' }, { status: 400 });
    }
    if (body.budget && typeof body.budget !== 'number') {
      return NextResponse.json({ error: 'Bad Request: budget must be a number' }, { status: 400 });
    }
    if (body.reward_rate && typeof body.reward_rate !== 'number') {
      return NextResponse.json({ error: 'Bad Request: reward_rate must be a number' }, { status: 400 });
    }
    if (body.reward_model && !Object.values(RewardModel).includes(body.reward_model)) {
      return NextResponse.json({ error: 'Bad Request: Invalid reward_model' }, { status: 400 });
    }

    // 3. Database Interaction
    const newCampaign = await prisma.campaign.create({
      data: {
        title: body.title,
        description: body.description,
        objective: body.objective,
        budget: body.budget,
        reward_model: body.reward_model,
        reward_rate: body.reward_rate,
        content_link: body.content_link,
        instructions: body.instructions,
        status: CampaignStatus.ACTIVE, // Default status for new campaigns
        creator_id: profile.id, // Link to the creator's profile ID
        // promoters_count, clicks_count, spent_budget default to 0 in schema
      },
    });

    // 4. Response
    return NextResponse.json(newCampaign, { status: 201 });

  } catch (error: any) {
    console.error('Error creating campaign:', error);
    if (error.name === 'SyntaxError') { // From request.json()
        return NextResponse.json({ error: 'Bad Request: Invalid JSON format' }, { status: 400 });
    }
    // Prisma errors can also be caught and handled more specifically if needed
    // e.g., error instanceof Prisma.PrismaClientKnownRequestError
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
