"use client";
import { useParams } from "next/navigation";
import Header from "../components/Header";
import Lokasi from "../components/Lokasi";
import Cards from "../components/Cards";
import useFetchNews from "../../../utils/hook/useFetchNews";
import Footer from "../components/Footer";
import SkeletonCards from "../components/skeleton/SkeletonCards";
import Custom404 from "../not-found";
import { formatForCategory } from "../../../utils/format/url.format";

const allowedCategories = [
  "peristiwa-lokal",
  "ekonomi",
  "bisnis",
  "politik",
  "kesehatan",
  "pendidikan",
  "budaya",
  "pariwisata",
  "teknologi",
  "komunitas",
  "sosial",
  "properti",
];

export default function Category() {
  const params = useParams();
  const { category } = params;
  const categoryStr = String(category);

  if (!allowedCategories.includes(categoryStr)) {
    return <Custom404 />;
  }

  const { newsData, error, isLoading } = useFetchNews(
    5,
    "approved",
    categoryStr.split("-").join(" ")
  );

  return (
    <div className="w-full max-w-full">
      <Lokasi />
      <Header />
      <div className="flex justify-between my-5 items-center max-w-[900px] mx-auto">
        <div className="text-2xl w-[250px] font-bold whitespace-nowrap">
          Berita {formatForCategory(categoryStr)}
        </div>
        <div className="bg-secondary text-primary px-3 py-2 rounded-full hover:bg-primary hover:text-secondary cursor-pointer font-bold uppercase">
          terlama
        </div>
      </div>
      <div className="max-w-[925px] mx-auto">
        {isLoading ? <SkeletonCards /> : <Cards data={newsData} />}
      </div>
      <Footer />
    </div>
  );
}
