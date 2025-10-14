import { IMAGE_COUNT } from "@/constants";

export async function GET() {
  const response = await fetch("https://picsum.photos/50");

  return new Response(await response.arrayBuffer());
}

export function getStaticPaths() {
  return Array.from({ length: IMAGE_COUNT }, (_, i) => ({
    params: { img_name: `${i}.jpg` },
  }));
}
