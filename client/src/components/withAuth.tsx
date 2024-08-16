"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { baseurl } from "../../baseUrl/baseUrl";
import { useDispatch } from "react-redux";
import { login } from "@/store/login/loginSlice";

export default function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
      const verifyToken = async () => {
        try {
          const cookieResponse = await axios.get(`${baseurl}/api/getCookies`, {
            withCredentials: true,
          });

          const user = cookieResponse.data.user;

          if (user) {
            setAuthenticated(true);
            dispatch(login({ data: user }));
          } else {
            router.push("/sign-in");
          }
        } catch (err) {
          router.push("/sign-in");
        } finally {
          setLoading(false);
        }
      };

      verifyToken();
    }, [router]);

    // if (loading) {
    //   return <div>Loading...</div>;
    // }

    if (!authenticated) {
      return null; // Prevents rendering of the wrapped component while redirecting
    }

    return <Component {...props} />;
  };
}
