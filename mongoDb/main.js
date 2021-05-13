var http = require('http');
const url = require('url');
const ConnectionPool = require('./ConnectionPool');
const redi = require('../mongoDb/redisConnection');

http.createServer( async function (req, res) {
    let id = 0;
    let availableStock = 0;
    let price = 0;
    let name = "";
    let deliverydays = 0;
    let averageSale = 0;

    const urlAttributes = url.parse(req.url, true);
    if(req.url === "/favicon.ico"){
        res.writeHead(404).end()
    }
    let db = await ConnectionPool.createConnection();
    const dbo = db.db("stockManagment");
    // to see stock of particular medicine, sale it and update sale and stock table

    // todo update should_order

    if(urlAttributes.pathname === '/chemist_sale' && req.method.toLowerCase() == 'get') {
        const d = new Date();
        const today = d.getDate() + '/' + ( d.getMonth()+1 ) + '/' + d.getFullYear();
        const callback = (err, doc) => {
            if (doc) {
                console.log(doc);
                doc.forEach(function (value, index) {
                    id = doc[index]._id;
                    availableStock = doc[index].Stock_Available_Per_Box;
                    price = doc[index].Price_In_Euro;
                    name = doc[index].Name;
                    deliverydays = doc[index].Delivery_Time_In_Days;
                    averageSale = doc[index].Average_Sale_Per_Day_Per_Box;
                });
                // update sales table
                if(name){
                    let salesInfo = {"Med_id" : id, "Name": name, "Sales_Date": today, "Quantity":5  , "Price_In_Euro":price }

                    dbo.collection('sales_chemist').insertOne(salesInfo, async function (err, res) {
                        if(err) throw err;
                        console.log(res);
                    });

                    let stock = availableStock - 5;
                    let shouldOrder = availableStock <= (deliverydays * averageSale) ;
                    dbo.collection('stock_chemist')
                        .updateOne( { _id : id }, { $set: { Stock_Available_Per_Box : stock, Should_Order : shouldOrder } });
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end("Medicine sold to Patient");
                }else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end("Medicine is not in stock");
                }

            }
        };


        dbo.collection('stock_chemist').find(
            {
                "Stock_Available_Per_Box": {
                    $gte: 10
                },
                "Name": "Daunorubicin"
            },
            {
                projection: {
                    Name: 1,
                    Price_In_Euro: 1,
                    Stock_Available_Per_Box: 1,
                    Delivery_Time_In_Days : 1,
                    Average_Sale_Per_Day_Per_Box : 1
                }
            }
        ).toArray( callback );

    }
    // get name of medicines that need to order
    if(urlAttributes.pathname === '/medicine_outofstock' && req.method.toLowerCase() == 'get') {

        const callback = (err, doc) => {
            if (doc) {
                console.log(doc);
                console.log(doc.length);
                res.writeHead(200, {'Content-Type': 'text/JSON'});
                res.end(JSON.stringify({"OutOfStockMedicines" : doc}));
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end("Stock is full");
            }
        };

        dbo.collection('stock_chemist').find(
            {Should_Order: true},
        ).project({
            "Name" : 1
        }).toArray( callback );

    }

    //medicine that are out of stock place order and add in order table
    if(urlAttributes.pathname === '/chemist_order' && req.method.toLowerCase() == 'get') {
        let medicineDeliveryTime = 0;
        let orderItems = [];
        let orderDate = new Date();
        let d = orderDate.getDate();
        let m = orderDate.getMonth() + 1;
        let yr = orderDate.getFullYear();
        let orderPlacedDate = d + '/' + m + '/' + yr;

        const callback = (err, doc) => {

            // todo set quantityOfOrder length same as doc length
            let quantityofOrder = [4,5,6];
            let quanityToOrder = 0;
            let outOfStockMedicine = [];
            if (doc) {
                console.log(doc);
                console.log(doc.length);
                doc.forEach(function (value, index) {
                    let a = index;
                    id = doc[index]._id;
                    medicineDeliveryTime = doc[index].Delivery_Time_In_Days;
                    name = doc[index].Name;
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
                res.writeHead(200, {'Content-Type': 'text/JSON'});
                res.end(JSON.stringify({"Medicine_Ordered" : outOfStockMedicine}));
            }
            else {
                res.writeHead(200, {'Content-Type' : 'text/hrml'});
                res.end("No medicine is out of stock");
            }
        };

        dbo.collection('stock_chemist').find(
            {Should_Order: true},
        ).project({
            "Name" : 1,
            "Delivery_Time_In_Days" : 1
        }).toArray( callback );

    }

    // warehouse manager check stocks if stock is available or not as per order
    if(urlAttributes.pathname === '/warehouse_stock' && req.method.toLowerCase() == 'get') {

        const d = new Date();
        const today = d.getDate() + '/' + ( d.getMonth()+1 ) + '/' + d.getFullYear();
        // get quantity from order table
        const callback = (err, docs) => {
            const outOfStockMedicines = [];
            const inStockMedicines = [];
            let orderId;
            if (docs) {
                console.log(docs);
                docs.forEach(function (value, index) {
                    if( value   && Array.isArray(value.warehouse_stock) && value.warehouse_stock.length === 0){
                        if(value.Order_Status === "Pending"){
                            outOfStockMedicines.push( value.Items.Name )
                        }

                    } else {
                        console.log("warehouse" , value.warehouse_stock);
                        orderId = value._id;
                        inStockMedicines.push( {Order_Id: value._id, Medicine_Name : value.Items.Name, 'Order_Quantity' : value.Items.Quantity, 'Price': value.warehouse_stock[0].Price_In_Euro  } );
                    }
                })
            }
            redi.set("Order_id", orderId);
            redi.set("in_stock", JSON.stringify( inStockMedicines ));
            //   supplyChemist = inStockMedicines;
            res.writeHead(200, {'Content-Type': 'text/JSON'});//.end("{}");
            res.end(JSON.stringify({
                out_of_stock_medicines: outOfStockMedicines,
                in_stock_medicines: inStockMedicines
            }));
        };
        dbo.collection('order').aggregate(
            [
                { "$unwind": "$Items" },
                {
                    "$lookup":
                        {
                            from: "stock_warehouse",
                            let:
                                { order_item: "$Items.Name", order_qty: "$Items.Quantity" , orderStaus : "$Order_Status" , oder_Date : "$Order_Date" },
                            pipeline:
                                [
                                    {
                                        $match:
                                            {
                                                $expr:
                                                    {
                                                        $and:
                                                            [
                                                                {
                                                                    $eq: [ "$Name",  "$$order_item" ]
                                                                },
                                                                {
                                                                    $gte: [ "$Stock_Available_Per_Box", "$$order_qty" ]
                                                                },
                                                                {
                                                                    $eq: [ "$$orderStaus", "Pending" ]
                                                                }
                                                            ]
                                                    }
                                            }
                                    },
                                    {
                                        $project:
                                            { Name: 1, _id: 1, Stock_Available_Per_Box : 1, Price_In_Euro : 1 }
                                    }
                                ],
                            as: "warehouse_stock"
                        }
                },
            ]
        ).toArray(callback);
    }

    //supply to chemist and update warehouse stock table
    if(urlAttributes.pathname === '/warehouse_supply' && req.method.toLowerCase() == 'get') {
        //console.log(supplyChemist) ;
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

    // update chemist stock table when chemist recieves order
    if(urlAttributes.pathname === '/chemist_stock_update' && req.method.toLowerCase() == 'get') {
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
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end("Supply of oder has been recieved");

                    // delete all keys from redi
                    redi.del('in_stock');
                    redi.del('update_chemist_stock');
                    redi.del('orderId');
                }else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end("Supply has not been recieved yet");
                }
            }
        });

    }

}).listen(3000);