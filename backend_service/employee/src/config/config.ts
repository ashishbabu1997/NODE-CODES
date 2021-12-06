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
    'sendinblueConfigurations':{
        'sendinblueSender':{
          'name': 'ellow',
          'email': 'jjoseph@ellow.io',
        },

        'welcomeMailTemplateId':3

},

    "mail": {
        "service": "gmail",
        "user": "cs@ellow.io",
        "password": "ricggklkmqeaxbxx"
    },
    "noreplymail": {
        "service": "gmail",
        "user": "no-reply@ellow.io",
        "password": "fqlroidzaxmlhgml"
    },
    "teamMail": {
        "service": "gmail",
        "user": "team@ellow.io",
        "password": "gvcxjwjwlezbpenh"
    },
    "text": {
    
        "subject":"Company Registration Notification",
        "newCompanySubject":"New Company Registration Notification",
        "newSubUserSubject":"Sub User Registration Notification",
        "newUserSubject":"New User Registration Notification",
        "freelancerSubject":"Candidate Registration Notification",
        "userSubject":"Candidate Verification Link",
        "resetConfirmSubject":" ellow Password Confirmation Mail"
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
    "adminEmail":"jjoseph@ellow.io",
    "colon":":",
    "sendinblue":{
        "allResourcesListId":6,
        "certifiedListId":4,
    }
};