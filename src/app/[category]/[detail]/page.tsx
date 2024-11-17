"use client";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import { useFetchDetailNews } from "../../../../utils/hook/useFetchDetailNews";
import { FaRegStar } from "react-icons/fa";
import Footer from "@/app/components/Footer";
import { formatForUrl } from "../../../../utils/format/url.format";
import SkeletonDetail from "@/app/components/skeleton/SkeletonDetail";

export default function Detail() {
  const params = useParams();
  const { detail } = params;
  const detailStr = String(detail);

  const { newsDetail, moreNewsByAuthor, author, isLoading } =
    useFetchDetailNews(detailStr, 5);

  if (isLoading) {
    return <SkeletonDetail />;
  }

  return (
    <div className="flex flex-col w-full max-w-full px-4 lg:px-0">
      <Header />
      {newsDetail ? (
        <div className="flex flex-col md:flex-row max-w-7xl my-5 mx-auto lg:mr-0">
          <div className="flex-1 p-6">
            <div className="text-center mb-5">
              <p className="text-lg text-gray-600">
                {new Date(newsDetail.updatedAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {newsDetail.title}
              </h1>
            </div>

            <div className="flex items-center justify-center mb-5 space-x-3">
              <div className="border border-gray-200 rounded-full w-[50px] h-[50px] overflow-hidden bg-gray-100">
                <img
                  src={`/images/${author?.image}`}
                  alt="Author"
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-sm font-bold">{author?.name}</h2>
                <p className="text-xs text-gray-500">
                  {author?.profession || "Penulis"}
                </p>
              </div>
              {newsDetail.status === "approved" ? (
                <div className="ml-10 flex items-center">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, index) => (
                      <FaRegStar
                        key={index}
                        className={
                          index < newsDetail.ratings.totalStars
                            ? "text-primary"
                            : ""
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-dark ml-1">
                    ({newsDetail.ratings.totalStars} Starts)
                  </p>
                </div>
              ) : (
                <p className="text-sm text-yellow-600 ml-10">[Drafted]</p>
              )}
            </div>

            <div className="relative w-full h-[450px] lg:h-[500px] overflow-hidden mb-10">
              <img
                src={newsDetail.image}
                alt="Gambar Detail"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {newsDetail.content}
            </p>
          </div>

          <div className="hidden md:block w-1/3 my-36 lg:mt-52 lg:mr-5">
            <h2 className="font-bold text-lg mb-4">
              Berita Lain dari Penulis:
            </h2>
            <div className="space-y-4">
              {moreNewsByAuthor
                .filter((news) => news.title !== newsDetail.title)
                .map((news) => (
                  <a
                    key={news.id}
                    href={`/${formatForUrl(news.category)}/${formatForUrl(
                      news.title
                    )}`}
                    className="block border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow duration-200 hover:cursor-pointer"
                  >
                    <div>
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-36 object-cover rounded-md mb-2"
                      />
                      <h3 className="font-semibold text-sm mb-3">
                        {news.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(news.updatedAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          <div className="block md:hidden mt-10">
            <h2 className="font-bold text-lg mb-4">
              Berita Lain dari Penulis:
            </h2>
            <div className="space-y-4">
              {moreNewsByAuthor.length === 1 ? (
                <div className="col-span-full text-center mt-20">
                  <p className="text-lg font-semibold text-[#212121]">
                    <span className="text-red-500">Berita tidak ada</span>
                  </p>
                </div>
              ) : (
                moreNewsByAuthor
                  .filter((news) => news.title !== newsDetail.title)
                  .map((news) => (
                    <div
                      key={news.id}
                      className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow duration-200 hover:cursor-pointer"
                    >
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-36 object-cover rounded-md mb-2"
                      />
                      <h3 className="font-semibold text-sm mb-3">
                        {news.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(news.updatedAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">404 - News not found</p>
        </div>
      )}
      <Footer />
    </div>
  );
}
