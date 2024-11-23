"use client";

const SkeletonDashboard: React.FC = () => {
  return (
    <div className="flex h-screen animate-pulse">
      <div className="w-64 bg-gray-300 hidden lg:block">
        <div className="p-5 space-y-4">
          <div className="h-8 bg-gray-400 rounded"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-6 bg-gray-400 rounded"></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-300 h-16 flex items-center px-4 shadow">
          <div className="h-8 bg-gray-400 w-32 rounded"></div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="h-8 bg-gray-400 w-8 rounded-full"></div>
            <div className="h-8 bg-gray-400 w-24 rounded"></div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div className="h-8 bg-gray-400 w-1/3 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-40 bg-gray-400 rounded-lg shadow-md"
              ></div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkeletonDashboard;
