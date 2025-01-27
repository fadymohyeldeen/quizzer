"use client";

import Sidebar from "../../app/components/Dashboard/Admin/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gradient-to-t from-white to-slate-200">
      <Sidebar />
      <div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
