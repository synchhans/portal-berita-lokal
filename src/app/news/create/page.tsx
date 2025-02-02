"use client";
import { usePathname } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useAuth } from "../../../../utils/hook/useAuth";
import { FiLogOut, FiUser } from "react-icons/fi";
import useUserData from "../../../../utils/hook/useUserData";
import useSessionStorage from "../../../../utils/hook/useSessionStorage";
import useSubmitNews from "../../../../utils/hook/useSubmitNews";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/app/vendor/RichTextEditor";

interface NewsFormData {
  kategori: string;
  namaKomunitas: string;
  judul: string;
  gambarUrl: string;
  kontenBerita: string;
}

interface Errors {
  judul?: string;
  kategori?: string;
  gambarUrl?: string;
  namaKomunitas?: string;
  kontenBerita?: string;
  lokasi?: string;
  tags?: string;
}

export default function CreateNews() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [formData, setFormData] = useSessionStorage<NewsFormData>("formData", {
    kategori: "",
    namaKomunitas: "",
    judul: "",
    gambarUrl: "",
    kontenBerita: "",
  });
  const router = useRouter();
  const [lokasi, setLokasi] = useState<LokasiType | null>(null);
  const [loadingLocation, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const widthRefs = useRef<HTMLSpanElement[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const pathname = usePathname();
  const { logout, isLoading: loading } = useAuth();
  const { userData: user } = useUserData();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_KEY_OPEN_KAGE = process.env.NEXT_PUBLIC_API_KEY_OPEN_KAGE;

  const { submitNews, loading: loadingSubmit } = useSubmitNews();

  const handleLogout = async () => {
    await logout();
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const { judul, kategori, gambarUrl, namaKomunitas, kontenBerita } =
      formData;

    const titleWords = judul.split(/\s+/).length;
    const contentWords = kontenBerita.split(/\s+/).length;

    if (titleWords < 8)
      newErrors.judul = "Judul harus terdiri dari minimal 8 kata.";
    if (!kategori) newErrors.kategori = "Kategori harus diisi.";
    if (!/\.(png|jpg|jpeg)$/i.test(gambarUrl))
      newErrors.gambarUrl = "Gambar harus berekstensi .png, .jpg, atau .jpeg.";
    if (kategori === "komunitas" && namaKomunitas.length < 5) {
      newErrors.namaKomunitas =
        "Nama komunitas harus terdiri dari minimal 5 karakter.";
    }
    if (contentWords < 35 || contentWords > 200) {
      newErrors.kontenBerita =
        "Konten berita harus terdiri dari minimal 35 kata dan maksimal 200 kata.";
    }

    if (!lokasi) {
      newErrors.lokasi = "Lokasi harus diatur sebelum mengirim berita.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formData, lokasi]);

  useEffect(() => {
    const storedLocation = localStorage.getItem("lokasi");
    if (storedLocation) {
      setLokasi(JSON.parse(storedLocation));
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanedTags = tags.slice(0, tags.length - 1);

    try {
      await submitNews({
        title: formData.judul,
        category: formData.kategori,
        image: formData.gambarUrl,
        content: formData.kontenBerita,
        location: lokasi
          ? lokasi
          : { lat: 0, long: 0, district: "", regency: "", country: "" },
        tags: cleanedTags,
      });

      sessionStorage.removeItem("formData");

      setFormData({
        judul: "",
        kontenBerita: "",
        gambarUrl: "",
        kategori: "",
        namaKomunitas: "",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Form submission error", error);
      const alertMessage = sessionStorage.getItem("alertMessage");
      console.log("Alert message from sessionStorage:", alertMessage);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      kontenBerita: value,
    }));
  };

  const handleAmbilLokasi = () => {
    setLoading(true);
    setErrorMessage(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY_OPEN_KAGE}`
            );

            if (!response.ok) {
              throw new Error("Gagal mengambil data lokasi.");
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const locationData = data.results[0].components;
              const newLocation: LokasiType = {
                lat: latitude,
                long: longitude,
                district: locationData.village || "Unknown",
                regency: locationData.county || "Unknown",
                country: locationData.country || "Unknown",
              };

              setLokasi(newLocation);
              localStorage.setItem("lokasi", JSON.stringify(newLocation));
            } else {
              setErrorMessage("Lokasi tidak ditemukan.");
            }
          } catch (error) {
            setErrorMessage("Terjadi kesalahan saat mengambil lokasi.");
            console.error("Error fetching location:", error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setErrorMessage("Error getting location: " + error.message);
          setLoading(false);
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const handleTagChange = (index: number, value: string) => {
    if (value.includes(" ")) return;

    const trimmedValue = value.trim();

    if (tags.includes(trimmedValue) && tags.indexOf(trimmedValue) !== index) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tags: "Tag ini sudah ada, coba tag lain.",
      }));
      return;
    }

    setErrors((prevErrors) => {
      const { tags, ...rest } = prevErrors;
      return rest;
    });

    const newTags = [...tags];
    newTags[index] = trimmedValue;
    setTags(newTags);
  };

  const handleAddTag = (index: number) => {
    if (tags[index] && index === tags.length - 1) {
      setTags([...tags, ""]);
    }
    setTimeout(() => {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }, 0);
  };

  const handleClearTags = () => {
    setTags([""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <button
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
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

      <div className="flex-1 lg:ml-64">
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

        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Buat Berita
            </h2>
          </div>
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
                placeholder="Masukan Judul Berita"
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
                onChange={handleInputChange}
                required
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Kategori</option>
                <option value="peristiwa-lokal">Peristiwa Lokal</option>
                <option value="komunitas">Komunitas</option>
              </select>
              {errors.kategori && (
                <p className="text-red-600 text-sm">{errors.kategori}</p>
              )}
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
                  placeholder="Masukkan Nama Komunitas"
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
              <div className="flex items-center border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-600 mr-1">https://</span>
                <input
                  type="text"
                  name="gambarUrl"
                  value={formData.gambarUrl}
                  onChange={handleInputChange}
                  required
                  className="flex-1 border-none focus:outline-none text-gray-500"
                  placeholder="gambar-online.com/gambar-berita.png"
                />
              </div>
              {errors.gambarUrl && (
                <p className="text-red-600 text-sm">{errors.gambarUrl}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-gray-600 font-medium mb-2">
                Isi Berita<span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.kontenBerita}
                onChange={handleRichTextChange}
              />
              {errors.kontenBerita && (
                <p className="text-red-600 text-sm">{errors.kontenBerita}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 font-semibold text-base mb-3">
                Lokasi Saat Ini<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {["Latitude", "Longitude", "Kecamatan", "Kota", "Negara"].map(
                  (label, index) => (
                    <div key={index}>
                      <label className="block font-medium text-sm text-gray-600 mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        disabled
                        value={
                          label === "Latitude"
                            ? lokasi?.lat ?? "-"
                            : label === "Longitude"
                            ? lokasi?.long ?? "-"
                            : label === "Kecamatan"
                            ? lokasi?.district ?? "-"
                            : label === "Kota"
                            ? lokasi?.regency ?? "-"
                            : label === "Negara"
                            ? "Indonesia"
                            : ""
                        }
                        className="mt-1 px-4 py-2 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-700"
                      />
                    </div>
                  )
                )}
              </div>
              <button
                onClick={handleAmbilLokasi}
                disabled={lokasi !== null}
                className={`bg-green-600 text-white px-4 py-2 mt-4 mb-2 rounded-lg shadow-md font-medium transition duration-200 ${
                  lokasi
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                }`}
              >
                {loadingLocation
                  ? "Mengambil lokasi.."
                  : "Ambil Lokasi Saat Ini"}
              </button>
              {errors.lokasi && (
                <p className="text-red-600 text-sm">{errors.lokasi}</p>
              )}
              {errorMessage && (
                <p className="text-red-800 text-base">{errorMessage}</p>
              )}
            </div>
            <div className="mb-14">
              <label className="block font-semibold text-base text-gray-600 mb-3">
                Tag <span className="text-green-500 text-sm">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-5">
                {tags.map((tag, index) => (
                  <div key={index} className="relative">
                    <span
                      ref={(el) => {
                        if (el) widthRefs.current[index] = el;
                      }}
                      className="absolute invisible whitespace-pre"
                      style={{ padding: "8px" }}
                    >
                      {tag ||
                        (index === 0 ? "Masukkan tag" : "Masukkan tag lainnya")}
                    </span>
                    <input
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      type="text"
                      disabled={index < tags.length - 1}
                      value={tag}
                      placeholder={
                        index === 0 ? "Masukkan tag" : "Masukkan tag lain"
                      }
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(index);
                        }
                      }}
                      style={{
                        width: `${Math.max(
                          widthRefs.current[index]?.offsetWidth || 140,
                          140
                        )}px`,
                      }}
                      className={`px-4 py-2 border rounded-lg shadow-sm text-gray-700 ${
                        index < tags.length - 1
                          ? "bg-gray-200 border-gray-400"
                          : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
              {errors.tags && (
                <p className="text-red-600 text-sm mt-1">{errors.tags}</p>
              )}
              <button
                onClick={handleClearTags}
                className="bg-red-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition duration-200"
              >
                Clear Tags
              </button>
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200  ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isFormValid || loading}
            >
              {loading ? "Menyimpan..." : "Buat Berita"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
