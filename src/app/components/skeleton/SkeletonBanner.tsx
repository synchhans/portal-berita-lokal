"use client";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

const SkeletonBanner: React.FC = () => {
  return (
    <div className="relative w-full max-w-[900px] mx-auto h-[400px] overflow-hidden bg-gray-300 animate-pulse">
      <div className="absolute inset-0 flex flex-col justify-end p-16 bg-gradient-to-t from-gray-700 to-transparent">
        <div className="w-24 h-6 bg-gray-400 rounded mb-2"></div>
        <div className="w-3/4 h-8 bg-gray-400 rounded mb-2"></div>
        <div className="w-1/2 h-6 bg-gray-400 rounded mb-2"></div>
      </div>

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
        <IoIosArrowDropleft className="text-5xl text-gray-500" />
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
        <IoIosArrowDropright className="text-5xl text-gray-500" />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === 0 ? "bg-gray-400" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonBanner;
