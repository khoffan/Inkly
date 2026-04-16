const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comments = Schema(
	{
		userid: {
			type: String,
			default: null
		},
		blogid: {
			type: String,
			default: null
		},
		comment: {
			type: String,
			default: null
		},
		like: {
			type: Number,
			default: 0
		},
		dislike: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Comments", Comments);
