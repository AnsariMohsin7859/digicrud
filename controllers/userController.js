const { userModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//register new user
let addUser = async (req, res) => {
  let body = req.body;

  if (!(req.body.email && req.body.password && req.body.name)) {
    res.status(400).send("All input is required");
  }

  const oldUser = await userModel.findOne({ email: req.body.email });

  if (oldUser) {
    return res.status(401).send("User Already Exist. Please Login");
  }

  let user = new userModel(body);
  console.log(user);

  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  user.password = await bcrypt.hash(user.password, salt);

  user.save((err, data) => {
    if (err) {
      return res.status(400).json({ error: err, msg: "failed with adding" });
    } else {
      return res.status(201).json({ result: data, msg: "successfully added" });
    }
  });
};

//get user by id
let getUserById = async (req, res) => {
  let Id = req.params.id;
  console.log("working" + Id);

  let result = await userModel
    .findById(Id)
    .then((result) => {
      return res.status(200).json({ msg: "user found", data: result });
    })
    .catch((err) => {
      return res.status(400).json({ msg: "unable to find user", error: err });
    });
};

//get all user  list with paggination
const getListOfUser = (req, res) => {
  let page = req.query.pageNo - 1;
  let limit = req.query.limit;
  let skip = page * limit;
  userModel
    .find()
    .limit(limit)
    .skip(skip)
    .then((data) => {
      return res.status(200).json({
        total: data.length,
        msg: "successfully got all user",
        result: data,
      });
    })
    .catch((err) => {
      return res.status(400).json({ error: err, msg: "failed to get user" });
    });
};

//login api of user with jwt
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  const ComparePass = await bcrypt.compare(password, user.password);

  // check user & password match
  if (user && ComparePass) {
    const token = generateToken({ _id: user._id, role: user.role });

    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    res.status(401).send("Invalid Credentials");
  }
};

//singout user
const signoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signout succesfully",
  });
};

//update user by id
let updateUser = async (req, res) => {
  let id = req.params.id;

  let dataToUpdate = req.body;

  userModel
    .findByIdAndUpdate(id, dataToUpdate)
    .then((result) => {
      return res
        .status(200)
        .json({ msg: "user updated succesfully", data: result });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ msg: "unable to update user ", error: err });
    });
};

//delete user by id
let deleteUser = async (req, res) => {
  let id = req.params.id;

  userModel
    .findByIdAndDelete(id)
    .then((result) => {
      return res
        .status(200)
        .json({ msg: "user deleted successfully ", data: result });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ msg: "unable to delete user ", error: err });
    });
};

// Generate token
const generateToken = (_id) => {
  return jwt.sign(_id, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  addUser,
  getUserById,
  getListOfUser,
  updateUser,
  deleteUser,
  loginUser,
  signoutUser
};
