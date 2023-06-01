const reply = require("../common/reply.js");
const Board = require("../models/Board.js");
const Validator = require("validatorjs");
// const mongoose = require("mongoose");
const User = require("../models/User.js");

const BoardCreate = async (req, res) => {
  const request = req.body;
  const rules = {
    title: "required|string|min:5",
    visibility: "required|string|in:private,public,workspace",
  };

  let validation = new Validator(request, rules);

  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }
  try {
    request["userId"] = req.user._id;
    const newBoard = new Board({
      title: request.title,
      visibility: request.visibility,
    });
    const board = await newBoard.save();

    // Add board to user's boards
    const user = await User.findById(req.user._id);
    user.boards.unshift(board._id);
    await user.save();

    // Add user to board's members as admin
    board.members.push({ user: user._id, name: user.name });
    // Log activity
    board.activity.unshift({ text: `${user.name} created this board` });
    await board.save();

    return res.json(reply.success("board Create Successfully", board));
  } catch (err) {
    console.log(err);
  }
};
const board_upadate = async (req, res) => {
  const id = req.params.id;
  //   if (!mongoose.Types.ObjectId.isValid(id)) {
  //     return res.json(reply.failed("Id does not exit"));
  //   }
  const request = req.body;
  const rules = {
    title: "required|string",
  };

  let validation = new Validator(request, rules);
  if (validation.fails()) {
    let shwErr = await Object.keys(Object.entries(validation.errors)[0][1])[0];
    return res.json(reply.failed(validation.errors.first(shwErr)));
  }

  const boardExit = await Board.findById({ _id: id });
  if (!boardExit) {
    return res.json(reply.failed("Board not found"));
  }
  if (request.title !== boardExit.title) {
    const user = await User.findById(req.user._id);
    boardExit.activity.unshift({
      text: `${user.name} renamed this board (from '${boardExit.title}')`,
    });
  }
  boardExit.title = request.title;
  boardExit.visibility=request.visibility;
  await boardExit.save();
  return res.json(reply.success("Update Successfully"));
};

//get user by boats
const getUserboard = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.user._id });
    const boards = [];
    for (const boardId of user?.boards) {
      boards.push(await Board.findById(boardId));
    }
    return res.json(reply.success("fetch User Board data By User", boards));
  } catch (err) {
    console.log(err);
    return res.json(reply.failed("board does not fetch"))
  }
};

const getUsrBordId=async (req,res)=>{
     const id=req.params.id;
     try{
         const board=await Board.findById(id)
         if(!board){
          return res.json(reply.failed("Board not found"))
         }  
         return res.json(reply.success("Board data found successfull",board))
     }catch(err){
        console.log(err);
        return res.json(reply.failed("board does not fetch with Id"))
     }
}

module.exports = { BoardCreate, board_upadate, getUserboard,getUsrBordId};
