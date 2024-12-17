import { MetadataRoute } from "next";
import { connectToDB } from "../../utils/lib/mongoose";
import NewsModel from "../../utils/model/News";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kabarlokal.vercel.app";

  await connectToDB();
  const news = await NewsModel.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(1000)
    .lean();

  const dynamicRoutes = news.map((article) => ({
    url: `${baseUrl}/${article.category.toLowerCase()}/${article.title_seo}`,
  }));

  return [...dynamicRoutes];
}
