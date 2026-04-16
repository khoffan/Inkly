const express = require("express");
const router = express.Router();

const Profiles = require("../Model/Profile");
const verifyAuth = require("../middleware/verifyAuth");

// Sync Firebase user to MongoDB profile (called after first login/register)
router.post("/sync-user", verifyAuth, async (req, res) => {
    try {
        const { uid, email } = req.user;
        const { first_name, last_name } = req.body;
        console.log(first_name,last_name)
        // Check if profile already exists
        let profile = await Profiles.findOne({ authid: uid });
        console.log(profile);

        if (profile) {
            return res.status(200).json({
                message: "Profile already exists",
                profile,
                isNew: false,
            });
        }

        // Create new profile for first-time user
        profile = new Profiles({
            first_name: first_name || "",
            last_name: last_name || "",
            email,
            phone_nuumber: "",
            address: "",
            blogs_count: 0,
            authid: uid,
        });

        await profile.save();

        return res.status(201).json({
            message: "Profile created successfully",
            profile,
            isNew: true,
        });
    } catch (error) {
        console.error("sync-user Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to sync user profile",
            error: error.message,
        });
    }
});

// Protected route test
router.get("/protected-route", verifyAuth, (req, res) => {
    return res.status(200).json({
        message: "Welcome to protected route",
        protect: true,
        user: req.user,
    });
});

module.exports = router;
