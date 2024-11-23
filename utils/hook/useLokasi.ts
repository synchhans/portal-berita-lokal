import { useState, useEffect } from "react";

const useLokasi = (apiKey: string, isAuthenticated: boolean): any => {
  const [lokasi, setLokasi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationChangeCount, setLocationChangeCount] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    const storedLocation = localStorage.getItem("lokasi");
    if (storedLocation) {
      setLokasi(JSON.parse(storedLocation));
    }

    const storedChangeCount = localStorage.getItem("locationChangeCount");
    const storedLastChange = localStorage.getItem("lastLocationChange");

    if (storedChangeCount) {
      setLocationChangeCount(parseInt(storedChangeCount, 10));
    }

    if (isAuthenticated && storedLastChange) {
      const lastChangeTime = new Date(parseInt(storedLastChange, 10));
      const cooldownTime = 60 * 60 * 1000;
      const currentTime = Date.now();

      if (
        locationChangeCount >= 10 &&
        currentTime - lastChangeTime.getTime() < cooldownTime
      ) {
        setIsCooldown(true);
      } else {
        setIsCooldown(false);
      }
    } else {
      setIsCooldown(false);
    }

    if (isAuthenticated && locationChangeCount < 6) {
      setLocationChangeCount(10);
      localStorage.setItem("locationChangeCount", "10");

      localStorage.removeItem("lastLocationChange");
    }
  }, [isAuthenticated, locationChangeCount]);

  const handleSetLocation = () => {
    const limit = isAuthenticated ? 10 : 6;

    if (isAuthenticated && locationChangeCount >= 10 && isCooldown) {
      setErrorMessage("Tunggu 1 jam sebelum mengubah lokasi lagi.");
      return;
    }

    if (locationChangeCount >= limit) {
      setErrorMessage(
        isAuthenticated
          ? "Anda sudah mencapai batas maksimal pengaturan lokasi."
          : "Batas maksimal pengaturan lokasi sudah tercapai. Silakan login."
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
            );

            if (!response.ok) {
              throw new Error("Gagal mengambil data lokasi.");
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const locationData = data.results[0].components;
              const newLocation: any = {
                lat: latitude,
                long: longitude,
                district: locationData.village || "Unknown",
                regency: locationData.county || "Unknown",
                country: locationData.country || "Unknown",
              };

              setLokasi(newLocation);
              localStorage.setItem("lokasi", JSON.stringify(newLocation));

              const newCount = locationChangeCount + 1;
              setLocationChangeCount(newCount);
              localStorage.setItem("locationChangeCount", newCount.toString());

              const currentTime = Date.now();
              if (isAuthenticated) {
                localStorage.setItem(
                  "lastLocationChange",
                  currentTime.toString()
                );
              }
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

  return {
    lokasi,
    loading,
    errorMessage,
    locationChangeCount,
    isCooldown,
    handleSetLocation,
  };
};

export default useLokasi;
