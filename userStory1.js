var express = require('express');
const { getNodes } = require('./controllers/getNodes');
const { getDoctor } = require('./controllers/getDoctor')
const { getAppointments } = require('./controllers/getAppointments')
const { reschedule } = require('./controllers/reschedule');
const { shortestPath } = require('./controllers/shortestPath');

// Create our Express router
var router = express.Router();

router.get('/allNodes', function(req,res) {
    getNodes()
    .then(patient => {
          res.json({ result: patient });
    })
});

//Query1 - Patient arrives at the hospital but forgot the name of the doctor. The reception should b able to look up the patient's appointment and get the doctor's details. 
router.get('/doctorDetails', function (req, res) {
    
     getDoctor("Emma" )    
     .then(doctor => {
        res.json({ result: doctor });
    })
});

//Query2 - Shortest path - Patient needs to collect reports from the lab and visit the doctor. Get the shortest route.
router.get('/shortestPath', function (req, res) {
    
    shortestPath()    
    .then(path => {
       res.json({ result: path });
   })
});

//Query3 - Patient calls the reception to book an appointment for the house doctor. Give a list of available appointments.
router.get('/appointments', function (req, res) {
    
    getAppointments()    
    .then(appointment => {
       res.json({ result: appointment });
   })
});

//Query4 - A patient needs to reschedule the appointment.
router.get('/reschedule', function (req, res) {   
    const data={fname:"Henry",oldAppointment:{date:"02.05.2021",time:"12:30"},newAppointment:{date:"02.05.2021",time:"12:15"}} 
    reschedule(data)    
    .then(appointment => {
       res.json({ result: appointment});
   })
});

module.exports=router
