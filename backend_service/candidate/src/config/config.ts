export default {
    "appName": "company",
    "version": "v1",
    "http": {
        "port":4005
    },
    "db": {
        "user": "devdb_user",
        "host": "52.66.51.51",
        "database": "devdb",
        "password": "DevD8u5er",
        "port": 5432
    },
    "adminEmail":"ashish.babu@ellow.ai",
    "mail": {
        "service": "gmail",
        "user": "no-reply@ellow.ai",
        "password": "fqlroidzaxmlhgml"
    },
    "nextLine":"\n",
    "approvalMail": {
        "firstLine": "<h3>Hello,",
        "secondLine": "    has been approved by the admin company !</h3>",
        "thirdLine": "<h3>With regards,</h3>",
        "fourthLine": "<h3>Team ellow.ai</h3>"
    },
    "rejectionMail": {
        "firstLine": "<h3>Hello,",
        "secondLine": "   has been rejected by the admin company !</h3>",
        "thirdLine": "<h3>With regards,</h3>",
        "fourthLine": "<h3>Team ellow.ai</h3>"
    }
}
