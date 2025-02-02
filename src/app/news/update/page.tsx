"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../../../utils/hook/useAuth";
import useUserData from "../../../../utils/hook/useUserData";
import useSessionStorage from "../../../../utils/hook/useSessionStorage";
import useUpdateNews from "../../../../utils/hook/useUpdateNews";
import RichTextEditor from "../../vendor/RichTextEditor";

interface NewsFormData {
  namaKomunitas: string;
  judul: string;
  gambarUrl: string;
  kategori: string;
  konten: string;
}

interface Errors {
  judul?: string;
  gambarUrl?: string;
  namaKomunitas?: string;
}

export default function UpdateNews() {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [formData, setFormData] = useSessionStorage<NewsFormData>(
    "formDataUpdate",
    {
      namaKomunitas: "",
      judul: "",
      gambarUrl: "",
      kategori: "komunitas",
      konten: "",
    }
  );
  const [errors, setErrors] = useState<Errors>({});
  const { logout, isLoading: loading } = useAuth();
  const { userData: user } = useUserData();
  const pathname = usePathname();
  const router = useRouter();
  const [newsId, setNewsId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(params);
    }
  }, []);

  useEffect(() => {
    if (searchParams) {
      const idFromParams = searchParams.get("newsId");
      if (idFromParams) {
        localStorage.setItem("newsId", idFromParams);
        setNewsId(idFromParams);

        router.replace("/news/update");
      } else {
        const storedNewsId = localStorage.getItem("newsId");
        setNewsId(storedNewsId);
      }
    }
  }, [searchParams, router]);

  const {
    news,
    fetchNewsById,
    updateNews,
    loading: loadingUpdate,
  } = useUpdateNews();

  useEffect(() => {
    if (newsId && !isFetched) {
      fetchNewsById(newsId!)
        .then(() => setIsFetched(true))
        .catch((err) => console.error("Error fetching news", err));
    }
  }, [newsId, isFetched, fetchNewsById]);

  useEffect(() => {
    if (news) {
      setFormData({
        namaKomunitas: news.category || "",
        judul: news.title,
        gambarUrl: news.image,
        kategori: news.category
          ? news.category.toLowerCase()
          : "peristiwa-lokal",
        konten: news.content,
      });
      setIsLoaded(true);
    }
  }, [news]);

  const handleLogout = async () => {
    await logout();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRichTextChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      konten: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const { judul, gambarUrl, namaKomunitas, kategori } = formData;

    if (!judul) newErrors.judul = "Judul wajib diisi.";
    if (!gambarUrl) newErrors.gambarUrl = "URL gambar wajib diisi.";
    if (kategori === "komunitas" && !namaKomunitas) {
      newErrors.namaKomunitas = "Nama komunitas wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateNews({
        id: newsId,
        title: formData.judul,
        category: formData.kategori,
        image: formData.gambarUrl,
        content: formData.konten,
      });
    } catch (error) {
      console.error("Form submission error", error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 z-40`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-2xl font-semibold">
            <a href="/dashboard">Dashboard</a>
          </h2>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
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
        <nav className="mt-4">
          <ul>
            <li>
              <a
                href="/dashboard"
                className={`block px-6 py-3 hover:bg-gray-700 ${
                  pathname === "/dashboard" ? "bg-gray-700" : ""
                }`}
              >
                Berita Tertunda
              </a>
            </li>
            <li>
              <a
                href="/news/approved"
                className={`block px-6 py-3 hover:bg-gray-700 ${
                  pathname === "/news/approved" ? "bg-gray-700" : ""
                }`}
              >
                Berita Disetujui
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <a href="/">
              <img src="/logo.svg" alt="Logo" className="w-24" />
            </a>
          </div>
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="mr-2 text-gray-800 font-semibold">
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
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

        {/* Form */}
        <main className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Perbarui Berita
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="mb-5">
              <label className="block text-gray-600 font-medium mb-2">
                Judul<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                required
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.judul && (
                <p className="text-red-600 text-sm">{errors.judul}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-gray-600 font-medium mb-2">
                Kategori<span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                disabled
                className="border rounded-lg px-4 py-2 w-full bg-gray-200 cursor-not-allowed"
              >
                <option value="peristiwa-lokal">Peristiwa Lokal</option>
                <option value="komunitas">Komunitas</option>
              </select>
            </div>

            {formData.kategori === "komunitas" && (
              <div className="mb-5">
                <label className="block text-gray-600 font-medium mb-2">
                  Nama Komunitas<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="namaKomunitas"
                  value={formData.namaKomunitas}
                  onChange={handleInputChange}
                  required
                  className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.namaKomunitas && (
                  <p className="text-red-600 text-sm">{errors.namaKomunitas}</p>
                )}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-gray-600 font-medium mb-2">
                Gambar URL<span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="gambarUrl"
                value={formData.gambarUrl}
                onChange={handleInputChange}
                required
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.gambarUrl && (
                <p className="text-red-600 text-sm">{errors.gambarUrl}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-gray-600 font-medium mb-2">
                Konten Berita<span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.konten}
                onChange={handleRichTextChange}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              {loadingUpdate ? "Loading..." : "Perbarui"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
