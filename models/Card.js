const mongoose=require("mongoose")
const cardSchema=mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default:"cardsvalues"
      },
      label: {
        type: String,
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
        },
      ],
      checklist: [
        {
          text: {
            type: String,
          },
          complete: {
            type: Boolean,
          },
        },
      ],
      archived: {
        type: Boolean,
        required: true,
        default: false,
      },
},{
    timestamps:true
})

const Card=mongoose.model("Card",cardSchema)
module.exports=Card;