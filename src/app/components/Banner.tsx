"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { formatForUrl } from "../../../utils/format/url.format";
import { News } from "../../../types/News";

interface BannerSliderProps {
  slides: News[];
}

const Banner: React.FC<BannerSliderProps> = ({ slides }) => {
  return (
    <div className="relative w-full max-w-[900px] mx-auto h-[400px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id.toString()}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center brightness-75"
              />
              <div className="absolute bottom-12 left-1.5 mx-10 text-white">
                <p className="text-lg font-bold">Featured</p>
                <p className="text-3xl md:text-4xl font-bold overflow-hidden align-middle text-ellipsis line-clamp-2">
                  {slide.title}
                </p>
                <p className="text-lg line-clamp-1">
                  {new Date(slide.updatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  • <b>{slide.category} •</b>{" "}
                  <Link
                    href={`/${formatForUrl(slide.category)}/${slide.title_seo}`}
                    className="text-sm hover:text-[#ccc]"
                  >
                    Lihat Lebih Detail
                  </Link>
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-4xl text-white hover:text-gray-300">
          <IoIosArrowDropleft />
        </div>
        <div className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-4xl text-white hover:text-gray-300">
          <IoIosArrowDropright />
        </div>
      </Swiper>
    </div>
  );
};

export default Banner;
