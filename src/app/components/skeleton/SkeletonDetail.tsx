"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function SkeletonDetail() {
  return (
    <div className="flex flex-col w-full max-w-full px-4 lg:px-0">
      <Header />
      <div className="flex flex-col md:flex-row max-w-7xl my-5 mx-auto lg:mr-0">
        <div className="flex-1 p-6 animate-pulse">
          <div className="text-center mb-5">
            <div className="bg-gray-300 h-5 w-32 mx-auto rounded mb-2"></div>
            <div className="bg-gray-300 h-8 w-3/4 mx-auto rounded"></div>
          </div>

          <div className="flex items-center justify-center mb-5 space-x-3">
            <div className="bg-gray-200 rounded-full w-[50px] h-[50px]"></div>
            <div>
              <div className="bg-gray-200 h-4 w-24 rounded mb-1"></div>
              <div className="bg-gray-200 h-3 w-20 rounded"></div>
            </div>
            <div className="ml-10 flex items-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 w-5 h-5 rounded-full"
                  ></div>
                ))}
              </div>
              <div className="bg-gray-200 h-4 w-10 rounded ml-2"></div>
            </div>
          </div>

          <div className="relative w-[434.92px] h-[450px] lg:w-[785.35px] lg:h-[450px] bg-gray-200 rounded-lg mb-10"></div>

          <div className="space-y-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 h-4 w-full rounded"></div>
            ))}
          </div>
        </div>

        <div className="hidden md:block w-1/3 my-36 lg:mt-52 lg:mr-5 animate-pulse">
          <div className="bg-gray-200 h-6 w-48 mb-4 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-white shadow-md transition-shadow duration-200 w-[326.66px] h-[225.74px] lg:w-[426.66px]"
              >
                <div className="bg-gray-200 h-36 w-full rounded-md mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* More News by Author Skeleton - Mobile */}
        <div className="block md:hidden mt-10 animate-pulse">
          <div className="bg-gray-200 h-6 w-48 mb-4 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-white shadow-md transition-shadow duration-200"
              >
                <div className="bg-gray-200 h-36 w-full rounded-md mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
