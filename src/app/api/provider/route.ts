import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "../../../../utils/lib/authHelper";
import { connectToDB } from "../../../../utils/lib/mongoose";
import NewsModel from "../../../../utils/model/News";
import { formatForUrl } from "../../../../utils/format/url.format";

const categories = [
  "Ekonomi",
  "Bisnis",
  "Politik",
  "Kesehatan",
  "Pendidikan",
  "Budaya",
  "Pariwisata",
  "Teknologi",
  "Komunitas",
  "Sosial",
  "Properti",
];

const NEWSAPI_API_KEY = process.env.NEWS_API_KEY;
const authorId = process.env.NEWS_API_AUTHORID;
const NEWSAPI_LANGUAGE = process.env.NEWS_API_LANGUAGE;

const defaultLocation = {
  lat: -6.9986312,
  long: 107.8308232,
  district: "Cicalengka Wetan",
  regency: "Bandung",
  country: "Indonesia",
};

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);

    if (!user || (user.role !== "admin" && user.role !== "provider")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    await connectToDB();

    const allArticles = [];
    const allTitles = new Set();

    for (const category of categories) {
      const url = `https://newsapi.org/v2/everything?q=${category}&language=${NEWSAPI_LANGUAGE}&apiKey=${NEWSAPI_API_KEY}`;
      const response = await fetch(url);

      const data = await response.json();
      if (!data.articles || !Array.isArray(data.articles)) {
        console.warn(`Invalid articles data for category ${category}.`);
        continue;
      }

      const categoryArticles = [];
      const allImages = new Set();

      for (const article of data.articles) {
        if (
          article.title &&
          article.publishedAt &&
          article.urlToImage &&
          article.content &&
          article.url &&
          !allTitles.has(article.title) &&
          !allImages.has(article.urlToImage)
        ) {
          allTitles.add(article.title);
          allImages.add(article.urlToImage);

          categoryArticles.push({
            title: article.title,
            title_seo: formatForUrl(article.title),
            content: article.content,
            image: article.urlToImage,
            author: authorId,
            url: article.url,
            location: defaultLocation,
            category: category,
            type: "provider",
            tags: article.tags || [category],
            status: "approved",
            ratings: {
              totalStars: 0,
              totalRatings: 0,
              userRatings: [],
            },
            views: 0,
          });
        }

        if (categoryArticles.length >= 4) break;
      }

      allArticles.push(...categoryArticles);
    }

    await NewsModel.deleteMany({ author: authorId });

    if (allArticles.length > 0) {
      await NewsModel.bulkWrite(
        allArticles.map((article) => ({
          updateOne: {
            filter: { title: article.title },
            update: { $set: article },
            upsert: true,
          },
        }))
      );

      return NextResponse.json(
        {
          message: `${allArticles.length} news successfully saved to DB`,
          news: allArticles,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No new unique articles to save." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error saving news to DB:", error);
    return NextResponse.json(
      { error: "Error saving news to DB" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { authorId } = await req.json();
    if (!authorId) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 }
      );
    }

    const user = await authenticate(req);
    if (!user || (user.role !== "admin" && user.role !== "provider")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    await connectToDB();
    const result = await NewsModel.deleteMany({ author: authorId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "No news found for this author" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `${result.deletedCount} news successfully deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error delete news provider:", error);
    return NextResponse.json(
      { error: "Error delete news provider" },
      { status: 500 }
    );
  }
}