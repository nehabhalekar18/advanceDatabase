const Redis = require("ioredis");

const redi = new Redis({
    port: 19339, // Redis port
    host: "redis-19339.c135.eu-central-1-1.ec2.cloud.redislabs.com", // Redis host
    password: "HatizCoIBC7aqeuOTbJrpkG6SgNDUti0",
    db: 0,
});

// redi.set("foo", JSON.stringify(["bar", 'hello']));
//
// redi.get("in_stock", function (err, result) {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(JSON.parse( result )); // Promise resolves to "bar"
//     }
//     redi.disconnect();
// });



module.exports = redi;