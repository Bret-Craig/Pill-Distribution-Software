const asyncHandler = require("express-async-handler");
const User = require("../db/userInfo");
const Medication = require("../db/medicationInfo");

const dotenv = require("dotenv");
dotenv.config();

//start connection to database
//-------
const mongoDB = process.env.MONGODB_URI;
const { MongoClient, ServerApiVersion } = require('mongodb');
//-------

let dbConnection;
function getDbConnection() {
  if (!dbConnection) {
    dbConnection = MongoClient.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  }
  return dbConnection;
}

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  const user = await User.findOne({ username: username });

  if (user && (await user.matchPassword(password))) {
    console.log("password match");
    res.json({
      username: user.username,
      name: user.name
    }).status(201);
  } else {
    res.status(401);
    throw new Error("Invalid Username or Password");
  }
});

//@description     Register new user
//@route           POST /api/users/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, name, serialNumber } = req.body;
  console.log(username, password, name, serialNumber);

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(404);
    throw new Error("Medication for user already exists");
  }

  const user = await User.create({
    username,
    password,
    name,
    serialNumber,
  });

  if (user) {
    res.status(201).json({
        _id: user._id,
        username: user.username,
        name: user.name,
      });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     add medication
//@route           POST /api/users/addMed
//@access          Public
const addMed = asyncHandler(async (req, res) => {
  const { username, medication, dosage, dayNum } = req.body;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  console.log(username, medication, dosage, dayNum)

  for (let i = 0; i < dayNum.length; i++) {
    let day = daysOfWeek[dayNum[i]]
    // console.log(day)
    let medExists = await Medication.findOne({ medication: medication, dosage, day: day });
    // console.log(medExists)
    if (medExists) {
      res.status(400)
      throw new Error("Medication for user already exists");
    }
  }
  var array = []
  for (let i = 0; i < dayNum.length; i++) {
    let day = daysOfWeek[dayNum[i]]
    array.push({
      username: username,
      medication: medication,
      dosage: dosage,
      day: day
    })
    // await Medication.create({
    //   username,
    //   medication,
    //   dosage,
    //   day
    // });
  }
  console.log(array)
  const med = await Medication.insertMany(array)
  
  if (med) {
    res.status(201).json({
      username,
      medication,
      dosage,
      day,
    });
  } else {
    res.status(401);
    throw new Error("Could not add med to database");
  }
});

//@description     delete medication
//@route           POST /api/users/delMed
//@access          Public
const delMed = asyncHandler(async (req, res) => {
  const { username, medication, dosage, dayNum } = req.body;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const deleteMed = await Medication.deleteOne({
    username: username,
    medication: medication,
    dosage: dosage,
    day: daysOfWeek[dayNum]
   })

  const del = deleteMed.deletedCount
  if (del === 1) {
    res.json({}).status(200)
  } else {
    res.status(400)
    throw new Error("Could not delete med from database");
  }

});

//@description     load medication
//@route           POST /api/users/loadMed
//@access          Public
const loadMed = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const meds = await Medication.find({ username: username });

  if (meds) {
    res.json({
      meds
    }).status(201);
  } else {
    res.status(401);
  }
});

module.exports = { authUser, registerUser, addMed, delMed, loadMed };