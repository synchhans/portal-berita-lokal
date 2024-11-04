"use client";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface LokasiType {
  lat: number;
  long: number;
  district: string;
  regency: string;
  country: string;
}

interface LokasiProps {
  defaultMessage?: string;
}

const Lokasi: React.FC<LokasiProps> = ({
  defaultMessage = "Silakan atur lokasi Anda untuk menampilkan berita lokal",
}) => {
  const [lokasi, setLokasi] = useState<LokasiType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_KEY_OPEN_KAGE = process.env.NEXT_PUBLIC_API_KEY_OPEN_KAGE;

  useEffect(() => {
    const storedLocation = localStorage.getItem("lokasi");
    if (storedLocation) {
      setLokasi(JSON.parse(storedLocation));
    }
  }, []);

  const handleSetLocation = () => {
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
              window.location.reload();
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

  const openGoogleMaps = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex mx-auto justify-center items-center bg-[#212121] text-white h-16 space-x-2 p-5">
      {loading ? (
        <h1 className="mr-5">Mengambil lokasi Anda...</h1>
      ) : lokasi ? (
        <h1 className="mr-5">
          Lokasi Anda saat ini:{" "}
          <u
            className="cursor-pointer hover:underline"
            onClick={() =>
              openGoogleMaps(`${lokasi.district}, ${lokasi.regency}`)
            }
          >
            {lokasi.district}
          </u>
          ,{" "}
          <u
            className="cursor-pointer hover:underline"
            onClick={() => openGoogleMaps(lokasi.regency)}
          >
            {lokasi.regency}
          </u>
          , <span className="text-border">{lokasi.country}</span>
        </h1>
      ) : (
        <h1 className="mr-5">{defaultMessage}</h1>
      )}
      {errorMessage && <p className="text-red-400">{errorMessage}</p>}
      <button
        onClick={handleSetLocation}
        className="flex items-center space-x-1 text-blue-400 hover:underline"
      >
        <FaMapMarkerAlt className="text-lg" />
        <span>{lokasi ? "Ubah Lokasi" : "Atur Lokasi"}</span>
      </button>
    </div>
  );
};

export default Lokasi;
