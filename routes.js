var express = require('express');
const { getNodes } = require('./controllers/getNodes');
const { getDoctor } = require('./controllers/getDoctor')

// Create our Express router
var router = express.Router();

router.get('/allNodes', function(req,res) {
    getNodes()
    .then(patient => {
          res.json({ result: patient });
    })
});

router.get('/doctorDetails', function (req, res) {
    
     getDoctor("Emma" )    
     .then(doctor => {
        res.json({ result: doctor });
    })
});

module.exports=router
