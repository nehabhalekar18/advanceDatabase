const NodeData = require('../models/NodeData');
const  connection=require('../connect')

function getAppointments(req,res){
  const session = connection.session
    return session.readTransaction((tx) =>
        tx.run('MATCH(a:Appointment) \ WHERE a.availability = true \ RETURN a'))
      
      .then(res => {
        return res.records.map(record => {
            return new NodeData(record.get('a'));
          });
      })
}
exports.getAppointments=getAppointments