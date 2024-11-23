"use client";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import useLokasi from "../../../utils/hook/useLokasi";
import { useAuthStatus } from "../../../utils/hook/useAuthStatus";
import SkeletonLocation from "./skeleton/SkeletonLocation";

interface LokasiProps {
  defaultMessage?: string;
}

const Lokasi: React.FC<LokasiProps> = ({
  defaultMessage = "Silakan atur lokasi Anda untuk menampilkan berita lokal",
}) => {
  const API_KEY_OPEN_KAGE = process.env.NEXT_PUBLIC_API_KEY_OPEN_KAGE || "";

  const { isAuthenticated, loading: authLoading } = useAuthStatus();

  const {
    lokasi,
    loading: lokasiLoading,
    errorMessage,
    locationChangeCount,
    handleSetLocation,
    isCooldown,
  } = useLokasi(API_KEY_OPEN_KAGE, isAuthenticated);

  const openGoogleMaps = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
    window.open(url, "_blank");
  };

  if (authLoading || lokasiLoading) {
    return (
      <div className="flex mx-auto justify-center items-center bg-[#212121] text-white h-16 space-x-2 p-5">
        <SkeletonLocation />
      </div>
    );
  }

  const isGuestLimitReached = !isAuthenticated && locationChangeCount >= 6;
  const isUserLimitReached = isAuthenticated && locationChangeCount >= 10;

  const remainingChangesForGuest = 6 - locationChangeCount;
  const remainingChangesForUser = 10 - locationChangeCount;

  const actualRemainingChangesForUser =
    isAuthenticated && locationChangeCount < 6
      ? 10 - locationChangeCount
      : remainingChangesForUser;

  const isDisabled =
    (isAuthenticated && isCooldown) ||
    isGuestLimitReached ||
    isUserLimitReached;

  return (
    <div className="flex mx-auto justify-center items-center bg-[#212121] text-white h-16 space-x-2 p-5">
      {lokasi ? (
        <>
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
        </>
      ) : isAuthenticated ? (
        <h1 className="mr-5">{defaultMessage}</h1>
      ) : isGuestLimitReached ? (
        <h1 className="mr-5">
          Silakan login terlebih dahulu untuk mengubah lokasi Anda.
        </h1>
      ) : (
        <h1 className="mr-5">{defaultMessage}</h1>
      )}

      {errorMessage && <p className="text-red-400">{errorMessage}</p>}

      <button
        onClick={handleSetLocation}
        className={`flex items-center space-x-1 ${
          isDisabled ? "text-red-400 cursor-not-allowed" : "text-blue-400"
        } hover:underline`}
        disabled={isDisabled}
      >
        <FaMapMarkerAlt className="text-lg" />
        <span>
          {lokasi ? "Ubah Lokasi" : "Atur Lokasi"}
          {isGuestLimitReached ? " (Silakan login terlebih dahulu)" : ""}
          {isUserLimitReached ? " (Tunggu 1 Jam)" : ""}
          {!isAuthenticated && !isGuestLimitReached && locationChangeCount < 6
            ? ` (${remainingChangesForGuest} kali tersisa)`
            : ""}
          {isAuthenticated && locationChangeCount < 10
            ? ` (${actualRemainingChangesForUser} kali tersisa)`
            : ""}
        </span>
      </button>
    </div>
  );
};

export default Lokasi;
