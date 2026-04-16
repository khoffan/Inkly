const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Profiles = Schema(
	{
		first_name: {
			type: String,
			default: null
		},
		last_name: {
			type: String,
			default: null
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		blogs_count: {
			type: Number,
			default: 0
		},
		image_path: {
			type: String,
			default: null
		},
		image_name: {
			type: String,
			default: null
		},
		phone_nuumber: {
			type: String,
			default: null
		},
		address: {
			type: String,
			default: null
		},
		authid: {
			type: String,
			default: null
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Profile", Profiles);
