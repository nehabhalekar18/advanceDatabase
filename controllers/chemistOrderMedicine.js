const { connectionPool } = require('../mongoDb/connectionPool');

async function orderMedicine() {

    let db = await connectionPool();
    const dbo = db.db("stockManagment");

    let quantityofOrder = [4,5,6,7];
    let quanityToOrder = 0;
    let outOfStockMedicine = [];
    let medicineDeliveryTime = 0;
    let orderItems = [];
    let orderDate = new Date();
    let d = orderDate.getDate();
    let m = orderDate.getMonth() + 1;
    let yr = orderDate.getFullYear();
    let orderPlacedDate = d + '/' + m + '/' + yr;

        return dbo.collection('stock_chemist').find(
            {Should_Order: true},
        ).project({
            "Name" : 1,
            "Delivery_Time_In_Days" : 1
        }).toArray( ).then((doc) => {
            if (doc) {
                console.log(doc);
                console.log(doc.length);
                doc.forEach(function (value, index) {
                    let a = index;
                    let id = doc[index]._id;
                    let medicineDeliveryTime = doc[index].Delivery_Time_In_Days;
                    let name = doc[index].Name;
                    quantityofOrder.forEach(function (value, index) {
                        if(a === index) {
                            quanityToOrder = quantityofOrder[index];
                        }

                    })
                    let calculateDate = new Date();
                    calculateDate.setDate(new Date().getDate() + medicineDeliveryTime);
                    let dd = calculateDate.getDate();
                    let mm = calculateDate.getMonth() + 1;
                    let y = calculateDate.getFullYear();

                    let expectedArrivalDate = dd + '/'+ mm + '/'+ y;
                    orderItems.push({"Med_id": id, "Name" : name , "Quantity" : quanityToOrder, "Expected_Arrival_Date": expectedArrivalDate});
                    outOfStockMedicine.push(name);
                });
                // add orders in order table
                dbo.collection("order").insertOne( {Order_Date: orderPlacedDate, Order_Status : "Pending", Items: orderItems });
                //res.end(JSON.stringify({"Medicine_Ordered" : outOfStockMedicine}));
                return outOfStockMedicine;
            }
            else {
                return "No medicine is out of stock";
            }
        });


}
exports.orderMedicine = orderMedicine;