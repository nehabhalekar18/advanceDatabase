const NodeData = require("../models/NodeData");
const connection = require("../connect");

function getMedicines(req, res) {
  const session = connection.session;
  return session
    .readTransaction((tx) =>
      tx.run(
        'MATCH (d:Disease{name:"Malaria"})-[a:MEDICINE]->(m:Medicine) return m.medicineName'
      )
    )

    .then((res) => {
      return res.records.map((record) => {
        return new NodeData(record.get("m.medicineName"));
      });
    });
}
exports.getMedicines = getMedicines;
