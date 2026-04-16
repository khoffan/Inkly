const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Tags = new Schema(
    {
        blogid: {
            type: String,
            required: true,
        },
        tagname: {
            type: String,
            required: true,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

Tags.pre("save", async function (next) {
    try {
        await mongoose.connection.collection("tags").dropIndex("tagid_1");
    } catch (error) {
        // Index might not exist, continue
    }
    next();
});

module.exports = mongoose.model("Tags", Tags);
