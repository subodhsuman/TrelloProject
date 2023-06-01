const express = require('express')
const UserController= require("../Controller/UserController.js")
const BoardController=require("../Controller/BoardController.js")
const ListController=require("../Controller/ListController.js")
const CardController=require("../Controller/CardController.js")
const Auth=require("../middleware/Auth.js")
// const member=require("../middleware/member.js")
const Router = express()

/* uer route is here*/

Router.get("/user_get",Auth,UserController.GetAuthUser) // Get authorized user
Router.post("/user_create",UserController.RegisterUser)
Router.post("/login",UserController.Auth)

/***************************** Board router is here *******************/
Router.post("/board_create",Auth,BoardController.BoardCreate)
Router.put("/boat_update/:id",Auth,BoardController.board_upadate)
Router.get("/getboard",Auth,BoardController.getUserboard)
Router.get("/getboard_id/:id",Auth,BoardController.getUsrBordId)


/***************************** List router is here *******************/

Router.post("/add_list",Auth,ListController.AddList)
Router.get("/get_list_board/:id",Auth,ListController.getboardlist)
Router.get("/getlist/:id",Auth,ListController.getListById)
Router.put("/update_list_name/:id",Auth,ListController.RenameList)
Router.delete("/delete_list/:id",Auth,ListController.DeleteList)
Router.put("/move_list", Auth,ListController.MoveList)

/***************************** Card router is here *******************/

Router.post("/add_card",Auth,CardController.AddCard)
Router.get("/list_card/:listId",Auth,CardController.GetCardlist)
Router.put("/edit_card/:id",Auth,CardController.EditCard)
Router.delete("/delete_card",Auth,CardController.deletedCard)
Router.put("/move/:id",Auth,CardController.moveCard)




module.exports = Router;

