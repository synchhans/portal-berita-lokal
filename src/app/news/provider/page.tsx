export default function NewsProvider() {
  return (
    <div className="m-5">
      <h1 className="text-5xl">Panel Provider News</h1>
      <button>Perbarui Berita</button>
      <button>Tambah Berita</button>
      <button>Hapus Berita</button>
      <a
        href="/dashboard"
        className="text-blue-500 border font-semibold ml-3 mt-20 p-2 inline-block hover:bg-blue-500 hover:text-white rounded-lg"
      >
        Kembali
      </a>
    </div>
  );
}
