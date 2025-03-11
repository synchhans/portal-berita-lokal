import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../utils/hook/useAuth";
import useFetchNews from "../../../../../utils/hook/useFetchNews";
import {
  FiCheckCircle,
  FiLogOut,
  FiPlus,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import SkeletonCards from "../../skeleton/SkeletonCards";
import Cards from "../../Cards";
import useFetchNotif from "../../../../../utils/hook/useFetchNotif";
import { IoMdNotificationsOutline } from "react-icons/io";

const ApprovedUser: React.FC<DashboardProps> = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const { logout, isLoading: loading } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  const { newsData, isLoading } = useFetchNews(
    1000,
    "approved",
    "",
    "",
    user?.id
  );

  const { notifications, isLoading: isNotifLoading } = useFetchNotif(user?.id!);

  const notificationCount = notifications?.length || 0;

  useEffect(() => {
    if (dropdownOpen) {
      setNotifOpen(false);
    }
    if (notifOpen) {
      setDropdownOpen(false);
    }
  }, [dropdownOpen, notifOpen]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      <div
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 z-40`}
      >
        <div className="p-5 relative flex justify-between items-center">
          <h2 className="text-2xl font-bold capitalize">
            <a href="/dashboard">User</a>
          </h2>
          <button
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav>
          <ul>
            <li>
              <a
                href="/dashboard"
                className={`block p-4 hover:bg-gray-700 ${
                  pathname === "/dashboard" ? "bg-gray-700" : ""
                }`}
              >
                Berita Tertunda
              </a>
            </li>
            <li>
              <a
                href="/news/approved"
                className={`block p-4 hover:bg-gray-700 ${
                  pathname === "/news/approved" ? "bg-gray-700" : ""
                }`}
              >
                Berita Disetujui
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 ml-0 lg:ml-64 transition-all">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="/">
              <img src="/logo.svg" alt="Logo" className="w-30 h-30" />
            </a>
          </div>
          <div className="relative">
            <div className="flex items-center cursor-pointer">
              <span
                className="mr-5 relative"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <IoMdNotificationsOutline className="w-8 h-8 text-gray-700 hover:text-blue-600 transition-colors duration-200" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </span>
              <span
                className="mr-2 text-gray-700 font-semibold cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.name}
              </span>
              <img
                src={`/images/${user?.image}`}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-6 w-48 bg-white rounded-md shadow-lg z-10">
                <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <FiUser className="mr-2" /> Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <FiLogOut className="mr-2" />
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="p-4 flex items-center space-x-3 border-b border-gray-200">
                  <IoMdNotificationsOutline className="text-gray-500 text-xl" />
                  <span className="font-medium text-gray-800">Notifikasi</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className="p-4 hover:bg-gray-100 transition-colors duration-150 flex items-start space-x-3"
                      >
                        {notif.status === "approved" && (
                          <FiCheckCircle className="text-green-500 text-lg mt-1" />
                        )}
                        {notif.status === "pending" && (
                          <FiXCircle className="text-red-500 text-lg mt-1" />
                        )}
                        <div>
                          <p className="text-sm text-gray-700">
                            {notif.message}
                          </p>
                          <span
                            className={`text-xs font-medium ${
                              notif.status === "approved"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {notif.status.charAt(0).toUpperCase() +
                              notif.status.slice(1)}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>Belum ada notifikasi</p>
                    </div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm font-medium">Notifikasi</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 flex-1">
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold mb-8">Berita Disetujui</h2>
            <a
              href="/news/create"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center space-x-2"
            >
              <FiPlus className="text-lg" />
              <span>Buat Berita</span>
            </a>
          </div>
          {isLoading ? (
            <SkeletonCards />
          ) : (
            <Cards
              data={newsData}
              role={user?.role}
              showActions={true}
              showView={true}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ApprovedUser;
