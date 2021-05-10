const _ = require('lodash');
function NodeData(_node) {
     _.extend(this, _node.properties);
   }
   
   module.exports = NodeData;