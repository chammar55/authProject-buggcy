import jwt from "jsonwebtoken";
import cookie from "cookie";

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      // expiresIn: "1h",
    }
  );
};

// prevent JWT from XSS and CSRF attacks
export const setTokenCookie = (res, token) => {
  // res.cookie("token", token, {
  //   httpOnly: true, // Prevents access by JavaScript
  //   secure: process.env.NODE_ENV === "production", // HTTPS only in production
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  //   sameSite: "strict", // CSRF protection
  //   path: "/",
  // });
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      path: "/",
    })
  );
};
