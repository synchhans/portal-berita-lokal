export default function NewsProvider() {
  return (
    <div>
      <h1>Panel Provider News</h1>
      <p>
        ini adalah <i>Rencana</i> pembuatan fitur untuk track data berita masuk,
        hapus, dari provider mana, untuk melacak data berita provider di
        database
      </p>
      <p>
        rencana Track: <br />
        Total berita masuk: - <br />
        Total berita dihapus: - <br />
        total berita di log: -
      </p>
      <a
        href="/dashboard"
        className="text-blue-500 border font-semibold m-5 p-2 inline-block hover:bg-blue-500 hover:text-white rounded-lg"
      >
        Kembali
      </a>
    </div>
  );
}
