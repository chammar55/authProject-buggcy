import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../myPrisma.js";

import { generateToken, setTokenCookie } from "../utils/jwtHelper.js";
import cookie from "cookie";

// pages/api/auth/signup.js

export const signUp = async (req, res) => {
  const { email, password, name, age, gender, role, profilePicUrl } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!email || !password || !name || !age || !gender || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // const sanitizedProfilePicUrl = profilePicUrl || "";

  try {
    // Upload the image to Cloudinary

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: parseInt(age),
        gender,
        role,
        profilePicUrl,
      },
    });
    console.log("signup", user);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: "Something Wrong" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid password" });

  // const token = jwt.sign(
  //   { userId: user.id, role: user.role },
  //   process.env.JWT_SECRET
  // );
  const token = generateToken(user);
  user.password = undefined;

  setTokenCookie(res, token);

  res.status(200).json({ user: user });
};

export const logout = async (req, res) => {
  console.log("Logout route hit");
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // secure flag true in production
      sameSite: "strict",
      maxAge: -1, // Set maxAge to -1 to delete the cookie immediately
      path: "/",
    })
  );

  res.status(200).json({ message: "Logged out successfully" });
};

export const getCookies = async (req, res) => {
  const user = req.user;

  // const profile = await prisma.user.findUnique({
  //   where: { id: user.id },
  // });

  // console.log("getCookie user", user);
  // console.log("getCookies Api", token);

  res.status(200).json({ user, user });
};
