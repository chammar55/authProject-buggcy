import jwt from "jsonwebtoken";
import cookie from "cookie";
import { prisma } from "../myPrisma.js";

const JWT_SECRET = process.env.JWT_SECRET;
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const authMiddleware = async (req, res, next) => {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(402).json({ message: "Unauthorized 2" });
    }
    // return res.staus(402).json({ message: decoded.email });
    // if (error) {
    //   throw decoded;
    // }
    req.user = user;

    next();
  } catch (err) {
    return res
      .status(403)
      .json({ err: "Unauthorized 3", message: err.message });
  }
};
