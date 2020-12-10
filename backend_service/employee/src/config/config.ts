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
    
        "subject":"Customer Registration Notification",
        "userSubject":"Customer Verification Link",
        "resetConfirmSubject":" ellow Confirmation Mail"
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
    "adminEmail":"deena.s@ellow.io",
    "colon":":"
};