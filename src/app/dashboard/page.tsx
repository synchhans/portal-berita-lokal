"use client";
import AlertManager from "../components/AlertManager";
import DashboardAdmin from "../components/pages/admin/Dashboard";
import DashboardProvider from "../components/pages/provider/Dashboard";
import DashboardUser from "../components/pages/user/Dashboard";
import useUserData from "../../../utils/hook/useUserData";

export default function Dashboard() {
  const { role, userData } = useUserData();

  const renderDashboardContent = () => {
    switch (role) {
      case "admin":
        return <DashboardAdmin user={userData} />;
      case "provider":
        return <DashboardProvider user={userData} />;
      case "user":
        return <DashboardUser user={userData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <AlertManager path={"/dashboard"} />
      <div>{renderDashboardContent()}</div>
    </div>
  );
}
