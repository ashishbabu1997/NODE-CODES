import * as queryService from '../queryService/queryService';
import config from '../config/config';
import { createNotification, createHirerNotifications } from '../common/notifications/notifications';
import * as emailClient from '../emailManager/emailManager';
import * as utils from '../utils/utils';



export const addSubUserEmail = async (_body, client,password) => {
    try {
        var ellowAdmins = await client.query(queryService.getEllowAdmins());
        var message=`${_body.companyName} has added a new subuser named ${utils.capitalize(_body.firstName)+' '+utils.capitalize(_body.lastName)}`
        createNotification({ positionId:null, jobReceivedId: null, companyId: _body.userCompanyId, message: message, candidateId: null, notificationType: 'employee', userRoleId: _body.userRoleId, employeeId: _body.employeeId, image: null, firstName: _body.firstName, lastName: _body.lastName })   
        if (Array.isArray(ellowAdmins.rows)) {

            let subject = "Subuser Registration Notification"
            let path = 'src/emailTemplates/addSubUser.html';
            let usersPath = 'src/emailTemplates/newUserText.html';
            let userSubject='ellow.io Login Credentials'
            let userReplacements = { loginPassword: password };
            if (utils.notNull(_body.email)) {
                emailClient.emailManager(_body.email, userSubject, usersPath, userReplacements);
            }
            let replacements = {
                name: utils.capitalize(_body.firstName)+' '+utils.capitalize(_body.lastName),
                cName:_body.companyName,
                email:_body.email,
            };
            ellowAdmins['rows'].forEach(element => {
                if (utils.notNull(element.email))
                    emailClient.emailManager(element.email,subject, path, replacements);
            })
        }
    
    } catch (e) {
        console.log("error : ", e.message)
        throw new Error('Failed to send mail');
    }
}