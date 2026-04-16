const express = require("express");
const router = express.Router();
const Tags = require("../Model/Tags");
const Blogs = require("../Model/Blogs");
const verifyAuth = require("../middleware/verifyAuth");

router.get("/tags", async (req, res) => {
    try {
        const tags = await Tags.aggregate([
            {
                $group: {
                    _id: null,
                    tagname: { $addToSet: "$tagname" },
                },
            },
        ]);
        return res.status(200).send({
            message: "Tags found",
            tags,
        });
    } catch (error) {
        return res.status(401).send({
            message: "ไม่มีข้อมูล",
            error,
        });
    }
});

// Get unique tag names (flat array for dropdown suggestions)
router.get("/tags/unique", async (req, res) => {
    try {
        const tags = await Tags.distinct("tagname");
        return res.status(200).json({
            message: "Unique tags found",
            tags: tags.sort(),
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch unique tags",
            error: error.message,
        });
    }
});

router.post("/tags", verifyAuth, async (req, res) => {
    try {
        const { blogid, tagname } = req.body;
        if (!(blogid && tagname)) {
            console.log("All input is required");
            return res.status(400).send({
                message: "All input is required",
            });
        }
        // Check for duplicate tag on this blog
        const existingTag = await Tags.findOne({ blogid, tagname });
        if (existingTag) {
            console.log("Tag already exists on this blog");
            return res.status(409).json({
                message: "Tag already exists on this blog",
                tag: existingTag,
            });
        }

        const tag = new Tags({
            blogid,
            tagname,
        });
        const saveTag = await tag.save();

        const blog = await Blogs.findOne({ _id: blogid });
        if (!blog) {
            const newBlog = new Blogs({ _id: blogid, tag: [saveTag] });
            await newBlog.save();
        } else {
            await Blogs.findOneAndUpdate(
                { _id: blogid },
                {
                    $push: {
                        tag: {
                            tagid: saveTag._id.toString(),
                            blogid: saveTag.blogid,
                            tagname: saveTag.tagname,
                            createdAt: saveTag.createdAt,
                            updatedAt: saveTag.updatedAt,
                        },
                    },
                }
            );
        }
        console.log("Tag created and updated successfully");
        return res.status(201).send({
            message: "Tag created and updated successfully",
            tag: saveTag,
        });
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: "creat tag unsuccess",
            error,
        });
    }
});

router.put("/tags/:id", verifyAuth, async (req, res) => {
    try {
        const idObj = req.params;
        const tagid = idObj.id;
        if (!tagid) {
            return res.status(400).send({
                message: "กรุณาใส่ params ให้ถูกต้อง",
            });
        }
        const { blogid, tagname } = req.body;
        if (!(blogid && tagname)) {
            return res.status(400).send({
                message: "All input is required",
            });
        }
        const tag = await Tags.findOneAndUpdate(
            { _id: tagid },
            {
                blogid,
                tagname,
                updatedAt: Date.now(),
            }
        );
        await Blogs.findOneAndUpdate(
            {
                _id: blogid,
                "tag.tagid": tag._id, // Find the specific tag in the array
            },
            {
                $set: {
                    "tag.$.tagname": tag.tagname,
                    "tag.$.updatedAt": tag.updatedAt,
                },
            }
        );
        return res.status(201).send({
            message: "Tag created and updated successfully",
            tag,
        });
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: "creat tag unsuccess",
            error,
        });
    }
});

router.delete("/tags/:id", verifyAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tags.findByIdAndDelete(id);
        if (!tag) {
            return res.status(404).send({
                message: "Tag not found",
            });
        }
        await Blogs.findOneAndUpdate(
            { _id: tag.blogid, "tag.tagid": id },
            { $pull: { tag: { tagid: id } } }
        );
        return res.status(200).send({
            message: "Tag deleted successfully",
            tag,
        });
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: "delete tag unsuccess",
            error,
        });
    }
});

module.exports = router;
