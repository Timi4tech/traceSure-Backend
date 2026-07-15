import jwt from "jsonwebtoken";
import redis from "../utils/redisClient.js"
import config from "../config/env.Config.js"


export const protect = (req, res, next) => {

  const refreshToken = req.cookies?.refreshToken;
  const accessToken =  req.cookies?.accessToken

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, config.accessJwtSecret);
      req.user = decoded;
      req.userId = decoded.id
      return next(); 
    } catch (err) {
      if (err.name === "TokenExpiredError" && refreshToken) {
        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            config.refreshJwtSecret
          );

          const newAccessToken = jwt.sign(
            { id: decodedRefresh.id },
            config.accessJwtSecret,
            { expiresIn: "1h" }
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000, // 1 hour
          });

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



