import express from "express";
import createUser from "./queries"
import bodyParser from "body-parser"
const app = express()
const port = 3001 
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.get('/', (request, response) => {
 response.send(" ELLOW API for Email Sign In")
   })
app.post('/email_signup',createUser)
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
