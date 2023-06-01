const mongoose = require("mongoose");
const BoardSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    visibility:{
      type:String,
      require:false,
      enum: ["private", "public","workspace"]
    },
    members: [
      {
        _id: false,
        user: {
          type:mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          default: 'admin',
        },
      },
    ],

    lists: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'List',
      },
    ],
    activity: [
      {
        text: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
 
    backgroundURL: {
      type: String,
      require:false,
      default:"https://images.pexels.com/photos/16889399/pexels-photo-16889399/free-photo-of-light-dawn-landscape-nature.jpeg"
    },

    activity: [
      {
        text: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
 
  },
  {
    timestamps: true,
  }
);

const Board=mongoose.model("Board",BoardSchema)
module.exports=Board;
