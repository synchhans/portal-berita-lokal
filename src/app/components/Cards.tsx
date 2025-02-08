import { FiEye } from "react-icons/fi";
import { formatForUrl } from "../../../utils/format/url.format";
import { News } from "../../../types/News";
import useApproveNews from "../../../utils/hook/useApproveNews";
import useDeleteNews from "../../../utils/hook/useDeleteNews";
import { ObjectId } from "mongoose";

interface CardsProps {
  data: News[];
  role?: string;
  showActions?: boolean;
  showApprove?: boolean;
  showView?: boolean;
  showCancel?: boolean;
  showUpdate?: boolean;
  showDelete?: boolean;
}

const Cards: React.FC<CardsProps> = ({
  data,
  role,
  showActions,
  showApprove,
  showView,
  showCancel,
  showUpdate,
  showDelete,
}) => {
  const { changeNews } = useApproveNews();

  const handleApprove = async (e: React.MouseEvent, itemId: ObjectId) => {
    e.preventDefault();
    changeNews(itemId, "approved");
  };

  const handleUpdate = async (e: React.MouseEvent, itemId: ObjectId) => {
    e.preventDefault();
    window.open(`/news/update?newsId=${itemId}`, "_blank");
  };

  const handleCancle = async (e: React.MouseEvent, itemId: ObjectId) => {
    e.preventDefault();
    changeNews(itemId, "pending");
  };

  const { loading: loadingDelete, error, deleteNews } = useDeleteNews();

  const handleDelete = async (itemId: ObjectId) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      await deleteNews(itemId);
    }
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
            <a
              href={showActions ? "#" : cardPath}
              key={index}
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
                      onClick={(e) => handleApprove(e, item._id)}
                      className="text-green-500 font-semibold hover:underline"
                    >
                      Setujui
                    </button>
                  )}
                  {role !== "provider" && showUpdate && (
                    <button
                      onClick={(e) => handleUpdate(e, item._id)}
                      className="text-orange-500 font-semibold hover:underline"
                    >
                      Update
                    </button>
                  )}
                  {role !== "user" && showCancel && (
                    <button
                      onClick={(e) => handleCancle(e, item._id)}
                      className="text-red-500 font-semibold hover:underline"
                    >
                      Batalkan
                    </button>
                  )}
                  {showView && (
                    <button
                      onClick={() =>
                        window.open(
                          `/${formatForUrl(item.category)}/${item.title_seo}`,
                          "_blank"
                        )
                      }
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      Lihat
                    </button>
                  )}
                  {role !== "provider" && showDelete && (
                    <button
                      onClick={(e) => handleDelete(item._id)}
                      className="text-red-500 font-semibold hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              )}
            </a>
          );
        })
      )}
    </div>
  );
};

export default Cards;
