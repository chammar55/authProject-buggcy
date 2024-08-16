"use client";

import withAuth from "@/components/withAuth";
import { RootState } from "@/store/store";
import { redirect } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";

function HomePage() {
  const userData = useSelector((state: RootState) => state.userLogin.data);

  const userRole = userData?.role;
  // console.log(userData);

  return (
    <div className="text-4xl">
      {userRole === "ADMIN" ? "Admin Home Page" : "User Home Page"}
    </div>
  );
}

export default withAuth(HomePage);
