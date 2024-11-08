"use client";
import { FiEye } from "react-icons/fi";
import { formatForUrl } from "../../../utils/format/url.format";
import { News } from "../../../types/News";
import { useState } from "react";
import useApproveNews from "../../../utils/hook/useApproveNews";

interface CardsProps {
  data: News[];
  role?: string;
  showActions?: boolean;
  showApprove?: boolean;
  showView?: boolean;
  showCancel?: boolean;
}

const Cards: React.FC<CardsProps> = ({
  data,
  role,
  showActions,
  showApprove,
  showView,
  showCancel,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { loading: isLoading, error, changeNews } = useApproveNews();

  const handleApprove = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    setLoading(true);
    changeNews(itemId, "approved");
  };

  const handleCancle = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    setLoading(true);
    changeNews(itemId, "pending");
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 mb-48">
      {data.length === 0 ? (
        <div className="col-span-full text-center mt-20">
          <p className="text-lg font-semibold text-[#212121]">
            <span className="text-red-500">Berita tidak ada</span>
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
                <div className="flex justify-between items-center text-gray-500 mb-2 text-sm">
                  <span>{relativeTime}</span>
                  <div className="flex items-center gap-1">
                    <FiEye className="text-lg" />
                    <span>{item.views}</span>
                  </div>
                </div>
                {showActions && (
                  <p
                    className={`text-sm font-medium mb-5 ${
                      item.status === "approved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {item.status === "approved"
                      ? "Sudah disetujui oleh admin"
                      : "Belum disetujui oleh admin"}
                  </p>
                )}
              </div>
              {showActions && (
                <div className="p-4 flex justify-around border-t">
                  {role === "admin" && showApprove && (
                    <button
                      onClick={(e) => handleApprove(e, item._id as string)}
                      className="text-green-500 font-semibold hover:underline"
                    >
                      Setujui
                    </button>
                  )}
                  {role === "admin" && showCancel && (
                    <button
                      onClick={(e) => handleCancle(e, item._id as string)}
                      className="text-red-500 font-semibold hover:underline"
                    >
                      Batalkan
                    </button>
                  )}
                  {showView && (
                    <a
                      href={`/${formatForUrl(item.category)}/${item.title_seo}`}
                      className="text-blue-500 font-semibold hover:underline"
                      target="_blank"
                    >
                      Lihat
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Cards;
