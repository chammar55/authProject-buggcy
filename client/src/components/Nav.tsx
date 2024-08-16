"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { House } from "lucide-react";
import { ThemeToggleBtn } from "./ThemeToggleBtn";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { baseurl } from "../../baseUrl/baseUrl";
import { logout } from "@/store/login/loginSlice";

function Nav() {
  const userData = useSelector((state: RootState) => state.userLogin.data);
  console.log("userData", userData);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Attempting to log out...");

    try {
      const response = await axios.post(
        `${baseurl}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("Logged out:", response.data.message);
      dispatch(logout());
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className="bg-zinc-100 py-2 border-b border-s-zinc-200 w-full z-10
    fixed top-0   darkNav"
    >
      <div className=" container flex items-center justify-between ">
        <Link className="text-black navLinksDarkColors" href="/">
          <House />
        </Link>
        <div className="flex items-center justify-center gap-4">
          {userData ? (
            <Link
              onClick={() => handleLogout()}
              className={`${buttonVariants()} `}
              href=""
            >
              Logout
            </Link>
          ) : (
            <Link className={`${buttonVariants()} `} href="/sign-in">
              Sign in
            </Link>
          )}

          <Link className={`${buttonVariants()} flex gap-4`} href="/profile">
            profile
            {userData ? (
              <img
                src={userData.profilePicUrl}
                alt="Profile picture"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              ""
            )}
          </Link>

          <ThemeToggleBtn />
        </div>
      </div>
    </div>
  );
}

export default Nav;
