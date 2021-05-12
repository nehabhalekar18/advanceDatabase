
const { connectionPool } = require('../mongoDb/connectionPool');
const redi = require('./RedisDatabase');


async function stockWarehouse() {

    let db = await connectionPool();
    const dbo = db.db("stockManagment");

    const d = new Date();
    const today = d.getDate() + '/' + ( d.getMonth()+1 ) + '/' + d.getFullYear();
    const outOfStockMedicines = [];
    const inStockMedicines = [];
    let orderId;

    return  dbo.collection('order').aggregate(
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
    ).toArray().then((doc) => {
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
            redi.set("Order_id", orderId);
            redi.set("in_stock", JSON.stringify( inStockMedicines ));
            //   supplyChemist = inStockMedicines;

            return {
                out_of_stock_medicines: outOfStockMedicines,
                in_stock_medicines: inStockMedicines
            };
        } else {
            return "Stock not available";
        }

    }).catch( (err) => { return err } );

}
exports.stockWarehouse = stockWarehouse;