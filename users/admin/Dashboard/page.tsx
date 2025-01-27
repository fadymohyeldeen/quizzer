"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Dashboard from "../../../app/components/Dashboard/Admin/Dashboard";
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("../../../app/components/Loader"), {
  ssr: false,
});

const AdminPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Dashboard />
    </>
  );
};

export default AdminPage;
