"use client";

const SkeletonCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 max-w-[925px] mx-auto mb-48">
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className="border rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="bg-gray-300 h-48 w-full"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 w-1/4 mb-2 rounded"></div>
            <div className="h-6 bg-gray-300 w-3/4 mb-2 rounded"></div>
            <div className="flex justify-between items-center text-gray-400 text-sm">
              <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCards;
