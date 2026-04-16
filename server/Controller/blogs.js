const express = require("express");
const router = express.Router();

const Blogs = require("../Model/Blogs");
const Profiles = require("../Model/Profile");
const verifyAuth = require("../middleware/verifyAuth");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/blogs");
	},
	filename: function (req, file, cb) {
		const fileName = Date.now() + "-" + file.originalname;
		cb(null, fileName);
	}
});

const upload = multer({ storage });

// blogs api
router.post("/creatBlogs", verifyAuth, async (req, res) => {
	try {
		const { title, description, author, blogImage, paragraphs } = req.body;
		if (!(title && description && author)) {
			return res.status(400).send({
				message: "All input is required"
			});
		}
		const blog = new Blogs({
			title,
			description,
			author,
			content: paragraphs,
			isDraft: false,
			images: blogImage.map((img) => ({
				imageId: img.id,
				imageName: img.image_name,
				imagePath: img.image_path,
				createdAt: Date.now(),
				updatedAt: Date.now()
			}))
		});
		await blog.save();

		// Delete any existing draft for this user when they publish
		await Blogs.findOneAndDelete({ author, isDraft: true });

		const blog_author = await Blogs.findOne({
			"author": author
		});
		if (!blog_author) {
			return res.status(400).send({
				message: "Blog not found"
			});
		}
		console.log(blog_author);
		await Profiles.findOneAndUpdate(
			{ authid: blog_author.author },
			{
				$inc: { blogs_count: 1 }
			}
		);
		//return false;
		return res.status(201).send({
			message: "Blog created successfully",
			blog
		});
	} catch (error) {
		return res.status(401).send({
			message: "creat blogs unsuccess",
			error
		});
	}
});

router.put("/updateblog/:id", verifyAuth, async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, author, paragraphs, blogImage } = req.body;
		if (!(title && description && author)) {
			return res.status(400).send({
				message: "All input is required"
			});
		}
		
		const updateData = { title, description, author, content: paragraphs };
		if (blogImage) {
			updateData.images = blogImage.map((img) => ({
				imageId: img.id,
				imageName: img.image_name,
				imagePath: img.image_path,
				updatedAt: Date.now()
			}));
		}

		const blog = await Blogs.findByIdAndUpdate(
			id,
			updateData,
			{ new: true }
		);

		if (!blog) {
			return res.status(404).send({
				message: "Blog not found"
			});
		}

		return res.status(200).send({
			message: "Blog updated successfully",
			blog
		});
	} catch (error) {
		return res.status(500).send({
			message: "Update blog unsuccessful",
			error: error.message || error
		});
	}
});

// get all blogs
router.get("/blogs", async (req, res) => {
	const tags = req.query.tags || null;
	const sort = req.query.sort || 1;
	const { search } = req.query;
	let filter = { isDraft: { $ne: true } }; // Ensure we do not fetch drafts
	if (search) {
		filter = { ...filter, title: { $regex: search, $options: "i" } };
	}
	try {
		if (tags) {
			const blogs = await Blogs.find({
				...filter,
				"tag.tagname": { $regex: tags, $options: "i" }
			}).sort({ createdAt: Number(sort) });
			if (blogs == null) {
				return res.status(400).send({
					message: "Blogs not found"
				});
			}
			return res.status(200).send({
				message: "Blogs found",
				blogs
			});
		}
		const blogs = await Blogs.find(filter).sort({ createdAt: Number(sort) });
		if (blogs == null) {
			return res.status(400).send({
				message: "Blogs not found"
			});
		}
		return res.status(200).send({
			message: "Blogs found",
			blogs
		});
	} catch (error) {
		return res.status(401).send({
			message: "get blogs unsuccess",
			error: error.massage
		});
	}
});
// get one blog
router.get("/blog/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const blog = await Blogs.findById(id);
		return res.status(200).send({
			message: "Blog found",
			blog
		});
	} catch (error) {
		res.status(400).send({
			message: "Blog not found",
			error
		});
	}
});

// get all blog pass id profile
router.get("/blogs/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const blogs = await Blogs.find({
			author: id,
			isDraft: { $ne: true }
		});

		return res.status(200).send({
			message: blogs
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			message: "ไม่มี blog ของ id นี้",
			error
		});
	}
});

// delete blog
router.delete("/deleteblog/:id", verifyAuth, async (req, res) => {
	try {
		const { id } = req.params;
		const blog = await Blogs.findByIdAndDelete(id);
		
		if (!blog) {
			return res.status(404).send({
				message: "Blog not found"
			});
		}

		await Profiles.findOneAndUpdate(
			{ authid: blog.author },
			{
				$inc: { blogs_count: -1 }
			}
		);

		return res.status(200).send({
			message: "Blog deleted successfully",
			blog
		});
	} catch (error) {
		return res.status(500).send({
			message: "Failed to delete blog",
			error: error.message || error
		});
	}
});

router.patch("/blog/like/:id", verifyAuth , async (req, res) => {
    try {
        const { id } = req.params;
        const firebaseUid = req.user.uid; // ดึง Firebase UID จาก Middleware

        const blog = await Blogs.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // ตรวจสอบว่าเคย Like หรือยัง (เช็คจาก String ใน Array)
        const isLiked = blog.likes.includes(firebaseUid);

        let update;
        if (isLiked) {
            // ถ้ายกเลิก Like
            update = { $pull: { likes: firebaseUid } };
        } else {
            // ถ้าจะ Like
            update = { 
                $addToSet: { likes: firebaseUid }
            };
        }

        const updatedBlog = await Blogs.findByIdAndUpdate(id, update, { new: true });

        return res.status(200).json({
            message: isLiked ? "Unliked success" : "Liked success",
            blog: updatedBlog
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.patch("/blog/dislike/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const firebaseUid = req.user.authid; // ดึง Firebase UID จาก Middleware

        const blog = await Blogs.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // ตรวจสอบว่าเคย Like หรือยัง (เช็คจาก String ใน Array)
        const isLiked = blog.likes.includes(firebaseUid);

        let update;
        if (isLiked) {
            // ถ้ายกเลิก Like
            update = { $pull: { likes: firebaseUid } };
        } else {
            // ถ้าจะ Like: เพิ่มเข้า likes และดึงออกจาก dislikes พร้อมกัน
            update = { 
                $addToSet: { likes: firebaseUid },
                $pull: { dislikes: firebaseUid } 
            };
        }

        const updatedBlog = await Blogs.findByIdAndUpdate(id, update, { new: true });

        return res.status(200).json({
            message: isLiked ? "Unliked success" : "Liked success",
            likeCount: updatedBlog.likes.length,
            isLiked: !isLiked
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.post("/blog/images", upload.single("blog"), verifyAuth, async (req, res) => {
	try {
		const file = req.file;

		if (!file) {
			return res.status(400).send({
				message: "files not found"
			});
		}
		// store file in array

		return res.status(200).send({
			message: "upload images success",
			file
		});
	} catch (error) {
		console.log(error);
		return res.status(401).send({
			message: "upload images unsuccess",
			error
		});
	}
});

// Get related blogs by matching tags
router.get("/blogs/related/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const blog = await Blogs.findById(id);
		if (!blog) {
			return res.status(404).send({ message: "Blog not found" });
		}

		const tagNames = blog.tag?.map((t) => t.tagname).filter(Boolean) || [];
		if (tagNames.length === 0) {
			return res.status(200).send({ message: "Related blogs found", blogs: [] });
		}

		const relatedBlogs = await Blogs.find({
			_id: { $ne: id },
			"tag.tagname": { $in: tagNames },
		})
			.sort({ createdAt: -1 })
			.limit(3);

		return res.status(200).send({
			message: "Related blogs found",
			blogs: relatedBlogs,
		});
	} catch (error) {
		return res.status(500).send({
			message: "Failed to fetch related blogs",
			error: error.message || error,
		});
	}
});

// ─── Draft APIs ───

// Upsert a draft
router.post("/blog/draft", verifyAuth, async (req, res) => {
	try {
		const { title, description, author, paragraphs, blogImage, tags } = req.body;
		if (!author) {
			return res.status(400).send({ message: "Author is required" });
		}

		// Prepare update payload
		const updateData = {
			title: title || "",
			description: description || "",
			content: paragraphs || [],
			isDraft: true,
			updatedAt: Date.now()
		};

		if (blogImage) {
			updateData.images = blogImage.map((img) => ({
				imageId: img.id,
				imageName: img.image_name,
				imagePath: img.image_path,
				updatedAt: Date.now()
			}));
		}

		// Prepare tags if passed
		if (tags && tags.length > 0) {
			updateData.tag = tags.map(t => ({
				tagname: t,
				updatedAt: Date.now()
			}));
		}

		// Find existing draft for the author and update, or create a new one
		const draft = await Blogs.findOneAndUpdate(
			{ author, isDraft: true },
			{ $set: updateData },
			{ new: true, upsert: true }
		);

		return res.status(200).send({
			message: "Draft saved successfully",
			draft
		});
	} catch (error) {
		return res.status(500).send({
			message: "Failed to save draft",
			error: error.message || error
		});
	}
});

// Get user's current draft
router.get("/blog/draft", verifyAuth, async (req, res) => {
	try {
		const authorId = req.user.authid; // Extract from token
		if (!authorId) return res.status(401).send({ message: "Unauthorized" });

		const draft = await Blogs.findOne({ author: authorId, isDraft: true });
		
		return res.status(200).send({
			message: draft ? "Draft found" : "No draft found",
			draft
		});
	} catch (error) {
		return res.status(500).send({
			message: "Failed to fetch draft",
			error: error.message || error
		});
	}
});

module.exports = router;
