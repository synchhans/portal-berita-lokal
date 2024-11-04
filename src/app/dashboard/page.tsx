"use client";
import { useEffect, useState } from "react";
import AlertManager from "../components/AlertManager";
import DashboardAdmin from "../components/pages/admin/Dashboard";
import DashboardProvider from "../components/pages/provider/Dashboard";
import DashboardUser from "../components/pages/user/Dashboard";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const roleFromCookie = Cookies.get("user_role");

    if (
      roleFromCookie === "admin" ||
      roleFromCookie === "provider" ||
      roleFromCookie === "user"
    ) {
      setRole(roleFromCookie);
    } else {
      Cookies.remove("secure_token");
      Cookies.remove("user_role");
      router.push("/login");
      return;
    }

    const url = new URL(window.location.href);
    if (url.searchParams.has("role")) {
      url.searchParams.delete("role");
      window.history.replaceState({}, document.title, url.toString());
    }

    setLoading(false);
  }, [router]);

  const renderDashboardContent = () => {
    switch (role) {
      case "admin":
        return <DashboardAdmin />;
      case "provider":
        return <DashboardProvider />;
      case "user":
        return <DashboardUser />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <AlertManager path={"/dashboard"} />
      <div>{renderDashboardContent()}</div>
    </div>
  );
}
