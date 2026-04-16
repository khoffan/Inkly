const admin = require("../config/firebase_config_admin");

const verifyAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthenticated: No token provided",
            });
        }

        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };

        next();
    } catch (error) {
        console.error("verifyAuth Error:", error.code || error.message);

        if (error.code === "auth/id-token-expired") {
            return res.status(401).json({
                success: false,
                message: "Token has expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = verifyAuth;
