// app/campaigns/[id]/page.tsx
"use client"; // Keep if it was there, client components can have params

type PageProps = {
  params: { id: string };
};

export default function MinimalCampaignPage({ params }: PageProps) {
  return <div>Campaign ID: {params.id}</div>;
}
