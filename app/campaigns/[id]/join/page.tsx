// app/campaigns/[id]/join/page.tsx
"use client"; // Keep if it was there

type PageProps = {
  params: { id: string }; // Assuming 'id' is the parameter for this route as well
};

export default function MinimalJoinPage({ params }: PageProps) {
  return <div>Join Campaign ID: {params.id}</div>;
}
