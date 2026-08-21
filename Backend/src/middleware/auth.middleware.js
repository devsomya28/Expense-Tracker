import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user information in request.
    // The token is signed with { userId }, but a number of newer
    // controllers/services (goal, intelligence, forecast, scenario,
    // insight, subscription, entitlement middleware) expect req.user._id.
    // Expose both shapes so either convention works.
    req.user = { ...decoded, _id: decoded.userId };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Named export alias - some routes (ai, forecast, goal, insight,
// intelligence, scenario, subscription) import `{ protect }` instead of
// the default export. Same implementation, different name.
export const protect = authMiddleware;

export default authMiddleware;