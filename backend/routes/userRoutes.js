const express = require('express');
const {
  authUser,
  registerUser,
  addMed,
  delMed,
  loadMed
} = require("../controllers/userController.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/addMed", addMed);
router.post("/delMed", delMed);
router.post("/loadMed", loadMed);

module.exports = router;