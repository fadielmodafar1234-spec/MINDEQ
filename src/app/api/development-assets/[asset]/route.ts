import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";

const DEVELOPMENT_MODEL = "development-machine.viewer.glb";

type DevelopmentAssetRouteProps = Readonly<{
  params: Promise<{ asset: string }>;
}>;

export async function GET(
  _request: Request,
  { params }: DevelopmentAssetRouteProps,
) {
  const { asset } = await params;

  if (process.env.NODE_ENV === "production" || asset !== DEVELOPMENT_MODEL) {
    notFound();
  }

  try {
    const model = await readFile(
      join(process.cwd(), ".mindeq-development-assets", DEVELOPMENT_MODEL),
    );

    return new Response(model, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "model/gltf-binary",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    notFound();
  }
}
