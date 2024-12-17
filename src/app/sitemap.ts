import { MetadataRoute } from "next";
import { connectToDB } from "../../utils/lib/mongoose";
import NewsModel from "../../utils/model/News";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kabarlokal.vercel.app";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/peristiwa-lokal`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/ekonomi`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/bisnis`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/politik`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/kesehatan`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/pendidikan`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/budaya`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/pariwisata`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/teknologi`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/komunitas`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sosial`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/properti`,
      lastModified: new Date(),
    },
  ];

  await connectToDB();
  const news = await NewsModel.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(1000)
    .lean();

  const dynamicRoutes = news.map((article) => ({
    url: `${baseUrl}/${article.category.toLowerCase()}/${article.title_seo}`,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
