
const { connectionPool } = require('../mongoDb/connectionPool');


async function supplyWarehouse() {

    let db = await connectionPool();
    const dbo = db.db("stockManagment");

    let orderItems = [];
    let records = [];
    const d = new Date();
    const today = d.getDate() + '/' + ( d.getMonth()+1 ) + '/' + d.getFullYear();
    redi.get("in_stock", function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.parse( result ));
            records = JSON.parse( result );
            if(records.length != 0){
                records.forEach(function (value, index) {
                    orderItems.push({"Order_Id": value.Order_Id, "Medicine_Name" : value.Medicine_Name, "Quantity" : value.Order_Quantity, "Price_In_Euro" : value.Price});
                    dbo.collection('stock_warehouse').findOneAndUpdate({"Name" : value.Medicine_Name}, {$inc: {"Stock_Available_Per_Box" : - value.Order_Quantity}})
                });
                //updateChemistStock = orderItems;
                redi.set("update_chemist_stock", JSON.stringify( orderItems ));
                dbo.collection('sales_warehouse').insertOne({Sales_Date: today, Items:orderItems});
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end("Order supplied to chemist");
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end("No Order has been placed");
            }
        }
    });

}

exports.supplyWarehouse = supplyWarehouse;