const socketIo = require("socket.io");
import database from './common/database/database';
import {notify} from './common/database/database';
import * as queryService from './queryService/queryService';
import config from './config/config';
import AppConfig from './config/config';


const jwt = require('jsonwebtoken');

export const  connect =(app) =>{
    let server = require('http').createServer();    
    server.on('request', app);
    
    const io = socketIo(server, {
        cors: { origin: '*' } });
        
        io.use(function(socket, next){            
            if (socket.handshake.query && socket.handshake.query.token){                
                let token = socket.handshake.query.token.replace('Bearer ','');
                jwt.verify(token, config.jwtSecretKey, function(err, decoded) {
                    if (err) {
                        console.log('error : ',err.message)
                        return next(new Error('Authentication error'));
                    };
                    socket.decoded = decoded;
                    if(decoded.userRoleId !=1 )
                    return next(new Error('Unauthorised access'));
               
                    next();
                });
            }
            else {
                console.log("new error");
                next(new Error('Authentication error'));
            }    
        }).on("connection", (socket) => {
            console.log("New client connected");
            getApiAndEmit(socket);
            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
        
        
        const getApiAndEmit = (socket) => {
            // Emitting a new message. Will be consumed by the client
            getData(socket);
            dbListener(socket);
        };  
        
        const getData = (socket) =>{
            database().query(queryService.listNotifications(), (error, results) => {
                if (error) {
                    console.error({ code: 400, message: "Database Error", data: {} });
                    return;
                }
                
                socket.emit("FromAPI", { code: 200, message: "Notification listed", data: results.rows });
            })
        }
        
        const dbListener = (socket) =>{
            var client = notify();
            client.connect(function(err) {
                if(err) {
                    return console.error('could not connect to postgres', err);
                }
                client.query('LISTEN "notificationEvent"');
                client.on('notification', function(data) {
                    getData(socket);
                });
            });
        }
        server.listen(AppConfig.http.port, () => console.log(`Listening on port ${AppConfig.http.port}`));
}    