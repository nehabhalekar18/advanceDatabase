const NodeData = require('../models/NodeData');
const  connection=require('../connect')

function shortestPath(req,res){
    const session = connection.session
    return session.readTransaction((tx) =>
        tx.run('MATCH (from:Room { type:"Reception" }), (to:Room { type: "Examine"}) ,(via:Room {type: "Lab"}), path = (from)-[:TO*]->(via)-[:TO*]-(to)\
        RETURN path AS shortestPath,reduce(distance = 0, r in relationships(path) | distance+r.distance) AS totalDistance\
            ORDER BY totalDistance ASC\
            LIMIT 5')
      )
      .then(res => {
        return res.records.map(record => {
            let shortestPath = new NodeData(record.get('shortestPath'));
            let totalDistance = new NodeData(record.get('totalDistance'));
            return {shortestPath:shortestPath,totalDistance:totalDistance};
          });
      })
}

exports.shortestPath=shortestPath