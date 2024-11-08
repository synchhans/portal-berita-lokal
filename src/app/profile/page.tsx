"use client";
import { FiUser, FiLogOut } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/hook/useAuth";
import useUserData from "../../../utils/hook/useUserData";
import useFetchUser from "../../../utils/hook/useFetchUser";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { logout, isLoading: loading } = useAuth();

  const { userData: user, isLoading } = useUserData();

  const { userData: userFetch, isLoading: loadingFetch } = useFetchUser(
    user?.id
  );

  console.log(userFetch);

  const handleLogout = async () => {
    await logout();
  };

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
          <h2 className="text-2xl font-bold">
            <a href="/dashboard">Admin</a>
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
              <a href="#" className="block p-4 hover:bg-gray-700">
                <span className="text-amber-500">[Monetization Sys]</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
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
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
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
                </>
              )}
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

        <main className="p-4 pb-44 flex-1">
          <h2 className="text-2xl font-bold mb-6">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Profile Image</label>
              {isLoading ? (
                <div>Loading image...</div>
              ) : (
                <img
                  src={`/images/${user?.image}`}
                  alt="Profile"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              )}
              <input type="file" id="image" className="mt-2" />
            </div>
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                defaultValue={isLoading ? "Loading..." : user?.name}
                disabled={isLoading}
                className="mt-2 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="text"
                defaultValue={isLoading ? "Loading..." : userFetch?.email}
                disabled
                className="mt-2 p-2 w-full bg-gray-100 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Profession</label>
              <input
                type="text"
                defaultValue={
                  isLoading ? "Loading..." : userFetch?.profession || "-"
                }
                disabled={isLoading}
                className="mt-2 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">District</label>
                <input
                  type="text"
                  defaultValue={
                    isLoading
                      ? "Loading..."
                      : userFetch?.preferences.location.district || "-"
                  }
                  disabled
                  className="mt-2 p-2 w-full border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Regency</label>
                <input
                  type="text"
                  defaultValue={
                    isLoading
                      ? "Loading..."
                      : userFetch?.preferences.location.regency || "-"
                  }
                  disabled
                  className="mt-2 p-2 w-full border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Negara</label>
                <input
                  type="text"
                  defaultValue={
                    isLoading
                      ? "Loading..."
                      : userFetch?.preferences.location.country
                  }
                  disabled
                  className="mt-2 p-2 w-full border border-gray-300 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium">Topik Yang disukai</label>
              <div className="flex items-center space-x-2 mt-2">
                {/* Checkboxes for each topic */}
                {["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"].map(
                  (topic, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`topic-${index}`}
                        className="mr-1"
                        disabled={isLoading}
                        // defaultChecked={user?.topics?.includes(topic)}
                      />
                      <label htmlFor={`topic-${index}`} className="mr-3">
                        {topic}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              Ubah Password{" "}
              <a
                href="#"
                target="_blank"
                className="text-blue-700 hover:underline"
              >
                Disini
              </a>
            </p>
            <button className="w-full mt-4 p-3 bg-blue-600 text-white rounded-lg">
              Simpan
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
