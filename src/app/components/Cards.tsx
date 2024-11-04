"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { formatForUrl } from "../../../utils/format/url.format";
import { News } from "../../../types/News";

interface CardsProps {
  data: News[];
}

const Cards: React.FC<CardsProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleClick = (e: React.MouseEvent, path: string, index: number) => {
    e.preventDefault();
    setLoading(true);
    setLoadingIndex(index);

    setTimeout(() => {
      router.push(path);
      setLoading(false);
    }, 800);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} minggu yang lalu`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} bulan yang lalu`;
    } else {
      return `${diffInYears} tahun yang lalu`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 max-w-[925px] mx-auto mb-48">
      {data.length === 0 ? (
        <div className="col-span-full text-center mt-20">
          <p className="text-lg font-semibold text-[#212121]">
            <span className="text-red-500">
              Berita di daerah anda tidak ada
            </span>
          </p>
        </div>
      ) : (
        data.map((item, index) => {
          const relativeTime = getRelativeTime(item.updatedAt.toString());
          const cardPath = `/${formatForUrl(item.category)}/${item.title_seo}`;

          return (
            <div
              key={item._id as string}
              className="border rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
              onClick={(e) => handleClick(e, cardPath, index)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-[#212121] font-semibold mb-2 uppercase">
                  {item.category}
                </p>
                <h2 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                  {item.title}
                </h2>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <span>{relativeTime}</span>
                  <div className="flex items-center gap-1">
                    <FiEye className="text-lg" />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Cards;
