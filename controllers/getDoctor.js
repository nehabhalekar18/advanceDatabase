const NodeData = require('../models/NodeData');
const  connection=require('../connect')

function getDoctor(req,res){
  const session = connection.session
    const patientName=req
    return session.readTransaction((tx) =>
        tx.run('MATCH (p:Patient) \ WHERE p.fname =~ $fname \ WITH p as patient \ MATCH (patient) -[: APPOINTMENT{issue:"Tooth ache",followUp:false}]->(:Appointment {date:"01.05.2021",time:"13:45",availability:false})-[:WITH]->(doctor) \
        RETURN doctor',
        {fname: '(?i).*' + patientName + '.*'}))
      
      .then(res => {
        return res.records.map(record => {
            return new NodeData(record.get('doctor'));
          });
      })
}
exports.getDoctor=getDoctor