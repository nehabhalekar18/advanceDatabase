var express = require("express");
const { getNodes } = require("./controllers/getNodes");
const { prescription } = require("./controllers/prescription");
const { getOutOfstockmed } = require("./controllers/getOutOfstockmed");
const { getAlternatemed } = require("./controllers/getAlternatemed");

// Create our Express router
var router = express.Router();

//Query1 - Patient comes with prescription , chemist sees the prescription
router.get("/prescription", function (req, res) {
  prescription().then((prescription) => {
    res.json({ result: prescription });
  });
});

//Query2 - Chemist sees the prescription and gets to know the medicine needed  is out of stock
router.get("/medicine", function (req, res) {
  getOutOfstockmed().then((medicine) => {
    res.json({ result: medicine });
  });
});

//Query2 - Chemist Searches for the alternate medicine that could be given instead of prescribed medicine
router.get("/alternatemedicine", function (req, res) {
  getAlternatemed().then((alternatemedicine) => {
    res.json({ result: alternatemedicine });
  });
});

module.exports = router;
