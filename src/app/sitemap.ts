import type { MetadataRoute } from "next";

import { getPublishedMachineSlugs } from "@/lib/machines/repository";

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredSiteUrl = process.env.MINDEQ_SITE_URL;

  if (!configuredSiteUrl) {
    throw new Error(
      "MINDEQ_SITE_URL must contain the approved site origin before building the sitemap.",
    );
  }

  const siteUrl = new URL(configuredSiteUrl);

  if (siteUrl.protocol !== "https:" && siteUrl.protocol !== "http:") {
    throw new Error("MINDEQ_SITE_URL must use the http or https protocol.");
  }
  const paths = [
    "/",
    "/machines",
    ...getPublishedMachineSlugs().map((slug) => `/machines/${slug}`),
  ];

  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }));
}
