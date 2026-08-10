import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";

type DevelopmentAssetDefinition = Readonly<{
  file: string;
  contentType: string;
}>;

const DEVELOPMENT_ASSET_DIRECTORY = join(
  process.cwd(),
  ".mindeq-development-assets",
);
const DEVELOPMENT_ASSETS: Readonly<Record<string, DevelopmentAssetDefinition>> =
  Object.freeze({
    "development-machine.viewer.glb": {
      file: join(
        DEVELOPMENT_ASSET_DIRECTORY,
        "development-machine.viewer.glb",
      ),
      contentType: "model/gltf-binary",
    },
    "development-machine.documentation.txt": {
      file: join(
        DEVELOPMENT_ASSET_DIRECTORY,
        "development-machine.documentation.txt",
      ),
      contentType: "text/plain; charset=utf-8",
    },
  });

type DevelopmentAssetRouteProps = Readonly<{
  params: Promise<{ asset: string }>;
}>;

export async function GET(
  _request: Request,
  { params }: DevelopmentAssetRouteProps,
) {
  const { asset } = await params;

  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const definition = Object.hasOwn(DEVELOPMENT_ASSETS, asset)
    ? DEVELOPMENT_ASSETS[asset]
    : undefined;

  if (!definition) {
    notFound();
  }

  try {
    const assetContents = await readFile(definition.file);

    return new Response(assetContents, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": definition.contentType,
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    notFound();
  }
}
