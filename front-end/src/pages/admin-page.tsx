import AdminSidebarLayout from "../layouts/admin-sidebar-layout";
import { Outlet } from "react-router-dom";

function AdminPage() {
  return (
    <AdminSidebarLayout>
      <Outlet />
    </AdminSidebarLayout>
  );
}

export default AdminPage;
