const NodeData = require("../models/NodeData");
const connection = require("../connect");

function getDisease(req, res) {
  const session = connection.session;
  return session
    .readTransaction((tx) =>
      tx.run(
        'MATCH (s1:Symptom),(s2:Symptom),(s3:Symptom),(s4:Symptom),(s5:Symptom) WHERE s1.name="Sore Throat" and s2.name = "Running Nose" and s3.name = "Cough" and s4.name ="Headache" and s5.name = "Fever" WITH s1 as s1, s2 as s2, s3 as s3, s4 as s4, s5 as s5 MATCH (s1)-[:TEST]->(r)-[:POSITIVE]->(d) MATCH (s2)-[:TEST]->(r)-[:POSITIVE]->(d) MATCH (s3)-[:TEST]->(r)-[:POSITIVE]->(d) MATCH (s4)-[:TEST]->(r)-[:POSITIVE]->(d) MATCH (s5)-[:TEST]->(r)-[:POSITIVE]->(d) RETURN d'
      )
    )

    .then((res) => {
      return res.records.map((record) => {
        return new NodeData(record.get("d"));
      });
    });
}
exports.getDisease = getDisease;
