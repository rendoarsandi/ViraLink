import { z } from "zod"

// Campaign validation schemas
export const joinCampaignSchema = z.object({
  campaignId: z.string().min(1, "Campaign ID is required"),
})

export const createCampaignSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  objective: z.string().optional(),
  budget: z.number().int().min(0, "Budget must be a positive number").optional(),
  rewardModel: z.string().optional(),
  rewardRate: z.number().int().min(0, "Reward rate must be a positive number").optional(),
  contentLink: z.string().url("Content link must be a valid URL").optional(),
  instructions: z.string().optional(),
})

// Profile validation schemas
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  userType: z.enum(["creator", "promoter"]).optional(),
})

// Query parameter schemas
export const campaignQuerySchema = z.object({
  status: z.enum(["active", "paused", "completed"]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
})

export type JoinCampaignInput = z.infer<typeof joinCampaignSchema>
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CampaignQueryInput = z.infer<typeof campaignQuerySchema>