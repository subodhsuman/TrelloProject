const List = require("../models/List.js");
const Board = require("../models/Board.js");
const User = require("../models/User.js");
const reply = require("../common/reply.js");
const Validator = require("validatorjs");
// const mongoose = require("mongoose");

// Add List
const AddList = async (req, res) => {
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
    const board = await Board.findById({ _id: request.boardId });
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
    const lists=await List.find({}).populate({path:"cards"})
    // const lists = [];
    // for (const listId of board.lists) {
    //   lists.push(await List.findById(listId));
    // }
    return res.json(reply.success("get all board list", lists));
  } catch (err) {
    console.log(err);
  }
};

// Get a list by id
const getListById = async (req, res) => {
  const id = req.params.id;
  try {
    const list = await List.findById({ _id: id });
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

const DeleteList = async (req, res) => {
  const id = req.params.id;
  const rquest = req.body;
  // console.log(requset.boardId);
  try {
    const list = await List.findByIdAndDelete({ _id: id });
    if (!list) {
      return res.json(reply.failed("List not found"));
    }
    // list.archived = req.params.archive === 'true';
    // await list.save()
    // const user=await User.findById(req.user._id)
    var board = await Board.findById({ _id: rquest.boardId });
    // board.activity.unshift({text: list.archived ? `${user.name} archived list '${list.title}' `: `${user.name} sent list '${list.title}' to the board`,});
    board.lists = (board?.lists).filter(function (e) {
      let d = e.toString().replace(/ObjectId\("(.*)"\)/, "$1");
      return d != id;
    });

    await board.save();
    return res.json(reply.success("List deleted", list));
  } catch (err) {
    console.log(err);
  }
};

const MoveList = async (req, res) => {
  const requset = req.body;
  const rules = {
    boardId: "required|string",
    listId: "required|string",
  };

  let validation = new Validator(request, rules);
  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }

  try {
    const toIndex = requset.toIndex ? requset.toIndex : 0;
    const board = await Board.findById(requset.boardId);
    const listed = await List.findById(requset.listId);
    if (!listed) {
      return res.json(reply.failed("List not found!"));
    }

    board?.lists.splice(board?.lists.indexOf(listed), 1);
    board?.lists.splice(toIndex, 0, listed);
    await board.save();
    return res.json(reply.success("Move List", board?.lists));
  } catch (err) {
    console.log(err);
    return res.json(reply.failed("unable to moved List!"));
  }
};

module.exports = {
  AddList,
  getboardlist,
  getListById,
  RenameList,
  DeleteList,
  MoveList,
};
