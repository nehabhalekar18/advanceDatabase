var express = require("express");
const { getListOfDisease } = require("./controllers/getNodes");
const { getSymptoms } = require("./controllers/getSymptoms");
const { getMedicines } = require("./controllers/getMedicines");
const { getDisease } = require("./controllers/getDisease");

// Create our Express router
// Create our Express router
var router = express.Router();

router.get("/allDisease", function (req, res) {
  getListOfDisease().then((disease) => {
    res.json({ result: disease });
  });
});

//Query 1 - To identify the symptoms of a particular disease
router.get("/Symptoms", function (req, res) {
  getSymptoms().then((symptoms) => {
    res.json({ result: symptoms });
  });
});

//Query 2  - To identify medicines for a particular disease

router.get("/Medicines", function (req, res) {
  getMedicines().then((medicine) => {
    res.json({ result: medicine });
  });
});

//Query 3 - To identify Test for a symptoms
router.get("/Disease", function (req, res) {
  getDisease().then((disease) => {
    res.json({ result: disease });
  });
});

module.exports = router;
