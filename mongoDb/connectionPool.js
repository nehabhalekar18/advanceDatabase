const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://root:root@cluster0.jkchn.mongodb.net/stockManagment?retryWrites=true&w=majority";
var client = null;


   async function connectionPool() {
        if(!client){
            client =  await MongoClient.connect(url, { useUnifiedTopology: true } );
        }
        return client;
    }

exports.connectionPool = connectionPool;