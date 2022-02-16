export default {
    "appName": "jobs",
    "version": "v1",
    "http": {
        "port": 4003
    },
    'ellowRecruitmentStatus':{
        'partial':'PARTIALLY_COMPLETED',
        'complete':'COMPLETED',
        'verifiedStage':'ellow Screening',
        'vettedStage':'Certification'
    },
    "jwtSecretKey": "elL0wA!",
    "adminEmail":"jjoseph@ellow.io",
    "db": {
        "user": "devdb_user",
        "host": "52.66.51.51",
        "database": "devdb",
        "password": "DevD8u5er",
        "port":5432
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
   
    "PositionText": {
        "subject":"Position Deletion Alert",
        "providersSubject":"New job posts from ellow.io"
    },
    "nextLine": "<br>",
    "colon":":",
    "recruiterEmail":"ashish.babu@ellow.io"
}
