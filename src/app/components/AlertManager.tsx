"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AlertMessages {
  [key: string]: string;
}

interface AlertManagerProps {
  path: string;
}

const AlertManager: React.FC<AlertManagerProps> = ({ path }) => {
  const router = useRouter();
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const storedMessage = sessionStorage.getItem("alertMessage");

    if (storedMessage) {
      setDisplayMessage(decodeURIComponent(storedMessage));
      setShowAlert(true);

      sessionStorage.removeItem("alertMessage");
    }
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
    router.replace(path);
  };

  return (
    <>
      {showAlert && displayMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className="p-4 rounded-lg shadow-lg transition-all duration-300 bg-green-500 text-white"
            role="alert"
          >
            <div className="flex justify-between items-center">
              <span>{displayMessage}</span>
              <button
                onClick={handleCloseAlert}
                className="ml-4 text-white font-bold"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertManager;
