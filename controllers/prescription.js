const NodeData = require("../models/NodeData");
const connection = require("../connect");

function prescription(req, res) {
  const session = connection.session;
  return session
    .readTransaction((tx) =>
      tx.run(
        'MATCH(p:Patient{fname:"Emma"})-[r:BRINGS]->(pr:Prescription{disease:"MalariaPrescription"})-[a:IsSeenBy]->(c:Chemist{fname:"John"}) return p,pr,c'
      )
    )

    .then((res) => {
      return res.records.map((record) => {
        let patient = new NodeData(record.get("p"));
        let prescription = new NodeData(record.get("pr"));
        let chemist = new NodeData(record.get("c"));
        return {
          patient: patient,
          prescription: prescription,
          chemist: chemist,
        };
      });
    });
}
exports.prescription = prescription;
