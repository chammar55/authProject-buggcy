// For Protected Routes

// import { NextResponse } from "next/server";
// import { useSelector } from "react-redux";
// import { RootState } from "./store/store";

// const userData = useSelector((state: RootState) => state.userLogin.data);
// const protectedRoutes = ["/", "/profile", "/homePage"];
// const auth = userData ? "true" : "false";
// export default function middleware(req: any) {
//   if (!auth && protectedRoutes.includes(req.nextUrl.pathname)) {
//     const absouteUrl = new URL("/sign-in", req.nextUrl.origin);
//     return NextResponse.redirect(absouteUrl.toString());
//   }
// }
export const middleware = () => {};
