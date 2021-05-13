const NodeData = require('../models/NodeData');
const  connection=require('../connect')

function reschedule(req,res){
  const session = connection.session
  let data=req;
  
  const cypher1= 'MATCH (p:Patient)-[r1:APPOINTMENT]->(a:Appointment {date:"'+data.oldAppointment.date+'",time:"'+data.oldAppointment.time+'",availability:false})-[r2:WITH]->(d)'
  const cypher2= 'MATCH(a2:Appointment{date:"'+data.newAppointment.date+'",time:"'+data.newAppointment.time+'", availability:true})'

    return session.writeTransaction((tx) =>
    tx.run(cypher1+' \ WHERE p.fname =~ $fname \SET a.availability=true \ DELETE r1,r2 \  WITH p as patient, d as doctor \ '+cypher2+' \ CREATE (patient)-[:APPOINTMENT]->(a2)-[:WITH]->(doctor) \ SET a2.availability=false \ RETURN patient,a2,doctor', {fname: '(?i).*' + data.fname + '.*'}))
      
      .then(res => {
        return res.records.map(record => {
          let appointment = new NodeData(record.get('a2'));
          let patient = new NodeData(record.get('patient'));
          return {appointment:appointment,patient:patient}
          });
      })
}
exports.reschedule=reschedule
