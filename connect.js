const neo4j = require('neo4j-driver');
//const driver = new neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "admin"));
const driver = new neo4j.driver("bolt://34.227.108.5:7687", neo4j.auth.basic("neo4j", "surfaces-products-congress"));
const database = "neo4j"
const session = driver.session({database: database});

exports.session=session
