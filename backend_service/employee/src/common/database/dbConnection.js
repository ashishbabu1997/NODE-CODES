const Pool = require('pg').Pool
const config = require('../../../config/config.json');

function connectDB() {
   return new Pool(config.db)
}
connectDB();

module.exports = connectDB;