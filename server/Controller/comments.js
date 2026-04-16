const express = require("express");
const router = express.Router();

const Comments = require("../Model/Comments");
const verifyAuth = require("../middleware/verifyAuth");

router.post("/comment", verifyAuth, async (req, res) => {
	try {
		const commentData = req.body;
		if (!commentData) {
			res.send({
				message: "ไม่มีข้อมูล"
			});
			return;
		}
		let comment = new Comments({
			userid: commentData.userid,
			blogid: commentData.blogid,
			comment: commentData.comment
		});

		await comment.save();
		return res.status(201).send({ message: "เพิ่ม comment สำเร็จ", comment });
	} catch (error) {
		console.log(error);
		return res.send({
			message: "ไม่มีข้อมูล",
			error
		});
	}
});

router.get("/comments/:blogid", async (req, res) => {
	try {
		const { blogid } = req.params;
		const commentsData = await Comments.find({ blogid }).sort({ createdAt: -1 });
		if (!commentsData) {
			res.send({
				message: "ไม่มีข้อมูล"
			});
		}
		res.status(200).send({
			commentsData
		});
	} catch (error) {
		console.log(error);
		return res.send({
			message: "ไม่มีข้อมูล",
			error
		});
	}
});

module.exports = router;
