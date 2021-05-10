const NodeData = require('../models/NodeData');
const  connection=require('../connect')

function getNodes(req,res){
    const session = connection.session
    return session.readTransaction((tx) =>
        tx.run('MATCH (n:Patient) \
        RETURN n')
      )
      .then(res => {
        return res.records.map(record => {
            return new NodeData(record.get('n'));
          });
      })
}

exports.getNodes=getNodes