const db = require('./query')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001 
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.get('/', (request, response) => {
 response.send(" ELLOW API OTP validation screen")
   })
app.post('/email_signup/validate_otp',db.validate_otp)
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
