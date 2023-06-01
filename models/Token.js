const mongoose = require("mongoose");
const TokenSchema = mongoose.Schema(
  {
    t_id: {
      type: String,
    },
    u_id: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const token = mongoose.model("token", TokenSchema);
module.exports=token
