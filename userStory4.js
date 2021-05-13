var express = require('express');
const { salesChemist } = require('./controllers/salesChemist');
const { stockChemist } = require('./controllers/stockOutMedicine');
const { orderMedicine } = require('./controllers/chemistOrderMedicine');
const { stockWarehouse } = require('./controllers/warehouseStock');
const { supplyWarehouse } = require('./controllers/supplyWarehouse');
const { newStockChemist } = require('./controllers/chemistRecieveOrder');

var router = express.Router();

router.get('/chemistSales', function(req,res) {
    salesChemist()
        .then(data => {
           res.json({ result: data });
        })
});

router.get('/MedicineNotinstock', function(req,res) {
    stockChemist()
        .then(data => {
            res.json({ result: data });
        })
});

router.get('/orderMedicine', function(req,res) {
    orderMedicine()
        .then(data => {
            res.json({ result: data });
        })
});

router.get('/warehouseStock', function(req,res) {
    stockWarehouse()
        .then(data => {
            res.json({ result: data });
        })
});

router.get('/warehouseSupply', function(req,res) {
    supplyWarehouse()
        .then(data => {
            res.json({ result: data });
        })
});

router.get('/ChemistNewStock', function(req,res) {
    newStockChemist()
        .then(data => {
            res.json({ result: data });
        })
});


module.exports=router;