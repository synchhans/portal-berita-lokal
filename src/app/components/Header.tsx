"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useSearch } from "../../../utils/hook/useSearch";
import { formatForUrl } from "../../../utils/format/url.format";
import { useAuthStatus } from "../../../utils/hook/useAuthStatus";

export default function Header() {
  const {
    searchQuery,
    handleSearchChange,
    handleSearchSubmit,
    searchResults,
    isLoading,
    setSearchResults,
  } = useSearch();

  const categoryContainerRef = useRef<HTMLDivElement | null>(null);

  const { isAuthenticated, loading } = useAuthStatus();

  const categories = [
    { path: "/", label: "Terbaru" },
    { path: "/peristiwa-lokal", label: "Peristiwa Lokal" },
    { path: "/ekonomi", label: "Ekonomi" },
    { path: "/bisnis", label: "Bisnis" },
    { path: "/politik", label: "Politik" },
    { path: "/kesehatan", label: "Kesehatan" },
    { path: "/pendidikan", label: "Pendidikan" },
    { path: "/budaya", label: "Budaya" },
    { path: "/pariwisata", label: "Pariwisata" },
    { path: "/teknologi", label: "Teknologi" },
    { path: "/komunitas", label: "Komunitas" },
    { path: "/sosial", label: "Sosial" },
    { path: "/properti", label: "Properti" },
  ];

  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    router.push(path);
  };

  const handleScroll = (direction: "left" | "right") => {
    const scrollAmount = 200;
    if (categoryContainerRef.current) {
      const scrollLeft = categoryContainerRef.current.scrollLeft;
      if (direction === "left") {
        categoryContainerRef.current.scrollLeft = Math.max(
          scrollLeft - scrollAmount,
          0
        );
      } else if (direction === "right") {
        const scrollWidth = categoryContainerRef.current.scrollWidth;
        const containerWidth = categoryContainerRef.current.clientWidth;
        categoryContainerRef.current.scrollLeft = Math.min(
          scrollLeft + scrollAmount,
          scrollWidth - containerWidth
        );
      }
    }
  };

  const searchRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSearchResults]);

  useEffect(() => {
    if (categoryContainerRef.current) {
      const activeCategory = Array.from(
        categoryContainerRef.current.querySelectorAll(".btn-category")
      ).find((element) =>
        (element as HTMLElement).classList.contains("active")
      );

      if (activeCategory) {
        categoryContainerRef.current.scrollLeft =
          (activeCategory as HTMLElement).offsetLeft - 100;
      }
    }
  }, [pathname]);

  return (
    <header className="flex flex-col justify-center text-center md:px-5">
      <div className="flex flex-col lg:flex-row justify-center text-center mt-5 items-center gap-y-2 lg:gap-x-9 lg:h-[50px] search-bar">
        <Link href="/">
          <Image
            src="/logo.svg"
            width={0}
            height={0}
            alt="Logo PORT"
            className="inline-block w-auto h-auto"
          />
        </Link>

        <div className="hidden lg:block">
          <Image
            src="/line.svg"
            width={0}
            height={0}
            alt="Line"
            className="inline-block w-auto h-auto"
          />
        </div>

        <div ref={searchRef} className="w-full max-w-[450px] relative px-5 md:px-0">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="search-bar rounded-3xl flex items-center justify-between border border-border focus-within:border-primary">
              <FaSearch className="text-hint fa-search ml-3" />
              <input
                type="text"
                className="w-full h-11 rounded-3xl outline-none font-semibold px-2 caret-dark text-lg text-[#9d9d9d]"
                placeholder="Cari berita tren terkini hari ini..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </form>

          {searchResults.length > 0 && (
            <div
              ref={resultsRef}
              className="absolute left-0 right-0 mx-8 md:mx-0 z-10 bg-white border-gray-200 max-h-[300px] overflow-y-auto shadow-lg rounded-lg"
            >
              {isLoading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : (
                searchResults.map((news) => (
                  <Link
                    key={news._id}
                    href={`/${formatForUrl(news.category)}/${formatForUrl(
                      news.title
                    )}`}
                    className="block p-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-1">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {news.location.district} - {news.category} -{" "}
                          {new Date(news.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 lg:mt-0">
          {loading ? (
            <div className="bg-transparent border border-border px-4 py-2 rounded-full font-bold">
              Checking
            </div>
          ) : isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="bg-primary text-light px-4 py-2 rounded-full flex items-center gap-2 font-bold"
              >
                DASHBOARD
              </Link>
              <Link
                href="/profile"
                className="bg-transparent border border-border px-4 py-2 rounded-full hover:bg-primary hover:text-light hover:border-light font-bold"
              >
                PROFILE
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-transparent border border-border px-4 py-2 rounded-full hover:bg-primary hover:text-light hover:border-light font-bold"
              >
                MASUK
              </Link>
              <Link
                href="/register"
                className="bg-primary text-light px-4 py-2 rounded-full flex items-center gap-2 font-bold"
              >
                DAFTAR
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="relative max-w-[445px] md:max-w-[700px] lg:max-w-[920px] mx-auto my-5">
        <div className="flex items-center ">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 text-gray-600 hover:text-primary"
          >
            <FaChevronLeft size={20} />
          </button>

          <div
            ref={categoryContainerRef}
            className="flex-1 overflow-hidden category-container"
          >
            <div className="flex flex-nowrap whitespace-nowrap items-center gap-1 transition-transform duration-300 ease-in-out">
              {categories.map(({ path, label }) => (
                <a
                  key={path}
                  href={path}
                  onClick={(e) => handleCategoryClick(e, path)}
                  className={`btn-category ${isActive(path) ? "active" : ""}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleScroll("right")}
            className="p-2 text-gray-600 hover:text-primary"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
