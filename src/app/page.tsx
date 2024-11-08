"use client";
import Banner from "./components/Banner";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Lokasi from "./components/Lokasi";
import SkeletonBanner from "./components/skeleton/SkeletonBanner";
import SkeletonCards from "./components/skeleton/SkeletonCards";
import useFetchNews from "../../utils/hook/useFetchNews";
import AlertManager from "./components/AlertManager";

export default function Home() {
  const { newsData, error, isLoading } = useFetchNews(7, "approved");

  if (error) {
    return <div>Error: {error}</div>;
  }

  const slides = newsData.slice(0, 5);
  const cardsData = newsData.slice(5, 7);

  return (
    <div className="w-full max-w-full">
      <Lokasi />
      <AlertManager path="/" />
      <Header />
      {isLoading ? <SkeletonBanner /> : <Banner slides={slides} />}
      <div className="flex justify-between my-5 items-center max-w-[900px] mx-auto">
        <div className="text-2xl w-[250px] font-bold">Berita Tren Terbaru</div>
        <div className="bg-secondary text-primary px-3 py-2 rounded-full hover:bg-primary hover:text-secondary cursor-pointer font-bold uppercase">
          terkini
        </div>
      </div>
      <div className="max-w-[925px] mx-auto">
        {isLoading ? <SkeletonCards /> : <Cards data={cardsData} />}
      </div>
      <Footer />
    </div>
  );
}
