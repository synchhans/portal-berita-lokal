import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/profile/"],
    },
    sitemap: "https://kabarlokal.vercel.app/sitemap.xml",
  };
}