import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token provided" });
    }

    // handle both: "Bearer xxxxxx" or just "xxxxxx"
    let token = authHeader;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    // ✅ FIXED — attach full user object to request
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};
