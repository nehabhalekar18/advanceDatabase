
const { connectionPool } = require('../mongoDb/connectionPool');


async function stockChemist() {

    let db = await connectionPool();
    const dbo = db.db("stockManagment");

    return dbo.collection('stock_chemist').find(
        {Should_Order: true},
    ).project({
        "Name" : 1
    }).toArray().then((doc) => {
        return doc ? doc : 'Stock is full';
    }).catch( (err) => { return err } );



}
exports.stockChemist = stockChemist;