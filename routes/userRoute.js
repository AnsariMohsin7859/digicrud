const  express = require('express');

const route = express.Router()
//import user controller 
const {addUser , getUserById, getListOfUser, updateUser, deleteUser, loginUser, signoutUser}= require ('../controllers/userController')

//import auth middleware
const {verifyToken,isAdmin,isUser}= require('../middleware/auth')

//register a user in db 
route.post('/addUser' , addUser )

//get user by id 
route.get('/getUserById/:id' ,getUserById)

//get all user 
route.get('/getAllUser' ,getListOfUser)

//update user by id 
route.put('/updateUser/:id' , updateUser)

//delete user by  id 
route.delete('/deleteUser/:id' , deleteUser)

//login user
route.get('/loginUser' , loginUser)

//logout user
route.get('/signoutUser' , verifyToken ,signoutUser)

module.exports = route