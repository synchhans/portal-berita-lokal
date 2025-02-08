import { useState, useEffect } from "react";

const useLokasi = (isAuthenticated: boolean): any => {
  const [lokasi, setLokasi] = useState<LokasiType | null>(null);
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

    const handleError = (message: string) => {
      setErrorMessage(message);
      setLoading(false);
    };

    const fetchLocationData = async (latitude: number, longitude: number) => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1`;
        const response = await fetch(url, {
          headers: {
            "User-Agent": "PortalBeritaLokal/1.0 muhamadfarhan.inc@gmail.com",
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data lokasi.");
        }

        const data = await response.json();
        if (data && data.address) {
          const address = data.address;

          const district =
            address.village ||
            address.town ||
            address.city ||
            address.suburb ||
            "Unknown";

          const regency =
            address.county ||
            address.state_district ||
            address.city ||
            "Unknown";

          const country = address.country || "Unknown";

          const newLocation = {
            lat: latitude,
            long: longitude,
            district,
            regency,
            country,
          };
          setLokasi(newLocation);
          localStorage.setItem("lokasi", JSON.stringify(newLocation));

          const newCount = locationChangeCount + 1;
          setLocationChangeCount(newCount);
          localStorage.setItem("locationChangeCount", newCount.toString());

          const currentTime = Date.now();
          if (isAuthenticated) {
            localStorage.setItem("lastLocationChange", currentTime.toString());
          }
        } else {
          handleError("Lokasi tidak ditemukan.");
        }
      } catch (error) {
        handleError("Terjadi kesalahan saat mengambil lokasi.");
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.permissions) {
      handleError("Browser tidak mendukung API Permissions.");
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          handleError(
            "Izin lokasi ditolak. Silakan aktifkan izin lokasi di browser."
          );
        } else if (["granted", "prompt"].includes(permissionStatus.state)) {
          if (!navigator.geolocation) {
            handleError("Geolocation is not supported by this browser.");
            return;
          }

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              await fetchLocationData(latitude, longitude);
            },
            (error) => {
              handleError("Error getting location: " + error.message);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }
      });
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
