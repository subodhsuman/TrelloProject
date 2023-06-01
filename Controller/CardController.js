const Card = require("../models/Card.js");
const List = require("../models/List.js");
const User = require("../models/User.js");
const Board = require("../models/Board.js");
const reply = require("../common/reply.js");
const Validator = require("validatorjs");

const AddCard = async (req, res) => {
  const request = req.body;
  const rules = {
    title: "required|string",
    listId: "required|string",
    boardId: "required|string",
  };

  let validation = new Validator(request, rules);
  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }
  try {
    const card = new Card({ title: request.title });
    await card.save();
    const list = await List.findById({ _id: request.listId });
    list?.cards?.push(card._id);
    await list.save();
    const user = await User.findById(req.user._id);
    const board = await Board.findById({ _id: request.boardId });
    board.activity.unshift({
      text: `${user.name} added '${request.title}' to '${list.title}'`,
    });
    await board.save();
    return res.json(reply.success("Add to card data", card));
  } catch (err) {
    console.log(err);
  }
};

// Get All of List Card
const GetCardlist = async (req, res) => {
  const listId = req.params.listId;
  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.json(reply.failed("List not found"));
    }
    let cardData = [];
    for (const cardId of list?.cards) {
      cardData.push(await Card.findById(cardId));
    }
    return res.json(reply.success("Get All Card", cardData));
  } catch (err) {
    console.log(err);
    return res.json(reply.failed("card does not fetch"));
  }
};

const EditCard = async (req, res) => {
  const id = req.params.id;
  const request = req.body;
  const rules = {
    title: "required|string",
  };

  let validation = new Validator(request, rules);
  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }

  try {
    const card = await Card.findById(id);
    if (!card) {
      return res.json(reply.failed("Card not found"));
    }

    card.title = card.title ? request.title : card.title;
    if (card.description || request.description == "") {
      card.description = card.description
        ? request.description
        : card.description;
    }
    await card.save();
    return res.json(reply.success("card Rename Updated"));
  } catch (err) {
    console.log(err);
  }
};

// delete cards

const deletedCard = async (req, res) => {
  const request = req.body;
  const rules = {
    cardId: "required|string",
    listId: "required|string",
  };

  let validation = new Validator(request, rules);
  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }

  try {
    let list = await List.findById(request.listId);
    const card = await Card.findByIdAndDelete(request.cardId);
    if (!list) {
      return res.json(reply.failed("list does not exit"));
    }
    if (!card) {
      return res.json(reply.failed("card does not exit"));
    }

    list?.cards?.splice(list?.cards?.indexOf(request.cardId), 1);
    await list.save();
     return res.json(reply.success("card deleted"))

  } catch (err) {
    console.log(err);
    return res.json(reply.failed("Unable to delete card"));
  }
};

// move card
const moveCard=async(req,res)=>{
   const moveCardId=req.params.id
  const request=req.body;

  const rules = {
    fromList: "required|string",
    tolist: "required|string",
  };
  let validation = new Validator(request, rules);

  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }


  try{
    const frmList=await List.findById(request.fromList)
    console.log(frmList,"frmList");

    const tolistm= await List.findById(request.tolist)
    console.log(tolistm,"tolistm");

    if (!moveCardId || !frmList || !tolistm) {
      return res.json(reply.failed("not found List/card"))
    } else if (frmList === tolistm) {
      tolistm = frmList;
    }

    const fromIndex = frmList?.cards.indexOf(moveCardId);
    if (fromIndex !== -1) {
        frmList?.cards.splice(fromIndex, 1);
        await frmList.save();
    }

    if (!tolistm?.cards.includes(moveCardId)) {
      if (request.toIndex === 0 || request.toIndex) {
         tolistm?.cards.splice(request.toIndex ,0, moveCardId);
      } else {
         tolistm?.cards.push(moveCardId);
      }
      await tolistm.save();
    }
   return res.json(reply.success("card moved"))
  }catch(err){
    console.log(err);
    return res.json("unable to move")
  }


}

module.exports = {AddCard, GetCardlist, EditCard, deletedCard,moveCard};
