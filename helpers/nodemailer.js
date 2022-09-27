const nodemailer = require('nodemailer')

const { userModel } = require("../models/user.model");

//send otp middelware
const otpSend = async (req, res, next) => {
  const { email } = req.body;
  const emailExist = await userModel.findOne({ email });
  console.log("12345", emailExist);

  if (emailExist) {
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);

    //update otp query
    await userModel.updateOne({ _id: emailExist._id }, { $set: { otp: otp } });

    //otp send by mail
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false,
      auth: {
        user: "782878ashfaq@gmail.com",
        pass: "xmCnK8rjgcJ4sWyD",
      },
    });

    //otp body
    const message = {
      from: "NeoSoft@neosofttech.com",
      to: `${email}`,
      subject: "",
      text: `Hello This is your account verification otp ${otp}`,
    };

    //call send mail function
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log("error", error);
      } else {
        console.log("info", info.response);
      }
    });
    res.status(200).json({
      msg : "Please check your mail - OTP sent"
    })
  } else {
    console.log("Email is not exist ");
  }
};

//verify otp middleware
const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404).json({
      msg: "email not exist",
    });
  } else if (otp == user.otp) {
    return res.json({
      msg: "otp verified",
    });
    next();
  } else {
    res.status(404).json({
      msg: "UnAuthorized",
    });
  }
};

module.exports = { otpSend, verifyOtp };
