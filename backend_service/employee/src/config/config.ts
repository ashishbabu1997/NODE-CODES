export default {
    "appName": "employee",
    "version": "v1",
    "http": {
        "port": 4002
    },
    "db": {
        "user": "devdb_user",
        "host": "52.66.51.51",
        "database": "devdb",
        "password": "DevD8u5er",
        "port": 5432
    },
    "jwtSecretKey": "elL0wA!",

    "mail": {
        "service": "gmail",
        "user": "sales@ellow.io",
        "password": "yteinevvuuchtmvb"
    },
    "text": {
        "firstLine": "Hello,",
        "secondLine": "An applicant has been registered with us!",
        "thirdLine": "Given below are the applicant's details",
        "subject":"Customer Registration Notification",
        "name":"Name",
        "companyName":"Company Name",
        "email":"Email Address",
        "phone":"Telephone Number",
        "fifthLine": "With regards,",
        "sixthLine":"Team ellow.io"
    },
    "usertext": {
        "firstLine": "<h3>Hello,</h3>",
        "secondLine": "<h3>Thank you for registering with ellow.io !</h3>",
        "thirdLine": "<h3>Please enter the password given below to login with us.</h3>",
        "password": "<h3>Your password is:-    ",
        "fourthLine": "<h3>With regards,</h3>",
        "fifthLine": "<h3>Team ellow.io</h3>"
    },
    "defaultHiringStep": {
        "hiringStepName": "ellow hiring step",
        "description": null,
        "hiringStages": [
            { "hiringStageName": "ellow receives candidate resume", "hiringStageDescription": null, "hiringStageOrder": 1 },
            { "hiringStageName": "ellow Screening Process", "hiringStageDescription": null, "hiringStageOrder": 2 },
            { "hiringStageName": "Telephonic Interview with ellow", "hiringStageDescription": null, "hiringStageOrder": 3 },
            { "hiringStageName": "Client Interview", "hiringStageDescription": null, "hiringStageOrder": 4 },
            { "hiringStageName": "HRInterview", "hiringStageDescription": null, "hiringStageOrder": 5 },
            { "hiringStageName": "Make Offer", "hiringStageDescription": null, "hiringStageOrder": 6 }
        ]
    },
    "nextLine": "<br>",
    "adminEmail":"lakshmi.n@ellow.io",
    "colon":":"
};