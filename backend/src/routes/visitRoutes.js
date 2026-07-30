const express = require("express");
const router = express.Router();

const {
  addVisit,
  getAnalytics,
} = require("../controllers/visitController");

router.post("/", addVisit);

router.get("/", getAnalytics);

module.exports = router;