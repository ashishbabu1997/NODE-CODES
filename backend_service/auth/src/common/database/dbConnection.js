const mysql = require('mysql');
const config = require('../../../config/config.json');
let connection;
let isConnected = false;

function connectDB() {
    if (isConnected === true) {
        return connection;
    }
    connection = mysql.createConnection(config.db);
    connection.connect(function (err) {
        if (err) {
            isConnected = false;
            console.error('error connecting: ' + err.stack);
            setTimeout(connectDB, 5000);
            return;
        }
        isConnected = true;
        console.log('MYSQL connected as id ' + connection.threadId);
    });

    connection.on('error', function (err) {
        isConnected = false;
        console.error('db error', err);
        connection.end();
        setTimeout(connectDB, 5000);

        /*if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal === true) {
            connection.end();
            setTimeout(connectDB, 5000);
        } else {
            console.log(err);
            connection.end();
            setTimeout(connectDB, 5000);
        }*/
    });

    console.log("TODO: use connection pooling.");
    return connection;

}

connectDB();

module.exports = connectDB;
