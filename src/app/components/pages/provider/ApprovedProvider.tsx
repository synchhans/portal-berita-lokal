"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../../../utils/hook/useAuth";
import useFetchNews from "../../../../../utils/hook/useFetchNews";
import SkeletonCards from "../../skeleton/SkeletonCards";
import Cards from "../../Cards";
import { FiLogOut, FiUser } from "react-icons/fi";

const ApprovedProvider: React.FC<DashboardProps> = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { logout, isLoading: loading } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  const { newsData, isLoading } = useFetchNews(
    1000,
    "approved",
    "",
    "provider",
    ""
  );

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
            <a href="/dashboard">Provider</a>
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
            <li>
              <a
                href="/news/provider"
                className={`block p-4 text-blue-500 hover:text-white hover:bg-gray-700 ${
                  pathname === "/news/provider" ? "bg-gray-700" : ""
                }`}
              >
                Tinjau Berita
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
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="mr-2 text-gray-700 font-semibold">
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
              <div className="absolute right-0 mt-6 w-48 bg-white rounded-md shadow-lg">
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
          </div>
        </header>

        <main className="p-4 flex-1">
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Berita Disetujui</h2>
            {isLoading ? (
              <SkeletonCards />
            ) : (
              <Cards
                data={newsData}
                role={user?.role}
                showActions={true}
                showView={true}
                showCancel={true}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprovedProvider;
