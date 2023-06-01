const List = require("../models/List.js");
const Board = require("../models/Board.js");
const User = require("../models/User.js");
const reply = require("../common/reply.js");
const Validator = require("validatorjs");
const mongoose=require("mongoose")


const AddList = async (req, res) => {
  // Add List
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
    const board = await Board.findById({ _id:request.boardId });
    if (!board) {
      return res.json(reply.failed("Board not found"));
    }
    const newList = new List({ title: request.title });
    const list = await newList.save();
    board.lists.push(list._id);
    // Log activity
    const user = await User.findById(req.user._id);
    board.activity.unshift({
      text: `${user.name} added '${request.title}' to this board`,
    });

    await board.save();
    return res.json(reply.success("Add list scuessfully", list));
  } catch (err) {
    console.log(err);
  }
};

const getboardlist = async (req, res) => {
  try {
    const id = req.params.id;
    const board = await Board.findById({ _id: id });
    if (!board) {
      return res.json(reply.failed("Board not found"));
    }
    const lists = [];
    for (const listId of board.lists) {
      lists.push(await List.findById(listId));
    }
    return res.json(reply.success("get all board list", lists));
  } catch (err) {
    console.log(err);
  }
};


// Get a list by id
const getListById = async (req, res) => {
  const id = req.params.id;
  try {
    const list = await List.findById({ _id:id});
    if (!list) {
      return res.json(reply.failed("List not found"));
    }
    return res.json(reply.success("Get list By Id", list));
  } catch (err) {
    console.log(err);
  }
};




// Edit a list's title
const RenameList = async (req, res) => {
  let id = req.params.id;
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
    const list = await List.findById({ _id: id });
    if (!list) {
      return res.json(reply.failed("List not found"));
    }

    list.title = request.title;
    await list.save();
    return res.json(reply.success("List Rename update"));
  } catch (err) {
    console.log(err);
  }
};
const DeleteList=async (req,res) =>{
  const id=req.params.id
  const rquest=req.body
  // console.log(requset.boardId);
  try{
    const list =await List.findByIdAndDelete({_id:id})
    if(!list){
     return res.json(reply.failed("List not found"))
    }
    // list.archived = req.params.archive === 'true';
    // await list.save()
    const user=await User.findById(req.user._id)
    var board=await Board.findById({_id:rquest.boardId})
    // board.activity.unshift({text: list.archived ? `${user.name} archived list '${list.title}' `: `${user.name} sent list '${list.title}' to the board`,});
    board.lists = (board?.lists).filter(function(e) {
       let d = e.toString().replace(/ObjectId\("(.*)"\)/, "$1");
      return d != id 
  })
  
    await board.save()
    return res.json(reply.success("List deleted",list))
  }catch(err){
    console.log(err);
  }
}

module.exports = { AddList, getboardlist, getListById, RenameList,DeleteList};
