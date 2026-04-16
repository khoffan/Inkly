const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Blogs = Schema(
    {
        title: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: null,
        },
        isDraft: {
            type: Boolean,
            default: false,
        },
        content: {
            type: [
                {
                    type: { type: String },
                    content: { type: String }
                }
            ],
            default: []
        },
        author: {
            type: String,
            default: null,
        },
        likes: {
            type: [String],
            default: null,
        },
        dislike: {
            type: [String],
            default: null,
        },
        tag: {
            type: [
                {
                    tagid: String,
                    blogid: String,
                    tagname: String,
                    createdAt: Date,
                    updatedAt: Date,
                },
            ],
            default: null,
        },
        comments: {
            type: [
                {
                    user: String,
                    comment: String,
                    createdAt: Date,
                    updatedAt: Date,
                },
            ],
            default: null,
        },
        images: [
            {
                imageId: String,
                imageName: String,
                imagePath: String,
                createdAt: Date,
                updatedAt: Date,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Blogs", Blogs);
