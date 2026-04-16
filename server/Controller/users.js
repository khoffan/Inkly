const express = require("express");
const router = express.Router();

const Profiles = require("../Model/Profile");
const verifyAuth = require("../middleware/verifyAuth");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/profile");
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

// Get current user's profile (using Firebase UID)
router.get("/user", verifyAuth, async (req, res) => {
    try {
        const { uid } = req.user;

        const user = await Profiles.findOne({ authid: uid });
        if (!user) {
            return res.status(404).json({
                message: "Profile not found",
                auth: false,
            });
        }

        return res.status(200).json({
            message: "User profile",
            user,
            auth: true,
        });
    } catch (error) {
        console.error("GET /user Error:", error);
        return res.status(500).json({
            message: "Failed to fetch user profile",
            error: error.message,
        });
    }
});

// Get profile by query (authenticated)
router.get("/profile", verifyAuth, async (req, res) => {
    try {
        const email = req.body;
        if (!email) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                isprofile: false,
            });
        }
        const profile = await Profiles.findOne(email);
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
                isprofile: false,
            });
        }
        return res.status(200).json({
            message: "User profile",
            profile,
            auth: true,
        });
    } catch (error) {
        console.error("GET /profile Error:", error);
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
});

// Create profile (authenticated)
router.post("/creatprofile", verifyAuth, async (req, res) => {
    try {
        const { first_name, last_name, email, phone, address } = req.body;
        const { uid } = req.user;

        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                isprofile: false,
            });
        }

        const profile = new Profiles({
            first_name,
            last_name,
            email,
            phone_nuumber: phone || "",
            address: address || "",
            blogs_count: 0,
            authid: uid,
        });

        await profile.save();

        return res.status(201).json({
            message: "Profile created successfully",
            profile,
            isprofile: true,
        });
    } catch (error) {
        console.error("POST /creatprofile Error:", error);
        return res.status(500).json({
            message: "Failed to create profile",
            error: error.message,
        });
    }
});

// Get one profile by authid (public)
router.get("/profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profiles.findOne({ authid: id });
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
                isProfile: false,
            });
        }
        return res.status(200).json({
            message: "Profile found",
            profile,
        });
    } catch (error) {
        console.error("GET /profile/:id Error:", error);
        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
});

// Update profile (authenticated)
router.put("/updateprofile/:id", verifyAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone_nuumber, address, email } = req.body;

        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                isprofile: false,
            });
        }

        const profile = await Profiles.findById(id);
        if (!profile) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await Profiles.findByIdAndUpdate(id, {
            first_name,
            last_name,
            email,
            phone_nuumber,
            address,
        });

        return res.status(200).json({
            message: "User updated successfully",
        });
    } catch (error) {
        console.error("PUT /updateprofile Error:", error);
        return res.status(500).json({
            message: "Failed to update profile",
            error: error.message,
        });
    }
});

// Upload profile image (authenticated)
router.put("/uploadimage/:id", verifyAuth, upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const fileSelected = req.file;

        const profile = await Profiles.findById(id);
        if (!profile) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await Profiles.findByIdAndUpdate(id, {
            image_path: fileSelected ? fileSelected.path : null,
            image_name: fileSelected ? fileSelected.originalname : null,
        });

        return res.status(200).json({
            message: "อัพเดตรูปภาพเรียบร้อยแล้ว",
            image_path: fileSelected.path,
        });
    } catch (error) {
        console.error("PUT /uploadimage Error:", error);
        return res.status(500).json({
            message: "Failed to upload image",
            error: error.message,
        });
    }
});

module.exports = router;
