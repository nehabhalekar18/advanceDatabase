
const { connectionPool } = require('../mongoDb/connectionPool');
const redi = require('../mongoDb/redisConnection');

async function newStockChemist() {

    let db = await connectionPool();
    const dbo = db.db("stockManagment");

    let stock = [];
    // console.log(updateChemistStock) ;
    redi.get("update_chemist_stock", function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.parse( result ));
            stock = JSON.parse( result );
            if(stock.length != 0){
                stock.forEach(function (value, index) {
                    dbo.collection('stock_chemist').findOneAndUpdate({"Name" : value.Medicine_Name}, {$inc: {"Stock_Available_Per_Box" : value.Quantity}})
                })
                redi.get("orderId", function (err, result) {
                    if (err) {
                        console.log(err);
                    }else {
                        console.log(result);
                        dbo.collection('order')
                            .updateOne(
                                {_id: result},{$set: {Order_Status : "Fullfilled" }}
                            )
                    }
                })
                // res.writeHead(200, {'Content-Type': 'text/html'});
                // res.end("Supply of oder has been recieved");

                // delete all keys from redi
                redi.del('in_stock');
                redi.del('update_chemist_stock');
                redi.del('orderId');
            }
            // else {
            //     res.writeHead(200, {'Content-Type': 'text/html'});
            //     res.end("Supply has not been recieved yet");
            // }
        }
    });




}
exports.newStockChemist = newStockChemist;