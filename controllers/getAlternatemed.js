const NodeData = require("../models/NodeData");
const connection = require("../connect");

function getAlternatemed(req, res) {
  const session = connection.session;
  return session
    .readTransaction((tx) =>
      tx.run(
        ' MATCH (c:Chemist),(m:Medicine) WHERE c.fname= "John" AND m.medicinename="Primaquine" WITH c as Chemist , m as Medicine MATCH (Chemist)-[r:LooksFor*]->(Medicine)-[r1:HasAlternateDrug]->(n) RETURN n'
      )
    )

    .then((res) => {
      return res.records.map((record) => {
        return new NodeData(record.get("n"));
      });
    });
}
exports.getAlternatemed = getAlternatemed;
