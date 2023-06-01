const mongoose=require("mongoose")
const ListSchema=mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      cards: [
        {
          type:mongoose.Schema.Types.ObjectId,
          ref: 'Card',
        },
      ],
      archived: {
        type: Boolean,
        required: true,
        default: false,
      },
},{
    timestamps: true,
})

const List=mongoose.model("List",ListSchema);
module.exports=List