"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface AlertMessages {
  [key: string]: string;
}

interface AlertManagerProps {
  path: string;
}

const messageAlias: AlertMessages = {
  login_successful: "Login successful",
  register_successful: "Register successful",
  logout_successful: "Logout successful",
};

const AlertManager: React.FC<AlertManagerProps> = ({ path }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (message) {
      const msg = messageAlias[message as keyof typeof messageAlias] || null;
      if (msg) {
        setDisplayMessage(decodeURIComponent(msg));
        setShowAlert(true);

        router.replace(path);
      }
    }
  }, [message, router, path]);

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
