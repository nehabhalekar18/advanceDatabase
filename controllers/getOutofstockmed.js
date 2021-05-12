const NodeData = require("../models/NodeData");
const connection = require("../connect");

function getOutOfstockmed(req, res) {
  const session = connection.session;
  return session
    .readTransaction((tx) =>
      tx.run(
        " MATCH (c:Chemist)-[a:LOOKS_FOR]->(m:Medicine{inStock:false})  RETURN m"
      )
    )

    .then((res) => {
      return res.records.map((record) => {
        return new NodeData(record.get("m"));
      });
    });
}
exports.getOutOfstockmed = getOutOfstockmed;
