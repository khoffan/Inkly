// make model from schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = Schema(
  {
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image_path: {
      type: String,
      default: null,
    },
    image_name: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", Users);
