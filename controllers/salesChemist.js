
const { connectionPool } = require('../mongoDb/connectionPool');


 async function salesChemist(req,res) {

     let db = await connectionPool();
     const dbo = db.db("stockManagment");

     let id = 0;
     let availableStock = 0;
     let price = 0;
     let name = "";
     let deliverydays = 0;
     let averageSale = 0;

     const d = new Date();
     const today = d.getDate() + '/' + ( d.getMonth()+1 ) + '/' + d.getFullYear();
        let sendback = "";

    return dbo.collection('stock_chemist').find(
         {
             "Stock_Available_Per_Box": {
                 $gte: 2
             },
             "Name": "Abraxane"
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
     ).toArray( ).then((doc)=>{
       if (doc) {
          // console.log(doc);
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
               let salesInfo = {"Med_id" : id, "Name": name, "Sales_Date": today, "Quantity":2  , "Price_In_Euro":price };

               dbo.collection('sales_chemist').insertOne(salesInfo, async function (err, res) {
                   if(err) throw err;
                   console.log(res);
               });

               let stock = availableStock - 2;
               let shouldOrder = availableStock <= (deliverydays * averageSale) ;
               dbo.collection('stock_chemist')
                   .updateOne( { _id : id }, { $set: { Stock_Available_Per_Box : stock, Should_Order : shouldOrder } });

               sendback = "Medicine sold to Patient";
           } else {

               sendback =  "Medicine is not in stock";
           }
           return sendback;
       }else {

           return "Medicine is not in stock";
       }
   }).catch( (err) => { return err } );

}
exports.salesChemist = salesChemist;