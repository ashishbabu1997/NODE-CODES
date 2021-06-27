const socketIo = require("socket.io");
import database from './common/database/database';
import { notify } from './common/database/database';
import * as queryService from './queryService/queryService';
import config from './config/config';
const dotenv = require('dotenv');


const jwt = require('jsonwebtoken');
dotenv.config();

export const connect = (app) => {

    const io = socketIo(app, {
        cors: { origin: '*' }
    });

    io.use(function (socket, next) {
        if (socket.handshake.auth && socket.handshake.auth.token) {
            let token = socket.handshake.auth.token.replace('Bearer ', '');
            jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
                if (err) {
                    console.log('error : ', err.message)
                    return next(new Error('Authentication error'));
                };
                socket.decoded = decoded;

                if (!['1', '2'].includes(decoded.userRoleId))
                    return next(new Error('Unauthorised access'));

                next();
            });
        }
        else {
            console.log("Authentication error");
            next(new Error('Authentication error'));
        }
    }).on("connection", (socket) => {
        console.log("New client connected");

        const client = notify();
        client.connect(function (err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
        });

        getApiAndEmit(socket, client);
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            client.end(err => {
                console.log('client has disconnected from db', err)
                if (err) {
                    console.log('error during disconnection', err.stack)
                }
            })
        });
    });


    const getApiAndEmit = (socket, client) => {
        // Emitting a new message. Will be consumed by the client            
        getData(socket);
        dbListener(socket, client);
    };

    const getData = (socket) => {

        let userRoleId = socket.decoded.userRoleId, companyId = socket.decoded.companyId;

        if (userRoleId == 1) {
            database().query(queryService.listNotifications(), (error, results) => {
                if (error) {
                    console.error({ code: 400, message: "Database Error", data: {} });
                    return;
                }
                socket.emit("recruiter", { code: 200, message: "User Notification listed", data: results.rows });
            })
        }
        else if (userRoleId == 2) {
            database().query(queryService.listHirerNotifications(companyId), (error, results) => {
                if (error) {
                    console.error({ code: 400, message: "Database Error", data: {} });
                    return;
                }
                socket.emit("hirer", { code: 200, message: "User Notification listed", data: results.rows });
            })
        }
    }

    const dbListener = (socket, client) => {

        let userRoleId = socket.decoded.userRoleId;
        if (userRoleId == '1') {
            client.query('LISTEN "notificationEvent"');
        }
        else {
            client.query('LISTEN "hirerNotificationEvent"');
        }

        client.on('notification', function (data) {
            getData(socket);
        });
    }
}