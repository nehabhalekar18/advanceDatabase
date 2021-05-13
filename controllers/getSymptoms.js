const NodeData = require("../models/NodeData");
const connection = require("../connect");

function getSymptoms(req, res) {
  const session = connection.session;
  return session
    .readTransaction((tx) =>
      tx.run(
        'MATCH (s:Symptom)-[a:TEST]->(t:Report{name:"Flu Test"})-[r:POSITIVE]->(d:Disease{name:"Influenza"}) return s'
      )
    )

    .then((res) => {
      return res.records.map((record) => {
        return new NodeData(record.get("s"));
      });
    });
}
exports.getSymptoms = getSymptoms;
