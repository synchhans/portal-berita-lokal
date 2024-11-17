"use client";
import ApprovedAdmin from "@/app/components/pages/admin/ApprovedAdmin";
import useUserData from "../../../../utils/hook/useUserData";
import AlertManager from "@/app/components/AlertManager";
import ApprovedProvider from "@/app/components/pages/provider/ApprovedProvider";
import ApprovedUser from "@/app/components/pages/user/ApprovedUser";

export default function Approved() {
  const { role, userData } = useUserData();

  const renderApprovedContent = () => {
    switch (role) {
      case "admin":
        return <ApprovedAdmin user={userData} />;
      case "provider":
        return <ApprovedProvider user={userData} />;
      case "user":
        return <ApprovedUser user={userData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <AlertManager path={"/news/approved"} />
      <div>{renderApprovedContent()}</div>
    </div>
  );
}
