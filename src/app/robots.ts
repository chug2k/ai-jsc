import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app", "/admin", "/auth", "/api"],
    },
    sitemap: "https://jobsearch.quest/sitemap.xml",
  };
}
