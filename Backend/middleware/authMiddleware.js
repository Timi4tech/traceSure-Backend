import jwt from "jsonwebtoken";
import redis from "../utils/redisClient.js"
import config from "../config/env.Config.js"

// Middleware: protect routes + refresh access token if expired
export const protect = (req, res, next) => {
  // Access token from Authorization header

  // Refresh token from HTTP-only cookie
  const refreshToken = req.cookies?.refreshToken;
  const accessToken =  req.cookies?.accessToken

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (accessToken) {
    try {
      // Verify access token
      const decoded = jwt.verify(accessToken, config.accessJwtSecret);
      req.user = decoded;
      req.userId = decoded.id
      return next(); // token valid → continue
    } catch (err) {
      // If token expired or invalid, try refresh
      if (err.name === "TokenExpiredError" && refreshToken) {
        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            config.refreshJwtSecret
          );

          // Issue new access token
          const newAccessToken = jwt.sign(
            { id: decodedRefresh.id },
            config.accessJwtSecret,
            { expiresIn: "1h" }
          );

          // Send new access token as cookie
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000, // 1 hour
          });

          // Attach user to request
          req.user = decodedRefresh;
          req.userId = decodedRefresh.id
          return next();
        } catch (refreshErr) {
          return res
            .status(401)
            .json({ message: "Refresh token invalid or expired" });
        }
      }

      return res.status(401).json({ message: "Access token invalid" });
    }
  } else {
    return res.status(401).json({ message: "No access token provided" });
  }
};



