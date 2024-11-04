import Link from "next/link";
import styles from "./404.module.css";

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className={`text-5xl font-bold ${styles.animatingText} mb-5`}>404</h1>
      <h1 className="text-4xl font-bold text-gray-800">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Maaf, halaman yang Anda cari tidak ada.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-primary border text-white rounded-lg hover:bg-white hover:text-primary"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default Custom404;
