const express = require("express");
const {
  createNewRoom,
  getRoom,
  addMessage,
} = require("../controllers/roomController");

const router = express.Router();

router.route("/").post(createNewRoom);
router.route("/:id").get(getRoom).post(addMessage);

module.exports = router;
